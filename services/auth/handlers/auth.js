const userData = require('../../../pkg/users');
const { user, createAccountSchema, loginSchema } = require('../../../pkg/users/validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cfg = require('../../../pkg/config');

const createAccount = async (req, res) => {
    try {
        await user(req.body, createAccountSchema);

        if(req.body.password !== req.body.password2) {
            return res.status(400).send('Bad Request. Passwords Missmatch');    
        }

        let u = await userData.getOneByEmail(req.body.email);
        if(u) {
            return res.status(400).send('Bad Request. User Exists');  
        }

        req.body.password = bcrypt.hashSync(req.body.password);

        let data = await userData.create(req.body);

        // await mailer.send(
        //     req.body.email,
        //     'Welcome',
        //     {
        //         first_name: req.body.first_name,
        //         last_name: req.body.last_name,
        //     },
        //     'welcome'
        // );

        return res.status(201).send('Created');
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
};

const login = async (req, res) => {
    try {
        await user(req.body, loginSchema);

        let u = await userData.getOneByEmail(req.body.email);
        if (!u) {
            return res.status(400).send('Bad Request');
        }

        if(!bcrypt.compareSync(req.body.password, u.password)){
            return res.status(401).send('Unauthorized');
        }

        let payload = {
            uid: u._id,
            email: u.email,
            exp: (new Date().getTime() + (365 * 24 * 60 * 60 * 1000)) / 1000
            // exp: (new Date().getTime() + (60 * 1000)) / 1000
        };

        let token = jwt.sign(payload, cfg.get('security').jwt_key);

        res.status(200).send({jwt: token});

    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
};

const refreshToken = (req, res) => {
    console.log(req.user);
    let payload = {
        uid: req.user.uid,
        email: req.user.email,
        exp: (new Date().getTime() + (365 * 24 * 60 * 60 * 1000)) / 1000
    };

    let token = jwt.sign(payload, cfg.get('security').jwt_key);
    res.status(200).send({ jwt: token });
};

module.exports = {
    createAccount,
    login,
    refreshToken,
};