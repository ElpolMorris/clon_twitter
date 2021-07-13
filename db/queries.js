const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const config = {
	user: "postgres",
	database: "clontwitter",
	password: process.env.PASS_DB,
	port: 5432,
	host: "localhost",
};

const pool = new Pool(config);

//funcion para crear usuario

const createUser = async (data) => {
	const [name, username, email, password] = data;
	const queryInsertUser =
		"INSERT INTO accounts (email,username) values($1,$2) returning id";
	const queryInsertName = "INSERT INTO datausers (id,fullname) values($1,$2)";
	const queryInsertPassword =
		"INSERT INTO loginusers (id,password) values ($1,$2)";
	try {
		const begin = await pool.query("BEGIN");
		const {
			rows: [{ id } = row],
		} = await pool.query(queryInsertUser, [email, username]);
		const insertName = await pool.query(queryInsertName, [id, name]);
		const insertPassword = await pool.query(queryInsertPassword, [
			id,
			password,
		]);
		const end = await pool.query("COMMIT");
		return true;
	} catch (error) {
		console.log(error);
		await pool.query("ROLLBACK");
	}
};

const getUser = async (data,isLogged) => {
	const query = "SELECT * from accounts where email = $1 OR username = $1;";
	const queryPass = "SELECT password from loginusers where id = $1";
	const updateLastLogin =
		"UPDATE loginusers SET last_login = now() where id = $1;";
	try {
		await pool.query("BEGIN")
		//destructuring to get id + username
		const {
			rows: [{ id, username } = row],
		} = await pool.query(query, [data]);
		//destructuring to get password
		const {
			rows: [{ password } = row],
		} = await pool.query(queryPass, [id]);
		if (!id || !username || !password) {
			throw new Error("no existe ese registro");
		}
		if(!isLogged){
			await pool.query(updateLastLogin, [id]);
		}
		await pool.query("COMMIT")
		return {
			user: username,
			password: password,
		};
	} catch (error) {
		console.log(error);
		await pool.query("ROLLBACK")
	}
};

const getMessage = async () => {
	const getTweets = "SELECT a.username,z.mensaje,z.date_created FROM accounts AS a INNER JOIN (SELECT id_user,id_tweet,y.id,y.mensaje,y.date_created FROM accounts_tweets INNER JOIN tweets AS y ON id_tweet = y.id) AS z ON a.id = z.id_user ORDER BY date_created desc;";
	try {
		const { rows } = await pool.query(getTweets);
		return {
			tweet: rows ?? [],
		};
	} catch (error) {
		console.log(error);
	}
};
const createTweet = async (data) => {
	const [user, tweet] = data;
	const queryCreateTweet =
		"INSERT INTO tweets (mensaje,date_created) VALUES ($1,now()) returning id;";
	const queryAccountsTweets =
		"INSERT INTO accounts_tweets (id_user,id_tweet) VALUES ($1,$2)";
	const queryUser =
		"SELECT id from accounts where email = $1 OR username = $1;";
	try {
		await pool.query("BEGIN");
		const {
			rows: [{ id: iduser } = row],
		} = await pool.query(queryUser, [user]);
		const {
			rows: [{ id: idtweet } = row],
		} = await pool.query(queryCreateTweet, [tweet]);
		await pool.query(queryAccountsTweets, [iduser, idtweet]);
		await pool.query("COMMIT");
		return true;
	} catch (error) {
		console.log(error);
		await pool.query("ROLLBACK");
	}
};
module.exports = { createUser, getMessage, getUser, createTweet };
