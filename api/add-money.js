const { MongoClient } = require("mongodb");

module.exports = async (req, res) => {

  try {

    if(req.method !== "POST"){

      return res.status(405).json({
        success:false,
        message:"Method not allowed"
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
      amount
    } = req.body;

    const user =
    await users.findOne({ email });

    if(!user){

      return res.json({
        success:false,
        message:"User not found"
      });

    }

    await users.updateOne(

      { email },

      {
        $inc:{
          balance:Number(amount)
        }
      }

    );

    return res.json({
      success:true,
      message:"Money added successfully"
    });

  } catch(err){

    return res.status(500).json({
      success:false,
      error:String(err)
    });

  }

};
