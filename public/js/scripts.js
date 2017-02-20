
var arrResponse ={};
var arrSS = {};

window.onload = function() {
  if( _('selZip') ) chkBoxScan( 'init', null );
}

function _(el){
    return document.getElementById(el);
}


var buildSelOpt = function( selName, arrSel ){
    arrSel.unshift('Select');
    if( document.getElementById(selName) ){
        _(selName).options.length = 0;
        for( var i in arrSel){
            _(selName).options[i] = new Option(`${arrSel[i]}`);
        }
    }
}

var homePageButton = function( obj ){
    if( _('user_name').value == '' ){
        alert('User Name is Required ') ;
        return false;
    }

    _('URL').value = obj.id;
    _('mode').value = _(obj.id).innerHTML;
    document.myForm.action= '/mainPage';
    document.myForm.submit();
}

var getPage = function( myMethod, myAction ){
    document.myForm.method= myMethod;
    document.myForm.action= '/'+myAction ;
    document.myForm.submit();
}

var zipSelected = function(){
    var data = '/getData/'+_('selZip').value;
    ajaxReq(data);
}


var prepareData = function (){
    var arrLen    = _('arrlength').value;
    var printData = [], route, mailCount = 0, bundleCtn = 0, totalPages = 0;
    arrLen++;

    for( var i = 1; i<arrLen; i++){
        arrSS = {};
        route     =  _('rte'+i).innerHTML;
        mailCount = +_('mailCtn'+i).innerHTML;
        bundleCtn = +_('perBundle').value;

        if( _('chkBx'+i).checked == true && mailCount > 0  ){
            fullSlips   = Math.floor( mailCount/bundleCtn );
            partialSlip = mailCount % bundleCtn;
            totalPages  += fullSlips;
            if( partialSlip > 0 ) totalPages++;

            arrSS['route'] = route;
            arrSS['bundleCtn'] = bundleCtn;
            arrSS['fullSlips'] = fullSlips;
            arrSS['partialSlip'] = partialSlip;
            arrSS['mailCount'] = mailCount;

            printData.push( arrSS );
        }
    }
    return [ printData, totalPages];
}

var printPDF = function( printOpt ){
    // console.log('arrResponse',arrResponse);
    if( printOpt == 'crReport')
        var printData = arrResponse; // arrResponse is global obj
    else
        var [printData, totalPages ] = prepareData();

    if( printData.length > 0){
        var headerInfo = `${ _('search').value}/${ _('selZip').value}/${ _('poEntry').value}/${printOpt}/${totalPages}`;
        var data = `/report/${headerInfo}/${ JSON.stringify(printData) }`;
        ajaxPDF( data );
        // console.log( data);
    }else{
        alert( 'No files were selected for processing.\nClick the checkbox next the file you wish to print.' );
    }
}

var validate_report = function( printOpt ){
    var errors =[];
    if( _('search').length == 0 ) errors.push('Search field is empty....');
    if( _('selZip').selectedIndex == "0" ) errors.push('Select a zip code to process...');
    if( _('poEntry').value.length == 0 ) errors.push('Post Office of Entry field is empty... ');
    if( _('mailTotal').innerHTML == 0 ) errors.push('There were no Carrier Routes selected... ');
    var pcsBundle = _('perBundle').value;
    if( pcsBundle.length == 0 ) errors.push('Bundle value must be greater than zero...');
    if( isNaN( pcsBundle ) ) errors.push('Bundle value must be a number...');

    if( errors.length > 0 ){
        errorMess(errors);
        return;
    }
    printPDF( printOpt );
}

var errorMess = function( errors){
    var message = errors.join('\n');
    alert('Errors Found:\n '+message);
}

var ajaxPDF = function( data ) {
    var xhttp_rpt = new XMLHttpRequest();

    xhttp_rpt.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var resp = this.responseText;
          _('pdfWindow').innerHTML = `<a href="${resp}" class="btn btn-danger" target="_blank" onClick="Javascript: _('pdfWindow').innerHTML =''" >Open Pdf</a>`;
          console.log('resp', resp);
        }
    };

    xhttp_rpt.open( "GET", data, true);
    xhttp_rpt.send( );
}


