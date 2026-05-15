const { getDB } = require("../config/db");

const createFeedback = async (data) => {
  const db = getDB();

  if (!db) {
    throw new Error("MongoDB is not connected");
  }

  const feedbackCollection = db.collection("feedback");

  const feedbackData = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await feedbackCollection.insertOne(feedbackData);

  return result;
};

module.exports = {
  createFeedback,
};