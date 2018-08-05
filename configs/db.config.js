const mongoose = require('mongoose');
const DB_NAME = 'facebook';
const URI = 'mongodb://localhost/facebook';

mongoose.connect(URI,  { useMongoClient: true })
.then(()=>{
    console.log(`connected to database: ${URI}`);   
})
.catch(error =>{
    console.log(error);
});