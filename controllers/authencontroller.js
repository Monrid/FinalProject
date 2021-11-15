const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

exports.register = async (req, res) => {
    const body = req.body
    console.log(body);
    if(!body.user_name || !body.user_name.firstname || !body.user_name.lastname || !body.user_username || !body.user_password || !body.user_email || !body.user_mobile) return res.status(400).json({result:"Bad request", massage:""}); 
    const usernameexist = await User.findOne({user_username: body.user_username});
    if (usernameexist) return res.status(400).json({result:"Bad request", massage:"Alredy Have Username"}); 
    const emailexist = await User.findOne({user_email: body.user_email});
    if (emailexist) return res.status(400).json({result:"Bad request", massage:"Alredy Have Email"}); 
    try{
        body.user_password = await bcrypt.hash(body.user_password,5);
        const data = await User.create(body)
        console.log(data);
        res.status(200).json({result:"OK",message:"SUCCES"}) 
    } catch(e){
        res.status(500).json({result:"Internal Sever Error", massage:""}); 
    }
};

exports.login = async (req, res) => {
    const { user_username, user_password } = req.body;

    try{
        const doc = await User.findOne({ user_username });
        if (!doc) return res.status(400).json("username is not found");

        const validpass = await bcrypt.compare(req.body.user_password, doc.user_password);
        if(!validpass) return res.status(400).json("Invalid password");
        console.log(doc);
        const payload = {
            id: doc._id
        };

        const userSchema = {
            name: doc.user_name,
            username: doc.user_username,
            email: doc.user_email
        }
        const token = jwt.sign(payload, '24h');

        res.status(200).header('Authorization', `Bearer ${token}`).json({ result: 'OK', message: 'success login in', data: userSchema });

    }catch(e){
        res.status(500).json({result:"Internet Sever Error", massage:""}); 
    }
};

