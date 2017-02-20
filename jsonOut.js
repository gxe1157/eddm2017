/* Get data of City and zip codes for New Jersey */   

module.exports = function () {
    const readline = require('readline');
    const fs = require('fs');

    var filename = './lib/data/NJ_Town2.csv';
    var output   = './lib/data/njTowns.txt';

    var oCityZip = {};
    var cityName, zipCode;

    var escapeSpecialChars = function escapeSpecialChars(jsonString) {
        return jsonString.replace(/[-~]*/g, '') ;        
    }
   return new Promise(function (resolve, reject) {
        var rl = readline.createInterface({
            input: fs.createReadStream(filename),
            output: process.stdout,
            terminal: false
        });

        rl.on('line', function(line) {
            [zipCode, cityName] = line.split(",");

            if( !oCityZip.hasOwnProperty(cityName) ) oCityZip[cityName] = [];
            oCityZip[cityName].push(zipCode);

        })

        rl.on('close', function() {
            if ( oCityZip ) {
                // console.log(oCityZip);
                console.log('File for City and Zip Code is written................');
                resolve( oCityZip );

            } else {
                console.log('File City and Zip Code Failed ............. [Prg:jsonOut]');                
                reject();
            }                      
        });
        process.stdin.destroy();                                
    })// end promise    

}// end eports
