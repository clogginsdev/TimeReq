import createHandler from "next-connect"
import { createGoogleCalendarEvent } from "../../../utils/googleCalendar";
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

// Receive a POST request from the client.
handler.post(async (req, res) => {
    try {
        const {day, time, email, name, description} = req.body;

    const date = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: day,
    };

    const event = {
        start: [date.year, date.month, date.day, time.hour, time.minutes],
        duration: {hours: 0, minutes: 30},
        title: "Chris_x_" + name + "_Meeting",
        description,
        location: "Google Meet or Zoom",
        status: "CONFIRMED",
        busyStatus: "BUSY",
        organizer: {name: "Chris Loggins", email: "chris@loggins.cc"},
        attendees: [
            {
                name,
                email,
                rsvp: true,
                partstat: "ACCEPTED",
                role: "REQ-PARTICIPANT",
            },
        ],
    };

    // Create Google Calendar event
    const calendarEvent = await createGoogleCalendarEvent(event);

    // Send confirmation email with Google Meet link
    await transporter.sendMail({
        from: "chris@loggins.cc",
        to: [email, 'chris@loggins.cc'],
        subject: `Meeting Confirmation: Chris & ${name}`,
        html: `
            <p>Your meeting has been scheduled!</p>
            <p>Join with Google Meet: <a href="${calendarEvent.hangoutLink}">${calendarEvent.hangoutLink}</a></p>
            <p>The event has been added to your Google Calendar.</p>
        `
    });

    // Return the download link to the client
    res.status(200).json({message: "Thank you! Please look out for the invite in your email."});

    } catch (error) {
        console.error('Meeting Invite Error:', error);
        res.status(500).json({ 
            error: 'Failed to process meeting invite',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

