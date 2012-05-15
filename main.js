/**
 * @copyright 2012 yayramen.
 * @author yayramen
 * @description This is the main file, which contains the inner workings. 
 */

global.Log = function(a) {
  console.log(mName, ">>>", a + ".");
};

global.mRoomId = global.mCurrentRoom = "4ec345804fe7d0727a0020a3";

global.mTTAPI = require("ttapi");
global.util = require("util");
global.mLanguage = require("./text.js");
global.mCommandsMod = require("./commands.js");
global.cradle = require("cradle");

Log("Connecting to couchdb");
global.c = new cradle.Connection({host:"localhost", port:5984, cache:true, raw:false});
Log("Finding database");
global.db = c.database("pets");
db.exists(function(a, b) {
  a ? Log("error", a) : b ? Log("db exists, using") : (Log("database does not exists."), db.create())
});

Log("Connecting to TT");
global.mPet = new mTTAPI(mAuthId, mUserId, mRoomId);

global.mHeartBeat = null;
global.mHunger = 100;
global.mExp = 0;
global.mLevel = 0;
global.mFatigue = 0;
global.mMoving = null;
global.mBooted = false;
global.mUsers = {};

global.OnRegistered = function(a) {
  a.user[0].userid == mUserId && (mBooted ? UpdateRoom() : (BootUp(), mBooted = true));
  for(i = 0;i < a.user.length;i++) {
    mUsers[a.user[i].userid] = a.user[i].name, Log("Registering " + a.user[i].name)
  }
};

global.OnDeregistered = function(a) {
  a.user[0].userid == mOwner && (Log('Owner left, waiting to follow'), mStalk(mOwner, 20))
};

global.OnSpeak = function(a) {
  a.text.match(/^[!*\/]/) && HandleCommand(a.userid, a.text)
};

global.OnPmmed = function(a) {
  a.text.match(/^[!*\/]/) && HandlePMCommand(a.senderid, a.text)
};

global.mRandom = function(a) {
  return a[Math.floor(Math.random() * a.length)]
};

global.mSave = function(x) {
  if (x) db.save(mUserId, {name:mName, type:mType, exp:mExp, hunger:mHunger, level:mLevel}, function(a) { a && console.log(a) });
  db.save(mUserId, {name:mName, type:mType, exp:mExp, hunger:mHunger, level:mLevel}, function(a) { a && console.log(a) });
  Log("Bot Saved")
};

global.BootUp = function() {
  mPet.modifyProfile({name:mName});
  mPet.modifyName(mName);
  mStalk(mOwner, 1);
  mHeartBeat = setInterval(function() {
    Loop()
  }, 15 * 1000);
  setTimeout(function(){
    mPet.roomInfo(function(a) {
      for(i = 0;i < a.users.length;i++) {
        mUsers[a.users[i].userid] = a.users[i].name, Log("Registering " + a.users[i].name)
      }
    });
  }, 5* 1000);
  db.get(mUserId, function(a, b) {
    if(a && "not_found" == a.error) {
      return Log("Doc not found, creating it"), mSave(true)
    }
    Log("Connected to doc: name:" + b.name + ", type:" + b.type + ", level:" + b.level + ", exp:" + b.exp + ", hunger:" + b.hunger);
    mHunger = b.hunger;
    mExp = b.exp;
    mLevel = b.level;
  });
  mLevelUp(mExp)
};

global.UpdateRoom = function () {
  mUsers = {};
  setTimeout(function(){
    mPet.roomInfo(function(a) {
      for(i = 0;i < a.users.length;i++) {
        mUsers[a.users[i].userid] = a.users[i].name, Log("Registering " + a.users[i].name)
      }
    });
  }, 5* 1000);  
};

global.Loop = function() {
  mFatigue++;
  240 == mFatigue && (mHunger--, mFatigue = 0);
  20 > mHunger && mCall(mRandom(mHungry))
};

global.mCall = function(a) {
  mPet.pm(a, mOwner)
};

global.mPM = function(a, b) {
  b = b.replace("{username}", mUsers[a]);
  mPet.pm(b, a)
};

global.mSay = function(a, b) {
  b = b.replace("{username}", mUsers[a]);
  mPet.speak(b)
};

global.mStalk = function(a, b) {
  mMoving = setTimeout(function() {
    mPet.stalk(a, function(a) {
      void 0 === a.roomId && mPet.roomRegister(mRoomId);
      a.roomId != mCurrentRoom && void 0 !== a.roomId && (Log("Going to owner"), mPet.roomRegister(a.roomId), mCurrentRoom = a.roomId)
    })
  }, b * 1000)
};

global.mExpReq = [30, 100, 220, 550, 800, 1100, 1400, 1700, 2000, 2500, 3000, 3500, 4200, 5000, 5900, 6800, 7800, 9000, 10000, 15000];

global.mLevelUp = function(a) {
  var b = 0;
  for(i = 0;i < mExpReq.length;i++) {
    a >= mExpReq[i] && (b = i + 1)
  }
  Log("Pet is Level " + b);
  if (b > mLevel) mSay(mOwner, "I've leveled up! I'm now level " + b + "!")
  mLevel = b;
  mSave();
};

global.HandleCommand = function(a, b) {
  var d = b.split(" "), e = d.shift().replace(/^[!\*\/]/, ""), b = d.join(" ");
  mCommands.filter(function(a) {
    return a.command && a.command == e || "object" == typeof a.command && a.command.length && -1 != a.command.indexOf(e)
  }).forEach(function(f) {
    if("hint" == b || "help" == b) {
      return mSay(a, f.hint)
    }
    f.callback(a, b)
  })
};

global.HandlePMCommand = function(a, b) {
  var d = b.split(" "), e = d.shift().replace(/^[!\*\/]/, ""), b = d.join(" ");
  mPMCommands.filter(function(a) {
    return a.command && a.command == e || "object" == typeof a.command && a.command.length && -1 != a.command.indexOf(e)
  }).forEach(function(d) {
    if("hint" == b || "help" == b) {
      return mSay(a, d.hint)
    }
    d.callback(a, b)
  })
};

Log("Hooking Events");
mPet.on("registered", OnRegistered);
mPet.on("deregistered", OnDeregistered);
mPet.on("speak", OnSpeak);
mPet.on("pmmed", OnPmmed);