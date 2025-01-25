import jwt from 'jsonwebtoken';
import db from '../db/db.js';

async function signin(req, res) {
    const { email, password } = req.body;
    const msg = {
        error: "",
        token: "",
        success: false
    }

    if (!email || !password) {
        msg.error = "Please enter all fields";
        return res.status(400).send(msg);
    }

    const refreshToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '8h' });

    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    let sql = `SELECT * FROM users WHERE email=$1 AND password=$2`;
    let result = (await db.query(sql, [email, password])).rows;
    
    if (result.length === 0) {
        msg.error = "Invalid credentials";
        return res.status(400).send(msg);
    }

    msg.success = true;
    msg.token = refreshToken;
    return res.status(200).send(msg);
}

function isauth(req, res, next) {
    let token = req.cookies?.refreshToken;
    const msg = {
        error: "",
    }
    
    if (!token) {
        msg.error = "No token found";
        return res.send(msg);
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            msg.error = err;
            return res.send(msg);
        }

        req.user_email = decoded.email;
    })

    next();
}

function verifyToken(req, res) {
    const token = req.cookies?.refreshToken;
    console.log("Verify Token:", token);

    const msg = {
        isauth: false,
        email: "",
        error: ""
    };

    if (!token) {
        msg.error = "No token found";
        return res.status(400).send(msg);
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            msg.error = "Invalid or expired token";
            return res.status(400).send(msg);
        }

        // Token is valid
        msg.isauth = true;
        msg.error = "";
        msg.email = decoded.email;
        return res.status(200).send(msg);
    });
}

function logout(req, res) {
    console.log("Logging out");
    res.clearCookie('refreshToken');
    res.send("Logged out");
}

export default isauth;
export { verifyToken, signin, logout };
