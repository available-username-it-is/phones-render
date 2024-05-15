const mongoose = require("mongoose");

const url = process.env.MONGO_URI;

mongoose.set('strictQuery', false);

mongoose.connect(url)
    .then(result => console.log("Connected to MongoDB"))
    .catch(error => console.log("Error connecting to MongoDB", error));

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, "Name has to be at least 3 characters long"],
        required: [true, "Name is required"]
    },
    number: {
        type: String,
        minLength: [8, "Number has to be at least 8 characters long"],
        validate: {
            validator: function(v) {
                return /^\d{2,3}-\d+$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    }
});

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Contact", contactSchema);