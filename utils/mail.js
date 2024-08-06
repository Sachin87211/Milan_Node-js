// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   secure: false, 
//   auth: {
//     user: "maddison53@ethereal.email",
//     pass: "jn7jnAPss4f63QBp6D",
//   },
// });

// async function main() {
//   const otp = crypto.randomInt(0, Math.pow(10, 4)).toString().padStart(4, '0');
//   console.log(otp)
//   const info = await transporter.sendMail({
//     from: '"Milan👻" <sachin211@ethereal.email>', 
//     to: "bar@example.com, baz@example.com", 
//     subject: "Update email ✔", 
//     // text: "Hello world?", 
//     html: "<b>otp</b>",
//   });

//   console.log("Message sent: %s", info.messageId);
// }

// main().catch(console.error);