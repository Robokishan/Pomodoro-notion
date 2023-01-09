import nodemailer from "nodemailer";
import { Attachment } from "nodemailer/lib/mailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: Number(process.env.SMTP_PORT ?? 587),
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  attachments,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: Attachment[];
}) => {
  await transporter.sendMail({
    from: process.env.REPORT_EMAIL,
    to,
    subject,
    text,
    html,
    attachments,
  });
};
