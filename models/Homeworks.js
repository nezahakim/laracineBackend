import { Router } from "express";
const Homeworks = Router()

Homeworks.post('/homework/add', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const homeworksCollection = db.collection('homeworks');
  
      const dt = new Date();
      const id = Math.floor(Math.random() * 10000000);
      const course = req.body.course;
      const Class = req.body.class;
      const marks = req.body.marks;
      const sub_date = req.body.sub_date;
      const pre_date = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
      const unique_id = req.body.unique_id;
  
      if (id && course && Class && marks && sub_date && pre_date && unique_id) {
        const result = await homeworksCollection.insertOne({
          id,
          course,
          Class,
          marks,
          pre_date,
          sub_date,
          unique_id,
        });
  
        if (result.insertedCount === 1) {
          const values = {
            status: true,
            id: id,
          };
          console.log(values);
          return res.json(values);
        }
      } else {
        res.json({ status: false, message: 'All input fields are required!' });
        console.log('All input fields are required!');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
});
Homeworks.get('/homework/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const questionsCollection = db.collection('questions');
  
      const id = req.params.id;
  
      const data = await questionsCollection.find({ homework_id: id }).sort({ id: 1 }).toArray();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
Homeworks.get('/homeworks/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const homeworksCollection = db.collection('homeworks');
      const usersCollection = db.collection('users');
      const teachersCollection = db.collection('teachers');
  
      const id = req.params.id;
  
      const data = await homeworksCollection.aggregate([
        {
          $match: { id },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: 'id',
            as: 'userData',
          },
        },
        {
          $lookup: {
            from: 'teachers',
            localField: 'author',
            foreignField: 'user_id',
            as: 'teacherData',
          },
        },
        { $unwind: '$userData' },
        { $unwind: '$teacherData' },
        {
          $project: {
            _id: 0,
            id: 1,
            course: 1,
            Class: 1,
            marks: 1,
            pre_date: 1,
            sub_date: 1,
            unique_id: 1,
            user: '$userData',
            teacher: '$teacherData',
          },
        },
      ]).toArray();
  
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
Homeworks.get('/homeworks_id/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const homeworksCollection = db.collection('homeworks');
  
      const id = req.params.id;
  
      const data = await homeworksCollection.findOne({ id });
  
      if (data) {
        const values = {
          status: true,
          data: data,
        };
        res.json(values);
      } else {
        res.json({ status: false, message: 'Homework not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
Homeworks.get('/homeworks', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const homeworksCollection = db.collection('homeworks');
      const teachersCollection = db.collection('teachers');
      const usersCollection = db.collection('users');
  
      const data = await homeworksCollection.aggregate([
        {
          $lookup: {
            from: 'teachers',
            localField: 'author',
            foreignField: 'user_id',
            as: 'teacherData',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: 'id',
            as: 'userData',
          },
        },
        { $unwind: '$teacherData' },
        { $unwind: '$userData' },
        {
          $project: {
            _id: 0,
            Hid: '$id',
            course: 1,
            Class: 1,
            marks: 1,
            pre_date: 1,
            sub_date: 1,
            unique_id: 1,
            teacher: '$teacherData',
            user: '$userData',
          },
        },
      ]).toArray();
  
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
Homeworks.get('/question/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const questionsCollection = db.collection('questions');
  
      const id = req.params.id;
  
      const data = await questionsCollection.findOne({ id });
  
      if (data) {
        const values = {
          status: true,
          data: data,
        };
        res.json(values);
      } else {
        res.json({ status: false, message: 'Question not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
Homeworks.post('/question/update/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const questionsCollection = db.collection('questions');
  
      const id = req.params.id;
      const question = req.body.question;
      const marks = req.body.marks;
  
      if (id && question && marks) {
        const result = await questionsCollection.updateOne({ id }, { $set: { question, marks } });
  
        if (result.modifiedCount > 0) {
          const values = { status: true, data: result };
          res.json(values);
        } else {
          res.json({ status: false, message: 'Question not found or no changes made' });
        }
      } else {
        res.json('All input fields are required!');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
Homeworks.post('/homework/update/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const homeworksCollection = db.collection('homeworks');
  
      const id = req.params.id;
      const course = req.body.course;
      const Class = req.body.class;
      const marks = req.body.marks;
      const sub_date = req.body.sub_date;
  
      if (id && Class && marks && course && sub_date !== null) {
        const result = await homeworksCollection.updateOne(
          { id },
          { $set: { Class, marks, course, sub_date } }
        );
  
        if (result.modifiedCount > 0) {
          const values = { status: true, data: result };
          res.json(values);
        } else {
          res.json({ status: false, message: 'Homework not found or no changes made' });
        }
      } else {
        res.json('All input fields are required!');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
Homeworks.get('/homework/delete/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const questionsCollection = db.collection('questions');
      const homeworksCollection = db.collection('homeworks');
  
      const id = req.params.id;
  
      if (id) {
        await questionsCollection.deleteMany({ homework_id: id });
        const result = await homeworksCollection.deleteOne({ id });
  
        if (result.deletedCount > 0) {
          const values = { status: true, data: result };
          res.json(values);
        } else {
          res.json({ status: false, message: 'Homework not found or no changes made' });
        }
      } else {
        res.json('All input fields are required!');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
Homeworks.get('/question/delete/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const questionsCollection = db.collection('questions');
  
      const id = req.params.id;
  
      if (id) {
        const result = await questionsCollection.deleteOne({ id });
  
        if (result.deletedCount > 0) {
          const values = { status: true, data: 'Success' };
          res.json(values);
        } else {
          res.json({ status: false, message: 'Question not found or no changes made' });
        }
      } else {
        res.json('All input fields are required!');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
Homeworks.post('/question/add', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const questionsCollection = db.collection('questions');
  
      const question = req.body.question;
      const marks = req.body.marks;
      const homework_id = req.body.homework_id;
  
      if (question && marks && homework_id) {
        const result = await questionsCollection.insertOne({ question, marks, homework_id });
  
        if (result.insertedCount > 0) {
          const values = { status: true, id: homework_id };
          console.log(values);
          res.json(values);
        } else {
          res.json('Failed to insert question');
        }
      } else {
        res.json('All input fields are required');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });


  Homeworks.get('/announcements', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const announcementsCollection = db.collection('announcements');
      const usersCollection = db.collection('users');
  
      const data = await announcementsCollection.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'who_announce',
            foreignField: 'id',
            as: 'who_announce_user'
          }
        },
        {
          $unwind: '$who_announce_user'
        },
        {
          $project: {
            title: 1,
            dates: 1,
            announcement: 1,
            who_announce: '$who_announce_user',
            Atitle: '$title',
            AId: '$_id'
          }
        },
        {
          $sort: { AId: -1 }
        }
      ]).toArray();
  
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
  Homeworks.get('/announcements/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const announcementsCollection = db.collection('announcements');
      const usersCollection = db.collection('users');
  
      const id = req.params.id;
      const data = await announcementsCollection.aggregate([
        {
          $match: { _id: new ObjectId(id) }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'who_announce',
            foreignField: 'id',
            as: 'who_announce_user'
          }
        },
        {
          $unwind: '$who_announce_user'
        },
        {
          $project: {
            title: 1,
            dates: 1,
            announcement: 1,
            who_announce: '$who_announce_user',
            Atitle: '$title',
            AId: '$_id'
          }
        }
      ]).toArray();
  
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
  Homeworks.post('/announcements/add', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const announcementsCollection = db.collection('announcements');
  
      const dt = new Date();
      const announcement = req.body.announcement;
      const title = req.body.title;
      const who_announce = req.body.who_announce;
      const dates = `${dt.getMonth()}-${dt.getDate()}-${dt.getFullYear()}`;
  
      if (announcement && title && who_announce) {
        const result = await announcementsCollection.insertOne({
          title,
          dates,
          announcement,
          who_announce
        });
  
        if (result.insertedCount > 0) {
          const values = { status: true, id: 'row added' };
          console.log(values);
          res.json(values);
        } else {
          res.json('Failed to insert announcement');
        }
      } else {
        res.json('All input fields are required');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
  Homeworks.post('/announcements/update/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const announcementsCollection = db.collection('announcements');
  
      const id = req.params.id;
      const announcement = req.body.announcement;
      const title = req.body.title;
  
      if (id && announcement && title) {
        const result = await announcementsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { announcement, title } }
        );
  
        if (result.modifiedCount > 0) {
          const values = { status: true, data: result };
          res.json(values);
        } else {
          res.json({ status: false, message: 'Announcement not found or no changes made' });
        }
      } else {
        res.json('All input fields are required!');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });

  Homeworks.post('/students/update/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const studentsCollection = db.collection('students');
  
      const id = req.params.id;
      const fname = req.body.fname;
      const lname = req.body.lname;
      const phone = req.body.phone;
      const Class = req.body.class;
      const gender = req.body.gender.toLowerCase();
      const dob = req.body.dob;
  
      if (gender === 'male' || gender === 'female') {
        const result = await studentsCollection.updateOne(
          { student_id: id },
          {
            $set: {
              gender,
              first_name: fname,
              last_name: lname,
              parent_phone: phone,
              grade_level: Class,
              date_of_birth: dob
            }
          }
        );
  
        if (result.modifiedCount > 0) {
          const values = { status: true, data: result };
          res.json(values);
        } else {
          res.json({ status: false, message: 'Student not found or no changes made' });
        }
      } else {
        res.json('Please Gender Must be Male or Female');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
  Homeworks.get('/student/delete/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const studentsCollection = db.collection('students');
  
      const id = req.params.id;
      const result = await studentsCollection.deleteOne({ student_id: id });
  
      if (result.deletedCount > 0) {
        const values = { status: true, data: result };
        res.json(values);
      } else {
        res.json({ status: false, message: 'Student not found or no changes made' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
  Homeworks.get('/students', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const studentsCollection = db.collection('students');
  
      const data = await studentsCollection.find().toArray();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
  Homeworks.get('/students/id/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const studentsCollection = db.collection('students');
  
      const id = req.params.id;
      const data = await studentsCollection.findOne({ student_id: id });
  
      if (data) {
        const values = { status: true, data };
        res.json(values);
      } else {
        res.json({ status: false, message: 'Student not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
  Homeworks.get('/students/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const studentsCollection = db.collection('students');
  
      const id = req.params.id;
      const data = await studentsCollection.find({
        $or: [
          { first_name: { $regex: `.*${id}.*`, $options: 'i' } },
          { last_name: { $regex: `.*${id}.*`, $options: 'i' } },
          { student_id: { $regex: `.*${id}.*`, $options: 'i' } }
        ]
      }).toArray();
  
      if (data) {
        res.json(data);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
  Homeworks.post('/students/add', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const studentsCollection = db.collection('students');
  
      const dt = new Date();
      const fname = req.body.fname;
      const lname = req.body.lname;
      const phone = req.body.phone;
      const Class = req.body.class;
      const gender = req.body.gender.toLowerCase();
      const dob = req.body.dob;
      const join_date = `${dt.getMonth()}-${dt.getDate()}-${dt.getFullYear()}`;
  
      if (gender === 'male' || gender === 'female') {
        const result = await studentsCollection.insertOne({
          first_name: fname,
          last_name: lname,
          parent_phone: phone,
          gender,
          date_of_birth: dob,
          grade_level: Class,
          join_date
        });
  
        if (result.insertedCount > 0) {
          const values = { status: true, id: 'row added' };
          console.log(values);
          res.json(values);
        } else {
          res.json('Failed to insert student');
        }
      } else {
        res.json('Please Gender Must be Male or Female');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });



  Homeworks.post('/teachers/add', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const usersCollection = db.collection('users');
      const teachersCollection = db.collection('teachers');
  
      const names = req.body.names;
      const email = req.body.email;
      const phone_number = req.body.phone_number;
      const gender = req.body.gender.toLowerCase();
      const password = req.body.password;
      const title = req.body.title;
      const subject_taught = req.body.subject_taught;
      const id = Math.floor(Math.random() * 10);
  
      if (gender === 'male' || gender === 'female') {
        const userResult = await usersCollection.insertOne({
          id,
          names,
          email,
          phone_number,
          gender,
          password,
          title
        });
  
        if (userResult.insertedCount > 0) {
          const teacherResult = await teachersCollection.insertOne({
            user_id: id,
            subject_taught
          });
  
          if (teacherResult.insertedCount > 0) {
            const values = { status: true, id: 'row added' };
            console.log(values);
            res.json(values);
          } else {
            res.json('Failed to insert teacher');
          }
        } else {
          res.json('Failed to insert user');
        }
      } else {
        res.json('Please Gender Must be Male or Female');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
  Homeworks.post('/teachers/update/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const usersCollection = db.collection('users');
      const teachersCollection = db.collection('teachers');
  
      const id = req.params.id;
      const names = req.body.names;
      const email = req.body.email;
      const phone_number = req.body.phone_number;
      const gender = req.body.gender.toLowerCase();
      const password = req.body.password;
      const title = req.body.title;
      const subject_taught = req.body.subject_taught;
  
      if (gender === 'male' || gender === 'female') {
        const userResult = await usersCollection.updateOne(
          { id },
          {
            $set: {
              gender,
              names,
              email,
              phone_number,
              password,
              title
            }
          }
        );
  
        if (userResult.modifiedCount > 0) {
          const teacherResult = await teachersCollection.updateOne(
            { user_id: id },
            { $set: { subject_taught } }
          );
  
          if (teacherResult.modifiedCount > 0) {
            const values = { status: true, data: teacherResult };
            res.json(values);
          } else {
            res.json({ status: false, message: 'Teacher not found or no changes made' });
          }
        } else {
          res.json({ status: false, message: 'User not found or no changes made' });
        }
      } else {
        res.json('Please Gender Must be Male or Female');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
  Homeworks.get('/teachers/delete/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const teachersCollection = db.collection('teachers');
      const usersCollection = db.collection('users');
  
      const id = req.params.id;
      const teacherResult = await teachersCollection.deleteOne({ user_id: id });
  
      if (teacherResult.deletedCount > 0) {
        const userResult = await usersCollection.deleteOne({ id });
  
        if (userResult.deletedCount > 0) {
          const values = { status: true, data: userResult };
          res.json(values);
        } else {
          res.json({ status: false, message: 'User not found or no changes made' });
        }
      } else {
        res.json({ status: false, message: 'Teacher not found or no changes made' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
  Homeworks.get('/teachers/id/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const usersCollection = db.collection('users');
      const teachersCollection = db.collection('teachers');
  
      const id = req.params.id;
      const data = await usersCollection.aggregate([
        {
          $match: { id: parseInt(id) }
        },
        {
          $lookup: {
            from: 'teachers',
            localField: 'id',
            foreignField: 'user_id',
            as: 'teacherData'
          }
        }
      ]).toArray();
  
      if (data) {
        const values = { status: true, data };
        res.json(values);
      } else {
        res.json({ status: false, message: 'Teacher not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
  Homeworks.get('/teachers', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const usersCollection = db.collection('users');
      const teachersCollection = db.collection('teachers');
  
      const data = await usersCollection.aggregate([
        {
          $lookup: {
            from: 'teachers',
            localField: 'id',
            foreignField: 'user_id',
            as: 'teacherData'
          }
        }
      ]).toArray();
  
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
  Homeworks.get('/teachers/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const usersCollection = db.collection('users');
      const teachersCollection = db.collection('teachers');
  
      const id = new String(req.params.id);
      const data = await usersCollection.aggregate([
        {
          $match: {
            $or: [
              { names: { $regex: `.*${id}.*`, $options: 'i' } },
              { email: { $regex: `.*${id}.*`, $options: 'i' } },
              { phone_number: { $regex: `.*${id}.*`, $options: 'i' } }
            ]
          }
        },
        {
          $lookup: {
            from: 'teachers',
            localField: 'id',
            foreignField: 'user_id',
            as: 'teacherData'
          }
        }
      ]).toArray();
  
      if (data) {
        res.json(data);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
Homeworks.get('/comments/:id', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const commentsCollection = db.collection('comments');
      const usersCollection = db.collection('users');
  
      const id = req.params.id;
      const data = await commentsCollection.aggregate([
        {
          $match: { activity_id: parseInt(id) }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'who_comment',
            foreignField: 'id',
            as: 'commenter'
          }
        }
      ]).toArray();
  
      if (data) {
        res.json(data);
      } else {
        res.json({ status: false, message: 'No comments found for the given activity ID' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });
  
  Homeworks.post('/comments/add', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const commentsCollection = db.collection('comments');
  
      const activity_id = req.body.activity_id;
      const who_comment = req.body.who_comment;
      const comment = req.body.comment;
  
      if (comment && activity_id && who_comment) {
        const result = await commentsCollection.insertOne({
          activity_id: parseInt(activity_id),
          who_comment: who_comment,
          comment: comment
        });
  
        if (result.insertedCount > 0) {
          const values = { status: true, id: 'row added' };
          console.log(values);
          res.json(values);
        } else {
          res.json({ status: false, message: 'Failed to add comment' });
        }
      } else {
        console.log(activity_id, comment, who_comment);
        res.json('All input fields are required');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  });

export default Homeworks