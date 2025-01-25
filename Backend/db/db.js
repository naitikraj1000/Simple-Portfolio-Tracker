import 'dotenv/config';
import pg from 'pg';


const { Pool } = pg;
const pool = new Pool ({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

const query = (text, params) => pool.query(text, params);


export default {query};
