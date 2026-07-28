#!/usr/bin/env node
/**
 * Standalone TransactPay encryption diagnostic.
 *
 * Reads TRANSACTPAY_PUBLIC_KEY, TRANSACTPAY_SECRET_KEY and TRANSACTPAY_ENCRYPTION_KEY
 * from environment variables (optionally loading .env.local), validates the
 * encryption key, builds the RSA public key, encrypts a test payload and sends it
 * to the TransactPay /payment/order/create endpoint.
 *
 * Usage:
 *   node test-transactpay-encryption.js
 *   node test-transactpay-encryption.js oaep       # use RSA_PKCS1_OAEP_PADDING
 *   node test-transactpay-encryption.js pkcs1 secret  # use secret key for api-key header
 *   node test-transactpay-encryption.js pkcs1 public http://payment-api-service.transactpay.ai  # override base URL
 *
 * Requires: node-forge
 *   npm install node-forge
 */

const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

function loadEnvFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    const raw = fs.readFileSync(filePath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
        if (!match) continue;
        const key = match[1];
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        if (process.env[key] && process.env[key] !== value) {
            // .env.local takes precedence over stale shell variables.
            process.env[key] = value;
        } else if (!process.env[key]) {
            process.env[key] = value;
        }
    }
}
loadEnvFile(path.join(process.cwd(), ".env.local"));

const forge = require("node-forge");

// -------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------

function log(stage, message) {
    const time = new Date().toISOString().split("T")[1].split(".")[0];
    console.log(`[${time}] [${stage}] ${message}`);
}

function mask(value) {
    if (!value || value.length < 12) return value ? "***" : "<not set>";
    return `${value.slice(0, 8)}...${value.slice(-4)} (${value.length} chars)`;
}

function isBase64(str) {
    if (typeof str !== "string" || str.length === 0) return false;
    const withoutWhitespace = str.replace(/\s/g, "");
    const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
    if (!base64Pattern.test(withoutWhitespace)) return false;
    const mod = withoutWhitespace.length % 4;
    if (mod === 1) return false;
    return true;
}

function stripLeadingZeros(buffer) {
    let i = 0;
    while (i < buffer.length - 1 && buffer[i] === 0) i += 1;
    return i > 0 ? buffer.subarray(i) : buffer;
}

function extractXmlValue(xml, tag) {
    const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
    return match?.[1]?.trim();
}

function toBase64Url(value) {
    const bytes = Buffer.from(value.replace(/\s/g, ""), "base64");
    return stripLeadingZeros(bytes).toString("base64url");
}

// -------------------------------------------------------------------------
// Stage 1: Environment variables
// -------------------------------------------------------------------------

const publicKey = process.env.TRANSACTPAY_PUBLIC_KEY?.trim();
const secretKey = process.env.TRANSACTPAY_SECRET_KEY?.trim();
const encryptionKey = process.env.TRANSACTPAY_ENCRYPTION_KEY?.trim();

log("ENV", `TRANSACTPAY_PUBLIC_KEY  = ${mask(publicKey)}`);
log("ENV", `TRANSACTPAY_SECRET_KEY  = ${mask(secretKey)}`);
log("ENV", `TRANSACTPAY_ENCRYPTION_KEY = ${mask(encryptionKey)}`);

if (!publicKey) {
    log("FATAL", "TRANSACTPAY_PUBLIC_KEY is not set.");
    process.exit(1);
}
if (!secretKey) {
    log("WARN", "TRANSACTPAY_SECRET_KEY is not set; secret-key mode will not work.");
}
if (!encryptionKey) {
    log("FATAL", "TRANSACTPAY_ENCRYPTION_KEY is not set.");
    process.exit(1);
}

// -------------------------------------------------------------------------
// Stage 2: Decode and validate the encryption key
// -------------------------------------------------------------------------

log("VALIDATE", `Base64 alphabet check: ${isBase64(encryptionKey) ? "PASS" : "FAIL"}`);

let decodedXml;
try {
    decodedXml = Buffer.from(encryptionKey, "base64").toString("utf-8");
} catch (err) {
    log("FATAL", `Base64 decode failed: ${err.message}`);
    process.exit(1);
}

log("XML", "--- Decoded XML (first 200 chars) ---");
log("XML", decodedXml.length > 200 ? decodedXml.slice(0, 200) + "..." : decodedXml);

const hasRsaKeyValue = /<RSAKeyValue/i.test(decodedXml);
const hasModulus = /<Modulus/i.test(decodedXml);
const hasExponent = /<Exponent/i.test(decodedXml);

log("XML", `<RSAKeyValue> present: ${hasRsaKeyValue}`);
log("XML", `<Modulus> present:     ${hasModulus}`);
log("XML", `<Exponent> present:    ${hasExponent}`);

if (!hasRsaKeyValue || !hasModulus || !hasExponent) {
    log("FATAL", "Encryption key does not contain a valid RSAKeyValue structure.");
    process.exit(1);
}

