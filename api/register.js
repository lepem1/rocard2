const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI missing");
}

const client =
new MongoClient(process.env.MONGODB_URI);

module.exports = async (req, res) => {

  if(req.method !== "POST"){
    return res.status(405).json({
      message:"Method not allowed"
    });
  }

  const { username, email, password } = req.body;

  await client.connect();

  const db = client.db("restorex");

  const users =
  db.collection("users");

  const exists =
  await users.findOne({ email });

  if(exists){
    return res.json({
      message:"Email already exists"
    });
  }

  const hashed =
  await bcrypt.hash(password,10);

  await users.insertOne({
    username,
    email,
    password:hashed,
    createdAt:new Date()
  });

  res.json({
    success:true,
    message:"Account created successfully"
  });

};
