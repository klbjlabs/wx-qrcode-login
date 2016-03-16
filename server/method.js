Meteor.methods({
  getUserInfo:function(url){
    //synchronous GET
    console.log('getUserInf-url', url);
    var result = HTTP.call("GET", url);
    if(result.statusCode == 200) {
      var respJson = JSON.parse(result.content);
      console.log('respIson===========', respJson);
      return respJson;
    } else {
      var errorJson = JSON.parse(result.content);
    }
  },
  getOpenIdByCode:function(code, state){
    console.log('code=============', code);
    // 如果是网页扫一扫登陆
    if (state === "webLogin") {
      appId = "xxxxxxxxxxxxxxx";
      appSecret = "xxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    }

    var getOpenIdUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appId + "&secret=" + appSecret + "&code=" + code + "&grant_type=authorization_code";
    var url = getOpenIdUrl;
    console.log('getOpenIdUrl===========', url);
    this.unblock();
    try {
      var result = HTTP.call("GET", url);
      console.log("result =============", result);
      return result;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      return "error getOpenId: " + e;
    }
  },
});
