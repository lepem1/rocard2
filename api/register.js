const { MongoClient } = require("mongodb");
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

    // CONNECT DATABASE
    const client =
    new MongoClient(process.env.MONGODB_URI);

    await client.connect();

    const db =
    client.db("restorex");

    const users =
    db.collection("users");

    // GET BODY
    const {
      username,
      email,
      password
    } = req.body;

    // VALIDATE
    if(!username || !email || !password){

      return res.json({
        success:false,
        message:"All fields are required"
      });

    }

    // CLEAN EMAIL
    const cleanEmail =
    email.toLowerCase().trim();

    // CHECK IF EXISTS
    const exists =
    await users.findOne({
      email:cleanEmail
    });

    if(exists){

      return res.json({
        success:false,
        message:"Email already exists"
      });

    }

    // INSERT USER
    const result =
    await users.insertOne({

      username:username.trim(),

      email:cleanEmail,

      password:password,

      balance:0,

      createdAt:new Date()

    });

    // CREATE TOKEN
    const token = jwt.sign(

      {
        id:result.insertedId.toString(),
        email:cleanEmail
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
