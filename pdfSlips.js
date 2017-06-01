// exports = module.exports;
// Evelio Velez Jr.  Jan 12 2017

module.exports = function(req, res) {
	var fs = require("fs");
	var pdf = require("pdfkit");

	var myDoc = new pdf({
	    //size: [ 396,612 ],
	    bufferPages: true,
	    size: [ 792, 612 ],
	    margins : { // by default, all are 72
			        top: 36,
			        bottom:10,
			        left: 0,
			        right: 0
				  }
	});

	/* Global functions */
	var GVM = res.locals;
	var eddmData = GVM.isObjEmpty( req.params ) ? req.body: req.params;
	var arrData = eddmData['data'];
	var arrResponse = JSON.parse(arrData);
	// console.log('arrResponse',arrResponse);

	var pagesPrinted = 0;
	var myPath     = './lib/pdfout';
	var fileOutput = 'eddmSlipSheets.pdf';
  var imposition = 1;
	var switchOn   = Math.ceil(eddmData.totalPages/2);


  var getParams = function( lineData ){
  	return lineData.split('|');
  }

	var pdfLine = function( bundleCtn ){
			var pos_y = 18, pos_x = 0;
			var widthAdj = eddmData.printOpt == 'size1' ? 396 : 792;
			var lineFont = eddmData.printOpt == 'size1' ? 18 : 26;

			if( (eddmData.printOpt == 'size1') && ( pagesPrinted >= switchOn ) ){
					myDoc.switchToPage( pagesPrinted - switchOn );
					pos_x = 396; 	//across
					imposition = 2;
			}


		pdfTopAlign( pos_y, pos_x, widthAdj );
			myDoc.fontSize(10)
				.text( `Total Count for ECRWSS ${oData['route']} = ${oData['mailCount']}`, pos_x, pos_y+10, { width: widthAdj, align: 'center' } )
				.text( `Page Number: ${pagesPrinted+1} `, pos_x, pos_y+30, { width: widthAdj, align: 'center' } );

			myDoc.fontSize(lineFont)
				.text( `${eddmData.poDest}, NJ ${eddmData.zipCode}`, pos_x, pos_y+190, { width: widthAdj, align: 'center' } )
				.text( `ECRWSS ${oData['route']}`, pos_x, pos_y+215, { width: widthAdj, align: 'center' } )
				.text( `${eddmData.poEntry}`, pos_x, pos_y+235, { width: widthAdj, align: 'center' } )
				.text( `${bundleCtn} PCS`, pos_x, pos_y+255, { width: widthAdj, align: 'center' } );

			if( imposition == 1 ) myDoc.addPage();

			pagesPrinted++;
	}

	var pdfTopAlign = function( pos_y, pos_x, widthAdj ){
			myDoc.fontSize(10)
				.text( `|`, pos_x, pos_y, { width: widthAdj, align: 'left' } )
				.text( `|`, pos_x, pos_y, { width: widthAdj, align: 'right' } )
	}

	var createPDF = function(){
		/* Size based on 72 pixes/inch
		*  3.75 * 72 = 270 | 10.63 * 72 = 765.4
	    */

		myDoc.pipe(fs.createWriteStream(`${myPath}/${fileOutput}`));
		myDoc.fontSize(14)
			 .fillColor('#000');

console.log(arrResponse);

		for( var line in arrResponse ){
				oData = arrResponse[line];
	            // console.log(i, route, bundle, fullSlips, partialSlip, rteCount);
				if( oData['fullSlips'] > 0 )
						for( var x = 0; x < oData['fullSlips']; x++ ) pdfLine( oData['bundleCtn'] );

				if( oData['partialSlip'] > 0 )
						pdfLine( oData['partialSlip'] );

		}

		/* Close create PDF */
		myDoc.end();
	    res.send( `${myPath}/${fileOutput}` );
	}

	createPDF();


}// End module.exports
