/**
 * @copyright 2012 yayramen.
 * @author yayramen
 * @description This is the main file, which contains the inner workings. 
 */

global.Log = function(a) {
  console.log(mName, ">>>", a + ".");
};

global.mRoomId = global.mCurrentRoom = "4fb42b96df5bcf5587292adc";
global.mDBName = 'fight1';

global.mTTAPI = require("ttapi");
global.util = require("util");
global._ = require("underscore");
global.mCommandsMod = require("./commands.js");
global.mTypeCommands = require("./types/type"+mType+".js");
if (mType == 4) require("./fight.js");

Log("Connecting to couchdb");
global.nano = require('nano')('http://localhost:5984');

Log("Finding database");
nano.db.create(mDBName, function(a) { a ? Log("db found, connecting") : Log("db not found, creating")});

global.store = nano.use(mDBName);

Log("Connecting to TT");
global.mPet = new mTTAPI(mAuthId, mUserId, mRoomId);

global.mHeartBeat = null;
global.mHunger = 100;
global.mClean = 20;
global.mExp = 0;
global.mLevel = 0;
global.mFatigue = 0;
global.mMoving = null;
global.mFighting = false;
global.mCalledOut = false;
global.mBooted = false;
global.mHungry = false;
global.mLevelUpReq = 30;
global.mHP = null;
global.mCurrentHP = mHP;
global.mUsers = {};

global.OnRegistered = function(a) {
if(a.user[0].userid == mUserId) {
  mBooted ? UpdateRoom() : (BootUp(), mBooted = true)
}else {
  for(i = 0;i < a.user.length;i++) {
    mUsers[a.user[i].userid] = a.user[i].name, Log("Registering " + a.user[i].name)
  }
}
};

global.OnDeregistered = function(a) {
  a.user[0].userid == mOwner && (Log('Owner left, waiting to follow'), mStalk(mOwner, 20))
};

global.OnSpeak = function(a) {
  a.text.match(/^[!*\/]/) && HandleCommand(a.userid, a.text, false)
};

global.OnPmmed = function(a) {
  a.text.match(/^[!*\/]/) && HandleCommand(a.senderid, a.text, true)
};

global.mRandom = function(a) {
  return a[Math.floor(Math.random() * a.length)]
};

global.mSave = function(y, z) {
  store.get(mUserId, function(b, a) { if(b) { return console.log(b) }
    if(!y || !z) { a.name = mName, a.type = mType, a.exp = mExp, a.hunger = mHunger, a.level = mLevel, a.clean = mClean, a.hp = mHP }
    y && z && (a.y = z);
    store.insert(a, function(a) { if(a) { return console.log(a) }
      Log("Pet Saved");
    })
  })
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
    LevelUp();
  }, 5* 1000);
  store.get(mUserId, function(b, a) {
    if(b && "not_found" == b.error) {
      Log("Doc not found, creating");
      store.insert({name:mName, type:mType, exp:mExp, hunger:mHunger, level:mLevel, clean:mClean}, mUserId, function(a){if(a){return console.log(a)}
      Log("Pet Created");
    })}else { if(b) { return console.log(b) }
    Log("Connected to doc:");console.log(a);
    mHunger = a.hunger;mExp = a.exp;mLevel = a.level;mClean = a.clean;mHP = a.hp;
    }
  });
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
  0 === mFatigue % 120 && mPet.speak(mRandom(mIdle));
  240 == mFatigue && (mClean--, mHunger--, mFatigue = 0, mSave());
  20 > mHunger && mCall(mRandom(mHungry));
  20 > mHunger && !mHungry && (mHungry = !0, mCall(mRandom(mHungry)));
  0 == mHunger && PassOut(hunger);
  4 == mType && mCurrentHP < mHP && mCurrentHP++;
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

global.LevelUp = function(a) {
  a && (mExp += a, Log("Gained " + a + " EXP, Total: " + mExp));
  for(i = a = 0;i < mExpReq.length;i++) {
    mExp >= mExpReq[i] && (a = i + 1, mLevelUpReq = mExpReq[i+1])
  }
  Log("Pet is Level " + a);
  a > mLevel && (4 == mType && (mHP += 50), mSay(mOwner, "I've leveled up! I'm now level " + a + "!"));
  mLevel = a;
  mSave()
};

global.HandleCommand = function(d, b, e) {
  var f = b.split(" "), c = f.shift().replace(/^[!\*\/]/, ""), b = f.join(" ");
  mFighting ? mAttacks.filter(function(a) {
    return a.command && a.command == c || "object" == typeof a.command && a.command.length && -1 != a.command.indexOf(c)
  }).forEach(function(a) {
    a.level > mLevel || a.callback(d, b, e)
  }) : mCommands.filter(function(a) {
    return a.command && a.command == c || "object" == typeof a.command && a.command.length && -1 != a.command.indexOf(c)
  }).forEach(function(a) {
    if(!(a.level > mLevel) && !(e && 0 == a.mode)) {
      if("hint" == b || "help" == b) {
        return mSay(d, a.hint)
      }
      a.callback(d, b, e)
    }
  })
};

global.PassOut = function(a) {
  Log('Passed out due to ' + a);
  "hunger" == a && (mHungry = false, mHunger = 100);
  mPet.roomRegister(mRoomId);
  mCall("I've passed out from " + a + "!");
};

Log("Hooking Events");
mPet.on("registered", OnRegistered);
mPet.on("deregistered", OnDeregistered);
mPet.on("speak", OnSpeak);
mPet.on("pmmed", OnPmmed);