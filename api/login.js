const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const client = new MongoClient(process.env.MONGODB_URI);

module.exports = async (req, res) => {

  if(req.method !== "POST"){
    return res.status(405).json({
      message:"Method not allowed"
    });
  }

  const { email, password } = req.body;

  await client.connect();

  const db = client.db("rocard");
  const users = db.collection("users");

  const user =
  await users.findOne({ email });

  if(!user){
    return res.json({
      message:"Account not found"
    });
  }

  const valid =
  await bcrypt.compare(password, user.password);

  if(!valid){
    return res.json({
      message:"Wrong password"
    });
  }

  const token = jwt.sign(
    {
      id:user._id
    },
    "SECRET_KEY"
  );

  res.json({
    token,
    message:"Login successful"
  });

};
