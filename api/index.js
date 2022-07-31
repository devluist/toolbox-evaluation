
const https = require('https');
const express = require('express');
const app = express();

const API_URL = "https://echo-serv.tbxnet.com/v1/secret/files";
const API_FILES_URL = "https://echo-serv.tbxnet.com/v1/secret/file/";

BigInt.prototype.toJSON = function () {
    return this.toString();
};

app.get('/files/list', (req, res, next) => {

    const options = {
        method: "GET",
        headers: {
            // This was explicitly required on the PDF "REQUISITOS TÉCNICOS API"
            // "no depender de [...] variables de entorno"
            Authorization: "Bearer aSuperSecretKey" 
        }
    }

        https.request(API_URL, options, externalRes => {
            let data = "";
            externalRes.on("data", chunk => data += chunk)

            externalRes.on("end", () => {
                if (data){
                    data = JSON.parse(data).files;
                }

                res.json(data)
            })
        })
        .end()
})

app.get('/files/data', (req, res, next) => {

    let { fileName } = req.query;
    let filesFetcher = [];

    const options = {
        method: "GET",
        headers: {
            // This was explicitly required on the PDF "REQUISITOS TÉCNICOS API"
            // "no depender de [...] variables de entorno"
            Authorization: "Bearer aSuperSecretKey" 
        }
    }

    // if user is requesting one file
    if( fileName && fileName.length > 0) {
        https.request(API_FILES_URL + fileName, options, csvRes => 
            csvResponseHandler(csvRes, filesFetcher, res, next)
        )
        .end()
    }
    // if user is requesting the list of files
    else {
        https.request(API_URL, options, externalRes => {
            let data = "";
            externalRes.on("data", chunk => data += chunk)

            externalRes.on("end", () => {
                if (data){
                    data = JSON.parse(data).files;
                }

                let processed = 0;
                data.forEach( (elm, idx) => {
                    https.request(API_FILES_URL + data[idx], options, csvRes => {
                        processed++;
                        csvResponseHandler(csvRes, filesFetcher, res, next, processed, data.length)
                    })
                    .end()
                })
            })
        })
        .end() 
    }

})

// in case user is requesting a single file, the processed and amountFiles are 1
function csvResponseHandler(csvRes, filesFetcher, res, next, processed = 1, amountFiles = 1) {

    if(csvRes.statusCode == 200){

        let csvData = "";
        let subResp = {
            file: null,
            lines: []
        };

        csvRes.on("data", chunk => csvData += chunk)

        csvRes.on("end", () => {
            if (csvData){
                csvData = csvData.split("\n");
            }

            // If file it's not just headers, then do something with it
            if(csvData.length > 1){

                for(let j = 1; j < csvData.length; j++){
                    const line = csvData[j].split(",");

                    // if each line has all csv cells and each each it's not empty
                    // then let's build the object to be sended to client
                    if(line.length > 3 && line[0] && line[1] && line[2] && line[3]){

                        subResp.file = line[0];
                        // TODO: maybe could better to compare it using Number.MAX_SAFE_INTEGER
                        // if string is to lengthy, then this is a BigInt, otherwise parse it as a regular Integer
                        let numb = line[2].length < 15 ? parseInt(line[2]) : BigInt(line[2]);

                        subResp.lines.push({
                            text: line[1],
                            number: numb,
                            hex: line[3]
                        });
                    }
                }

                if(subResp.file){
                    filesFetcher.push(subResp)

                    // if the amount of files processed is equal to the amount of files requested
                    // then it's time to send the response to the client
                    if(processed === amountFiles){
                        if(amountFiles === 1 && filesFetcher.length === 1){
                            filesFetcher = filesFetcher[0]
                        }

                        // dangerous but required for localhost testing
                        res.setHeader("Access-Control-Allow-Origin", "*" )
                        res.json(filesFetcher)
                    }
                }    
            }
            else {
                // if user only requested one file, then throw an error, otherwise let it work with the good ones
                if(amountFiles === 1){
                    next({message: "Empty File", status: 200})    
                }
            }
        })
    }
    else {
        // if user only requested one file, then throw an error, otherwise let it work with the good ones
        if(amountFiles === 1)
            next({status: csvRes.statusCode, message: csvRes.statusMessage})
    }
}

app.use((err, req, res, next) => {
    if(err && err.status){
        res.status(err.status).json(err)
    }
    else{
        res.json(err)
    }
})

app.listen(3500, () => {
    console.log(`Example app listening on port http://localhost:3500`);
})
