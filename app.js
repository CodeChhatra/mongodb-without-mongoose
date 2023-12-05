const express = require('express');
const connectAndInsertData = require('./db');
const usersData = require('./userdata.json').usersData;
const userProfileData = require('./userprofile.json').userProfileData;

const app = express();
const PORT = 5000;

app.get('/insertData', async (req, res) => {
  try {
    await connectAndInsertData(usersData, userProfileData);
    res.send('Data inserted into MongoDB collections.');
  } catch (err) {
    res.status(500).send('Error inserting data.');
  }
});

app.listen(PORT, () => {
  console.log(`Node.js App running on port ${PORT}...`);
});
