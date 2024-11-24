import createHandler from "next-connect";
import dbPromise, { jsonify } from "../../../utils/db";

const handler = createHandler();
export default handler;


export async function checkTimeAvailable(timeString) {
  const db = await dbPromise;
  const existingMeeting = await db
    .db("timereqs")
    .collection("meetings")
    .findOne({
      start: timeString,
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

  // Convert time to 24-hour format
  let hour = time.hour;
  if (time.period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (time.period === 'AM' && hour === 12) {
    hour = 0;
  }

  // Format time as "HH:MM AM/PM"
  const formattedTime = `${time.hour.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')} ${time.period}`;

  const { insertedId } = await (
    await dbPromise
  )
    .db()
    .collection("meetings")
    .insertOne({
      start: formattedTime,
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


