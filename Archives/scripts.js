var oJobDir = {};
var chars   =[];
var findCity=[];
var ajaxLookup = 3;

window.onload = function() {

  // if(  _('TotalCount') )
  chkBoxScan( 'init', null );
  var keysPressed = 0;
}

function _(el){
    return document.getElementById(el);
}

function clearMess(){
    document.getElementById( 'mess' ).style.display = 'none';
}

var pagesOutput = function(lineNum){
    var x = _('printed'+lineNum).innerHTML == 0 ? +_('reprint'+lineNum).innerHTML + +_('setCnt'+lineNum ).innerHTML : +_('reprint'+lineNum).innerHTML;
    x     = (+_('fileCnt'+lineNum ).innerHTML * +x )/4;
    return Math.ceil(x);
}


var doReport = function(){
    var printData = prepareData();
    if( printData.length > 0){
        var data = '/fusionPro/'+_('workOrder').value+'/'+_('dealerCode').value+'/'+_('selReport').value+'/'+printData.toString();
        ajaxFusionPro(data);
    }else{
        alert( 'No files were selected for processing.\nClick the checkbox next the file you wish to print.' );
        return false;
    }
}



var messDisplay = function(message){
        _( 'mess' ).style.display = 'block';
        _( 'mess').innerHTML = message;
}


var buildSelOpt = function( selName, arrSel ){
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
   document.myForm.action= '/getData ';
   document.myForm.submit();
}

var getPage = function( myMethod, myAction ){
  console.log(myMethod, myAction);

    document.myForm.method= myMethod;
    document.myForm.action= '/'+myAction;
    document.myForm.submit();
}


var chkBoxToggle = function(){
    var toggleState = _('chkBx0').checked === true ? true : false;
    chkBoxScan( 'toggle', toggleState);
}

var chkBox = function ( lineNum ){
    /* get total for this one line */
    var addEDDM1 = +_('busCtn'+lineNum).innerHTML + +_('aptCtn'+lineNum).innerHTML + +_('poBox'+lineNum).innerHTML + +_('resCtn'+lineNum).innerHTML;
    var addEDDM2 = +_('aptCtn'+lineNum).innerHTML + +_('poBox'+lineNum).innerHTML + +_('resCtn'+lineNum).innerHTML;
    _('total'+lineNum).innerHTML = addEDDM1;
    _('mailCtn'+lineNum).innerHTML = '';    
    return [ addEDDM1, addEDDM2 ];
}

var chkBoxScan = function( mode, toggleState ){
    /* mode -> init, toggle, sumChkBxs */
    var mailTotal = 0, total_bus =0, total_apt =0, total_poBox =0, total_resCtn =0, ttotal =0;
    _('mailTotal').innerHTML = 0;

    if( mode == 'init')  _('chkBx0').checked = false;

    var length = _('arrlength').value;
    length++;

    for(var i = 1; i < length; i++){
        if( mode == 'toggle' ){
          _('chkBx'+i ).checked = toggleState;
        }

        var [ addEDDM1, addEDDM2 ] = chkBox(i);
        total_bus  += +_('busCtn'+i).innerHTML;
        total_apt  += +_('aptCtn'+i).innerHTML;
        total_poBox += +_('poBox'+i).innerHTML;
        total_resCtn += +_('resCtn'+i).innerHTML;

        if( _( 'chkBx'+i ).checked ){
            mailTotal += _('eddmOpt').value == 'EDDM1' ? addEDDM1 : addEDDM2; 
            _('mailCtn'+i).innerHTML = _('eddmOpt').value == 'EDDM1' ? addEDDM1 : addEDDM2;              
            _('mailTotal').innerHTML = mailTotal;
        }

    }

    /* column totals */
    ttotal = total_bus+total_apt+total_poBox+total_resCtn;
    _('total_bus').innerHTML = total_bus;
    _('total_apt').innerHTML = total_apt;
    _('total_poBox').innerHTML =total_poBox;
    _('total_resCtn').innerHTML =total_resCtn;
    _('ttotal').innerHTML = ttotal;

}


var reportSelect = function(){
    var query  = 'SD1';
    // console.log('query1',query)

    var outPut = "upDateScreen";
    var data = '/townHall/'+query+'/'+outPut+'/'+_('workOrder').value+'/'+_('dealerCode').value+'/'+_('selReport').value+'/'+_('allJobDir').value;
    ajaxReq(data, query);
}

