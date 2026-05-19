const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {

  try {

    // TEST
    if(req.method === "GET"){
      return res.status(200).json({
        status:"API Online"
      });
    }

    // ONLY POST
    if(req.method !== "POST"){
      return res.status(405).json({
        success:false,
        message:"Method not allowed"
      });
    }

    // CHECK ENV
    if(!process.env.MONGODB_URI){
      return res.status(500).json({
        success:false,
        message:"MongoDB URI missing"
      });
    }

    // CONNECT
    const client =
    new MongoClient(process.env.MONGODB_URI);

    await client.connect();

    const db =
    client.db("restorex");

    const users =
    db.collection("users");

    // BODY
    const {
      username,
      email,
      password
    } = req.body;

    // EXISTS
    const exists =
    await users.findOne({ email });

    if(exists){

      return res.json({
        success:false,
        message:"Email already exists"
      });

    }

    // INSERT USER
const result =
await users.insertOne({
  username,
  email,
  password:password,
  createdAt:new Date()
});

    // TOKEN
    const token = jwt.sign(
      {
        id:result.insertedId,
        email:email
      },
      "SECRET_KEY",
      {
        expiresIn:"7d"
      }
    );

    // SUCCESS
    return res.json({
      success:true,
      token:token,
      message:"Account created successfully"
    });

  } catch(err){

    return res.status(500).json({
      success:false,
      error:String(err)
    });

  }

};
