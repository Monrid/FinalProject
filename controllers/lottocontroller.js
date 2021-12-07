const Lotto = require("../models/lottoschema");
const History = require("../models/historyschema");
const axios = require("axios");
const { response } = require("express");
const apiUrl = "https://lotto.api.rayriffy.com"

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

exports.gethistory = async (req, res) => {
    const userID = req.userId
    console.log(userID);
    try {
        const data = await History.find({userid:userID})
        if (!data) return res.status(200).json({result: 'Not OK', message: 'Not have purchase history'});
        res.status(200).json({result: 'Ok', message: "" , data: data});
    } catch (error) {
        res.status(500).json({result:"Internal Servrer Error", message:""});
    }
}

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

exports.check = async (req, res ) => {
    const id = req.body.id
    const userlotto =req.body.userlotto
    var result = false
    var smallresult = false
    var prizename = ""
    var reward = ""
    axios.get(`${apiUrl}/lotto/${id}`) 
    .then((response) => {
        if (response.data.status == "success") {
            const prizes = response.data.response.prizes
            const running = response.data.response.runningNumbers
            if (result == false){
                for (let i = 0 ; i < prizes.length ; i ++ ) {
                    for (let j = 0 ; j < prizes[i].number.length ; j++) {
                        if (userlotto.toString() == prizes[i].number[j]) {
                            prizename = prizes[i].name
                            reward = prizes[i].reward
                            console.log(prizename, reward);
                            result = true
                            break
                        };
                    };
                };
            };
            if (smallresult == false) {
                // console.log('test1');
                for (let i = 0 ; i < running.length ; i ++ ) {
                    // console.log("test2");
                    for (let j = 0 ; j < running[i].number.length ; j++) {
                        // console.log("Test3",running[i].number[j], userlotto);
                        if (userlotto.toString().substr(0, 3) == running[i].number[j]) { //เช็ค3ตัวหน้า
                            prizename = running[i].name
                            reward = running[i].reward
                            console.log(prizename, reward);
                            smallresult = true
                            break
                        }
                        else if (userlotto.toString().substr(3, 6) == running[i].number[j]) { //เช็ค3ตัวหลัง
                            prizename = running[i].name
                            reward = running[i].reward
                            console.log(prizename, reward);
                            smallresult = true
                            break
                        }
                        else if (userlotto.toString().substr(4, 6) == running[i].number[j]) { //เช็ค2ตัวหลัง
                            prizename = running[i].name
                            reward = running[i].reward
                            console.log(prizename, reward);
                            smallresult = true
                            break
                        };
                    };
                };
            }
            // console.log(response.data.response.prizes);
            // console.log(response.data.response.runningNumbers);
            var message = "ไม่ถูกรางวัล"
            if (result || smallresult) {
                message = "ถูกรางวัล"
            };
            const res_data = {
                message : message,
                prizename : prizename,
                reward : reward
            };
            res.status(200).json({ result: 'OK', message: 'Send data success', data: res_data });
        };
    });
};