import { Router } from "express";
import getStocks from "../component/stock.js";
import isauth from "../component/auth.js";
import { verifyToken } from "../component/auth.js";
import dotenv from 'dotenv';
import { signin, logout } from "../component/auth.js";
import { getuserstocks, signup, addstock, updatestock, deletestock, getuserprotfoliostocks } from "../component/portfolio.js";
const router = Router();

dotenv.config();
console.log(process.env.FRONTEND_URL);
router.get("/", (req, res) => {
    res.send(`Backend is Running Fine and Frontend URL is ${process.env.FRONTEND_URL}`);
});

router.get("/getuserstock", getuserstocks);
router.get("/getuserprotfoliostocks", getuserprotfoliostocks);
router.post("/signup", signup);
router.post("/addstock", addstock);
router.put("/updatestock", updatestock);
router.delete("/deletestock", deletestock);

router.get("/getStocks", getStocks);
router.get("/verifyToken", verifyToken);
router.post("/signin", signin)
router.get("/logout", logout);


export default router;