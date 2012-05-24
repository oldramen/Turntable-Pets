/**
 * @copyright 2012 yayramen.
 * @author yayramen
 * @description This is the main file, which contains the inner workings. 
 */

global.Log = function(a) {
  console.log(mName, ">>>", a + ".");
};

global.mRoomId = global.mCurrentRoom = "4fb42b96df5bcf5587292adc";
global.mDBName = 'fight33';

global.mTTAPI = require("ttapi");
global.util = require("util");
global._ = require("underscore");
global.mCommandsMod = require("./commands.js");
if (mType > 3) require("./fight.js");
global.mTypeCommands = require("./types/type"+mType+".js");


Log("Connecting to couchdb");
global.nano = require('nano')('http://localhost:5984');

Log("Finding database");
nano.db.create(mDBName, function(a) { a ? Log("Db found, connecting") : Log("Db not found, creating")});

global.store = nano.use(mDBName);

Log("Connecting to TT");
global.mPet = new mTTAPI(mAuthId, mUserId, mRoomId);

global.mFirstRun = false;
global.mHeartBeat = null;
global.mHunger = 100;
global.mClean = 20;
global.mExp = 0;
global.mLevel = 0;
global.mFatigue = 0;
global.mMoving = null;
global.mArena = false;
global.mFighting = false;
global.mWins = 0;
global.mLosses = 0;
global.CalledOut = false;
global.mBooted = false;
global.mHungry = false;
global.mLevelUpReq = 30;
global.mHP = null;
global.mCurrentHP = mHP;
global.mStay = false;
global.mUsers = [];
global.gameMasters = ['4e0ff328a3f751670a084ba6'];
global.mLearned = ['headbutt', 'scratch', 'tackle'];

global.OnRegistered = function(a) {
  if(a.user[0].userid == mUserId) {
    mBooted ? UpdateRoom() : (BootUp(), mBooted = true)
  }else {
    for(i = 0;i < a.user.length;i++) {
      mUsers.push({userid: a.user[i].userid, name: a.user[i].name}), Log("Registering " + a.user[i].name)
    }
  }
  150 < mUsers.length && (Call("Too many people, hiding in the playpen"), mPet.roomRegister(mRoomId));
};

global.OnDeregistered = function(a) {
  a.user[0].userid == mOwner && (Log('Owner left, waiting to follow'), Stalk(mOwner, 20))
  for(i = 0;i < mUsers.length;i++) {
    mUsers[i].userid == a.user[0].userid && (mUsers.splice(mUsers.indexOf(mUsers[i]), 1), Log("Deregistering " + a.user[0].name));
  }
};

global.OnSpeak = function(a) {
  a.text.match(/^[!*\/]/) && HandleCommand(a.userid, a.text, false)
};

global.OnPmmed = function(a) {
  a.text.match(/^[!*\/]/) && HandleCommand(a.senderid, a.text, true), console.log("PM: "+a.text)
};

global.isMaster = function(a) {
  if (gameMasters.indexOf(a) != -1) return true;
  return false;
};

global.aboutMe = function(a){
  if (b == '@'+mName) return true;
  return false;
};

global.isLearned = function(a){
  var b = ['attacked', 'stats', 'ftimedout', 'fainted', 'attack', 'potion'];
  if (mLearned.indexOf(a) != -1) return true;
  if (b.indexOf(a) != -1) return true;
  return false;
};

global.Random = function(a) {
  return a[Math.floor(Math.random() * a.length)]
};

global.Save = function(y, z) {
  store.get(mUserId, function(b, a) { if(b) { return console.log(b) }
    if(!y || !z) {
      a.name = mName, a.type = mType, a.exp = mExp, a.hunger = mHunger,
      a.level = mLevel, a.clean = mClean, a.hp = mCurrentHP, a.mhp = mHP,
      a.wins = mWins, a.losses = mLosses, a.learned = mLearned, a.pots = mPotions
    }
    y && z && (eval("a." + y + " = " + z), Log(a.y + " = " + z));
    store.insert(a, function(a) { if(a) { return console.log(a) }
      Log("Pet Saved");
    })
  })
};

global.BootUp = function() {
  mPet.modifyProfile({name:mName});
  mPet.modifyName(mName);
  mPet.userInfo(function(a){ mName = a.name});
  Stalk(mOwner, 1);
  mHeartBeat = setInterval(function() {
    Loop()
  }, 15 * 1000);
  setTimeout(function(){
    mPet.roomInfo(function(a) {
      for(i = 0;i < a.users.length;i++) {
        mUsers.push({userid: a.users[i].userid, name: a.users[i].name});
        Log("Registering " + a.users[i].name);
      };
    });
    LevelUp();
  }, 5*1000);
  store.get(mUserId, function(b, a) {
    if(b && "not_found" == b.error) { return Create(); }else { if(b) { return console.log(b) }
      Log("Connected to doc:");console.log(a);
      mHunger = a.hunger;mExp = a.exp;mLevel = a.level;mClean = a.clean;mCurrentHP = a.hp;
      mHP = a.mhp;mWins = a.wins;mLosses = a.losses;mLearned = a.learned;mPotions = a.pots
    }
  });
  store.get('users', function(b, a) {
    if(b) { return console.log(b) }
    a[mUserId] = {name:mName, type:mType, variant:mVar};
    store.insert(a, 'users', function(a){if(a){return console.log(a)} Log("Updated users db")});
  });
};

