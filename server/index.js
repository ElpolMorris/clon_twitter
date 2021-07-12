const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const { register, home, login, verify } = require("../router/router");
const PORT = process.env.PORT || 3000;
const exphbs  = require('express-handlebars');
//simulacion bbdd
const {
	createUser,
	createTweet,
	getMessage,
	getUser,
} = require("../db/queries");

const __newDirName = "C:\\Users\\nuevo\\Documents\\prueba_tecnica\\esponsor\\clon_twitter\\"
app.use("/assets",express.static(__newDirName + "/public/assets"))
app.use("/axios",express.static(__newDirName + "/node_modules/axios/dist/"))
app.engine("handlebars", exphbs({
	defaultLayout: __newDirName + "/views/layouts/main.handlebars",
	partialsDir: __newDirName + "/views/components/",
	layoutsDir: __newDirName + "/views/"
}));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(PORT, () => console.log(`servidor en http://localhost:${PORT}`));

// app.get("/",(req,res)=>{
//     res.send("homes")
// })

app.get("/login", (req, res) => {
	res.render("Login",{
		inputs: [
			{
				"nameInput": "userOrEmail",
				"type": "text",
				"label": "Usuario o Correo"
			},
			{
				"nameInput": "password",
				"type": "password",
				"label": "Contraseña"
			},
		]
	})})

app.get("/register", (req, res) => {
	res.render("Register",{
		inputs: [
			{
				"nameInput": "Nombre completo",
				"type": "text",
				"label": "Nombre completo"
			},
			{
				"nameInput": "email",
				"type": "email",
				"label": "Correo"
			},
			{
				"nameInput": "User",
				"type": "text",
				"label": "Nombre de Usuario"
			},
			{
				"nameInput": "password",
				"type": "password",
				"label": "Contraseña"
			},
		]
	});
});
app.get("/", (req, res) => {
	res.redirect("/home");
})
app.get("/prueba",(req,res)=>{
	res.render("Home",{
		inputs: [
			{
				"nameInput": "Tweet",
				"type": "textarea",
				"label": "Escribe lo que piensas"
			}
		]
	})
})
//funciones de prueba
const dataRender = {
	inputs: [
		{	
			"textarea":"true",
			"nameInput": "Tweet",
			"type": "textarea",
			"label": "Escribe lo que piensas"
		}
	]
}
//
register(app, createUser);
login(app, getUser);
home(app, getMessage, createTweet,dataRender,getUser);
verify(app,getUser)

app.get("*",(req,res)=>{
	res.redirect("/")
})
