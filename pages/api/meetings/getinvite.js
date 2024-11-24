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
        
        // Parse time string (e.g., "1:00 PM")
        const [timeStr, period] = time.split(' ');
        const [hours, minutes] = timeStr.split(':').map(Number);
        let hour = hours;
        if (period === 'PM' && hours !== 12) hour += 12;
        if (period === 'AM' && hours === 12) hour = 0;
        
        meetingDate.setHours(hour);
        meetingDate.setMinutes(minutes);

        // Send confirmation email to the requester
        await transporter.sendMail({
            from: "hellp@lggs.dev",
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
        console.log("EMAIL", process.env.NEXT_PUBLIC_FROM_EMAIL);
        await transporter.sendMail({
            from: "hellp@lggs.dev",
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
