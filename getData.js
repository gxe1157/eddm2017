// Meliisa Data  -> Evelio Velez Jr. Jan 6 2017

module.exports = function (res, zipCode) {
	var request = require('./node_modules/request'),
		cheerio = require('./node_modules/cheerio'),
		fs = require('fs');

	var url  = 'http://www.mailers.com/melissa2.html';
	// var url  = 'https://www.melissadata.com/lookups/CartZip.asp?Zip='+zipCode;
	console.log('url', url);

	var results = [];

    return new Promise(function (resolve, reject) {

		request( url, function( err, res, html ){
			if( err && res.statusCode === 200 ) console.log('problem with loading........');

			var $ = cheerio.load(html, {
		        ignoreWhitespace: true,
		        xmlMode: true
		    });

			var allTableData = $('.Tableresultborder');
			var tableData    = allTableData.text();
		    tableData = tableData.replace(/PO Boxes/g,'PO_Boxes');        
		    tableData = tableData.replace(/Rural Route/g,'Rural_Route');        		    
		    tableData = tableData.replace(/N\/A/g,'|');
		    tableData = tableData.replace(/Map/g,'|');

		    var prepData = tableData.split('|');
		    // console.log('prepData', prepData);
		    var datatoObj;
		    var arrItem = [];
		    var arrReturn = [];

			prepData.forEach(function(item) {
			    var a = item.replace(/\s+/g, '|');
			    arrItem = a.split('|');
			    // console.log('arrItem', arrItem);

			    dataObj =({
			    	'route'		: arrItem[1],
			    	'routeType' : arrItem[2],
			    	'busCount'	: arrItem[4],
			    	'aptCount'	: arrItem[5],
			    	'poBox'		: arrItem[6],
			    	'resCount'	: arrItem[7]
			    });
			    arrReturn.push(dataObj);
			});
			/*  remove fist and last row */
			arrReturn.pop();
			arrReturn.shift();

	        if ( arrReturn ) {
	    	    resolve( arrReturn )
	        } else {
	        	reject( )
	        }          
		});// end of request
		
	}) // end of promise

} // end export



