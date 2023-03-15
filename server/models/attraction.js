const mongoose = require("mongoose")

const attractionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tripId: { type: String, required: true }
})

attractionSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})

const Attraction = mongoose.model("Attraction", attractionSchema)

module.exports = { Attraction }