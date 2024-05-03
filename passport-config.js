
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');



 function initialize(passport, GetUserByEmail, GetUserById){

    const authenticateUser = async (email, password, done) =>{

       const user = GetUserByEmail(email); 

       if(user == null){
        return done(null, false, {message: 'no user with that email'});
       }

       try {
        if(await bcrypt.compare(password, user.password)){
            return done(null, user);
        }else{
            return done(null, false, {message: 'Password incorrect'});
        }
       } catch (error) {
           return done(error)
       }
    } 

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
       return done(null, GetUserById(id))  
    })

}

module.exports = initialize;