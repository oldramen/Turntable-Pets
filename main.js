/**
 * @copyright 2012 yayramen.
 * @author yayramen
 * @description This is the main file, which contains the inner workings. 
 */

global.mRoomId = global.mCurrentRoom = "4ec345804fe7d0727a0020a3";

global.mTTAPI = require("ttapi");
global.util = require('util');
global.mLanguage = require("./text.js");
global.mCommandsMod = require("./commands.js");

global.cradle = require('cradle');
console.log('Connecting to couchdb');
global.c = new(cradle.Connection)({
  host: 'localhost',
  port: 5984,
  cache: true,
  raw: false
});
console.log('Finding database');
global.db = c.database('pets');

db.exists(function(a, b) {
  a ? console.log("error", a) : b ? console.log("db exists, using") : (console.log("database does not exists."), db.create())
});

console.log('Connecting to TT');
global.mPet = new mTTAPI(mAuthId, mUserId, mRoomId);

global.mHeartBeat = null;
global.mHunger = 100;
global.mExp = 0;
global.mFatigue = 0;
global.mMoving = false;
global.mUsers = {};

global.OnRegistered = function(a) {
  a.user[0].userid == mUserId && BootUp();
  for(i = 0;i < a.user.length;i++) {
    mUsers[a.user[i].userid] = a.user[i].name
    console.log('Registering '+a.user[i].name)
  }
};

global.OnDeregistered = function(a) {
  a.user[0].userid == mOwner && mStalk(mOwner)
};

global.OnSpeak = function(a) {
  a.text.match(/^[!*\/]/) && HandleCommand(mUsers[a.userid], a.text)
};

global.mRandom = function(a) {
  return a[Math.floor(Math.random() * a.length)]
};

global.BootUp = function() {
  mUsers = {};
  mMoving = false;
  mPet.modifyProfile({ name: mName });
  mPet.modifyName(mName);
  mStalk(mOwner);
  mMoving || (mHeartBeat = setInterval(function() {
    Loop()
  }, 15E3), mPet.roomInfo(function(a) {
    for(i = 0;i < a.users.length;i++) {
      mUsers[a.users[i].userid] = a.users[i].name
      console.log('Registering '+a.users[i].name)
    }
  }))
  db.get(mUserId, function(b, a) {
  if(b && "not_found" == b.error) {
    return console.log("Doc not found for this pet, creating it"), db.save(mUserId, {name:mName, type:mType, exp:0, hunger:100}, function(a) {
      a && console.log(a)
    })
  }
  console.log("Connected to doc: name:" + a.name + ", type:" + a.type + ", exp:" + a.exp + ", hunger:" + a.hunger);
  mHunger = a.hunger;
  mExp = a.exp
});
};

global.Loop = function() {
  mFatigue++;
  240 == mFatigue && (mHunger--, mFatigue = 0); //Drop one hunger per hour.
  20 > mHunger && mCall(mRandom(mHungry))
};

global.mCall = function(a) {
  mPet.pm(a, mOwner)
};

global.mSay = function(a, b) {
  b = b.replace("{username}", a);
  mPet.speak(b);
};

global.mStalk = function() {
  mPet.stalk(mOwner, function(a) {
    void 0 === a.roomId && mPet.roomRegister(mRoomId);
    a.roomId != mCurrentRoom && void 0 !== a.roomId && (mMoving = true, setTimeout(function() {
      mPet.roomRegister(a.roomId);
      mCurrentRoom = a.roomId
    }, 2E4))
  })
};

global.HandleCommand = function(a, b) {
  var c = b.split(" "), d = c.shift().replace(/^[!\*\/]/, ""), b = c.join(" ");
  mCommands.filter(function(e) {
    return e.command && e.command == d || "object" == typeof e.command && e.command.length && -1 != e.command.indexOf(d)
  }).forEach(function(f) {
    if("hint" == b || "help" == b) {
      return mSay(a, f.hint)
    }
    f.callback(a, b)
  })
};

console.log('Hooking Events');
mPet.on("registered", OnRegistered);
mPet.on("deregistered", OnDeregistered);
mPet.on("speak", OnSpeak);