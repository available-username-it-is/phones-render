const morgan = require("morgan");
const cors = require("cors");

const express = require("express");
const app = express();

morgan.token("body", function (req, res) { return JSON.stringify(req.body) });

app.use(cors());
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));


let contacts = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

app.get('/api/persons', (req, res) => {
    res.json(contacts);
});

app.get('/info', (req, res) => {
    res.send(
        `
            <p>Phonebook has info for ${contacts.length} people</p>
            <p>${new Date()}</p>
        `
    );
});

app.get('/api/persons/:id', (req, res) => {
    const id = +req.params.id;
    const contact = contacts.find(contact => contact.id === id);
    if (!contact) {
        return res.status(404).end();
    }

    res.json(contact);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = +req.params.id;
    contacts = contacts.filter(contact => contact.id !== id);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const id = Math.round(Math.random() * 10000000000);

    if (!req.body.name || !req.body.number) {
        return res.status(400).json({ msg: "Input the required data" });
    }

    if (contacts.find(contact => contact.name === req.body.name)) {
        return res.status(400).json({ msg: "name must be unique" });
    }

    const contact = { id, ...req.body };
    contacts.push(contact);
    res.json(contact);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});