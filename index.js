require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require("./middleware/error-handler");
const express = require("express");

const Contact = require("./models/contact");

const app = express();

morgan.token("body", function (req, res) { return JSON.stringify(req.body) });

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.get('/api/persons', (req, res) => {
    Contact.find({})
        .then(contacts => res.json(contacts));
});

app.get('/info', (req, res) => {
    Contact.countDocuments({})
        .then(count => {
            res.send(
                `
                    <p>Phonebook has info for ${count} people</p>
                    <p>${new Date()}</p>
                `
            );
        })
        .catch(error => console.log(error));

});

app.get('/api/persons/:id', (req, res, next) => {
    Contact.findById(req.params.id)
        .then(contact => {
            if (contact) {
                res.json(contact);
            } else {
                res.status(404).end();
            }
        })
        .catch(error => {
            next(error);
        });
});

app.delete('/api/persons/:id', (req, res) => {
    Contact.findByIdAndDelete(req.params.id)
        .then(result => res.status(204).end())
        .catch(error => console.log(error));
});

app.post('/api/persons', (req, res, next) => {
    if (!req.body.name || !req.body.number) {
        return res.status(400).json({ msg: "Input the required data" });
    }

    const contact = new Contact({
        name: req.body.name,
        number: req.body.number
    });

    contact.save()
        .then(contact => res.json(contact))
        .catch(err => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
    const contact = {
        name: req.body.name,
        number: req.body.number
    };

    Contact.findByIdAndUpdate(req.params.id, contact, { new: true, runValidators: true, context: "query" })
        .then(updContact => res.json(updContact))
        .catch(err => next(err));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});