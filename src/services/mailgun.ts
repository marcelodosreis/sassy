import FormData from "form-data";
import Mailgun from "mailgun.js";

export const sendEmail = async ({
    from,
    to,
    subject,
    text,
    html,
}: {
    from: string;
    to: string[];
    subject: string;
    text: string;
    html: string;
}) => {
    if (!from || !to || !subject || !text || !html) {
        throw new Error("Missing required email parameters.");
    }

    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
        username: "api",
        key: process.env.MAILGUN_SECRET_KEY || "",
    });

    const message = {
        from,
        to,
        subject,
        text,
        html,
    };

    try {
        await mg.messages.create(
            process.env.MAILGUN_SECRET_DOMAIN || "MAILGUN_SECRET_DOMAIN",
            message
        );
        console.log(`Email sent successfully to: ${to.join(", ")}`);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error(`Failed to send email to: ${to.join(", ")}. Error: ${error}`);
    }
};