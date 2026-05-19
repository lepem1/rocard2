const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {

  try {

    // TEST API
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
      email,
      password
    } = req.body;

    // FIND USER
    const user =
    await users.findOne({ email });

    if(!user){

      return res.json({
        success:false,
        message:"Account not found"
      });

    }

    // CHECK PASSWORD
    if(password !== user.password){

      return res.json({
        success:false,
        message:"Wrong password"
      });

    }

    // CREATE TOKEN
    const token = jwt.sign(
      {
        id:user._id,
        email:user.email
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
      message:"Login successful"
    });

  } catch(err){

    return res.status(500).json({
      success:false,
      error:String(err)
    });

  }

};
