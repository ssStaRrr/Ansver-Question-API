const bcrypt = require("bcrypt");
const validateUserInput = (email,password) => {
    return email &&  password;   //eğer email,password undefined ise return False dönecek.
}
const comparePassword = (password,hashedPassword) => {
    return bcrypt.compareSync(password,hashedPassword);   
}
module.exports = {
    validateUserInput,
    comparePassword
}; 