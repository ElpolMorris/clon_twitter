const jsonwebtoken = require("jsonwebtoken");
// const dotenv = require("dotenv")
// dotenv.config()
// const SECRET = `${process.env.SECRET_KEY}`

const generateToken = ({ user, password }) => {
	const payload = {
		user,
		password,
	};
	return jsonwebtoken.sign(payload, "SECRET");
};
const verifyToken = (token) => {
    const hola = jsonwebtoken.verify(token,"SECRET")
    return hola
}
module.exports = { 
    generateToken,
    verifyToken 
};