global.Create = function() {
  store.get(mUserId, function(b, a) {
    if(b && "not_found" == b.error) {
      Log("Doc not found, creating");
      var doc = {name:mName, type:mType, exp:mExp, hunger:mHunger, level:mLevel, clean:mClean};
      store.insert(doc, mUserId, function(a){if(a){return console.log(a)}
      Log("Pet Created");
    })}else { if(b) { return console.log(b) }
      Log("Connected to doc:");console.log(a);
      mHunger = a.hunger;mExp = a.exp;mLevel = a.level;mClean = a.clean;mCurrentHP = a.hp;
      mHP = a.mhp;mWins = a.wins;mLosses = a.losses;mLearned = a.learned;
    }
  });
  store.get('users', function(b, a) {
    if(b && "not_found" == b.error) {
      Log("Users doc not found, creating");
      var doc = {};doc[mUserId] = {name:mName, type:mType, variant:mVar};
      store.insert(doc, 'users', function(a){if(a){return console.log(a)}
      Log("Users doc Created");
    })}else { if(b) { return console.log(b) }
      a[mUserId] = {name:mName, type:mType, variant:mVar};
      store.insert(a, 'users', function(a){if(a){return console.log(a)}});
    }
  });
};

global.UpdateRoom = function () {
  mUsers = [];
  setTimeout(function(){
    mPet.roomInfo(function(a) {
      for(i = 0;i < a.users.length;i++) {
        mUsers.push({userid: a.users[i].userid, name: a.users[i].name}), Log("Registering " + a.users[i].name), mCurrentRoom = a.room.roomid;
      }
    });
  }, 5* 1000);  
};

global.Loop = function() {
  mFatigue++;
  0 === mFatigue % 120 && mPet.speak(Random(mIdle));
  240 == mFatigue && (mClean--, mHunger--, mFatigue = 0, Save());
  20 > mHunger && Call(Random(mHungry));
  20 > mHunger && !mHungry && (mHungry = !0, Call(Random(mHungry)));
  0 == mHunger && PassOut(hunger);
  3 < mType && mLevel > 0 && mCurrentHP < mHP && mCurrentHP++;
};

global.Call = function(a) {
  mPet.pm(a, mOwner)
};

global.PM = function(a, b) {
  b = b.replace("{username}", mUsers[a]);
  mPet.pm(b, a);
  console.log("Sent: "+b);
};

global.Say = function(a, b) {
  b = b.replace("{username}", mUsers[a]);
  mPet.speak(b)
};

global.Stalk = function(a, b) {
  if (mStay) return;
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
  if (a > mLevel) {
    if (mType > 3) { 
      mHP += 50;
      mPotions += 3;
      mCurrentHP = mHP;
    }
    Say(mOwner, "I've leveled up! I'm now level " + a + "!"); 
    getNewCommands(a, mType);
    mLevel = a;
  }
  Save()
};

global.getNewCommands = function(b, e) {
  var c = [];
  mCommands.forEach(function(a) {
    b == a.level && !a.hidden && c.push(a.command)
  });
  0 < c.length && Call("New Actions: /{cmds}".replace("{cmds}", c.join(", /")));
  if(3 < e && 1 < b) {
    var d = [];
    mAttacks.forEach(function(a) {
      b == a.level && !a.hidden && (d.push(a.command), console.log(a.command))
    });
    0 < d.length && (Call("Pick a new attack to learn with /learn: {attacks}".replace("{attacks}", d.join(", "))), mCanLearn = true)
  }
};

global.HandleCommand = function(d, c, f) {
  if(c.match(/^[!\*\/]/)) {
    var g = c.split(" "), e = g.shift().replace(/^[!\*\/]/, "").toLowerCase(), c = g.join(" ");
    mFighting ? mAttacks.filter(function(b) {
      return b.command && b.command == e || "object" == typeof b.command && b.command.length && -1 != b.command.indexOf(e)
    }).forEach(function(b) {
      if("hint" == c || "help" == c) { return Say(d, b.hint) }
      mLevel >= b.level && (isLearned(b.command)) && b.callback(d, c, f)
    }) : mCommands.filter(function(b) {
      return b.command && b.command == e || "object" == typeof b.command && b.command.length && -1 != b.command.indexOf(e)
    }).forEach(function(b) {
      if("hint" == c || "help" == c) { return Say(d, b.hint) }
      mLevel >= b.level && !(f && 0 == b.mode) && !(b.owner && d != mOwner) && b.callback(d, c, f)
    })
  }
};

global.PassOut = function(a) {
  Log('Passed out due to ' + a);
  "hunger" == a && (mHungry = false, mHunger = 100);
  mPet.roomRegister(mRoomId);
  Call("I've passed out from " + a + "!");
};

Log("Hooking Events");
mPet.on("registered", OnRegistered);
mPet.on("deregistered", OnDeregistered);
mPet.on("speak", OnSpeak);
mPet.on("pmmed", OnPmmed);