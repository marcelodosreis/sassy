import FormData from "form-data";
import Mailgun from "mailgun.js";

export const sendEmail = async (
    from: string,
    to: string[],
    subject: string,
    text: string
) => {
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
        username: "api",
        key: process.env.MAILGUN_SECRET_KEY || "MAILGUN_SECRET_KEY",
    });

    const message = {
        from,
        to,
        subject,
        text,
    };

    try {
        const data = await mg.messages.create(process.env.MAINGUL_SECRET_DOMAIN || "MAINGUL_SECRET_DOMAIN", message);
        console.log(data);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
