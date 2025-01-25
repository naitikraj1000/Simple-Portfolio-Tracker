import { Router } from "express";
import getStocks from "../component/stock.js";
import isauth from "../component/auth.js";
import { verifyToken } from "../component/auth.js";
import { signin, logout } from "../component/auth.js";
import {getuserstocks, signup, addstock, updatestock, deletestock,getuserprotfoliostocks } from "../component/portfolio.js";
const router = Router();



router.get("/getuserstock",getuserstocks);
router.get("/getuserprotfoliostocks",getuserprotfoliostocks);
router.post("/signup", signup);
router.post("/addstock", addstock);
router.put("/updatestock", updatestock);
router.delete("/deletestock", deletestock);

router.get("/getStocks", getStocks);
router.get("/verifyToken", verifyToken);
router.post("/signin", signin)
router.get("/logout", logout);


export default router;