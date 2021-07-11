const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const { register, home, login } = require("../router/router");
const PORT = process.env.PORT || 3000;

//simulacion bbdd
const {
	createUser,
	createTweet,
	getMessage,
	getUser,
} = require("../db/prueba_queries");



app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(PORT, () => console.log(`servidor en http://localhost:${PORT}`));

// app.get("/",(req,res)=>{
//     res.send("homes")
// })

app.get("/login", (req, res) => {
	res.send("login");
});

app.get("/register", (req, res) => {
	res.send("Registro");
});
app.get("/", (req, res) => {
	res.redirect("/register");
});
//funciones de prueba

//
register(app, createUser);
login(app, getUser);
home(app, getUser, getMessage, createTweet);
