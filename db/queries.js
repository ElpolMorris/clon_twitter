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
		console.log(id);
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

const getUser = async (data) => {
	const query = "SELECT * from accounts where email = $1 OR username = $1;";
	const queryPass = "SELECT password from loginusers where id = $1";
	try {
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
		console.log(username, password);
		return {
			user: username,
			password: password,
		};
	} catch (error) {
		console.log(error);
	}
};

const getMessage = async (data) => {
	const queryUser =
		"SELECT id from accounts where email = $1 OR username = $1;";
	const updateLastLogin =
		"UPDATE loginusers SET last_login = now() where id = $1;";
	const getTweets = "SELECT mensaje from tweets where id = $1";
	try {
		await pool.query("BEGIN");
		const {
			rows: [{ id } = row],
		} = await pool.query(queryUser, [data]);
		await pool.query(updateLastLogin, [id]);
		const {
			rows: [mensaje],
		} = await pool.query(getTweets, [id]);
		await pool.query("COMMIT");
		return {
			tweet: mensaje ?? [],
		};
	} catch (error) {
		console.log(error);
		await pool.query("ROLLBACK");
	}
};
const createTweet = async (data) => {
	const [user, tweet] = data;
	const queryCreateTweet =
		"INSERT INTO tweets (id,mensaje,date_created) VALUES ($1,$2,now());";
	const queryUser =
		"SELECT id from accounts where email = $1 OR username = $1;";
	try {
		await pool.query("BEGIN");
		const {
			rows: [{ id } = row],
		} = await pool.query(queryUser, [user]);
		await pool.query(queryCreateTweet, [id, tweet]);
		await pool.query("COMMIT");
		return true;
	} catch (error) {
		console.log(error);
		await pool.query("ROLLBACK");
	}
};

module.exports = { createUser, getMessage, getUser, createUser };
