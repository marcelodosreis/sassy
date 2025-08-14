import FormData from "form-data";
import Mailgun from "mailgun.js";

type EmailParams = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
};

export default class EmailService {
  private mailgunClient;

  constructor() {
    this.mailgunClient = new Mailgun(FormData).client({
      username: "api",
      key: process.env.MAILGUN_SECRET_KEY || "",
    });
  }

  async sendEmail({
    from,
    to,
    subject,
    text,
    html,
  }: EmailParams): Promise<void> {
    this.validateEmailParams({ from, to, subject, text, html });

    const message = {
      from: `${from} <postmaster@${process.env.MAILGUN_SECRET_DOMAIN}>`,
      to,
      subject,
      text,
      html,
    };

    try {
      await this.mailgunClient.messages.create(
        process.env.MAILGUN_SECRET_DOMAIN || "MAILGUN_SECRET_DOMAIN",
        message
      );
      console.log(`Email sent successfully to: ${to.join(", ")}`);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error(
        `Failed to send email to: ${to.join(", ")}. Error: ${error}`
      );
    }
  }

  private validateEmailParams({
    from,
    to,
    subject,
    text,
    html,
  }: EmailParams): void {
    if (!from || to! || !subject || text! || !html) {
      throw new Error("Missing required email parameters.");
    }
  }
}
