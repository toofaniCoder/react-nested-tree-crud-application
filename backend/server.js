const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/nested_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const subuserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  profile: String,
});
// Create a Mongoose schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  profile: String,
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null,
  },
});

// Create a Mongoose model
const User = mongoose.model('Student', userSchema);

// Create an Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// GET all students
app.get('/students', async (req, res) => {
  try {
    const students = await User.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET a specific user by ID
app.get('/students/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new user
app.post('/students', upload.single('profile'), async (req, res) => {
  try {
    const { name, email, phone, parent } = req.body;
    let user = new User({
      parent,
      name,
      email,
      phone,
      profile: req.file ? req.file.filename : '',
    });
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT/UPDATE an existing user by ID
app.put('/students/:id', upload.single('profile'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;

    if (req.file) {
      // Delete previous profile picture if it exists
      if (user.profile) {
        fs.unlinkSync(`uploads/${user.profile}`);
      }
      user.profile = req.file.filename;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a user by ID
app.delete('/students/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the profile picture if it exists
    if (user.profile) {
      fs.unlinkSync(`uploads/${user.profile}`);
    }

    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
