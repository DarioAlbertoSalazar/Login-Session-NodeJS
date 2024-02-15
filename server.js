require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const bycrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const port = 3000;
const app = express();

app.use(express.static("views"));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['athorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views/signup.html"));
});

app.get('/home', authenticateToken, (req, res)=>{
    res.json({user: req.user.username})
})

app.post("/signup", (req, res) => {
    const { username, password } = req.body
    bycrypt.hash(password, 10, (err, hash) => {
        if(err) {
            return res.sendStatus(500).json({success: false, message:"Error hashing password"})
        }
        pool.query('INSERT INTO users(username, password) VALUES (?,?)', [username, hash], (error, result)=>{
            if(error) {
                return res.status(500).json({success: false, message: "Error on adding the value on the DB"})
            }
            res.json({success:true, message: "User was created successfully"})
        })
    })
});

app.post('/login', (req,res)=>{
    const { username, password } = req.body
    pool.query("SELECT * FROM users WHERE username = ?", [username], (err, result)=>{
        if(err) throw err

        if(result.length > 0) {
            bycrypt.compare(password, result[0].password, (error, match)=>{
                if(error) throw error;
                if(match) {
                    const token = jwt.sign({id: result[0].id, username: result[0].username}, process.env.JWT_SECRET,{ expiresIn: '10m'})
                    res.json({success:true, token, message:"Login correcto"})
                } else {
                    res.status(401).json({success:false, message:"credenciales incorrectas"})
                }
            })
        } else {
            res.status(404).send('credenciales incorrectas')
        }
    })
})

app.listen(port, () => {
  console.log("Server is running on port: ", port);
});
