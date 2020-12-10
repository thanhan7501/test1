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
    let userJson = readDataFromFile();
    res.render('all', { data: userJson })
});

app.get('/delete', (req, res) => {
    let NameToDelete = req.query.name;
    //1. load data from file to array
    let userJson = readDataFromFile();

    //2. find user in array and delete
    let indexToRemove = -1;
    for (i = 0; i < userJson.length; i++) {
        if (userJson[i].name == NameToDelete) {
            indexToRemove = i;
            break;
        }
    }
    userJson.splice(indexToRemove, 1);

    //3. save array to file
    let contentToSave = '';
    for (i = 0; i < userJson.length; i++) {
        contentToSave += '/' + userJson[i].name + ':' + userJson[i].city;
    }
    fs.writeFileSync(fileName, contentToSave);
    res.redirect('/');
});

app.get('/edit', (req, res) => {
    let nameToEdit = req.query.name;
    //1. load data from file to array
    let userJson = readDataFromFile();

    //2. find user in array and edit
    let indexToEdit = -1;
    for (i = 0; i < userJson.length; i++) {
        if (userJson[i].name == nameToEdit) {
            indexToEdit = i;
            break;
        }
    }
    res.render('edit', { data: userJson[indexToEdit] });
});

app.post('/update', (req, res)=>{
    let nameToUpdate = req.body.txtName;
    let cityToUpdate = req.body.txtCity;

    //1. load data from file to array
    let userJson = readDataFromFile();

    //2. find user in array and edit
    let indexToEdit = -1;
    for (i = 0; i < userJson.length; i++) {
        if (userJson[i].name == nameToUpdate) {
            indexToEdit = i;
            break;
        }
    }
    //update array
    userJson[indexToEdit].city = cityToUpdate;
    
    //3. save array to file
    let contentToSave = '';
    for (i = 0; i < userJson.length; i++) {
        contentToSave += '/' + userJson[i].name + ':' + userJson[i].city;
    }
    fs.writeFileSync(fileName, contentToSave);
    res.redirect('/');
})


var PORT = process.env.Port || 8000
app.listen(PORT);
console.debug("Server is running on port: " + PORT);

function readDataFromFile() {
    let fileContent = fs.readFileSync(fileName, 'utf-8');
    let userText = fileContent.split('/');
    userText.shift();
    let userJson = [];
    userText.forEach(user => {
        let eachUser = {
            'name': user.split(':')[0],
            'city': user.split(':')[1]
        };
        userJson.push(eachUser);
    });
    return userJson;
}

