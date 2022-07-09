const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const utilFunction = require("./utilFunction.js");

/* megaObj is an array of object with the structure of the object as - 
{
    id : id,
    fileDataObj = {
        fileData : encodedFileData,
        encoding : encodingUsed,
        fileExtension : fileExtension
    }
} 
This is to ensure that binary search can be implemented on id
*/

const megaObj = [];

function generateID(){
    return megaObj.length ;
}

const corsOption = {
    origin : "*",
    optionsSuccessStatus : 200
}

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.text({limit: '50mb'}));

const finalObj = {};

app.post("/uploadFile", cors(corsOption), bodyParser.text({type : 'text'}),function(req, res){
    console.log('You have hit the /uploadFile endpoint with CORS enabled');

    let bodyRecieved = req.body;
    const encodedFileData = bodyRecieved.substring(bodyRecieved.indexOf(',') + 1);

    //Extracting encoding by removing extracted data;
    bodyRecieved = bodyRecieved.replace(encodedFileData, "");
    const encodingUsed = bodyRecieved.substring(bodyRecieved.indexOf(";")+1, bodyRecieved.indexOf(","));

    //Extracting fileExtension by removing the extracted data, PROBABLY FIND A BETTER SOLUTION ?
    bodyRecieved = bodyRecieved.replace("data:","");
    bodyRecieved = bodyRecieved.replace(encodingUsed,"");
    bodyRecieved = bodyRecieved.replace(",","");
    bodyRecieved = bodyRecieved.replace(";","");
    const fileExtension = bodyRecieved.split("/")[1];
    
    //Construct a proper object as the bodyRecieved is something like - 
    // data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD

    const fileDataObj = {
        fileData : encodedFileData,
        encoding : encodingUsed,
        fileExtension : fileExtension
    }

    // The plan is to save the data on the server for now
    const id = generateID();
    const objForMegaObj = {
        id, fileDataObj
    };

    megaObj.push(objForMegaObj);

    console.log(megaObj);

    //In the response the generated nunmber is to be shown so the user can download using that

    res.json({id});
})

app.post("/downloadFile", cors(corsOption), function(req, res){
    console.log(req.body);

    res.json({ok : "ok"})
})

app.listen(5600, "localhost", function(){
    console.log('Server has started');
});

