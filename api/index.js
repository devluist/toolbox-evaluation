
const https = require('https');
const express = require('express');
const app = express();

BigInt.prototype.toJSON = function () {
    return this.toString();
};

app.get('/files/data', (req, res) => {

    const options = {
        method: "GET",
        headers: {
            // This was explicitly required on the PDF "REQUISITOS TÉCNICOS API"
            // "no depender de [...] variables de entorno"
            Authorization: "Bearer aSuperSecretKey" 
        }
    }

    https.request("https://echo-serv.tbxnet.com/v1/secret/files", options, externalRes => {
        let data = "";
        let url = "https://echo-serv.tbxnet.com/v1/secret/file/";
        externalRes.on("data", chunk => data += chunk)

        externalRes.on("end", () => {
            let filesFetcher = [];
            let processed = 0;
            if (data){
                data = JSON.parse(data).files;
            }

            data.forEach( (elm, idx) => {
                https.request(url + data[idx], options, csvRes => {
                    processed++;
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

                                    // if each line has all csv cells
                                    // and each one it's not empty
                                    if(line.length > 3 && line[0] && line[1] && line[2] && line[3]){
                                        subResp.file = line[0];
                                        subResp.lines.push({
                                            text: line[1],
                                            number: line[2].length < 15 ? parseInt(line[2]) : BigInt(line[2]), // TODO: compare using Number.MAX_SAFE_INTEGER
                                            hex: line[3]
                                        });
                                    }
                                }
                                if(subResp.file){
                                    filesFetcher.push(subResp)
                                    if(processed === data.length){
                                        res.json(filesFetcher)
                                    }
                                }    
                            }
                        })
                    }
                })
                .on("error", error => console.log(error))
                .end()
            })
        })
    })
    .on("error", error => console.log(error))
    .end()
})



app.listen(3500, () => {
    console.log(`Example app listening on port http://localhost:3500`);
})
