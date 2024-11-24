import createHandler from "next-connect";
import dbPromise, { jsonify } from "../../../utils/db";

const handler = createHandler();
export default handler;


export async function checkTimeAvailable(year, month, day, hour, minutes) {
  const db = await dbPromise;
  const existingMeeting = await db
    .db("timereqs")
    .collection("meetings")
    .findOne({
      start: [year, month, day, hour, minutes],
      taken: true
    });
  return !existingMeeting;
}

export async function getMeetings() {
  return await (await dbPromise)
    .db("timereqs")
    .collection("meetings")
    .find()
    .toArray();
}

handler.get(async (req, res) => {
  try {
    const meetings = await getMeetings();
    return res.json(meetings);
  } catch (error) {
    console.error('Get Meetings Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch meetings',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

handler.post(async (req, res) => {
  try {
    const { year, month, day, time, email, name, description, duration } = req.body;

    // Format time as 12-hour format with AM/PM
    const formattedTime = new Date(year, month, day, time.hour, time.minutes)
      .toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

    const date = [year, month, day, formattedTime];

    const { insertedId } = await (
      await dbPromise
    )
      .db()
      .collection("meetings")
      .insertOne({
        start: date,
        timeString: formattedTime, // Store formatted time string
        taken: true,
        duration: { hours: Math.floor(duration / 60), minutes: duration % 60 },
        title: "Chris x " + name + " Meeting",
        description,
        location: "Google Meet or Zoom",
        status: "CONFIRMED",
        busyStatus: "BUSY",
        organizer: { name: "Chris Loggins", email: "chris@loggins.cc" },
        attendees: [
          {
            name,
            email,
            rsvp: true,
            partstat: "ACCEPTED",
            role: "REQ-PARTICIPANT",
          },
        ],
      });
    res.json({ _id: insertedId });
  } catch (error) {
    console.error('Create Meeting Error:', error);
    res.status(500).json({ 
      error: 'Failed to create meeting',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

