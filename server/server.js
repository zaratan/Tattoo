Accounts.onCreateUser(function(options, user) {
  if (options.profile) {
    if(user.services.facebook){
      options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
    }
    if(user.services.google){
      options.profile.picture = user.services.google.picture
    }
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
