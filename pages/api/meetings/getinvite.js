import createHandler from "next-connect";
import { sendConfirmationEmail, sendNotificationEmail } from "../../../utils/emailService";
import { createMeetingDate } from "../../../utils/dateUtils";

const handler = createHandler();
export default handler;

handler.post(async (req, res) => {
    try {
        const {day, time, email, name, description} = req.body;
        const meetingDate = createMeetingDate(day, time);

        await Promise.all([
            sendConfirmationEmail(email, name, meetingDate, description),
            sendNotificationEmail(name, email, meetingDate, description)
        ]);

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