var ajaxReq =  function(data){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // alert( "readyState: "+this.readyState+" | status: "+this.status )
          var resp = this.responseText;
          arrResponse = JSON.parse(resp);
          _('bodyResponse').innerHTML = ' ';

          var newTable     = '';
          var responseData = '';
          var lineNumber   = 0;

          for ( var line in arrResponse ) {
              responseData = arrResponse[line];
              lineNumber   = parseInt(line) + 1;
              newTable += `<tr>
                               <td class="tdNumeric" >${lineNumber}&nbsp;&nbsp;</td>
                               <td id="rte${lineNumber}">${responseData['route']}</td>
                               <td id="rteType${lineNumber}">${responseData['routeType']}</td>
                               <td id="busCtn${lineNumber}"  class="tdNumeric">${responseData['busCount']}</td>
                               <td id="aptCtn${lineNumber}"  class="tdNumeric">${responseData['aptCount']}</td>
                               <td id="poBox${lineNumber}"   class="tdNumeric">${responseData['poBox']}</td>
                               <td id="resCtn${lineNumber}"  class="tdNumeric">${responseData['resCount']}</td>
                               <td id="total${lineNumber}"   class="tdNumeric">&nbsp;</td>
                               <td id="mailCtn${lineNumber}" class="tdNumeric">&nbsp;</td>
                               <td >
                                  <center>
                                    <input name="chkBx${lineNumber}"
                                     id="chkBx${lineNumber}"
                                     type="checkbox"
                                     onClick="Javascript: chkBox( ${lineNumber} ); chkBoxScan( 'sumChkBxs', null); ">
                                  </center>
                               </td>
                           </tr>`;
          }
          _('bodyResponse').innerHTML = newTable;
          _('arrlength').value = lineNumber;
          _('search').disabled = true;
          chkBoxScan( 'init', null);
        }
    };

    xhttp.open( "GET", data, true);
    xhttp.send();
}



var chkBoxToggle = function(){
    var toggleState = _('chkBx0').checked === true ? true : false;
    chkBoxScan( 'toggle', toggleState);
}

var chkBox = function ( lineNum ){
    /* get total for this one line */
    var addEDDM1 = +_('busCtn'+lineNum).innerHTML + +_('aptCtn'+lineNum).innerHTML + +_('poBox'+lineNum).innerHTML + +_('resCtn'+lineNum).innerHTML;
    var addEDDM2 = +_('aptCtn'+lineNum).innerHTML + +_('resCtn'+lineNum).innerHTML;
    var addEDDM3 = +_('busCtn'+lineNum).innerHTML + +_('poBox'+lineNum).innerHTML;
    var addEDDM4 = +_('poBox'+lineNum).innerHTML;

    _('total'+lineNum).innerHTML = addEDDM1;
    _('mailCtn'+lineNum).innerHTML = '';
    return [ addEDDM1, addEDDM2, addEDDM3, addEDDM4 ];
}

var chkBoxScan = function( mode, toggleState ){
    /* mode -> init, toggle, sumChkBxs */
    var mailTotal = 0, total_bus =0, total_apt =0, total_poBox =0, total_resCtn =0, ttotal =0;
    var [ addEDDM1, addEDDM2, addEDDM3, addEDDM4 ] = [null, null, null, null];
    _('mailTotal').innerHTML = '';

    if( mode == 'init')  _('chkBx0').checked = false;

    var length = _('arrlength').value;
    length++;

    for(var i = 1; i < length; i++){
        arrResponse[i-1]['mailTotal'] = '0';

        if( mode == 'toggle' ){
          _('chkBx'+i ).checked = toggleState;
        }

        [ addEDDM1, addEDDM2, addEDDM3, addEDDM4 ] = chkBox(i);
        total_bus  += +_('busCtn'+i).innerHTML;
        total_apt  += +_('aptCtn'+i).innerHTML;
        total_poBox += +_('poBox'+i).innerHTML;
        total_resCtn += +_('resCtn'+i).innerHTML;

        if( _( 'chkBx'+i ).checked ){
            switch( _('eddmOpt').value ) {
                case 'EDDM1':
                  mailTotal += addEDDM1;
                  _('mailCtn'+i).innerHTML = addEDDM1;                  
                  break;
                case 'EDDM2':
                  mailTotal += addEDDM2;
                  _('mailCtn'+i).innerHTML = addEDDM2;                                    
                  break;
                case 'EDDM3':
                  mailTotal += addEDDM3;
                  _('mailCtn'+i).innerHTML = addEDDM3;                                    
                  break;
                case 'EDDM4':
                  mailTotal += addEDDM4;
                  _('mailCtn'+i).innerHTML = addEDDM4;                                    
                  break;
            }
            _('mailTotal').innerHTML = mailTotal;
            arrResponse[i-1]['mailTotal'] = _('mailCtn'+i).innerHTML;
      }
    }

    // console.log(arrResponse);
    /* column totals */
    ttotal = total_bus+total_apt+total_poBox+total_resCtn;
    _('total_bus').innerHTML = total_bus;
    _('total_apt').innerHTML = total_apt;
    _('total_poBox').innerHTML =total_poBox;
    _('total_resCtn').innerHTML =total_resCtn;
    _('ttotal').innerHTML = ttotal;

}
