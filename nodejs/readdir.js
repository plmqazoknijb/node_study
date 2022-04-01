const fs = require('fs');
const testFolder = "../data";
fs.readdir(testFolder,function (arr,data){
    console.log(data);
});