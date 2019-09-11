const User = require('../models/User');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const bcrypt = require('bcrypt');

module.exports.login = async (req, res) => {
    const candidate = await User.findOne({
        email: req.body.email
    });

    if (candidate) {
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);

        if (passwordResult) {
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60});

            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            res.status(401).json({
                message: 'Invalid password'
            })
        }
    } else {
        res.status(404).json({
            message: 'No such user'
        })
    }
};

module.exports.register = async (req, res) => {
    const candidate = await User.findOne({
        email: req.body.email
    });

    if (candidate) { 
        res.status(409).json({
            message: 'The user already exists'
        })
    } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const user = new User({
            email: req.body.email,
            password: hash
        });

        try {
            await user.save();
            res.status(201).send('User created');
        } catch (err) {
            errorHandler(res, err);
        }
    }
};