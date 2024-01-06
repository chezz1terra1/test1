const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;


mongoose.connect('your-mongodb-uri', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));


const User = mongoose.model('User', {
  username: String,
  password: String,
});

app.use(bodyParser.json());


app.use(express.static('public'));


app.post('/register', async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;


    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }


    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({ username, password: hashedPassword });


    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
