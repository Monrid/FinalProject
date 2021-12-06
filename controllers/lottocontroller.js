const Lotto = require("../models/lottoschema");
const History = require("../models/historyschema");

exports.createlotto = async (req, res) => {
    const body = req.body
    console.log(body);
    if(!body.number || !body.amount || !body.price) return res.status(400).json({result:"Bad request", message:""}); 
    const numberexist = await Lotto.findOne({number: body.number});
    if (numberexist) {
        numberexist.amount = (Number(numberexist.amount) + Number(body.amount)).toString();
        await Lotto.findByIdAndUpdate(numberexist._id,numberexist) 
        res.status(200).json({result:'Ok', message:'SUCCESS'});
    } else{
        const data = await Lotto.create(body)
        console.log(data);
        res.status(200).json({result:"OK",message:"SUCCESS"})
    };
};

exports.buylotto = async (req, res) => {
    const {number,amount} = req.body;
    const userID = req.userId
    console.log("ดูuserID ที่สั่งซื้อ",userID);
    try {
        const data = await Lotto.findOne({ number:number });
        if (!data) return res.status(200).json({result: 'Not OK', message: 'Number is not found'});
        if(Number(data.amount) <= 0 || Number(data.amount) < Number(amount)) return res.status(200).json({result: 'Not Ok', message: 'This number out of stock'});
        data.amount = (Number(data.amount) - Number(amount)).toString();
        console.log(data.amount);
        await Lotto.findByIdAndUpdate(data._id,data)
        const history = {
            userid: userID,
            number: number,
            amount: amount
        }
        await History.create(history);
        res.status(200).json({result: 'OK', message: 'Buy success'});
    } catch (error) {
        res.status(500).json({result:"Internal Server Error", message:""});
    }
};

exports.getlottoAvailable = async (req, res) => {
    try {
        const data = await Lotto.find()
        // console.log(data);
        var res_data = data.map(key => {
            if (Number(key.amount) > 0) return key 
        }); 
        res_data = res_data.filter(e => {
            return e != undefined
        })
        // console.log(res_data);
        res.status(200).json({ result: 'OK', message: 'Send data success', data: res_data });
    } catch (error) {
        res.status(500).json({result:"Internal Servrer Error", message:""});
    }
};

exports.getAll = async (req, res) => {
    try {
        const data = await Lotto.find()
        console.log(data);
        res.status(200).json({ result: 'OK', message: 'Send data success', data: data });
    } catch (error) {
        res.status(500).json({result:"Internal Servrer Error", message:""});
    }
};