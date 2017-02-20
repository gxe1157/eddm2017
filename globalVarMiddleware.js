
module.exports =  middleware = {

    myHelpers: function(req, res, next){
        res.locals = ({
            todayIs     : new Date(),
            getDate     : function(){ return new Date().toLocaleDateString();},
            isObjEmpty  : function(obj){ return ( Object.keys(obj).length === 0 && obj.constructor === Object  );},
            removeSpaces: function(str){ return str.replace(/\s/g, ''); }, 
            spacer      : function( x ){ for(var i=0; i < x; i++ ) console.log( '_\n' );}            
        });
        next();
    }
};

// app.use(middleware.globalLocals);
// app.get('/', middleware.index, middleware.render('home'));
