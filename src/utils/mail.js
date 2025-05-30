import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import ApiError from "./api-error.js";
import ApiResponse from "./api-response.js";

class MailService {
    #mailGenerator;
    #transporter;

    constructor() {
        // Mailgen setup
        this.#mailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "Paperless Code",
                link: "https://www.paperlesscode.com",
            },
        });

        // Nodemailer transporter setup
        this.#transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure:false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    async send({ userEmail, subject, mailgenContent }) {
        try {
            const emailText =
                this.#mailGenerator.generatePlaintext(mailgenContent);
            const emailHtml = this.#mailGenerator.generate(mailgenContent);

            const info = await this.#transporter.sendMail({
                from: '"Paperless Code (❁´◡`❁)" <support@paperlesscode.com>',
                to: userEmail,
                subject,
                text: emailText,
                html: emailHtml,
            });

            console.log(info)
            return new ApiResponse(200, 8002);
        } catch (error) {
            console.error("Error sending email:", error);
            return new ApiError(500, 1024);
        }
    }
}

const mailService = new MailService();
export default mailService;
