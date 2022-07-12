const fs = require('fs');

const readStr = fs.createReadStream(__dirname + "/text.txt");
const wrtStream = fs.createWriteStream(__dirname + "/newFile.txt");

readStr.on('data', function(chunk){
    console.log(chunk);
    wrtStream.write(chunk.toString());
})