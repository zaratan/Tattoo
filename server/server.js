Accounts.onCreateUser(function(options, user) {
  if (options.profile) {
    options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
    user.profile = options.profile;
  }
  return user;
});

Meteor.publish("tentacles", function() {
  return Tentacles.find();
})

Meteor.publish("votes", function() {
  return Votes.find();
})
