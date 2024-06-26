const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
require('dotenv').config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public')); // Assuming your static files are in a 'public' directory
app.use(express.json());


mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(console.log("Mongodb connected"));

const appointmentSchema = new mongoose.Schema({
  dateone: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  datetwo: {
    type: String,
    required: true,
  },
  time: {
    type: String, 
    required: true,
  },
  timetwo: {
    type: String,
    required: true,
  },
  deposit: {
    type: Number,
    required: true,
  },
  rent: {
    type: Number,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

app.get('/', function(req, res) {
  res.send("Server is Running")
  //res.sendFile(__dirname + './public/index.html');
});

app.post('/api/add', async (req, res) => {

  const { dateone, name, datetwo, number, time, timetwo, deposit, rent } = req.body;

  const newAppointment = new Appointment({
    dateone,
    name,
    datetwo,
    number,
    time,
    timetwo,
    deposit,
    rent
  });


  try {
    await newAppointment.save();
    //const savedAppointment = 
    //console.log('Kaydedildi:', savedAppointment);
    res.status(200).json({ message: 'Appointment added successfully' });
  } catch (error) {
    console.error('kaydedilemedi:', error);
    res.status(500).json({ error: error });
  }
});

app.get('/api/app', async (req, res) => {
  try {
    const appointments = {
      "appointments": [
        {
          "id": 1,
          "name": "John Doe",
          "date": "2024-03-20",
          "time": "10:00 AM"
        },
        {
          "id": 2,
          "name": "Jane Smith",
          "date": "2024-03-21",
          "time": "11:00 AM"
        },
        {
          "id": 3,
          "name": "Alice Johnson",
          "date": "2024-03-22",
          "time": "02:00 PM"
        }
      ]
    };
    res.json(appointments);
  } catch (error) {
    console.error('Veriler getirilemedi:', error);
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});


app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    console.error('Veriler getirilemedi:', error);
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Appointment.findByIdAndDelete(id);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Veri silinemedi:', error);
    res.status(500).json({ error: 'Error deleting appointment' });
  }
});

//* Edit an Object
app.put('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const appointmentDetails  = req.body;
  
  try {    
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, appointmentDetails, { new: true });
    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment updated successfully', updatedAppointment });
  } catch (error) {
    console.error('Veri güncellenemedi:', error);
    res.status(500).json({ error: 'Error updating appointment' });
  }
});

//* Get one Object
app.get('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findById(id);
    res.json(appointment);
  } catch (error) {
    console.error('Veriler getirilemedi:', error);
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
