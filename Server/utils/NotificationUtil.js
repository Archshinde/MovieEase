const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (emails, subject, html, text) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "MovieEase <onboarding@resend.dev>",
            to: emails,
            subject: subject,
            html: html,
            text: text
        });

        if (error) {
            console.error("Unable to send email:", error);
            throw new Error(error.message);
        }

        console.log(`Email sent successfully to ${emails.join(", ")}`);
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