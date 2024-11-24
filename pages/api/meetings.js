import createHandler from "next-connect";
import dbPromise from "../../utils/db";

const handler = createHandler();
export default handler;

// Get all meetings
handler.get(async (req, res) => {
  try {
    const client = await dbPromise;
    const db = client.db("meetings");
    const meetings = await db.collection("meetings").find({}).toArray();
    res.status(200).json(meetings);
  } catch (error) {
    console.error('Get Meetings Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch meetings',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create a new meeting
handler.post(async (req, res) => {
  try {
    const { year, month, day, time, name, email, description, duration = 30 } = req.body;

    // Create the meeting object
    const meeting = {
      start: [year, month, day, time],
      timeString: time,
      duration: {
        hours: Math.floor(duration / 60),
        minutes: duration % 60
      },
      title: `Chris x ${name} Meeting`,
      description,
      location: "Google Meet or Zoom",
      status: "pending",
      busyStatus: "BUSY",
      organizer: {
        name: "Chris Loggins",
        email: "chris@loggins.cc"
      },
      attendees: [
        {
          name,
          email,
          rsvp: true,
          partstat: "ACCEPTED",
          role: "REQ-PARTICIPANT"
        }
      ]
    };

    const client = await dbPromise;
    const db = client.db("meetings");
    await db.collection("meetings").insertOne(meeting);

    res.status(200).json(meeting);
  } catch (error) {
    console.error('Create Meeting Error:', error);
    res.status(500).json({ 
      error: 'Failed to create meeting',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
