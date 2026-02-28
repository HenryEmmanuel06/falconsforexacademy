import nodemailer from "nodemailer";

type PaymentSuccessEmailInput = {
    to: string;
    fullName?: string | null;
    plan: string;
    location: string;
};

type RegistrationSuccessEmailInput = {
    to: string;
    fullName?: string | null;
    trainingLocation?: string | null;
};

type AdminPaymentNotificationEmailInput = {
    provider: "paystack" | "nowpayments";
    reference: string;
    email: string;
    fullName?: string | null;
    plan: string;
    location?: string | null;
    status: string;
    paidAt?: string | null;
};

type AdminRegistrationNotificationEmailInput = {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    trainingLocation: string;
    tradingLevel: string;
    nationality?: string | null;
    residentialAddress?: string | null;
    createdAt: string;
};

function getSmtpConfig() {
    const host = process.env.SMTP_HOST;
    const portRaw = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secureRaw = process.env.SMTP_SECURE;

    if (!host) throw new Error("SMTP_HOST is not set");
    if (!portRaw) throw new Error("SMTP_PORT is not set");
    if (!user) throw new Error("SMTP_USER is not set");
    if (!pass) throw new Error("SMTP_PASS is not set");

    const port = Number(portRaw);
    if (!Number.isFinite(port)) throw new Error("SMTP_PORT is invalid");

    const secure = secureRaw != null ? secureRaw === "true" : port === 465;

    return { host, port, user, pass, secure };
}

function getAdminRecipientEmail() {
    const admin = process.env.ADMIN_EMAIL;
    const fallback = process.env.SMTP_USER;
    return String(admin ?? fallback ?? "").trim();
}

function createTransport() {
    const { host, port, user, pass, secure } = getSmtpConfig();

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass,
        },
        connectionTimeout: 20_000,
        greetingTimeout: 20_000,
        socketTimeout: 30_000,
        tls: {
            servername: host,
        },
    });

    return { transporter, user };
}

