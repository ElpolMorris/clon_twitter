const bcrypt = require('bcrypt');
//encriptar pass
const hashPass = async(password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}
//comparar contraseñas
const compareHash = async(password,hashKey) => {
    const isValid = await bcrypt.compare(password,hashKey)
    return isValid
}

module.exports = {
    hashPass,
    compareHash
}



