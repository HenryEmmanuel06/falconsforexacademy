import nodemailer from "nodemailer";

type PaymentSuccessEmailInput = {
    to: string;
    fullName?: string | null;
    plan: string;
    location: string;
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

export async function sendPaymentSuccessEmail(input: PaymentSuccessEmailInput) {
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

    const nameLine = input.fullName ? `Hi ${input.fullName},` : "Hello,";

    const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "";
    const siteUrl = rawSiteUrl.trim().replace(/\/$/, "");
    const registrationUrl = siteUrl ? `${siteUrl}/register` : "/register";

    const text = `${nameLine}\n\nCongratulations! Your payment was successful.\n\nPlan: ${input.plan}\nLocation: ${input.location}\n\nTo gain full access, please complete your registration here:\n${registrationUrl}\n\nThank you for choosing FalconsForexAcademy.`;

    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
            <p>${nameLine}</p>
            <p><strong>Congratulations!</strong> Your payment was successful.</p>
            <p>
                <strong>Plan:</strong> ${input.plan}<br />
                <strong>Location:</strong> ${input.location}
            </p>
            <p>
                To gain full access, please complete your registration:<br />
                <a href="${registrationUrl}" style="color:#091B25;font-weight:700;">Complete Registration</a>
            </p>
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
