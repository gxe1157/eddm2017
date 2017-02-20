
alert('here at kb.js');

// credit goes to this team here -> https://github.com/wesbos/keycodes

var kCodes = {
  // 3 : "break",
  // 8 : "backspace / delete",
  // 9 : "tab",
  // 12 : 'clear',
  // 13 : "enter",
  // 16 : "shift",
  // 17 : "ctrl",
  // 18 : "alt",
  // 19 : "pause/break",
  // 20 : "caps lock",
  // 27 : "escape",
  // 32 : "spacebar",
  // 33 : "page up",
  // 34 : "page down",
  // 35 : "end",
  // 36 : "home ",
  // 37 : "left arrow ",
  // 38 : "up arrow ",
  // 39 : "right arrow",
  // 40 : "down arrow ",
  // 41 : "select",
  // 42 : "print",
  // 43 : "execute",
  // 44 : "Print Screen",
  // 45 : "insert ",
  // 46 : "delete",
  48 : "0",
  49 : "1",
  50 : "2",
  51 : "3",
  52 : "4",
  53 : "5",
  54 : "6",
  55 : "7",
  56 : "8",
  57 : "9",
  58 : ":",
  59 : "semicolon (firefox), equals",
  60 : "<",
  61 : "equals (firefox)",
  63 : "ß",
  64 : "@ (firefox)",
  65 : "a",
  66 : "b",
  67 : "c",
  68 : "d",
  69 : "e",
  70 : "f",
  71 : "g",
  72 : "h",
  73 : "i",
  74 : "j",
  75 : "k",
  76 : "l",
  77 : "m",
  78 : "n",
  79 : "o",
  80 : "p",
  81 : "q",
  82 : "r",
  83 : "s",
  84 : "t",
  85 : "u",
  86 : "v",
  87 : "w",
  88 : "x",
  89 : "y",
  90 : "z"
};


(function (kCodes) {

    function contentLoaded () {    
        var chars = [],
            noKeysPressed = 0,
            container = document.getElementById('container');

            window.addEventListener('keydown', function (event) {
                var x = event.which || e.keyCode;
                // var x = event.keyCode;

    console.log( 'keyValue', x, kCodes.hasOwnProperty( 65 ) );                    

                noKeysPressed++;                         
                if (event.keyCode !== 13) {
                    chars.push(event.key);
                    container.textContent = chars.join('');                        
                }
            }, false);

            window.addEventListener('keyup', function (event) {
                console.log('noKeysPressed', noKeysPressed);
                if (event.keyCode === 13 ) {
                    container.textContent = chars.join('');
                    chars = [];
                    noKeysPressed =0;
                   }
            }, false);
    }

    window.addEventListener('DOMContentLoaded', contentLoaded, false); 
}(kCodes));
