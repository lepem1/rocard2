const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

module.exports = async (req, res) => {

  try {

    if(req.method === "GET"){
      return res.status(200).json({
        status:"API Online"
      });
    }

    if(!process.env.MONGODB_URI){
      return res.status(500).json({
        message:"MONGODB_URI missing"
      });
    }

    const client =
    new MongoClient(process.env.MONGODB_URI);

    await client.connect();

    const db =
    client.db("restorex");

    const users =
    db.collection("users");

    const {
      username,
      email,
      password
    } = req.body;

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

    return res.json({
      success:true,
      message:"Account created successfully"
    });

  } catch(err){

    return res.status(500).json({
      error:String(err)
    });

  }

};
