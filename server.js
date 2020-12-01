const express = require("express");

const app = express();

const path = require("path");

const fs = require('fs');
var fileName = 'data.txt';

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

const engines = require('consolidate');
const { error } = require("console");
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    let fileContent = fs.readFileSync(fileName, 'utf-8');
    let userText = fileContent.split('/');
    userText.shift();
    let userJson = [];
    userText.forEach(user => {
        let eachUser = {
            'name': user.split(':')[0],
            'city': user.split(':')[1]
        }
        userJson.push(eachUser);
    });
    res.render('all', { data: userJson })
});




var PORT = process.env.Port || 8000
app.listen(PORT);
console.debug("Server is running on port: " + PORT);
