const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    console.log("📧 sendEmail FUNCTION CALLED");

    // ✅ Safe debug logs (masked password)
    console.log("EMAIL:", process.env.EMAIL_USER || "NOT FOUND");
    console.log(
        "PASS:",
        process.env.EMAIL_PASS
            ? "*".repeat(process.env.EMAIL_PASS.length)
            : "NOT FOUND"
    );

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
            from: `"Your App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
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