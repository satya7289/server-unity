const puppeteer = require('puppeteer');
const validUrl = require('valid-url');
const express = require('express');
const request = require('request');
const cheerio = require("cheerio");
const path = require('path');
const fs = require('fs');
const os = require('os');

const Parse = require('./Parse');
const { json, static } = require('express');

const app = express();
const port = process.env.PORT || 8080;



app.get('/web', function(req, res) {
    var urlToScreenshot = req.query.url;
    if (urlToScreenshot == undefined) urlToScreenshot = 'https://google.com';
    urlToScreenshot = Parse.parseUrl(urlToScreenshot);
    Parse.loadSiteOnSourceHtml(urlToScreenshot);
    fs.readdir(__dirname + '/HTML', (err, files) => {
        files.forEach(file => {
            if(file.slice(-4)=='html'){
                (async() => {
                    const browser = await puppeteer.launch({
                        args: ['--no-sandbox', '--disable-setuid-sandbox']
                    });

                    const page = await browser.newPage();
                    const html = fs.readFileSync(__dirname+'/HTML/'+file,'utf-8');
                    await page.setContent(html);
                    await page.screenshot({path:__dirname+'/public/images/'+file.slice(0,-4) + 'png'});
                    await browser.close();
                })();
            }
        });
        let links = [];
        files.forEach(file => {
            if(file.slice(-4)=='html') {
                let link = req.protocol + "://" + req.get('host') + "/images/"+file.slice(0,-4) +'png';
                links.push(link);
            }
        })
        console.log(os.hostname());
        res.json({
            "status": "1",
            "message":"success",
            "links": JSON.stringify(Object.assign({},links))
        });
    })   
})




app.get('/a', function(req,res){
    // var data = fs.readFile(__dirname+ '/screenshot.png',(error,data)=>{
    //     console.log(data,"satay");
    // });
    res.send("Hello Mr. Satya Prakash Sharma.");
})

app.get('/webshot', function(req, res) {
    var urlToScreenshot = req.query.url;
    if (urlToScreenshot == undefined) urlToScreenshot = 'https://google.com';
    urlToScreenshot = Parse.parseUrl(urlToScreenshot);
    if (validUrl.isWebUri(urlToScreenshot)) {
        console.log('Screenshotting: ' + urlToScreenshot);
        (async() => {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.goto(urlToScreenshot);
            const html = await page.content();
            // fs.writeFile(__dirname+"HTML/sourceHtml.txt",'utf8');
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

app.use(express.static(path.join(__dirname, 'public')))
app.listen(port, function() {
    console.log('Server is running on port ' + port)
})
