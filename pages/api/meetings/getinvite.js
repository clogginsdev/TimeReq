import createHandler from "next-connect"
const nodemailer = require('nodemailer');

const handler = createHandler();
export default handler;

const transporter = nodemailer.createTransport({
    host: "smtp.useplunk.com",
    secure: true,
    port: 465,
    auth: {
        user: "plunk",
        pass: process.env.PLUNK_API_KEY
    }
});

handler.post(async (req, res) => {
    try {
        const {day, time, email, name, description} = req.body;

        const meetingDate = new Date();
        meetingDate.setDate(day);
        meetingDate.setHours(time.hour);
        meetingDate.setMinutes(time.minutes);

        // Send confirmation email to the requester
        await transporter.sendMail({
            from: "chris@loggins.cc",
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

        // Send notification email to Chris
        await transporter.sendMail({
            from: `${process.env.NEXT_PUBLIC_FROM_EMAIL}`,
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

        res.status(200).json({
            message: "Thank you! Your request has been received. Chris will review and confirm the meeting details soon."
        });

    } catch (error) {
        console.error('Meeting Request Error:', error);
        res.status(500).json({ 
            error: 'Failed to process meeting request',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

