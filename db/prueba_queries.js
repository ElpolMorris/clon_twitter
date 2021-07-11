const fs = require("fs");

const createUser = (dataIn) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const [name, username, email, password] = dataIn;
			let { dataFalse } = JSON.parse(
				fs.readFileSync("C:\\Users\\nuevo\\Documents\\prueba_tecnica\\esponsor\\clon_twitter\\server\\dataFalse.json", "utf8")
			);
			const verify = dataFalse.find(
				(d) => d.name == name && d.username == username
			);
			if (!verify) {
                const nuevoUsuario = {
					name: name,
					username: username,
					email: email,
					password: password,
				}
				dataFalse.push(nuevoUsuario);
				const data = {
					dataFalse: dataFalse,
				};
				fs.writeFileSync(
					"C:\\Users\\nuevo\\Documents\\prueba_tecnica\\esponsor\\clon_twitter\\server\\dataFalse.json",
					JSON.stringify(data),
					"utf8"
				);
				if (dataFalse.length == 0) {
					console.log("pasé por aqui");
					resolve(nuevoUsuario);
				}
				resolve(nuevoUsuario);
			} else {
				resolve("")
			}
		});
	}, 1000);
};

const getUser = (user)=>{
	return new Promise((resolve,reject)=>{
		setTimeout(() => {
			let { dataFalse } = JSON.parse(
				fs.readFileSync("C:\\Users\\nuevo\\Documents\\prueba_tecnica\\esponsor\\clon_twitter\\server\\dataFalse.json", "utf8")
			);
			const verify = dataFalse.find(
				(d) => d.username == user || d.email == user
			);
			console.log(verify)
			if(verify){
				let {username,password} = verify
				resolve({username: username,password:password})
			}else {
				reject({})
			}
		}, 2000);
	})
}
const getMessage = (data)=>{
	const messages = JSON.parse(
		fs.readFileSync("C:\\Users\\nuevo\\Documents\\prueba_tecnica\\esponsor\\clon_twitter\\server\\tweets.json", "utf8")
	);
	const user = messages.filter( d => d.user == data)
	console.log(user)
	console.log(data)
	return user
}

const createTweet = (data)=>{
	const [user,tweet] = data
	const dbTweet = JSON.parse(
		fs.readFileSync("C:\\Users\\nuevo\\Documents\\prueba_tecnica\\esponsor\\clon_twitter\\server\\tweets.json", "utf8")
	);
	//const longDbTweet = dbTweet.length
	const newTweet = {
		user: user,
		tweet: tweet
	}
	dbTweet.push(newTweet)
	fs.writeFileSync(
		__dirname + "\\tweets.json",
		JSON.stringify(dbTweet),
		"utf8"
	);

	return "exito"
}

module.exports = {
    createUser,
    createTweet,
    getMessage,
    getUser
}