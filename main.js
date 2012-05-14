/**
 * @copyright 2012 yayramen.
 * @author yayramen
 * @description This is the main file, which contains the inner workings. 
 */

global.mRoomId = global.mCurrentRoom = "";

global.mTTAPI = require("ttapi");
global.mLanguage = require("./text.js");
global.mCommandsMod = require("./commands.js");

global.mPet = new mTTAPI(mAuthId, mUserId, mRoomId);

global.mHeartBeat = null;
global.mHunger = 100;
global.mFatigue = 0;
global.mMoving = !1;
global.mUsers = {};

mPet.on("registered", OnRegistered);
mPet.on("deregistered", OnDeregistered);

global.OnRegistered = function(a) {
  a.user[0].userid == mUserId && BootUp();
  for(i = 0;i < data.user.length;i++) {
    mUsers[a.user[i].userid] = a.user[i].name
  }
};

global.OnDeregistered = function(a) {
  a.user[0].userid == mOwner && mStalk(mOwner)
};

global.OnSpeak = function(a) {
  a.text.match(/^[!*\/]/) && HandleCommand(mUser[a.userid], a.text)
};

global.mRandom = function(a) {
  return a[Math.floor(Math.random() * a.length)]
};

global.BootUp = function() {
  mUsers = {};
  mStalk(mOwner);
  mMoving || (mHeartBeat = setInterval(function() {
    Loop()
  }, 15E3), mPet.roomInfo(function(a) {
    for(i = 0;i < a.users.length;i++) {
      mUsers[a.users[i].userid] = a.users[i].name
    }
  }))
};

global.Loop = function() {
  mFatigue++;
  50 == mFatigue && (mHunger--, mFatigue = 0);
  20 > mHunger && mCall(mRandom(mHungry))
};

global.mCall = function(a) {
  mPet.pm(a, mOwner)
};

global.mSay = function(a, b) {
  b.indexOf("{username}") && (b = b.replace("{username}", mUsers[a]));
  mPet.speak(b)
};

global.mStalk = function() {
  mPet.stalk(mOwner, function(a) {
    a.roomId != mCurrentRoom && void 0 !== a.roomId && (mMoving = !0, setTimeout(function() {
      bot.roomRegister(a.roomId);
      mCurrentRoom = a.roomId
    }, 2E4))
  })
};

global.HandleCommand = function(a, b) {
  var c = b.split(" "), d = c.shift().replace(/^[!\*\/]/, ""), b = c.join(" ");
  mCommands.filter(function(a) {
    return a.command && a.command == d || "object" == typeof a.command && a.command.length && -1 != a.command.indexOf(d)
  }).forEach(function(c) {
    if("hint" == pText || "help" == pText) {
      return mSay(a, c.hint)
    }
    c.callback(a, b)
  })
};