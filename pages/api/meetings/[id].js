import { ObjectId } from 'mongodb';
import createHandler from "next-connect";
import dbPromise from "../../../utils/db";

const handler = createHandler();
export default handler;

handler.patch(async (req, res) => {
  try {
    const { id } = req.query;
    const { status } = req.body;

    const client = await dbPromise;
    const db = client.db("meetings");
    
    const result = await db.collection("meetings").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.status(200).json({ message: 'Meeting status updated successfully' });
  } catch (error) {
    console.error('Update Meeting Status Error:', error);
    res.status(500).json({ 
      error: 'Failed to update meeting status',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
