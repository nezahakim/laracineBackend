import { Router } from "express";

const User = Router()

User.get('/account/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    const teachersCollection = db.collection('teachers');

    const data = await usersCollection.aggregate([
      { $match: { id: userId } },
      {
        $lookup: {
          from: 'teachers',
          localField: 'id',
          foreignField: 'user_id',
          as: 'teacherData',
        },
      },
      { $unwind: '$teacherData' },
      {
        $project: {
          _id: 0,
          id: '$id',
          // Include other fields you want to retrieve
          // Example: firstName: '$firstName',
          //          lastName: '$lastName',
          //          subjectTaught: '$teacherData.subject_taught',
        },
      },
    ]).toArray();

    if (data.length > 0) {
      res.json({ status: true, data: data[0] });
    } else {
      res.json({ status: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

export default User