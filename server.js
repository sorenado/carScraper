const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const crypto = require("crypto");
const { sendConfirmation, hashStringToBase64 } = require("./helperFunctions");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();
const port = 8080;
const dbURL =
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1";

async function connectToDB() {
  const client = new MongoClient(dbURL);
  try {
    await client.connect();
    console.log("Connected To Database");
    const db = client.db("car_scraper");
    return { db, client };
  } catch (err) {
    console.error(err);
  }
}

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/homepage.html");
});

app.post("/join-button-form", async (req, res) => {
  try {
    const { db, client } = await connectToDB();
    const pendingUserCollection = db.collection("pendingUsers");
    const usersCollection = db.collection("users");

    const { name, email, password } = req.body;
    console.log(name, email, password);

    const user = await usersCollection.findOne({ email: email });

    if (user) {
      console.log("User exists in the database:", user);
      res.sendStatus(409); // If the user already has an account
      return; // Exit the function to prevent further execution
    }

    const hashedPassword = await hashStringToBase64(password);
    console.log(`HashedPassword: ${hashedPassword}`);

    const pendingUser = {
      name: name,
      email: email,
      password: hashedPassword,
    };

    const result = await pendingUserCollection.insertOne(pendingUser);
    const inputtedPendingUser = await pendingUserCollection.find({
      email: email,
    });

    if (inputtedPendingUser) {
      sendConfirmation(email, result.insertedId).catch((error) => {
        res.sendStatus(500);
        return; // Exit the function on error
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});

app.get("/addedUsersPage", async (req, res) => {
  const objectId = req.query.objectid;

  try {
    const { db, client } = await connectToDB();
    const userCollection = db.collection("users");
    const pendingUserCollection = db.collection("pendingUsers");
    const objectIdToQuery = new ObjectId(objectId);

    const pendingUser = await pendingUserCollection.findOne({
      _id: objectIdToQuery,
    });
    const user = await userCollection.insertOne(pendingUser);
    const deletePendingUser = await pendingUserCollection.deleteOne({
      _id: objectIdToQuery,
    });

    if (deletePendingUser.deletedCount === 1) {
      res.status(200).sendFile(__dirname + "/addedUsersPage.html");
      console.log(
        "Everything worked correctly in making the user and adding to the database"
      );
    } else {
      res.status(500).sendFile(__dirname + "/addedUsersPage.html");
      console.log("Deleted count was not 1 ");
    }
  } catch (err) {
    console.error(err);
    res.status(500).sendFile(__dirname + "/addedUsersPage.html");
  }
});

app.post("/login-form", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { db, client } = await connectToDB();
    const userCollection = db.collection("users");

    const userInfo = await userCollection.findOne({ email: email });

    if (!userInfo) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const hashedInputPassword = await hashStringToBase64(password);

    if (userInfo.password === hashedInputPassword) {
      res.status(200).json({ message: "Password Matched" });
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => console.log(`Successfully running on Port: ${port}`));
