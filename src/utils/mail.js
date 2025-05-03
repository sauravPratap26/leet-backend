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
                name: "Leet Lab",
                link: "https://example.com",
            },
        });

        // Nodemailer transporter setup
        this.#transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 2525,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    async send({ userEmail, subject, mailgenContent }) {
        const emailText = this.#mailGenerator.generatePlaintext(mailgenContent);
        const emailHtml = this.#mailGenerator.generate(mailgenContent);

        const info = await this.#transporter.sendMail({
            from: '"Leet Lab (❁´◡`❁)" <leetLab@gmail.com>',
            to: userEmail,
            subject,
            text: emailText,
            html: emailHtml,
        });
        return new ApiResponse(200, 8002);
    }
}

const mailService = new MailService();
export default mailService;
