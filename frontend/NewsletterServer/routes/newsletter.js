const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

const filePath = path.join(__dirname, 'subscribers.json');

const isFileExists = () => {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '');
        }
    } catch (error) {
        console.error('Błąd inicjalizacji subscribers.json: ', error);
    }
};

const readSubscribers = () => {
    try {
        isFileExists();
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return fileContent ? fileContent.trim().split('\n').map(line => JSON.parse(line)) : [];
    } catch (error) {
        console.error('Wystąpił błąd podczas czytania subscribers.json:', error);
        return [];
    }
};

const appendSubscriber = (subscriber) => {
    try {
        fs.appendFileSync(filePath, `${JSON.stringify(subscriber)}\n`);
    } catch (error) {
        console.error('Błąd dodawania subskrybenta do subscribers.json:', error);
    }
};


router.post('/', async (req, res) => {
    const { email, firstName, lastName } = req.body;

    if (!email || !firstName || !lastName) {
        return res.status(400).json({message: 'Please enter a valid email address, first name and last name.'});
    }

    try {

        const subscribers = readSubscribers();

        const existingSubscriber = subscribers.find((subscriber) => subscriber.email === email);
        if (existingSubscriber) {
            return res.status(409).json({ message: 'Ten adres email jest już subskrybentem.' });
        }


        const uuid = uuidv4();
        console.log(`UUID: ${uuid}`);
        const newSubscriber = {
            id: uuid,
            email,
            firstName,
            lastName,
            subscribedAt: new Date().toISOString(),
            status: 'active',
        };

        appendSubscriber(newSubscriber);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Dziękujemy za zapis do newslettera',
            text: `Cześć, ${firstName} ${lastName}, dziękujemy za zapis do newslettera`,
        });
        res.status(200).json({message: "Newsletter utworzony pomyślnie!"});
    } catch (error) {
        console.error("Error sending email address", error);
        res.status(500).json({message: "An error occurred while sending email"});
    }

});

router.get('/', (req, res) => {
   try {
       const subscribers = readSubscribers();
       res.status(200).json(subscribers);
   } catch (error) {
       console.error('Wystąpił błąd podczas fetchowania listy subskrybentów', error);
       res.status(500).json({message: "Wystąpił błąd podczas fetchowania listy subskrybentów"});
   }
});

router.post('/notify', async (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Brak tytułu artykułu' });
    }

    try {
        const subscribers = readSubscribers().filter((subscriber) => subscriber.status === 'active');

        if (!subscribers.length) {
            return res.status(200).json({ message: 'Brak aktywnych subskrybentów' });
        }

        for (const subscriber of subscribers) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: subscriber.email,
                subject: `Nowy artykuł na stronie`,
                text: `Cześć, ${subscriber.firstName} ${subscriber.lastName},\n\nDodaliśmy nowy artykuł: "${title}".\n\nPozdrawiamy!`,
            });
        }

        res.status(200).json({ message: 'Wiadomość wysłana do wszystkich subskrybentów' });
    } catch (error) {
        console.error('Error notifying subscribers:', error);
        res.status(500).json({ message: 'Wystąpił błąd podczas wysyłania wiadomości' });
    }
});


module.exports = router;