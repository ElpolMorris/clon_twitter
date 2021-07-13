const jsonwebtoken = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()
const SECRET = `${process.env.SECRET_KEY}`

const generateToken = ({ user, password }) => {
	const payload = {
		user:user,
		password:password,
	};
	return jsonwebtoken.sign(payload, SECRET);
};
const verifyToken = (token) => {
    const verificated = jsonwebtoken.verify(token,SECRET)
    return verificated
}
module.exports = { 
    generateToken,
    verifyToken 
};
