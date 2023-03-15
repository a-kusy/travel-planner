const mongoose = require("mongoose")
const Joi = require("joi")

const tripSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
})

tripSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})

const Trip = mongoose.model("Trip", tripSchema)

const validate = (data) => {

    const schema = Joi.object({
        name: Joi.string().required.label("name"),
        date: Joi.string().required.label("date"),
        description: Joi.string().required.label("description"),
        userId: Joi.string().required.label("userId"),
    })
    return schema.validate(data)
}
module.exports = { Trip, validate }