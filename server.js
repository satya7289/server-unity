const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const port = process.env.PORT || 8080;
const validUrl = require('valid-url');

var parseUrl = function(url) {
    url = decodeURIComponent(url)
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = 'http://' + url;
    }

    return url;
};

app.get('/', function(req,res){
    res.send("Hello Mr. Satya Prakash Sharma.");
})

app.get('/webshot', function(req, res) {
    var urlToScreenshot = req.query.url;
    if (urlToScreenshot == undefined) urlToScreenshot = 'https://google.com';
    urlToScreenshot = parseUrl(urlToScreenshot);
    if (validUrl.isWebUri(urlToScreenshot)) {
        console.log('Screenshotting: ' + urlToScreenshot);
        (async() => {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.goto(urlToScreenshot);
            await page.screenshot().then(function(buffer) {
                res.setHeader('Content-Disposition', 'attachment;filename="' + urlToScreenshot + '.png"');
                res.setHeader('Content-Type', 'image/png');
                res.send(buffer)
            });

            await browser.close();
        })();
    } else {
        res.send('Invalid url: ' + urlToScreenshot);
    }

});

app.listen(port, function() {
    console.log('App listening on port ' + port)
})


/*
const express = require('express');
// var webshot = require('webshot');
const captureWebsite = require('capture-website');
const app = express()

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/webshot',(req, res, next)=>{
    (async () => {
        // await captureWebsite.file('https://google.com','scrrenshot.png');
        var webshot = await captureWebsite.buffer('https://google.com');
        res.send(webshot);
        console.log(webshot);
    })();
    // res.send('hiii');
    // var requestUrl = req.query.url;
    // if (requestUrl == undefined) requestUrl = 'google.com';
    // webshot(requestUrl, function (err, renderStream) {
    //     renderStream.pipe(res);
    // });
});


app.listen(process.env.PORT || 8080, ()=>console.log('Server is running...'));

module.exports = app;
*/