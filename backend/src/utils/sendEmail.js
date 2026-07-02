const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text, html = null) => {
    console.log("📧 sendEmail FUNCTION CALLED");

    // ✅ Safe debug logs (masked password)
    console.log("EMAIL:", process.env.EMAIL_USER || "NOT FOUND");
    console.log(
        "PASS:",
        process.env.EMAIL_PASS
            ? "*".repeat(process.env.EMAIL_PASS.length)
            : "NOT FOUND"
    );

    let htmlContent = html;
    if (!htmlContent && text) {
        // Convert plain text newlines into HTML paragraphs
        const paragraphs = text
            .split('\n')
            .map(p => p.trim())
            .filter(p => p.length > 0)
            .map(p => {
                if (p.startsWith('http://') || p.startsWith('https://')) {
                    return `
                    <div style="margin: 25px 0; text-align: center;">
                        <a href="${p}" target="_blank" style="background-color: #D90404; color: #ffffff; padding: 12px 30px; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 6px; display: inline-block; box-shadow: 0 4px 6px rgba(217, 4, 4, 0.2); transition: background-color 0.2s;">
                            Click Here to Proceed
                        </a>
                    </div>
                    <p style="margin: 0 0 10px 0; font-size: 11px; color: #64748b; text-align: center; word-break: break-all;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        <a href="${p}" style="color: #D90404; text-decoration: none;">${p}</a>
                    </p>
                    `;
                }
                
                // If it's a key-value detail (e.g. "Name: John")
                if (p.includes(':') && !p.startsWith('http')) {
                    const colonIndex = p.indexOf(':');
                    const label = p.substring(0, colonIndex).trim();
                    const value = p.substring(colonIndex + 1).trim();
                    if (label.length < 30 && value.length > 0) {
                        return `
                        <div style="padding: 10px 15px; background-color: #f8fafc; border-left: 3px solid #cbd5e1; margin-bottom: 10px; border-radius: 0 4px 4px 0; text-align: left;">
                            <strong style="color: #64748b; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 2px; font-family: sans-serif;">${label}</strong>
                            <span style="color: #0f172a; font-size: 14px; font-weight: 600; font-family: sans-serif;">${value}</span>
                        </div>
                        `;
                    }
                }
                
                return `<p style="margin: 0 0 15px 0; line-height: 1.6; color: #374151; font-family: sans-serif; text-align: left;">${p}</p>`;
            })
            .join('');

        htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05); border: 1px solid #e2e8f0;">
                            <!-- Header -->
                            <tr>
                                <td align="center" style="background-color: #ffffff; padding: 25px 20px; border-bottom: 4px solid #D90404;">
                                    <img src="${process.env.CORS_ORIGIN || 'http://localhost:3000'}/logo.png" alt="Reconditioned Engine Logo" style="height: 50px; max-height: 50px; object-fit: contain; display: block;" />
                                </td>
                            </tr>
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px; background-color: #ffffff;">
                                    <h1 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #0f172a; font-family: sans-serif; text-align: left;">${subject}</h1>
                                    <div style="font-size: 15px; color: #374151; margin-bottom: 20px;">
                                        ${paragraphs}
                                    </div>
                                </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                                <td align="center" style="background-color: #0f172a; padding: 30px 20px; color: #94a3b8; font-size: 12px;">
                                    <p style="margin: 0 0 8px 0; color: #ffffff; font-weight: 600; font-family: sans-serif;">Reconditioned Engine Marketplace</p>
                                    <p style="margin: 0 0 15px 0; font-family: sans-serif;">44 Fowler Road, Hainault Business Park, Ilford London, IG6 3UT</p>
                                    <div style="border-top: 1px solid #334155; padding-top: 15px; width: 100%; max-width: 250px;">
                                        <p style="margin: 0; font-family: sans-serif;">© 2026 Reconditioned Engine. All Rights Reserved.</p>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;
    }

    try {
        // ✅ Create transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // Gmail App Password
            },
        });

        console.log("🚀 Transporter created");

        // ✅ Verify connection (helps debug issues)
        await transporter.verify();
        console.log("✅ SMTP connection verified");

        // ✅ Send email
        const info = await transporter.sendMail({
            from: `"Reconditioned Engine" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html: htmlContent,
        });

        console.log("✅ Email sent:", info.response);

        return true;

    } catch (error) {
        console.error("❌ Email Error FULL:", error.message);

        // Extra debug info
        if (error.code) console.error("Error Code:", error.code);
        if (error.response) console.error("Error Response:", error.response);

        return false;
    }
};

module.exports = sendEmail;