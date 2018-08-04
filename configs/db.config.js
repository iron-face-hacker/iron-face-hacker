const mongoose = require('mongoose');
const DB_NAME = 'facebook';
const URI = process.env.MONGO_URI;

mongoose.connect(URI,  { useMongoClient: true })
.then(()=>{
    console.log(`connected to database: ${URI}`);   
})
.catch(error =>{
    console.log(error);
});