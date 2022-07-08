const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const utilFunction = require("./utilFunction.js");


const corsOption = {
    origin : "*",
    optionsSuccessStatus : 200
}

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.text({limit: '50mb'}));

app.post("/randomPath", cors(corsOption), bodyParser.text({type : 'text'}),function(req, res){
    console.log('You have hit the /randomPath endpoint with CORS enabled');

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

    // UNFORTUNALTEY STUCK HERE :((((()))))
    // TRY REDIS MAYBE

    const unqNumber = utilFunction.objToUnq(fileDataObj);

    
    //Generate hash for encodedFileData and return it to user - 

    res.json({"name" : "Bharat"});
})

app.listen(5600, "localhost", function(){
    console.log('Server has started');
});

