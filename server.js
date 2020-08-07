const express = require('express');
// var webshot = require('webshot');
const captureWebsite = require('capture-website');
const app = express()

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/webshot',(req, res, next)=>{
    (async () => {
        var webshot = await captureWebsite.buffer('https://google.com');
        // res.send(webshot);
        // console.log(webshot);
        res.send("hi");
    })();
    // var requestUrl = req.query.url;
    // if (requestUrl == undefined) requestUrl = 'google.com';
    // webshot(requestUrl, function (err, renderStream) {
    //     renderStream.pipe(res);
    // });
});


app.listen(process.env.PORT || 8080, ()=>console.log('Server is running...'));

module.exports = app;
