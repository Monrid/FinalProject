const Lotto = require("../models/lottoschema");

exports.createlotto = async (req, res) => {
    const body = req.body
    console.log(body);
    if(!body.number || !body.amount || !body.price) return res.status(400).json({result:"Bad request", massage:""}); 
    const numberexist = await Lotto.findOne({number: body.number});
    if (numberexist) return res.status(400).json({result:"Bad request", massage:"Alredy Have This Number"}); 
    const data = await Lotto.create(body)
        console.log(data);
        res.status(200).json({result:"OK",message:"SUCCES"})
};