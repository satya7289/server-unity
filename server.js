const express = require('express');
const app = express()

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/webshot',(req, res, next)=>{
    res.send("hiiii");
});


app.listen(process.env.PORT || 8080, ()=>console.log('Server is running...'));

module.exports = app;
