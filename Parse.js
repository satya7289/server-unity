const request = require('request');
const fs = require('fs');
const cheerio = require("cheerio");

const sourceHTML = '/HTML/sourceHTML.txt';
const HTML_PATH = '/HTML/';
const head_path = 'head.txt';
const body_path = 'body.txt';
const script_path = 'script.txt';
const base_html_start = '<html>';
const base_html_end = '</html>';
const base_body_start = '<body>';
const base_body_end = '</body>';

var write = (data,path)=>{
    var writeStream = fs.createWriteStream(__dirname + HTML_PATH + path,'utf8');
    writeStream.write(data);
}

var appendWrite = (data,path)=>{
    fs.appendFileSync(__dirname + HTML_PATH + path,data + '\n','utf-8',()=>{});

}

var createFile = (path)=>{
    fs.writeFile(__dirname + HTML_PATH + path,'',()=>{});
}

var parseHtml = (path)=> {
   
    fs.readFile(__dirname + HTML_PATH + path, 'utf8',(error, html)=>{

        createFile(head_path);
        createFile(body_path);
        createFile(script_path);

        const $ = cheerio.load(html);
        var head = $('head');
        var body = $('body');
        write($.html(head),head_path);
        write($.html(body),body_path);

        /* Add all script to one file */
        body.children().each((idx,child)=>{
            if(child.tagName=='script'){
                appendWrite($.html(child),script_path);
            }
        })

        /** Making a html file. */
        body.children().each((idx,child)=>{
            if(child.tagName!='script'){
                let temp_path = idx.toString() + '.html';
                createFile(temp_path);
                appendWrite(base_html_start,temp_path);
                var h = fs.readFile(__dirname+HTML_PATH+head_path,'utf-8',(error,h)=>{
                    appendWrite(h,temp_path);
                    appendWrite(base_body_start,temp_path);
                    appendWrite($.html(child),temp_path);
                    fs.readFile(__dirname+HTML_PATH+script_path,'utf-8',(error,script)=>{
                        appendWrite(script,temp_path);
                        appendWrite(base_body_end,temp_path);
                        appendWrite(base_html_end,temp_path);
                    })                    
                });
                
            }
        })
       
    })
}

var remHTMLAndImagesFIle = ()=>{
    fs.readdir(__dirname + '/HTML',(err,files)=>{
        files.forEach(file=>{
            if(file.slice(-4)=='html'){
                fs.unlinkSync(__dirname+'/HTML/'+file);
            }
        })
    })
    fs.readdir(__dirname + '/public/images',(err,files)=>{
        files.forEach(file=>{
            fs.unlinkSync(__dirname+'/public/images/' +file);
        })
    })
}


exports.parseUrl = function(url) {
    url = decodeURIComponent(url)
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = 'http://' + url;
    }

    return url;
};

exports.loadSiteOnSourceHtml = (uri)=>{
    request({uri:uri},(error, resp, body)=>{
        var writeStream = fs.createWriteStream(__dirname+sourceHTML);
        writeStream.write(body);
        console.log("loaded site "+uri);
        remHTMLAndImagesFIle();
        parseHtml('sourceHTML.txt');
    })
}