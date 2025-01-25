import db from '../db/db.js'
import jwt from 'jsonwebtoken';
import { MAX, v4 as uuidv4 } from 'uuid';

async function signup(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }

        let sql = 'CREATE TABLE IF NOT EXISTS users (name VARCHAR(255), email VARCHAR(255) PRIMARY KEY, password VARCHAR(255))';
        await db.query(sql);

        sql = `SELECT * FROM users WHERE email = $1`;
        let result = await db.query(sql, [email]);

        if (result.rows.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        sql = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`;
        await db.query(sql, [name, email, password]);
        console.log("User created successfully");

        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getuserprotfoliostocks(req, res) {
    try {
        const token = req.cookies?.refreshToken;

        let user_email = null;


        if (!token) {
            return res.status(400).send({ error: "You are not authorized to view this page" });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(400).send({ error: "You are not authorized to view this page" });
            }
            user_email = decoded.email;
        });



        if (!user_email) {
            return res.status(400).send({ error: "You are not authorized to view this page" });
        }

        let sql = `
            SELECT 
                T2.stockname,
                T1.stocksymbol,
                SUM(T1.stockquantity) AS stockquantity,
                SUM(T1.stockavgprice * T1.stockquantity) / SUM(T1.stockquantity) AS stockavgprice
            FROM users_stock_details AS T1
            INNER JOIN stock_info AS T2 ON T1.stocksymbol = T2.stocksymbol
            WHERE T1.email = $1
            GROUP BY T1.stocksymbol, T2.stockname`;

        let result = (await db.query(sql, [user_email])).rows;

        return res.status(200).send({ data: result });
    } catch (error) {
        return res.status(400).send({ error: error.message || "Bad Request" });
    }
}


async function getuserstocks(req, res) {
    try {
        const { stockname, stocksymbol, user_email } = req.query;

        if (!stockname || !stocksymbol || !user_email) {
            return res.status(400).send({ error: "Please fill all the fields" });
        }

        let sql = `SELECT * FROM users_stock_details WHERE email=$1 AND stocksymbol=$2`;
        let result = (await db.query(sql, [user_email, stocksymbol])).rows;

        return res.status(200).send({ data: result })
    } catch (error) {
        console.log(" Getuserstocks function called error", error.message)
        res.status(400).send({ error: error.message || "Bad Request" });
    }
}

async function addstock(req, res) {
    try {
        const { date, stockquantity, stockavgprice, stockname, stocksymbol, user_email } = req.body;
        const transaction_id = uuidv4();
        if (!date || !stockquantity || !stockavgprice || !stockname || !stocksymbol || !user_email) {
            return res.status(400).send({ error: "Please fill all the fields" });
        }

        let sql = `CREATE TABLE IF NOT EXISTS users_stock_details (
            transaction_id UUID PRIMARY KEY,
            date VARCHAR(255),
            email VARCHAR(255),
            stocksymbol VARCHAR(255),
            stockquantity INT,
            stockavgprice FLOAT,
            FOREIGN KEY (email) REFERENCES users(email)
        );`;
        await db.query(sql);

        sql = `INSERT INTO users_stock_details (transaction_id, date, email, stocksymbol, stockquantity, stockavgprice) 
        VALUES ($1, $2, $3, $4, $5, $6)`;
        await db.query(sql, [transaction_id, date, user_email, stocksymbol, stockquantity, stockavgprice]);

        sql = `CREATE TABLE IF NOT EXISTS stock_info (
            stockname VARCHAR(255),
            stocksymbol VARCHAR(255),
            PRIMARY KEY (stocksymbol)
        );`;
        await db.query(sql);

        sql = `SELECT * FROM stock_info WHERE stocksymbol = $1`;
        const result = (await db.query(sql, [stocksymbol])).rows;

        if (result.length === 0) {
            sql = `INSERT INTO stock_info (stockname, stocksymbol) VALUES ($1, $2)`;
            await db.query(sql, [stockname, stocksymbol]);
        }

        res.status(200).send({ transaction_id: transaction_id });
    } catch (error) {
        console.log(" Addstock function called error", error.message)
        res.status(400).send({ error: error.message || "Bad Request" });
    }
}

async function updatestock(req, res) {
    try {
        const { date, stockquantity, stockavgprice, stockname, stocksymbol, user_email, transaction_id } = req.body;

        if (!transaction_id || !stockquantity || !stockavgprice) {
            return res.status(400).send("Please fill all the fields");
        }

        let sql = `UPDATE users_stock_details 
                   SET stockquantity = $1, stockavgprice = $2, date=$3 
                   WHERE transaction_id = $4 AND email=$5 AND stocksymbol=$6`;
        await db.query(sql, [stockquantity, stockavgprice, date, transaction_id, user_email, stocksymbol]);

        res.status(200).send({ data: "Stock updated successfully" });

    } catch (error) {
        console.log(" Updatestock function called error", error.message)
        res.status(400).send({ error: error.message || "Bad Request" });
    }
}

async function deletestock(req, res) {
    try {
        const { transaction_id, user_email } = req.body
        if (!transaction_id) {
            return res.status(400).send("Please fill all the fields");
        }

        let sql = `DELETE FROM users_stock_details WHERE transaction_id = $1`;
        await db.query(sql, [transaction_id]);
        res.status(200).send({ data: "Stock deleted successfully" });

    } catch (error) {
        res.status(400).send({ error: error.message || "Bad Request" });
    }
}

export { signup, getuserprotfoliostocks, addstock, updatestock, deletestock, getuserstocks };


