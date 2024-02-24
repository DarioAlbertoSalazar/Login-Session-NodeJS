require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sequelize = require("./sequelize_conn.js");
const Task = require("./Task.js");
const LoginForm = require("./LoginForm.js");
const port = process.env.PORT || 3001;
const app = express();

sequelize.sync();

app.use(express.static("views"));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(express.json());

// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["athorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views/signup.html"));
});

app.get("/home", authenticateToken, (req, res) => {
  res.json({ user: req.user.username, id: req.user.id });
});

// Sin sequelize
// app.post("/signup", (req, res) => {
//     const { username, password } = req.body
//     bycrypt.hash(password, 10, (err, hash) => {
//         if(err) {
//             return res.sendStatus(500).json({success: false, message:"Error al introducir la contraseña"})
//         }
//         pool.query('INSERT INTO users(username, password) VALUES (?,?)', [username, hash], (error, result)=>{
//             if(error) {
//                 return res.status(500).json({success: false, message: "Error agregando valor a la Base de Datos"})
//             }
//             res.json({success:true, message: "Usuario se creó de manera exitosa"})
//         })
//     })
// });

// Con sequelize
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await LoginForm.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "El usuario ya existe" });
    }
    const hashedPassword = await bycrypt.hash(password, 10);
    const newUser = await LoginForm.create({
      username,
      password: hashedPassword,
    });
    res.json({ success: true, message: "Usuario se creó de manera exitosa" });
  } catch (error) {
    console.error("Error on signup:", error);
    res.status(500).json({ success: false, message: "Error on signup" });
  }
});

// Sin sequelize
// app.post('/login', (req,res)=>{
//     const { username, password } = req.body
//     pool.query("SELECT * FROM users WHERE username = ?", [username], (err, result)=>{
//         if(err) throw err

//         if(result.length > 0) {
//             bycrypt.compare(password, result[0].password, (error, match)=>{
//                 if(error) throw error;
//                 if(match) {
//                     const token = jwt.sign({id: result[0].id, username: result[0].username}, process.env.JWT_SECRET,{ expiresIn: '1h'})
//                     res.json({success:true, token, message:"Login correcto"})
//                 } else {
//                     res.status(401).json({success:false, message:"credenciales incorrectas"})
//                 }
//             })
//         } else {
//             res.status(404).send('credenciales incorrectas')
//         }
//     })
// })

// Con sequelize
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await LoginForm.findOne({ where: { username } });
    if (!user) {
      return res.status(404).send("Credenciales incorrectas");
    }
    const match = await bycrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas" });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ success: true, token, message: "Login correcto" });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res
      .status(500)
      .json({ success: false, message: "Error en el inicio de sesión" });
  }
});

// --- TODO APP API's --- //

app.get("/task", async (req, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
});

app.get("/tasks/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const tasks = await Task.findAll({
      include: [{
        model: LoginForm,
        where: { id: userId }
      }]
    });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ success: false, message: "Error fetching tasks" });
  }
});

app.put("/task/:id", async (req, res) => {
  const affectedRow = await Task.update(req.body, {
    where: { id: req.params.id },
  });
  res.json({ message: `Actualizado: ${affectedRow}` });
});

app.post("/task", async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

app.delete("/task/:id", async (req, res) => {
  const deleteRow = await Task.destroy({
    where: { id: req.params.id },
  });
  res.json({ message: "Deleted: " + deleteRow });
});




app.listen(port, () => {
  console.log("Server is running on port: ", port);
});
