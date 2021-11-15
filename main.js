const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use("/api",require("./middlewares/api"));

const port = 8080
app.listen(port,() => {
    console.log(`server is running on port ${port}`)
});
