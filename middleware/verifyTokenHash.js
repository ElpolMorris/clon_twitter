const { compareHash } = require("../utils/bcrypt");
const { verifyToken } = require("../utils/jwt");

const verifyTokenHash = async(token,getUser)=>{
    //const data = req.body;
    if(!token){
        throw new Error("token no válido")
        //res.status(403).send("No posee token valido")
    }
    const { user, password } = verifyToken(token);
    if ((user && password)) {
        let { user:username, password: passHash } = await getUser(user);
        if (passHash) {
            const isValid = await compareHash(password, passHash);
            if (isValid) {
                return username
                //res.status(200).send(username)
            } else {
                throw new Error("token no válido")
                //res.status(403).send("No posee token valido");
            }
        } else {
            throw new Error("token no válido")
            //res.status(403).send("No posee token valido");
        }
    }
}

const isAllDataRight = (req,res,next)=>{
    const { name, username, email, password } = req.body;
		const isAllData = [name, username, email, password].every((d) => {
			let dStringify = `${d}`;
			let wrapObject = dStringify.includes("{" || "}");
			return d && d.length > 0 && !wrapObject;
		});
		if (!isAllData) {
			res
				.status(400)
				.send("los datos enviados no son del tipo correspondiente");
		}
		next();
}

module.exports = {verifyTokenHash,isAllDataRight}