export async function sendPaymentSuccessEmail(input: PaymentSuccessEmailInput) {
    const { transporter, user } = createTransport();

    const nameLine = input.fullName ? `Hi ${input.fullName},` : "Hello,";

    const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "";
    const siteUrl = rawSiteUrl.trim().replace(/\/$/, "");
    const registrationUrl = siteUrl ? `${siteUrl}/register` : "/register";

    const telegramInnerGroupUrl =
        process.env.TELEGRAM_INNER_GROUP_URL ??
        process.env.NEXT_PUBLIC_TELEGRAM_INNER_GROUP_URL ??
        "https://t.me/falconsforexacademy";

    const isSignals = String(input.plan ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ") === "premium signals";

    const text = isSignals
        ? `${nameLine}\n\nCongratulations! Your Premium Signals payment was successful.\n\nPlan: ${input.plan}\nLocation: ${input.location}\n\nJoin the Telegram inner circle group here:\n${telegramInnerGroupUrl}\n\nThank you for choosing FalconsForexAcademy.`
        : `${nameLine}\n\nCongratulations! Your payment was successful.\n\nPlan: ${input.plan}\nLocation: ${input.location}\n\nTo gain full access, please complete your registration here:\n${registrationUrl}\n\nThank you for choosing FalconsForexAcademy.`;

    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
            <p>${nameLine}</p>
            <p><strong>Congratulations!</strong> Your payment was successful.</p>
            <p>
                <strong>Plan:</strong> ${input.plan}<br />
                <strong>Location:</strong> ${input.location}
            </p>
            ${
                isSignals
                    ? `<p>
                Join the Telegram inner circle group:<br />
                <a href="${telegramInnerGroupUrl}" style="color:#AD6500;font-weight:700;">Join Telegram Inner Group</a>
            </p>`
                    : `<p>
                To gain full access, please complete your registration:<br />
                <a href="${registrationUrl}" style="color:#091B25;font-weight:700;">Complete Registration</a>
            </p>`
            }
            <p>Thank you for choosing FalconsForexAcademy.</p>
        </div>
    `;

    await transporter.sendMail({
        from: `FalconsForexAcademy <${user}>`,
        to: input.to,
        subject: `Payment Successful - ${input.plan}`,
        text,
        html,
    });
}

export async function sendRegistrationSuccessEmail(input: RegistrationSuccessEmailInput) {
    const { transporter, user } = createTransport();

    const nameLine = input.fullName ? `Hi ${input.fullName},` : "Hello,";
    const locationLine = input.trainingLocation ? `Training Location: ${input.trainingLocation}` : null;

    const text = `${nameLine}\n\nYour registration was submitted successfully.\n\n${locationLine ? `${locationLine}\n\n` : ""}Our team will review your details and contact you shortly.\n\nThank you for choosing FalconsForexAcademy.`;

    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
            <p>${nameLine}</p>
            <p><strong>Your registration was submitted successfully.</strong></p>
            ${locationLine ? `<p>${locationLine}</p>` : ""}
            <p>Our team will review your details and contact you shortly.</p>
            <p>Thank you for choosing FalconsForexAcademy.</p>
        </div>
    `;

    await transporter.sendMail({
        from: `FalconsForexAcademy <${user}>`,
        to: input.to,
        subject: "Registration Successful",
        text,
        html,
    });
}

export async function sendAdminPaymentNotificationEmail(input: AdminPaymentNotificationEmailInput) {
    const adminTo = getAdminRecipientEmail();
    if (!adminTo) throw new Error("Admin email is not configured (set ADMIN_EMAIL or SMTP_USER)");

    const { transporter, user } = createTransport();

    const subject = `New Payment (${input.provider}) - ${input.status} - ${input.plan}`;
    const paidAtLine = input.paidAt ? `Paid At: ${input.paidAt}` : null;
    const locationLine = input.location ? `Location: ${input.location}` : null;

    const text = `New payment recorded.\n\nProvider: ${input.provider}\nStatus: ${input.status}\nReference: ${input.reference}\nEmail: ${input.email}\nFull Name: ${input.fullName ?? "—"}\nPlan: ${input.plan}\n${locationLine ?? ""}${locationLine ? "\n" : ""}${paidAtLine ?? ""}${paidAtLine ? "\n" : ""}`.trim();

    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
            <p><strong>New payment recorded</strong></p>
            <p>
                <strong>Provider:</strong> ${input.provider}<br />
                <strong>Status:</strong> ${input.status}<br />
                <strong>Reference:</strong> ${input.reference}<br />
                <strong>Email:</strong> ${input.email}<br />
                <strong>Full Name:</strong> ${input.fullName ?? "—"}<br />
                <strong>Plan:</strong> ${input.plan}
                ${locationLine ? `<br /><strong>Location:</strong> ${input.location}` : ""}
                ${paidAtLine ? `<br /><strong>Paid At:</strong> ${input.paidAt}` : ""}
            </p>
        </div>
    `;

    await transporter.sendMail({
        from: `FalconsForexAcademy <${user}>`,
        to: adminTo,
        subject,
        text,
        html,
    });
}

export async function sendAdminRegistrationNotificationEmail(input: AdminRegistrationNotificationEmailInput) {
    const adminTo = getAdminRecipientEmail();
    if (!adminTo) throw new Error("Admin email is not configured (set ADMIN_EMAIL or SMTP_USER)");

    const { transporter, user } = createTransport();

    const subject = `New Registration - ${input.fullName}`;

    const text = `New registration submitted.\n\nID: ${input.id}\nFull Name: ${input.fullName}\nEmail: ${input.email}\nPhone: ${input.phoneNumber}\nGender: ${input.gender}\nNationality: ${input.nationality ?? "—"}\nResidential Address: ${input.residentialAddress ?? "—"}\nTraining Location: ${input.trainingLocation}\nTrading Level: ${input.tradingLevel}\nSubmitted: ${input.createdAt}`;

    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
            <p><strong>New registration submitted</strong></p>
            <p>
                <strong>ID:</strong> ${input.id}<br />
                <strong>Full Name:</strong> ${input.fullName}<br />
                <strong>Email:</strong> ${input.email}<br />
                <strong>Phone:</strong> ${input.phoneNumber}<br />
                <strong>Gender:</strong> ${input.gender}<br />
                <strong>Nationality:</strong> ${input.nationality ?? "—"}<br />
                <strong>Residential Address:</strong> ${input.residentialAddress ?? "—"}<br />
                <strong>Training Location:</strong> ${input.trainingLocation}<br />
                <strong>Trading Level:</strong> ${input.tradingLevel}<br />
                <strong>Submitted:</strong> ${input.createdAt}
            </p>
        </div>
    `;

    await transporter.sendMail({
        from: `FalconsForexAcademy <${user}>`,
        to: adminTo,
        subject,
        text,
        html,
    });
}