var ajaxPDF = function( data ) {
    var xhttp_rpt = new XMLHttpRequest();

    xhttp_rpt.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // alert( "readyState2: "+this.readyState+" | status: "+this.status )
          var resp = this.responseText;
          alert(resp);
        }
    };

    xhttp_rpt.open( "GET", data, true);
    xhttp_rpt.send( );    
}

var ajaxReq =  function(data, query){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // alert( "readyState: "+this.readyState+" | status: "+this.status )
          var resp = this.responseText;
          // console.log('rest', resp);
          var arrResponse = JSON.parse(resp);
          _('bodyResponse').innerHTML = ' ';

          var newTable     = '';
          var responseData = '';
          var lineNumber   = 0;

          for ( var line in arrResponse ) {
              // console.log(arrResponse[line]);
              responseData = arrResponse[line];
              lineNumber   = parseInt(line) + 1;
              newTable += `<tr>
                           <td>${lineNumber}<input type ="hidden" id = "RecNo${lineNumber}" name = "RecNo${lineNumber}" value = '${responseData['RecNo']}' /> </td>
                           <td id="twn${lineNumber}">${responseData['Dcode']} | ${responseData['City']}</td>
                           <td id="fileCnt${lineNumber}" class="tdNumeric">${responseData['NoFiles']}</td>
                           <td id="setCnt${lineNumber}" class="tdNumeric">${responseData['Count']}</td>
                           <td class="tdNumeric">${responseData['ModDate']}</td>
                           <td id="respLine${lineNumber}">${responseData['Status']}</td>
                           <td id="editOpt${lineNumber}"><a href="javascript: editLine( '${responseData['RecNo']}' );">Edit</a></td>
                           <td>
                                <input name="chkBx${lineNumber}" id="chkBx${lineNumber}" value="${responseData['Dcode']}" type="checkbox" onClick="Javascript: chkBox( ${lineNumber} );  chkBoxScan( 'sumChkBxs', null);">
                           </td>
                           <td  id="reprint${lineNumber}" class="tdNumeric">${responseData['Reprint']}</td>
                           <td  id="printed${lineNumber}" class="tdNumeric">${responseData['PrintCount']} </td>
                           <td class="tdNumeric" id="pages${lineNumber}">&nbsp;</td>

                           </tr>`;
          }

          _('bodyResponse').innerHTML = newTable;
          _('arrlength').value = lineNumber;
          _('showSel').innerHTML = `${_(query).innerHTML} [${lineNumber}]`;
          chkBoxScan( 'init', null);
        }
    };

    xhttp.open( "GET", data, true);
    xhttp.send();
}

function uniCharCode(event) {
    var textContent; 
    var data = '/getJSON/'+textContent;

    if( findCity.length == 0 ){
        getJSON(data)
          .then(function( results ) { 
              findCity = results;
              // alert( findCity );              
          })
    }

    var x = event.which || event.keyCode;
    _('textContent').innerHTML = "The Unicode CHARACTER code is: " + x;

    if ( event.keyCode !== 13 && kCodes.hasOwnProperty(event.keyCode) ) {
        chars.push(event.key);

        if( chars.length > ajaxLookup ){
           textContent = chars.join('');                              
           ajaxLookup = ajaxLookup + 3;
          // do a lookup
          var results = getByValue2( findCity, 'Paterson');
          alert('results | '+results);

        }

        function getByValue2( arr, value ) {
          alert( arr.length+' | '+value );

          arr.filter(function (el) {
              return el = value;
          });
        }
    }     

   /* Found it exit */
   if (event.keyCode === 13) {
      textContent = chars.join('');                        
      chars = [];
      // var data = '/getJSON/'+textContent;
      // getJSON(data);
      console.log('Do a city lookup here.............');
      // keysPressed =0;
    }    

}

var getJSON = function( data ) {
  return new Promise(function (resolve, reject) {

    var xhr = new XMLHttpRequest();
    xhr.open("get", data, true);
    xhr.responseType = "text";
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // alert( "readyState2: "+this.readyState+" | status: "+this.status )
          var resp = this.responseText;
          if ( resp ) {
            var d = resp.split(',');
            // alert('D:\n'+d);
            resolve( d )
          } else {
            reject( ['Failed........'] );
          }              
        }
    };
    xhr.send( );    
  }) // end of promise    
}


// var ages = [32, 33, 16, 40];
// function checkAdult(age) {
//     return age >= 18;
// }

// function myFunction() {
//     document.getElementById("demo").innerHTML = ages.filter(checkAdult);
// }
