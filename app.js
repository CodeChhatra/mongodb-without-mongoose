const express = require('express');
const { connectDB } = require('./db');

const app = express();
const PORT = 5000;

app.get('/averageAge', async (req, res) => {
  try {
    const db = await connectDB();
    const usersCollection = db.collection('UsersProfile');

    const users = await usersCollection.find({}).toArray();

    const currentDate = new Date();
    let totalAge = 0;
    let validUsersCount = 0;

    for (const user of users) {
      try {
        const dob = new Date(user.dob); // Parse MongoDB date format

        const age = calculateAge(dob, currentDate);

        if (!isNaN(age)) {
          totalAge += age;
          validUsersCount++;

          
          await usersCollection.updateOne(
            { _id: user._id }, 
            { $set: { age: age } } 
          );
        }
      } catch (error) {
        console.error(`Error calculating age for user ${user.name}: ${error}`);
      }
    }

    const averageAge = totalAge / validUsersCount;

    res.json({ averageAge });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error calculating average age.' });
  }
});

// Function to calculate age
function calculateAge(dateOfBirth, currentDate) {
  const dob = new Date(dateOfBirth);
  const ageDate = new Date(currentDate - dob);
  const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
  return isNaN(calculatedAge) ? null : calculatedAge; 
}

app.get('/deleteUsers', async (req, res) => {
  try {
    const db = await connectDB();
    const userProfileCollection = db.collection('UsersProfile');
    const usersCollection = db.collection('Users');

    const ageThreshold = 25; 

    
    const usersToDelete = await userProfileCollection.find({ age: { $gte: ageThreshold } }).toArray();

   
    const deleteProfileResult = await userProfileCollection.deleteMany({ age: { $gte: ageThreshold } });

   
    const userIdsToDelete = usersToDelete.map(user => user.userId); 
    const deleteUserResult = await usersCollection.deleteMany({ _id: { $in: userIdsToDelete } });

    res.json({ deletedProfilesCount: deleteProfileResult.deletedCount, deletedUsersCount: deleteUserResult.deletedCount });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting users.' });
  }
});



app.listen(PORT, () => {
  console.log(`Node.js App running on port ${PORT}...`);
});
