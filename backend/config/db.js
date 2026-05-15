const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

let db;

const connectDB = async () => {
  try {
    await client.connect();

    const dbName = process.env.MONGO_DB_NAME || "fix_buddy";

    db = client.db(dbName);

    console.log(`MongoDB Connected to database: ${dbName}`);
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

const getDB = () => db;

module.exports = { connectDB, getDB };