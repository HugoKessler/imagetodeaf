const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { secret } = require("./config");
const { capture } = require("./sentry");

// load up the user model
const User = require("./models/user");

function getToken(req) {
  let token = ExtractJwt.fromAuthHeaderWithScheme("JWT")(req);
  if (!token) token = req.cookies.jwt;
  return token;
}

module.exports = function (app) {
  const opts = {};
  opts.jwtFromRequest = getToken;
  opts.secretOrKey = secret;

  passport.use(
    "user",
    new JwtStrategy(opts, async function (jwtPayload, done) {
      try {
        const user = await User.findOne({ _id: jwtPayload._id });
        if (user) return done(null, user);
      } catch (error) {
        capture(error);
      }
      return done(null, false);
    })
  );

  passport.use(
    "admin",
    new JwtStrategy(opts, async function (jwtPayload, done) {
      try {
        const user = await User.findOne({ _id: jwtPayload._id });
        if (user && user.role === "admin") return done(null, user);
      } catch (error) {
        capture(error);
      }
      return done(null, false);
    })
  );

  app.use(passport.initialize());
};
