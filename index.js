const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config()

const PORT = 8080;

const app = express();

app.use(express.json());

// array of pets
const pets = [
    { id: 1, name: 'Fluffy', type: 'dog' },
    { id: 2, name: 'Spot', type: 'cat' },
    { id: 3, name: 'Slimy', type: 'frog' },
    { id: 4, name: 'Scooby', type: 'dog' },
    { id: 5, name: 'Scales', type: 'snake' },
    { id: 6, name: 'Bacon', type: 'pig' },
    { id: 7, name: 'Bubbles', type: 'fish' },
    { id: 8, name: 'Crackers', type: 'parrot' },
]

// GET - /api/pets - get all pets
app.get('/api/pets', (req, res) => {
    res.send(pets);
});

// GET - /api/pets/:id - get pet by id
app.get('/api/pets/:id', (req, res) => {
    const petId = parseInt(req.params.id);
    const pet = pets.find(pet => pet.id === petId);
    if (pet) {
        res.send(pet);
    } else {
        res.status(404).send('Pet not found');
    }
});

// GET - /api/pets/name/:name - get pet by name
app.get('/api/pets/name/:name', (req, res) => {
    const petName = req.params.name;
    const pet = pets.find(pet => pet.name === petName);
    if (pet) {
        res.send(pet);
    } else {
        res.status(404).send('Pet not found');
    }
});

// POST - /api/pets - create pet
app.post('/api/pets', (req, res) => {
    const pet = req.body;
    pet.id = pets.length + 1;
    pets.push(pet);
    res.send(pet);
});

// PUT - /api/pets/:id - update pet by id
app.put('/api/pets/:id', (req, res) => {
    const petId = parseInt(req.params.id);
    const pet = pets.find(pet => pet.id === petId);
    if (pet) {
        // pet.id = req.body.id;
        pet.name = req.body.name;
        pet.type = req.body.type;
        // send a success message
        res.json({ message: 'Pet updated', pet });
    } else {
        res.status(404).send('Pet not found');
    }
});

// DELETE - /api/pets/:id - delete pet by id
app.delete('/api/pets/:id', (req, res) => {
    const petId = parseInt(req.params.id);
    const pet = pets.find(pet => pet.id === petId);
    if (pet) {
        pets.splice(pets.indexOf(pet), 1);
        res.json({ message: 'Pet deleted', pet });
    } else {
        res.status(404).send('Pet not found');
    }
});

// DELETE - /api/pets - delete all pets
app.delete('/api/pets', (req, res) => {
    pets.length = 0;
    res.json({ message: 'Pets deleted' });
});

// DELETE - /api/pets/name/:name - delete pet by name
app.delete('/api/pets/name/:name', (req, res) => {
    const petName = req.params.name;
    const pet = pets.find(pet => pet.name === petName);
    if (pet) {
        pets.splice(pets.indexOf(pet), 1);
        res.json({ message: 'Pet deleted', pet });
    } else {
        res.status(404).send('Pet not found');
    }
});

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
    }
})

app.post('/api/send-mail', (req, res, next) => {
    let { recipient, subject, content } = req.body;

    let mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: recipient,
        subject: "NEW MESSAGE - " + subject,
        text: content
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:' + info.response);
            res.send('Email sent');
        }
    });
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));