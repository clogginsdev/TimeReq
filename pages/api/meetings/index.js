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
  return res.json(await getMeetings());
});

handler.post(async (req, res) => {
  const { year, month, day, time, email, name, description } = JSON.parse(req.body);

  const date = [year, month, day, time.hour, time.minutes]

  const { insertedId } = await (
    await dbPromise
  )
    .db()
    .collection("meetings")
    .insertOne({
      start: date,
      duration: { hours: 0, minutes: 30 },
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
});


