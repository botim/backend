import passport from 'passport';
import TwitterStrategy from 'passport-twitter';
import { Router } from 'express';

const routes = Router();

let trustProxy = false;
if (process.env.DYNO) {
  // apps on Heroku are behind a trusted proxy
  trustProxy = true;
}

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: '/auth/twitter/callback',
      proxy: trustProxy
    },
    function(token, tokenSecret, profile, cb) {
      User.findOrCreate({ twitterId: profile.id }, function(err, user) {
        return cb(err, user);
      });
    }
  )
);

// In order to restore authentication state across requests, Passport needs
// to serialize users into and deserialize users out of the session. This would
// typically be as simple as supplying the user ID when serializing,
// and querying the user record by ID from the database when deserializing.
// However, for now we are not storing the users in our db so
// the complete Twitter profile is serialized and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

routes.get('/auth/twitter', passport.authenticate('twitter'));

routes.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(
  req,
  res
) {
  // successful authentication, redirect home.
  res.redirect('/');
});

export { routes as auth };
