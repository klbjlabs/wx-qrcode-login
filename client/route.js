Meteor.loginWithWechat = function(profileObject, callback) {
  var loginRequest = {
    // 用户 unionid 作为 username，防止冲突情况出现
    username: profileObject.unionid,
    openid: profileObject.openid,
    profile: profileObject,
    loginMethod: "WECHAT",
  };
  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback: callback
  });
};


Router.route('/wechatLogin', {
  waitOn: function() {

  },
  data: function() {

  },
  action: function() {
    var code = this.params.query.code;
    var state = this.params.query.state;
    console.log('code', code);
    console.log('state', state);
    Meteor.call("getOpenIdByCode", code, state, function(e, r) {
      var jsonContent = JSON.parse(r.content);
      var accessToken = jsonContent.access_token;
      var openid = jsonContent.openid;
      var url = "https://api.weixin.qq.com/sns/userinfo?access_token=" +
                accessToken + "&openid=" + openid;
      Meteor.call('getUserInfo', url, function(e, r) {
        if(r) {
          Meteor.loginWithWechat(r, function() {

            console.log("state :", state);
            Meteor.call("printLog", "state :", state);

            if (state == "profile") {
              Router.go('/profile');
            }
            // if (state == "activityNew") {
            //   Router.go('/activities/new');
            // }
            if (state === "index" || state === "webLogin") {
              Router.go('/instances');
            }
            // if (state.indexOf("/activities") >= 0) {
            //   Router.go(state);
            // }
            // if (state.indexOf("/registration") >= 0) {
            //   Router.go(state);
            // }
          });
        }
      });
    });
  },
  name: 'wechatLogin'
});