const xml = decodedXml.replace(/^\d+!/, "");

const modB64 = extractXmlValue(xml, "Modulus");
const expB64 = extractXmlValue(xml, "Exponent");

if (!modB64 || !expB64) {
    log("FATAL", "Could not extract Modulus and/or Exponent from XML.");
    process.exit(1);
}

let modBytes, expBytes;
try {
    modBytes = Buffer.from(modB64, "base64");
    expBytes = Buffer.from(expB64, "base64");
} catch (err) {
    log("FATAL", `Failed to Base64-decode modulus/exponent: ${err.message}`);
    process.exit(1);
}

const modulusBits = modBytes.length * 8;
const exponentValue = "0x" + expBytes.toString("hex").toUpperCase();

log("KEY", `Modulus length:  ${modBytes.length} bytes = ${modulusBits} bits`);
log("KEY", `Exponent value:  ${exponentValue}`);

if (modBytes.length !== 512 && modBytes.length !== 256 && modBytes.length !== 128) {
    log("WARN", "Modulus length is not a common RSA key size (2048/3072/4096 bits).");
}

// -------------------------------------------------------------------------
// Stage 3: Build RSA public key
// -------------------------------------------------------------------------

const pki = forge.pki;
const forgePublicKey = pki.setRsaPublicKey(
    new forge.jsbn.BigInteger(modBytes.toString("hex"), 16),
    new forge.jsbn.BigInteger(expBytes.toString("hex"), 16)
);

const pkcs1Pem = pki.publicKeyToRSAPublicKeyPem(forgePublicKey);
const spkiPemFromForge = pki.publicKeyToPem(forgePublicKey);

log("PEM", "--- PKCS#1 PEM (from node-forge) ---");
log("PEM", pkcs1Pem);

log("PEM", "--- SPKI PEM (from node-forge) ---");
log("PEM", spkiPemFromForge);

// Also build with Node crypto using the same JWK approach as lib/transactpay.ts.
const n = toBase64Url(modB64);
const e = toBase64Url(expB64);
const cryptoPublicKey = crypto.createPublicKey({ key: { kty: "RSA", n, e }, format: "jwk" });
const spkiPemFromCrypto = cryptoPublicKey.export({ type: "spki", format: "pem" });

log("PEM", "--- SPKI PEM (from Node crypto JWK) ---");
log("PEM", spkiPemFromCrypto);

const cryptoKeySize = cryptoPublicKey.asymmetricKeyDetails?.modulusLength ?? modulusBits;
log("KEY", `Node crypto reported modulusLength: ${cryptoKeySize} bits`);

// -------------------------------------------------------------------------
// Stage 4: Encrypt the exact payload
// -------------------------------------------------------------------------

const payload = `{\n  "reference":"TEST123",\n  "amount":100,\n  "currency":"NGN"\n}`;

log("PAYLOAD", "--- Plain JSON payload ---");
log("PAYLOAD", payload);

const paddingArg = (process.argv[2] || "pkcs1").toLowerCase();
const keyTypeArg = (process.argv[3] || "public").toLowerCase();

const useOaep = paddingArg === "oaep";
const useSecretKey = keyTypeArg === "secret";

const paddingName = useOaep ? "RSA_PKCS1_OAEP_PADDING" : "RSA_PKCS1_PADDING";
const padding = useOaep ? crypto.constants.RSA_PKCS1_OAEP_PADDING : crypto.constants.RSA_PKCS1_PADDING;

log("PADDING", `Selected padding: ${paddingName}`);
log("PADDING", `Selected api-key source: ${useSecretKey ? "SECRET_KEY" : "PUBLIC_KEY"}`);

let cryptoEncrypted;
try {
    cryptoEncrypted = crypto.publicEncrypt(
        { key: cryptoPublicKey, padding },
        Buffer.from(payload, "utf8")
    );
} catch (err) {
    log("FATAL", `Node crypto encryption failed: ${err.message}`);
    process.exit(1);
}

const cryptoBase64 = cryptoEncrypted.toString("base64");

const forgeEncrypted = forgePublicKey.encrypt(forge.util.encodeUtf8(payload), "RSAES-PKCS1-V1_5");
const forgeBase64 = Buffer.from(forgeEncrypted, "binary").toString("base64");

log("CIPHER", "--- Node crypto ciphertext ---");
log("CIPHER", `Length: ${cryptoBase64.length}`);
log("CIPHER", `${cryptoBase64.slice(0, 64)}...${cryptoBase64.slice(-8)}`);

log("CIPHER", "--- node-forge ciphertext (reference, RSAES-PKCS1-V1_5) ---");
log("CIPHER", `Length: ${forgeBase64.length}`);
log("CIPHER", `${forgeBase64.slice(0, 64)}...${forgeBase64.slice(-8)}`);

