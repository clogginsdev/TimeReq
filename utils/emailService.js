const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.useplunk.com",
    secure: true,
    port: 465,
    auth: {
        user: "plunk",
        pass: process.env.PLUNK_API_KEY
    }
});

const sendConfirmationEmail = async (email, name, meetingDate, description) => {
    return transporter.sendMail({
        from: process.env.NEXT_PUBLIC_FROM_EMAIL,
        to: email,
        subject: `Meeting Request Received`,
        html: `
            <p>Hi ${name},</p>
            <p>Thank you for your meeting request. Chris will review the details and get back to you soon.</p>
            <p>Requested meeting details:</p>
            <ul>
                <li>Date: ${meetingDate.toLocaleDateString()}</li>
                <li>Time: ${meetingDate.toLocaleTimeString()}</li>
                <li>Description: ${description}</li>
            </ul>
        `
    });
};

const sendNotificationEmail = async (name, email, meetingDate, description) => {
    return transporter.sendMail({
        from: process.env.NEXT_PUBLIC_FROM_EMAIL,
        to: "chris@loggins.cc",
        subject: `New Meeting Request from ${name}`,
        html: `
            <p>New meeting request received:</p>
            <ul>
                <li>Name: ${name}</li>
                <li>Email: ${email}</li>
                <li>Date: ${meetingDate.toLocaleDateString()}</li>
                <li>Time: ${meetingDate.toLocaleTimeString()}</li>
                <li>Description: ${description}</li>
            </ul>
        `
    });
};

module.exports = {
    sendConfirmationEmail,
    sendNotificationEmail
};
