/**
 * @copyright 2012 yayramen.
 * @author yayramen
 * @description This is the main file, which contains the main functions. 
 */

global.mRoomId = global.mCurrentRoom = '';
global.mTTAPI = require("ttapi");
global.mLanguage = require("./text.js");
global.mCommandsMod = require("./commands.js");


global.mPet = new mTTAPI(mAuthId, mUserId, mRoomId);

global.mHeartBeat = null;
global.mHunger = 100;
global.mFatigue = 0;
global.mMoving = false;
global.mUsers = {};

mPet.on("registered", OnRegistered);
mPet.on("deregistered", OnDeregistered);

global.OnRegistered = function (a) {
	if (a.user[0].userid == mUserId) BootUp();
    for (i = 0; i < data.user.length; i++) {
		mUsers[a.user[i].userid] = a.user[i].name;
	};
};

global.OnDeregistered = function (a) {
	if (a.user[0].userid == mOwner) mStalk(mOwner);
};

global.mCall = function (a) { mPet.pm(a, mOwner); };
global.mRandom = function(a) { return a[Math.floor(Math.random() * a.length)]; };

global.mStalk = function(a) {
	mPet.stalk(mOwner, function(a) {
  		a.roomId != mCurrentRoom && void 0 !== a.roomId && (mMoving = true, setTimeout(function() {
    		bot.roomRegister(a.roomId);
    		mCurrentRoom = a.roomId
  		}, 2E4))
	});
};

global.BootUp = function () {
	mUsers = {};
	mStalk(mOwner);
	if (mMoving) return;
	mHeartBeat = setInterval(function () {
        Loop();
    }, 15 * 1000);
    mPet.roomInfo(function(a) {
    	for (i = 0; i < a.users.length; i++) {
        	mUsers[a.users[i].userid] = a.users[i].name;
        }
    });
};

global.Loop = function() {
 	mFatigue++;
  	20 == mFatigue && (mHunger--, mFatigue = 0);
  	20 > mHunger && mCall(mRandom(mHungry))
};