const expectedLength = Math.ceil(modBytes.length / 3) * 4;
if (cryptoBase64.length !== expectedLength || forgeBase64.length !== expectedLength) {
    log("WARN", `Expected Base64 length ~${expectedLength} for ${modBytes.length}-byte key. Got ${cryptoBase64.length} / ${forgeBase64.length}.`);
}

const apiKey = useSecretKey ? secretKey : publicKey;

if (!apiKey) {
    log("FATAL", `Cannot use ${useSecretKey ? "secret" : "public"} key because it is not set.`);
    process.exit(1);
}

const baseUrlOverride = process.argv[4]?.trim();
const baseUrl = (baseUrlOverride || process.env.TRANSACTPAY_BASE_URL || "https://payment-api-service.transactpay.ai").replace(/\/$/, "");
const endpoint = `${baseUrl}/payment/order/create`;

log("PADDING", `Base URL: ${baseUrl}${baseUrlOverride ? " (from command line)" : ""}`);
const requestBody = JSON.stringify({ data: cryptoBase64 });

log("REQUEST", `POST ${endpoint}`);
log("REQUEST", `api-key: ${mask(apiKey)}`);
log("REQUEST", `Content-Type: application/json`);
log("REQUEST", `accept: application/json`);
log("REQUEST", "--- Request body ---");
log("REQUEST", requestBody);

// -------------------------------------------------------------------------
// Stage 5: Send to TransactPay
// -------------------------------------------------------------------------

async function main() {
    let response;
    let responseText;
    try {
        response = await fetch(endpoint, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "api-key": apiKey,
            },
            body: requestBody,
        });

        responseText = await response.text();
    } catch (err) {
        log("FATAL", `Network request failed: ${err.message}`);
        process.exit(1);
    }

    log("RESPONSE", `HTTP status: ${response.status} ${response.statusText}`);
    log("RESPONSE", "--- Response headers ---");
    for (const [key, value] of response.headers.entries()) {
        log("RESPONSE", `  ${key}: ${value}`);
    }
    log("RESPONSE", "--- Raw response body ---");
    log("RESPONSE", responseText);

    // -------------------------------------------------------------------------
    // Stage 6: Investigation
    // -------------------------------------------------------------------------

    const lower = responseText.toLowerCase();
    const isDecryptError = lower.includes("decrypt your payload");

    log("ANALYSIS", "--- Investigation summary ---");
    log("ANALYSIS", `Padding used:                 ${paddingName}`);
    log("ANALYSIS", `api-key source:               ${useSecretKey ? "SECRET_KEY" : "PUBLIC_KEY"}`);
    log("ANALYSIS", `Payload UTF-8 encoding:       confirmed`);
    log("ANALYSIS", `Base64 output:                standard Base64 (no base64url)`);
    log("ANALYSIS", `Node crypto key modulus bits: ${cryptoKeySize}`);
    log("ANALYSIS", `XML RSA key modulus bits:     ${modulusBits}`);
    log("ANALYSIS", `Ciphertext length:            ${cryptoBase64.length}`);
    log("ANALYSIS", `PEM (PKCS#1) generated:       ${pkcs1Pem ? "yes" : "no"}`);
    log("ANALYSIS", `PEM (SPKI, crypto) generated: ${spkiPemFromCrypto ? "yes" : "no"}`);
    const rawMod = Buffer.from(modB64.replace(/\s/g, ""), "base64");
    const strippedMod = stripLeadingZeros(rawMod);
    const nRef = strippedMod.toString("base64url");
    log("ANALYSIS", `node-forge vs crypto n match: ${n === nRef}`);

    if (isDecryptError) {
        log("ANALYSIS", "");
        log("ANALYSIS", "The server returned a decryption error. Possible causes (most to least likely):");
        log("ANALYSIS", "  1. The encryption key does not belong to the same account/mode as the api-key.");
        log("ANALYSIS", "  2. The api-key is a TEST key but the request is hitting the LIVE base URL (or vice versa).");
        log("ANALYSIS", "  3. The RSA public key the server holds is different from the one in TRANSACTPAY_ENCRYPTION_KEY.");
        log("ANALYSIS", "  4. TransactPay expects OAEP instead of PKCS#1 v1.5 (run with 'oaep' argument to test).");
        log("ANALYSIS", "  5. The api-key header should be the secret key instead of the public key (run with 'secret' argument).");
        log("ANALYSIS", "");
        log("ANALYSIS", "To test OAEP padding:");
        log("ANALYSIS", "  node test-transactpay-encryption.js oaep");
        log("ANALYSIS", "To test the secret key as the api-key:");
        log("ANALYSIS", "  node test-transactpay-encryption.js pkcs1 secret");
    } else if (response.ok) {
        log("ANALYSIS", "SUCCESS: the request was accepted. The encryption key and padding are correct.");
    } else {
        log("ANALYSIS", "The request failed for a non-decryption reason (validation/missing fields).");
    }
}

main();
