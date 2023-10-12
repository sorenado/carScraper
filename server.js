const express = require("express"); //For routes and such
const { MongoClient, ObjectId } = require("mongodb"); // For connecting to DB
const crypto = require("crypto"); //For Hashing Passwords
const { sendConfirmation, hashStringToBase64 } = require("./helperFunctions"); // Sending Confirmation email returns the confirmation code sent
const app = express();
const port = 8080;
const dbURL =
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1";
app.use(express.static("public"));

const userEmail = "";

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

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/homepage.html");
});

const pendingUser = new Map();
app.use(express.json());

app.post("/join-button-form", async (req, res) => {
  try {
    const { db, client } = await connectToDB();
    const collection = db.collection("users");

    const { name, email, password } = req.body;
    console.log(name, email, password);

    hashedPassword = hashStringToBase64(password);

    const pendingUser = {
      name: name,
      email: email,
      password: hashedPassword,
    };

    const userID = collection.insertOne(pendingUser);

    const confirmationCode = sendConfirmation(email);
    // console.log(confirmationCode);
  } catch (error) {
    console.error(error);
  }
});

app.post("/validate-code", async (req, res) => {
  const confirmation_code = req.body.confirmationCode;

  const userData = pendingUser.get(userEmail);

  if (!userData) {
    res.status(400).send("User Data not found");
  }

  if (userData.confirmationCode !== confirmation_code) {
    res.status(400).send("Confirmation code is incorrect");
  }

  const hashedPassword = crypto
    .createHash("sha256")
    .update(userData.password)
    .digest("hex");

  const dbInsertData = {
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
  };

  const resultID = await searches.insertOne(dbInsertData);

  res.status(200).send("Registartion completed successfully.");
});

app.listen(port, () => console.log(`Succesfully running on Port: ${port}`));
