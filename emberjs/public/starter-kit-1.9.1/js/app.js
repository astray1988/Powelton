window.Github = Ember.Application.create({
  rootElement: "#github-app",
  LOG_TRANSITIONS:true
});

Github.Router.map(function() {
  this.resource("user",{path:"/users/:login"},function(){
    this.resource("repositories");
    this.resource("repository",{path:"repositories/:name"},function(){
      this.resource("issues");
      this.resource("forks");
      this.resource("commits");
      this.route("newissue");
    });
  });
});

Github.IndexRoute = Ember.Route.extend({
  model: function() {
    return Ember.$.getJSON("https://api.github.com/users/robconery/followers");
  }
});

Github.UserRoute = Ember.Route.extend({
  model:function(params){
    return Ember.$.getJSON("https://api.github.com/users/" + params.login);
  }
});

Github.UserIndexRoute = Ember.Route.extend({
  model:function(){
    return this.modelFor('user');
    console.log(user);
  }
});

Github.RepositoriesRoute = Ember.Route.extend({
  model:function(){
    var user = this.modelFor("user");
    return Ember.$.getJSON(user.repos_url);
  }
});



Github.RepositoryRoute = Ember.Route.extend({
  model:function(params){
    var user = this.modelFor("user");
    //build the URL for the Repo call manually
    var url = "https://api.github.com/repos/" + user.login + "/" + params.name ;
    return Ember.$.getJSON(url);
  }
});

Github.RepositoryController = Ember.ObjectController.extend({
  needs:["user"],
  user:Ember.computed.alias("controllers.user"),
  forked: Ember.computed.alias("fork")
});

Github.IssuesRoute = Ember.Route.extend({
  model:function(){
    var repo = this.modelFor("repository");
    var url = repo.issues_url.replace("{/number}","");
    return Ember.$.getJSON(url);
  }
});

Github.ForksRoute = Ember.Route.extend({
  model:function(){
    var repo = this.modelFor("repository");
    return Ember.$.getJSON(repo.forks_url);
  }
});

Github.CommitsRoute = Ember.Route.extend({
  model:function(){
    var repo = this.modelFor("repository");
    var url = repo.commits_url.replace("{/sha}","");
    return Ember.$.getJSON(url);
  }
});

Github.RepositoriesController = Ember.ArrayController.extend({
  needs:["user"],
  user: Ember.computed.alias("controllers.user")
});

Github.RepositoryNewissueController = Ember.ObjectController.extend({
  needs:["repository"],
  repo:Ember.computed.alias("controllers.repository"),
  issue:function(){
    return Github.Issue.create();
  }.property("repo.model"), // whenever 'repo' changes, force new issue be created.
  actions:{
    submitIssue:function(){
      //var title = $("#new-issue-title").val();
      //var body = $("#new-issue-body").val();
      //var vals = this.getProperties("title","body")
      //console.log(vals);
      // POST issue_url
      var issue = this.get("issue"); // pull issue off
      var url = this.get("repo").get("issue_url");
      //Ember.$.post(url,{title:title,body:body},function(result) {
      //  //success...
      //  this.transitionToRoute("issues");
      //  alert("Issue submitted");
      //});
      console.log("Submitted " + issue.get("title") + " to " + url);
      //reset the new issue form after submitted.
      this.set("issue",Github.Issue.create());
      this.transitionToRoute("issues");
    }
  }
});

// create an issue object
Github.Issue = Ember.Object.extend({
  title: "",
  body:"",
  isValid:function(){
    // do some validations..
    return true;
  }
});

Ember.Handlebars.registerBoundHelper('fromDate',function(theDate){
  var today = moment();
  var target = moment(theDate);
  return target.from(today);
});
