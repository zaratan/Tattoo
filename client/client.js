Meteor.subscribe("tentacles");
Meteor.subscribe("votes");
Meteor.subscribe("users");

Template.list.helpers({
  tentacles: function(){return Tentacles.find({}, {sort: {vote: -1, created_at: -1}})}
})

Template.tentacle.events({
  'click .upvote': function(event) {
    Template.tatoo.check_user();
    vote_up($(event.target).data('id'))
  },
  'click .downvote': function(event) {
    Template.tatoo.check_user();
    vote_down($(event.target).data('id'))
  }
});

Template.tentacle.helpers({
  label_color: function(){
    if(this.vote > 25)
      return "label-success";
    if(this.vote < 0)
      return "label-danger";
    return "label-primary"},
  arrow_color_up: function(){
    if(Meteor.user() && count_vote_user_tentacle(this._id, true) > 0)
      return "green";
    return "";
  },
  arrow_color_down: function(){
    if(Meteor.user() && count_vote_user_tentacle(this._id, false) > 0)
      return "red"
    return ""
  },
  votes: function(){
    return _.map(first_votes_for_tentacle(this._id), function(e){
      return {
        picture: e.picture,
        klass: (e.up ? "img-green" : "img-red"),
        name: user_name_by_id(e.user)
      }
    })
  }
});

Template.tatoo.check_user = function(){
    if (! Meteor.user()) {
      $('body').prepend('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Erreur!</strong> Vous devez être connecté pour réaliser cette action.</div>')
      return false;
    }
    return true;
}

Template.form.events({
  'submit .new-line-form': function (event) {
    event.preventDefault();
    var $input = $(event.target).find('[type=text]');
    if(!($input.val() && Template.tatoo.check_user())){
      return;
    }
    Meteor.call('new_tentacle',$input.val())
    $input.val('');
  }
});

Template.login.helpers({
  user: function(){return Meteor.user()}
});
