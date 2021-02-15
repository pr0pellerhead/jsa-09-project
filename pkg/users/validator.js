const { Validator } = require('node-input-validator');

const userSchema = {
    first_name: 'required|minLength:3',
    last_name: 'required|minLength:2',
    birthday: 'required',
    email: 'required|email',
};

const createAccountSchema = {
    email: 'required|email',
    password: 'required',
    password2: 'required'
};

const loginSchema = {
    email: 'required|email',
    password: 'required'
};

const user = async (data, schema) => {
    let v = new Validator(data, schema);
    let res = await v.check();
    if(!res) {
        throw v.errors;
    }
    return res;
};

module.exports = {
    userSchema,
    createAccountSchema,
    loginSchema,
    user,
};