const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
    }
});

exports.sendMail = async (receiver) => {
    try {
        await transport.sendMail(receiver);
        console.log("Email sent:", receiver);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending email");
    }
};