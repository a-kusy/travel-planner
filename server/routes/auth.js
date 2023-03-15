const { body, validationResult} = require('express-validator')
const router = require("express").Router()
const { User } = require("../models/user")
const bcrypt = require("bcrypt")
const Joi = require("joi")

router.post("/", [body('email').isEmail().bail().trim().normalizeEmail()], async (req, res) => {
    try {
        const { error } = validate(req.body);
        const er = validationResult(req);
        if (error)
            return res.status(400).send({ message: error.details[0].message })
        if (!er.isEmpty())
            return res.status(400).send({ message: er.mapped() })

        const user = await User.findOne({ email: req.body.email })
        if (!user)
            return res.status(401).send({ message: "Błędny email lub hasło!" })

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (!validPassword)
            return res.status(401).send({ message: "Błędny email lub hasło!" })
        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "Zalogowano!" })

    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera!" })
    }
})

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    })
    return schema.validate(data)
}
module.exports = router