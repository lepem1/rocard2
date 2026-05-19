const { MongoClient,ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

module.exports = async (req,res) => {

  try {

    const token =
    req.headers.authorization;

    if(!token){

      return res.json({
        success:false
      });

    }

    const decoded =
    jwt.verify(token,"SECRET_KEY");

    const client =
    new MongoClient(process.env.MONGODB_URI);

    await client.connect();

    const db =
    client.db("restorex");

    const users =
    db.collection("users");

    const user =
    await users.findOne({

      _id:new ObjectId(decoded.id)

    });

    return res.json({
      success:true,
      balance:user.balance || 0,
      username:user.username
    });

  } catch(err){

    return res.status(500).json({
      success:false,
      error:String(err)
    });

  }

};
