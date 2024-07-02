const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const CRUDModel = require("./Schema/CRUDSchema")
const bcrypt = require("bcrypt")

/// Authentication login
passport.use(
  new localStrategy(async (username, password, done) => {
    try {
      console.log("Login credentials", username, password);
      const admin = await CRUDModel.findOne({ email: username });
      console.log(admin);

      if (!admin) {
        return done((null, false, { message: "incorrect username" }));
      }
      
        const passwordMatch = await bcrypt.compare(password, admin.password);
        console.log(passwordMatch);

        if (!passwordMatch) {
          return done(null, false, { message: "Incorrect password" });
        } else {
          return done(null, admin); 
      }
    } catch (error) {
      return done(error);
    }
  })
);

module.exports = passport;