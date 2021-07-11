const {Pool} = require("pg")
const dotenv = require("dotenv");
const { palegoldenrod } = require("color-name");
dotenv.config();

const config = {
    user: "postgres",
    database: "clontwitter",
    password: process.env.PASS_DB,
    port: 5432,
    host:"localhost"
}

const pool = new Pool(config)

//funcion para crear usuario

const createUser = async(data)=>{
    const [name,username,email,password] = data
    const queryInsertUser = "INSERT INTO accounts (email,username) values($1,$2) returning id"
    const queryInsertName = "INSERT INTO datausers (id,fullname) values($1,$2)"
    const queryInsertPassword = "INSERT INTO loginusers (id,password) values ($1,$2)"
    try {
        const begin = await pool.query("BEGIN")
        const {rows:[{id}=row]} = await pool.query(queryInsertUser,[email,username])
        console.log(id)
        const insertName = await pool.query(queryInsertName,[id,name])
        const insertPassword = await pool.query(queryInsertPassword,[id,password])
        const end = await pool.query("COMMIT")
        return true        
    } catch (error) {
        console.log(error)
        await pool.query("ROLLBACK")   
    }
}

module.exports = {createUser}