import createHandler from "next-connect"
const ics = require('ics');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const handler = createHandler();
export default handler;

const transporter = nodemailer.createTransport({
    host: "smtp.useplunk.com",
    secure: true, // Using SSL
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

    const {error, value} = ics.createEvent(event);
    if (error) {
        console.error('ICS Creation Error:', error);
        return res.status(500).json({ error: 'Failed to create calendar invite' });
    }

    // Ensure the invites directory exists
    const invitesDir = path.join(process.cwd(), 'public/invites');
    fs.mkdirSync(invitesDir, { recursive: true });

    // Save the file to the file system
    const filename = path.join(invitesDir, `${event.start.join('')}_invite.ics`);
    fs.writeFileSync(filename, value);

    const attachment = fs.readFileSync(filename).toString("base64");

    // Send the email with Nodemailer
    await transporter.sendMail({
        from: "chris@loggins.cc",
        to: [email, 'chris@loggins.cc'],
        subject: `Meeting Invitation: Chris & ${name}`,
        text: `Meeting request confirmed. The calendar invite is attached.`,
        attachments: [{
            filename: `${event.start.join('')}_invite.ics`,
            content: value,
            contentType: 'text/calendar'
        }]
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

