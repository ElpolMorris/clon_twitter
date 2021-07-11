const { hashPass, compareHash } = require("../utils/bcrypt");
const { generateToken, verifyToken } = require("../utils/jwt");
const{verifyTokenHash,isAllDataRight} = require("../middleware/verifyTokenHash")
const register = (app, createUser) => {
	app.use("/register", (req, res, next) => {
		// const { name, username, email, password } = req.body;
		// const isAllData = [name, username, email, password].every((d) => {
		// 	let dStringify = `${d}`;
		// 	let wrapObject = dStringify.includes("{" || "}");
		// 	return d && d.length > 0 && !wrapObject;
		// });
		// if (!isAllData) {
		// 	res
		// 		.status(400)
		// 		.send("los datos enviados no son del tipo correspondiente");
		// }
		// next();
        isAllDataRight(req, res, next)
	});
	app.post("/register", async (req, res) => {
		const { name, username, email, password } = req.body;
		//simulacion registro en base de datos
		try {
			const newPass = await hashPass(password);
			const data = await createUser([name, username, email, newPass]);
			if (!data) {
				res.status(400).send("usuario ya registrado");
			} else {
				res.status(200).send("registrado de manera pulenta");
			}
		} catch (e) {
			res.status(500).send(e);
		}
	});
};
const login = (app, getUser) => {
	app.post("/login", async (req, res) => {
		const { user, password } = req.body;
		//simulación búsqueda en base de datos
		try {
			let { username, password: passHash } = await getUser(user);
			if (passHash) {
				const isValid = await compareHash(password, passHash);
				if (isValid) {
					const token = generateToken({ user: username, password: password });
					res.status(200).send(token);
				} else {
					res.status(403).send("credenciales incorrectas");
				}
			} else {
				throw new Error("tamos mal");
			}
		} catch (error) {
			res.status(403).send(`Error: ${error.message}`);
		}
	});
};

const home = (app, getUser,getMessage,crearTweet) => {
	app.use("/home", async (req, res, next) => {
		try {
            verifyTokenHash(req, res, next,getUser)
		} catch (error) {
            res.redirect("http://localhost:3000/login");
        }
	});
	app.get("/home", async(req, res) => {
		const { user } = req;
        //get mensajes del usuario
        console.log(user)
        const tweets = await getMessage(user)
        console.log(tweets)
		res.send(tweets);
	});
    app.post("/home",async(req,res)=>{
        const { user } = req;
        const { tweet } = req.body
        if(tweet.length <= 250 && tweet.length > 0 && tweet){
            const nuevoTweet = await crearTweet([user,tweet])
            if(nuevoTweet){
                res.status(201).send("Tweet creado exitosamente")
            }else{
                res.status(422).send("tweets no cumplen lo indicado")
            }
        }else{
            res.status(422).send("tweets no cumplen lo indicado")
        }
    })
};
module.exports = {
	register,
	home,
	login,
};
