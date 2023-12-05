const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://rahul:Yg6i3prvrBgSF4ay@cluster0.io54nr3.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);

async function connectAndInsertData(usersData, userProfileData) {
  try {
    await client.connect();
    // console.log('Connected to MongoDB!');

    const db = client.db('test');
    const usersCollection = db.collection('Users');
    const userProfileCollection = db.collection('UsersProfile');

    // Insert users data into Users collection
    await usersCollection.insertMany(usersData);
    console.log('Users data inserted.');

    // Insert user profile data into UsersProfile collection
    await userProfileCollection.insertMany(userProfileData);
    console.log('User profiles data inserted.');
  } catch (err) {
    console.error('Error inserting data:', err);
    console.error(err.stack);
  } finally {
    await client.close();
    console.log('Connection closed.');
  }
}

module.exports = connectAndInsertData;
