console.log("Hello world")

const uploadFileButton = document.querySelector("div.button button.upload-file");
const downloadFileButtono = document.querySelector("div.button button.download-file");

const uploadFileNode = document.querySelector('div.upload-file');
const downloadFileNode = document.querySelector('div.download-file');

const allMainFunctionNode = document.querySelectorAll("div.main-function");

let counter = 0;

//Variable to know if its a upload/download;
let isUpload = false;

function updateState(calledFrom){
    isUpload = calledFrom === "uploadFile" ? true : false;
}


uploadFileButton.addEventListener('click', function(){
    console.log('upload Button is clicekd');

    updateState('uploadFile');

    handleRequest(isUpload);
})

downloadFileButtono.addEventListener('click', function(){
    console.log('download Button is clicekd');

    updateState('downloadFile');

    handleRequest(isUpload)
})

//Function to clear the content of both Node
function clearContentOfUploadAndDownloadNode(){
    allMainFunctionNode.forEach(function(eachNode){
        eachNode.innerHTML = "";
    })
}

//Common function that take's care of the button pressed i.e if its Upload/Download
function generateNodeData(node){
    const classOfNode = node.className;
    clearContentOfUploadAndDownloadNode();

    if(classOfNode.includes("upload-file")){
        node.innerHTML += `
            <form>
            <label for="myfile">Select a file:</label>
            <input type="file" id="myfile" name="myfile" class="myFile">
            <input class="myFile-submit" type="submit">
            </form>
            <div class="upload-file-result box">

            </div>
        `;
    }else{
        node.innerHTML += `
        <form>
        <label for="myfile-download">Please enter the ID generated when the file was uploaded - </label>
        <input type="text" id="myfile-download" name="myfile-download" class="myFile-download">
        <button class="myFile-download-submit">Download</button>
        </form>
        `;
    }
}

function handleRequest(stateofUpload){
    if(stateofUpload){
        //Handle things for upload
        generateNodeData(uploadFileNode);

        handleStateOfUpload();
    }else{
        //Handle things for download
        generateNodeData(downloadFileNode);

        handleStateOfDownload();
    }
}

//Function to handle to different state - 
function handleStateOfUpload(){
    const submitFileButton = document.querySelector('input.myFile-submit');
    const fileNode = document.querySelector('input.myFile');
    let fileData;

    fileNode.onchange = function(event) {
        const fileDetail = fileNode.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(fileDetail);

        reader.addEventListener('load', function(e){
            fileData = e.target.result;
        });
    }

    submitFileButton.addEventListener('click', function(event){

        event.preventDefault();

        console.log('This is flag', isUpload)

        //Check if Some file is uploaded or no;
        if(fileData === undefined){
            alert("Please upload the file first!");

            //handleRequest is called and not HandleStateofUpload as the submitFileButton loses its pointer to that node when the clearContent function is called. To see it, call handleStateofUpload and click the submit button twice!!
            handleRequest(isUpload);
        }

        console.log('This is fileData', fileData);

        fetch("http://localhost:5600/uploadFile", {
            method : "POST",
            body : fileData
        })
        .then((res) => res.json())
        .then((finalRes) => {
            const uploadFileResultNode = document.querySelector('div.upload-file-result');

            uploadFileResultNode.innerText = `Yay! Your File is uploaded. Please use the ID - "${finalRes.id}" to download the file`;
        })
    })

}

function handleStateOfDownload(){
    const downloadButton = document.querySelector("form button.myFile-download-submit");
    const inputAreaforIDNode = document.querySelector("form input.myFile-download");

    downloadButton.addEventListener('click', function(event){
        event.preventDefault();
        console.log('Final download button is cliked');

        const idEnteredByUser = inputAreaforIDNode.value;

        //Send this data to server -

        const body = {id : idEnteredByUser};

        fetch("http://localhost:5600/downloadFile", {
            method : "POST",
            body : JSON.stringify(body),
        })
        .then((res) => res.json())
        .then((finalRes) => {
            console.log('Final Res', finalRes);
        })


    })
}
