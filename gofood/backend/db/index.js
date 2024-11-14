import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `\n MONGODB CONNECTED!! at HOST : ${connectionInstance.connection.host} \n DB Name : ${connectionInstance.connection.name} `
    );

    const fetched_data = await mongoose.connection.db
      .collection("gofood")
      .find({})
      .toArray();

    if (fetched_data && fetched_data.length > 0) {
      global.gofood = fetched_data;
      console.log("Data fetched and stored globally:", global.gofood);
    } else {
      console.log("No data found in the 'gofood' collection.");
    }
    const gofoodCategory = await mongoose.connection.db
      .collection("gofoodCategory")
      .find({})
      .toArray();

    if (gofoodCategory && gofoodCategory.length > 0) {
      global.gofoodCategory = gofoodCategory;
      console.log("Data fetched and stored globally:", global.gofoodCategory);
    } else {
      console.log("No data found in the 'gofood' collection.");
    }
  } catch (error) {
    console.log("MongoDb Connection error:", error);
    process.exit(1);
  }
};

export default connectDb;
