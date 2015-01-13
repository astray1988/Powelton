UserAdmin = Ember.Application.create({
    rootElement : "#user-admin-app",
    LOG_TRANSITIONS:true
});

UserAdmin.Router.map(function(){
    this.resource("users");
    this.resource("user",{path: "users/:username"});
});

//UserAdmin.UsersRoute({
//
//});