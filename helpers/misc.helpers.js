const constants = require('../constants');
module.exports = (hbs) => {
    
    hbs.registerHelper('json', function(context){
        return JSON.stringify(context);
    });
    
    hbs.registerHelper('datetime', function(date) { // las fechas las querre poner bonitas
        let objFecha = new Date(date);        
        let opcionesFecha = {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
        let fechaFormateada = objFecha.toLocaleString('en-GB', opcionesFecha);
        
        return date ? fechaFormateada : undefined;// si no recibe fecha el helper da undefined
    });
    
    hbs.registerHelper('isAdmin', (context, options) =>{        
        if (context.role === constants.user.ADMIN) {            
            return options.fn(this);
        } else{            
            return options.inverse(this);
        }
    });
    
    hbs.registerHelper('sliptLastname', (context, options) =>{        
        return context.charAt(0).toUpperCase() + '.';
    });
    
    hbs.registerHelper('upperCase', (context, options) =>{        
        return context.toUpperCase();  
    });
    
    hbs.registerHelper('isOwneredByOwnSession', function(user, session, options){
        if (user.id == session._id || session.role === constants.user.ADMIN) {                        
            return options.fn(this);
        } else{                                    
            return options.inverse(this);
        }
    });

    hbs.registerHelper('isNotFriend', function(user, session, friendships, options){
        const isMyFriend = friendships.some((friendship) => {
            return (
                friendship.owner.toString() === user._id.toString() || friendship.receiver.toString() === user._id.toString()
            );
        });

        if (!isMyFriend) {
            return options.fn(this);
        } else{                                    
            return options.inverse(this);
        }
    });
    
    
    hbs.registerHelper('isNotMe', function(owner, session, receiver, statusFriendship ,options) {
        
        if (statusFriendship.status === 'PENDING') {
            if (owner._id.equals(session._id)) {
                return options.fn(this);
            } else{            
                return options.inverse(this);
            }
        }
    });
    
};

