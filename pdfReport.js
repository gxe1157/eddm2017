// exports = module.exports;
// Evelio Velez Jr.  Jan 12 2017

module.exports = function(req, res) {
	var fs = require("fs");
	var pdf = require("pdfkit");

	/* Global functions */
	var GVM = res.locals; 
	var eddmData  = GVM.isObjEmpty( req.params ) ? req.body: req.params;
	var arrData   = eddmData['data'];
	var arrResponse = JSON.parse(arrData);	
	// console.log('arrResponse',arrResponse);

	var myPath    = './lib/pdfout';
	var fileOutput= 'postOfficeReport.pdf';
	var busCount = 0, aptCount = 0, poBox = 0, resCount = 0, mailTotal = 0;

    /* PDF setup */
    var pos_x = 0, pos_y = 0, moveLine = 20;
	var myDoc = new pdf({
	    //size: [ 396,612 ],
	    bufferPages: true,
	    size: [ 612, 792 ],		    
	    margins : { // by default, all are 72
			        top: 36,
			        bottom:10,
			        left: 0,
			        right: 0
				  }
	});

    var getParams = function( lineData ){
    	return lineData.split('|');
    }

    var pdfHeader = function(){
    	pos_x = 72, pos_y = 124;
		/* [box_x, box_y, boxWidth, boxheight] */
	    myDoc.rect(54, 109, 504, 27)
	         .fillColor('black', 0.1)              // This add gray scale
	         .fillAndStroke()      
	         .fillColor('black', 1 )
	         .stroke();

		myDoc.font('Times-Roman')
			 .fontSize( 32 )					
			 .text( `Every Door Direct Mail (EDDM)`, 0, pos_y-100, { width: 612, align: 'center' } )
			 .fontSize( 16 )	
			 .text( `${eddmData.poDest}, NJ ${eddmData.zipCode}`, 0, pos_y-50, { width: 612, align: 'center' } )
			 .fontSize( 12 )				 			 				
			 .text( `Route`, pos_x, pos_y, { width: 72, align: 'left' } )
			 .text( `Type of Rte`, pos_x*2, pos_y, { width: 108, align: 'left' } )
			 .text( `Businesses`, pos_x*3, pos_y, { width: 72, align: 'left' } )
			 .text( `Apartment`, pos_x*4, pos_y, { width: 72, align: 'left' } )
			 .text( `PO_Box`, pos_x*5, pos_y, { width: 72, align: 'left' } )
			 .text( `Residential`, pos_x*6, pos_y, { width: 72, align: 'left' } )			 			 			 			 			 
			 .text( `Totals`, pos_x*7, pos_y, { width: 50, align: 'right' } );
    }	

    var pdfLine = function(){
		myDoc.font('Times-Roman')
			 .fontSize(12)					
			 .text( oData['route'], pos_x, pos_y, { width: 50, align: 'left' } )
			 .text( oData['routeType'], pos_x*2, pos_y, { width: 52, align: 'left' } )
			 .text( oData['busCount'], pos_x*3, pos_y, { width: 52, align: 'right' } )
			 .text( oData['aptCount'], pos_x*4, pos_y, { width: 52, align: 'right' } )
			 .text( oData['poBox'], pos_x*5, pos_y, { width: 52, align: 'right' } )
			 .text( oData['resCount'], pos_x*6, pos_y, { width: 52, align: 'right' } )			 			 			 			 			 
			 .text( oData['mailTotal'], pos_x*7, pos_y, { width: 45, align: 'right' } );

		busCount  += +oData['busCount'];
		aptCount  += +oData['aptCount'];
		poBox     += +oData['poBox']; 
		resCount  += +oData['resCount']; 
		mailTotal += +oData['mailTotal']; 

  	}

    var pdfTotals = function(){
    	var drawLine = '_______';
		myDoc.font('Times-Roman')
			 .fontSize(12)					
			 .text( drawLine, pos_x*3, pos_y-9, { width: 52, align: 'right' } )
			 .text( drawLine, pos_x*4, pos_y-9, { width: 52, align: 'right' } )
			 .text( drawLine, pos_x*5, pos_y-9, { width: 52, align: 'right' } )
			 .text( drawLine, pos_x*6, pos_y-9, { width: 52, align: 'right' } )
			 .text( drawLine, pos_x*7, pos_y-9, { width: 45, align: 'right' } )
			 .fontSize(12)					
			 .text( 'Totals: ', pos_x, pos_y+10, { width: 50, align: 'left' } )			 
			 .text( busCount, pos_x*3, pos_y+10, { width: 52, align: 'right' } )
			 .text( aptCount, pos_x*4, pos_y+10, { width: 52, align: 'right' } )
			 .text( poBox, pos_x*5, pos_y+10, { width: 52, align: 'right' } )
			 .text( resCount, pos_x*6, pos_y+10, { width: 52, align: 'right' } )
			 .text( mailTotal, pos_x*7, pos_y+10, { width: 45, align: 'right' } );
  	}

    var pdfTopAlign = function( pos_y, pos_x, widthAdj ){
		myDoc.fontSize(10)
			.text( `|`, pos_x, pos_y, { width: widthAdj, align: 'left' } )		
			.text( `|`, pos_x, pos_y, { width: widthAdj, align: 'right' } )
			.text( `|`, pos_x, pos_y, { width: widthAdj, align: 'center' } );			
    }

	var createPDF = function( arrResponse ){
		/* Size based on 72 pixes/inch  */

		myDoc.pipe(fs.createWriteStream(`${myPath}/${fileOutput}`));
		/* route":"B001","routeType":"PO_Boxes","busCount":"9","aptCount":"0","poBox":"6","resCount":"0" */
		pdfHeader();		
		pos_x = 72, pos_y = 144;
		var lines = 0, pages = 0;

		for( var line in arrResponse ){
			lines++,
			oData = arrResponse[line];		
			pdfLine( oData );			
			pos_y += 18;

			if( lines > 30 ){
				myDoc.text( 'Continued on next page...', 0, pos_y+18, { width: 612, align: 'center' } );
				lines = 0;
				myDoc.addPage(); 				
				pdfHeader();
				pos_x = 72, pos_y = 144;				
				pages++;
			}  
		}

        /* Go back and print on bottom of pages */
        for( var pg = 0; pg < pages+1; pg++) {
			myDoc.switchToPage( pg );
			myDoc.fontSize( 16 )
				 .text( `Page ${pg+1} of ${pages+1}`, 0, 756, { width: 612, align: 'center' } );
        }
		pdfTotals();

		/* Close create PDF */
		myDoc.end();
	    res.send( `${myPath}/${fileOutput}` ); 
	}	
	createPDF( arrResponse );

}// End module.exports

