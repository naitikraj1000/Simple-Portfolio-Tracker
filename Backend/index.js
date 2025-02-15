import express from 'express';
import router from './router/router.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './db/db.js'


const app = express();
dotenv.config();
console.log("FRONTEND URL ",process.env.FRONTEND_URL);
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

const dbConnection = async () => {
  try {
    await db.query('SELECT 1');
    console.log('DB connected successfully');
  } catch (error) {
    console.log('DB connection failed',error);
  }
}
dbConnection();

const port = 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});