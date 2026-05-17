const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
      email,
      password
    } = req.body;

    const user =
    await users.findOne({ email });

    if(!user){
      return res.json({
        message:"Account not found"
      });
    }

    const valid =
    await bcrypt.compare(
      password,
      user.password
    );

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

    return res.json({
      success:true,
      token,
      message:"Login successful"
    });

  } catch(err){

    return res.status(500).json({
      error:String(err)
    });

  }

};
