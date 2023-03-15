const router = require("express").Router()
const { body, validationResult } = require('express-validator')
const { User, validate } = require("../models/user")
const bcrypt = require("bcrypt")
const tokenVerification = require('../middleware/tokenVerification')

router.post("/", [body('email').isEmail().trim().normalizeEmail(),
body('password').isLength({ min: 8 }),
body('firstName').not().isEmpty().trim().escape(),
body('lastName').not().isEmpty().trim().escape()], async (req, res) => {
    try {
        const { error } = validate(req.body)
        const er = validationResult(req);
        if (error)
            return res.status(400).send({ message: error.details[0].message })

        if (!er.isEmpty())
            return res.status(400).send({ message: er.array().msg })
        
        const user = await User.findOne({ email: req.body.email })
        if (user)
            return res.status(400).send({ message: "Użytkownik o takim emailu istnieje!" })

        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        await new User({ ...req.body, password: hashPassword }).save()
        res.status(201).send({ message: "Pomyślnie utworzono użytkownika" })
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera" })
    }
})

router.get("/delete", tokenVerification, function (req, res) {
    console.log('User Id', req.user._id);
    console.log("Użytkownik będzie usunięty: ");
    User.findByIdAndRemove(req.user._id, function (err) {
        if (err) res.send(err);
        res.json({ message: 'Pomyślnie usunięto użytkownika!' });
    })
})
module.exports = router
