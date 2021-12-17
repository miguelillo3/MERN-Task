// Get express
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

//Creating the server
const app = express();

//Connect to Data Base
connectDB()

//Enable cors  
app.use(cors());

//Enable express.json
app.use( express.json( { extended: true } ) );

// app PORT
const port = process.env.port || 4000;

//Importing routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

//Specify the main page
app.get('/',(req, res) => {
    res.send('Hello World')
});

//Start app
app.listen(port, '0.0.0.0', () =>{
    console.log(`The server is running at port: ${port}`);
});
  