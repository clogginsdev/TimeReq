import createHandler from "next-connect";
import dbPromise, { jsonify } from "../../../utils/db";

const handler = createHandler();
export default handler;


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
    const { year, month, day, time, email, name, description } = req.body;

  const date = [year, month, day, time.hour, time.minutes]

  const { insertedId } = await (
    await dbPromise
  )
    .db()
    .collection("meetings")
    .insertOne({
      start: date,
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


