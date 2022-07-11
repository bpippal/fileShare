const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.text({limit: '50mb'}));

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

function getIdxById(id){

    //Implemented binary search to get the file details

    let leftIdx = 0;
    let rightIdx = megaObj.length - 1;

    const target = parseInt(id);
    
    while(leftIdx <= rightIdx){
    
        let mid = parseInt((leftIdx + rightIdx)/2);
        console.log("🚀 ~ file: server.js ~ line 41 ~ getIdxById ~ mid", mid)
        console.log("🚀 ~ file: server.js ~ line 44 ~ getIdxById ~ megaObj", megaObj)

        if(megaObj[mid].id === target){
            return mid;
        }else if(megaObj[mid].id > target){
            rightIdx = mid - 1;
        }else if(megaObj[mid].id < target){
            leftIdx = mid + 1;
        }
    }
    
    //For nothing being found;
    return -1;
    
}

const corsOption = {
    origin : "*",
    optionsSuccessStatus : 200
}


const finalObj = {};

app.post("/uploadFile", cors(corsOption), bodyParser.text({type : 'text'}),function(req, res){

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


    //In the response the generated nunmber is to be shown so the user can download using that

    res.json({id});
})

app.post("/downloadFile", cors(corsOption), function(req, res){

    const body = JSON.parse(req.body);

    //Get the file details 
    const idxOfFileDetails = getIdxById(body.id);

    //Handling fileNotFound case
    if(idxOfFileDetails === -1){
        res.status(404).send({err : "File not Found"})
    }

    const fileDetails = megaObj[idxOfFileDetails];

/* 
Once fileDetails are fetched, delete the fileDetails from the server.. cant use delete as it leave' undefined holes which create's issues during binary search
TODO
*/

    res.status(201).send(fileDetails);

})

app.listen(5600, "localhost", function(){
    console.log('Server has started');
});

