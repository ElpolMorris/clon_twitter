const { compareHash } = require("../utils/bcrypt");
const { verifyToken } = require("../utils/jwt");

const verifyTokenHash = async(req,res,next,getUser)=>{
    const data = req.headers["authorization"];
    if(!data) res.redirect("http://localhost:3000/login"); 
    //res.status(403).send("No posee token valido")
    const token = data.replace("Bearer ", "");
    const { user, password } = verifyToken(token);
    if ((user && password)) {
        let { user:username, password: passHash } = await getUser(user);
        if (passHash) {
            const isValid = await compareHash(password, passHash);
            if (isValid) {
                req.user = username
                next();
            } else {
                res.redirect("http://localhost:3000/login");
            }
        } else {
            res.redirect("http://localhost:3000/login");
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