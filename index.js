const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const { register, home, login, verify } = require("./router/route");
const PORT = process.env.PORT || 3000;
const exphbs  = require('express-handlebars');
const {inputsLoginDetails,inputsDetailsRegister,dataRender} = require("./utils/dataForm")
//Conexión BBDD
const {
	createUser,
	createTweet,
	getMessage,
	getUser,
} = require("./db/queries");

app.use("/assets",express.static(__dirname + "/public/assets"))
app.use("/axios",express.static(__dirname + "/node_modules/axios/dist/"))
app.engine("handlebars", exphbs({
	defaultLayout: __dirname + "/views/layouts/main.handlebars",
	partialsDir: __dirname + "/views/components/",
	layoutsDir: __dirname + "/views/"
}));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(PORT, () => console.log(`servidor en http://localhost:${PORT}`));

app.get("/login", (req, res) => {
	res.render("Login",inputsLoginDetails)})

app.get("/register", (req, res) => {
	res.render("Register",inputsDetailsRegister);
});
app.get("/", (req, res) => {
	res.redirect("/home");
})


register(app, createUser);
login(app, getUser);
home(app, getMessage, createTweet,dataRender,getUser);
verify(app,getUser)

app.get("*",(req,res)=>{
	res.redirect("/")
})
