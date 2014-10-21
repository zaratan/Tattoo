Tentacles = new Mongo.Collection("tentacles");

Tentacles.allow({
  update: function(){return false;},
  insert: function(){return false;}
});

Votes = new Mongo.Collection("votes");

Votes.allow({
  insert: function(){return false;},
  remove: function(){return false;}
});

Meteor.users.allow({
});

count_vote_user_tentacle = function(tentacle_id, up) {
  return Votes.find({user: Meteor.user()._id, up: up, tentacle_id: tentacle_id}).count()
}

vote_down = function(id) {
  return Meteor.call('vote', id, false)
}

vote_up = function(id) {
  return Meteor.call('vote', id, true)
}

first_votes_for_tentacle = function(tentacle_id) {
  return Votes.find({tentacle_id: tentacle_id},{limit: 10, sort: {created_at: -1}}).fetch()
}

user_name_by_id = function(id) {
  return Meteor.users.findOne(id).profile.name;
}

Meteor.methods({
  new_tentacle: function(text){
    check(Meteor.user(), Object);
    check(text, String)
    tentacle = Tentacles.insert({
      text: text,
      vote: 0,
      created_at: new Date(),
      created_by: Meteor.user()._id    
    });
  },
  vote: function(id, up){
    var inc = up ? 1 : -1
    check(Meteor.user(), Object);
    if(count_vote_user_tentacle(id, up) === 0) {
      Tentacles.update(id, {$inc: {vote: inc}});
      if(count_vote_user_tentacle(id, !up))
        Tentacles.update(id, {$inc: {vote: inc}});
      Votes.remove({user: Meteor.user()._id, tentacle_id: id})
      Votes.insert({
        tentacle_id: id,
        user: Meteor.user()._id,
        picture: Meteor.user().profile.picture,
        up: up,
        created_at: new Date()
      });
    }
    else
    {
      Votes.remove({user: Meteor.user()._id, tentacle_id: id})
      Tentacles.update(id, {$inc: {vote: -inc}});
    }
  }})
