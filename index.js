const express = require("express");
const mysql = require('mysql2');
const cors = require('cors')

const app= express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'school_management',
})

db.connect((err)=>{
    if(err){
        console.log('Error connecting to the database', err);
    }
    else{
        console.log("Database Connected");
    }
});

app.get('/', (req, res)=>{
    res.send('Server is running!');
})

app.listen(5000, ()=>{
    console.log(`Server running on Port 5000`);
})