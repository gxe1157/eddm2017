//Evelio Velez Jr. 01.07.2017

exports.home = function(req,res){
    res.render('homePage', {
    	title   : 'Every Door Direct Mail ( EDDM ) '
    });
};

exports.reportPDF = function(req, res) {
    var useRequire = req.params['printOpt'] == 'crReport'? '../pdfReport' : '../pdfSlips' ;
    var pdfSlips = require( useRequire );
    pdfSlips(req, res);

};

exports.pdfBrowser = function(req, res) {
  var fs = require('fs');

  var tempFile= `./lib/pdfout/${ req.params['pdfName'] }`;
  fs.readFile(tempFile, function (err,data){
     res.contentType("application/pdf");
     res.end(data);
  });
}


exports.mainPage = function(req,res){
    var cityZip = require('../jsonOut');
    var arrTowns =[];

    cityZip()
      .then(function( results ) {
          console.log('We have Data......'+ arrTowns.length + 'Records.');
          for (var key in results) {
              arrTowns.push(key);
           }

          res.render('displayRoutes', {
            title: 'Every Door Direct Mail ( EDDM ) -MainPage',
            cityZipOpt: JSON.stringify(results)
          });
      })
      .catch(function( results ) {
        console.log('Not found ....',  results);
        res.send( false );
      })

};

exports.getData = function(req,res){
    var data = require('../getData');
    var rowData = [];
    data( res, req.params['zipCode'])
      .then(function( results ) {
          var arrLen =  results.length;
          console.log('We have Carrier Route Data......'+arrLen);

          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(results));
      })
      .catch(function( results ) {
          console.log('Not found ....',  results);
          res.send( false );
      })

}


// Route for all other page requests
exports.notFound = function(req, res) {
   	res.end("Page not found............... ");
};
