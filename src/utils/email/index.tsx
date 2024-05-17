import nodemailer from "nodemailer";
import postmarkTransport from "nodemailer-postmark-transport";
import { Attachment } from "nodemailer/lib/mailer";

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_SERVER,
//   port: Number(process.env.SMTP_PORT ?? 587),
//   auth: {
//     user: process.env.SMTP_USERNAME,
//     pass: process.env.SMTP_PASSWORD,
//   },
//   debug: true,
// });

const transporter = nodemailer.createTransport(
  postmarkTransport({
    auth: {
      apiKey: process.env.POSTMARK_API_KEY!,
    },
  })
);

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
  console.log({ html }, text, { attachments });
  await transporter
    .sendMail({
      from: process.env.REPORT_EMAIL,
      to,
      subject,
      text,
      html,
      attachments,
    })
    .then((success) =>
      console.log("Mail sent", {
        success,
        to,
        subject,
        text,
        html,
        attachment: attachments?.length,
      })
    )
    .catch((err) => console.error({ err }));
};
