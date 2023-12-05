const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb+srv://rahul:Yg6i3prvrBgSF4ay@cluster0.io54nr3.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    // console.log("Connected to MongoDB!");

    // Function to list databases
    async function listDatabases() {
      const databasesList = await client.db().admin().listDatabases();
      console.log("Databases:");
      databasesList.databases.forEach((db) => {
        console.log(`- ${db.name}`);
      });
    }

    await listDatabases();
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
}
run().catch(console.dir);
