const nodemailer = require("nodemailer");

const sendEmail = async (emails, subject, html, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const emailIds = emails.join(", ");

        const mailDetails = {
            from: process.env.EMAIL_USER,
            to: emailIds,
            subject: subject
        };

        if (html) {
            mailDetails.html = html;
        }

        if (text) {
            mailDetails.text = text;
        }

        const data = await transporter.sendMail(mailDetails);

        console.log(`Email sent successfully to ${emailIds}`);

        return data;

    } catch (err) {
        console.error("Unable to send email:", err);
        throw err;
    }
};

module.exports = {
    sendEmail
};

























// const nodeMailer = require("nodemailer");
// const sendEmail = (emails, subject, html, text) => {
//     const emailIds = emails.join(', ')
//     let transporter = nodeMailer.createTransport({
//         service: "gmail",
//         auth: {
//            user: process.env.EMAIL_USER,
//            pass: process.env.EMAIL_PASS
//         }
//     });

//     let mailDetails = {
//         from: process.env.EMAIL_USER,
//         to: emailIds,
//         subject
//     }

//     if(html) {
//         mailDetails.html = html;
//     }

//     if(text) {
//         mailDetails.text = text;
//     }

//     transporter.sendMail(mailDetails, function(err, data){
//         if(err) {
//             console.log("Unable to send email", err);
//         } else {
//             console.log(`Email sent successfully to ${emailIds}`);
//         }
//     })
// }

// module.exports = {
//     sendEmail
// }