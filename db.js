const mongoose = require('mongoose')
require("dotenv").config();

const url = process.env.MONGO_URI;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length === 4) {

  const name = process.argv[2];
  const number = process.argv[3];
  const contact = new Contact({ name, number });
  
  contact.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 2) {
  Contact.find({}).then(contacts => {
    console.log("Contacts:");
    contacts.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`);
    });
    mongoose.connection.close();
  });
}