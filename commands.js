/**
 * @copyright 2012 yayramen. 
 * @author yayramen
 * @description This is the file that contains all the commands
 * @flags: level = level required to use command. mode = 0(chat), 1(pm), 2(both);
 */
global.mCommands = [{
    command: 'fight',
    callback: function(b, a) {
      if(4 == mType) {
        if(mCooldown) return mPM(mOwner, mCoolDownFight);
        for(i = 0;i < mUsers.length;i++) {
          mUsers[i].name == a && (mPM(mUsers[i].userid, "/reqconf"), mCalledOut = !0, mOpponent = mUsers[i].userid, mConfTime = setTimeout(function() {
            mCalledOut = false;mOpponent = null;}, 5000))
        }
      }
    },
    level: 1,
    mode: 1,
    hint: 'Makes the pet fight'
},
{
    command: 'reqconf',
    callback: function(a) {
      if(!mCalledOut && !mCooldown && !mOpponent) {
        for(i = 0;i < mUsers.length;) {
          return mUsers[i].userid == a && (mCalledOut = !0), mOpponent = a, mCall(mUsers[i].name + " wants to fight! Type /accept to fight!"), mPM(a, "/sendconf"), mOwnConf = setTimeout(function() {
            mPM(mOpponent, "/ftimedout");
            mCall("Fight Timed Out!");
            mOpponent = mCalledOut = null
          }, 15000)
        }
      };
      if (mCooldown) {mPM(a, "/cooldown")}
    },
    level: 1,
    mode: 1,
    hint: 'responds to fights'
},
{
    command: 'sendconf',
    callback: function(a,b,c){
        if (a == mOpponent) clearTimeout(mConfTime);
    },
    level: 1,
    mode: 1,
    hint: 'confirms is bot'
},
{
    command: 'cooldown',
    callback: function() {
        mCall("Oppenent is too weak to fight!");
    },
    level: 1,
    mode: 1,
    hint: 'oppenent is cooling down'
}
{
    command: 'ftimedout',
    callback: function(a, b, c) {
        mCall('Fight Timed Out!');
        mCalledOut = null;mOpponent = null;
    },
    level: 1,
    mode: 1, 
    hint: 'times out'
},
{
    command: 'accept',
    callback: function(a,b,c){
        clearTimeout(mOwnConf);
        mFighting = true;
        mOwnTurn = true;
        mPM(mOpponent, "/accepted");
        mCall("It's your turn! Pick an attack!");
        mSay(a, "Fighting!");
    },
    level: 1,
    mode: 1,
    hint: 'accept a fight'
},
{
    command: 'accepted',
    callback: function(a,b,c){
        mFighting = true;
        mSay(a, "Fighting!");
    },
    level: 1,
    mode: 1,
    hint: 'accepted'
},
{
    command: 'speak',
    callback: function (a, b, c) {
        a == mOwner && (mSay(a, mRandom(mSpeak)), LevelUp(30));
    },
    level: 0,
    mode: 0,
    hint: 'Makes the pet speak'
},
{
    command: 'stats',
    callback: function(a, b, c) {
        if (mType != 4) { b = "Level: "+mLevel+", Exp: "+mExp+"/"+mLevelUpReq+", Hunger: "+mHunger+"/100, Cleanliness: "+mClean+"/20"; }
        else { b = "Level: "+mLevel+", HP: "+mCurrentHP+"/"+mHP+", Exp: "+mExp+"/"+mLevelUpReq+", Hunger: "+mHunger+"/100, Cleanliness: "+mClean+"/20"; }
        a == mOwner && (c ? mPM(a, b) : mSay(a, b))
    },
    level: 0,
    mode: 2,
    hint: 'Tells the bots stats.'
},
{
	command: 'feed',
	callback: function (a, b, c) {
        var x = 100 - mHunger;if (x > 50) x = 50;
        100 != mHunger && a == mOwner && (mPM(a, mRandom(mFed)), mHunger += x, LevelUp(1));
	},
    level: 0,
    mode: 1,
	hint: 'help'
},
{
    command: 'clean',
    callback: function (a, b, c) {
        var x = 20 - mClean;var y = x;if (y > 15) y = 15;
        20 != mClean && a == mOwner && (mPM(a, mRandom(mBathed)),mClean += x, LevelUp(1));
    },
    level: 0,
    mode: 1,
    hint: 'help'
},
{
    command: 'come',
    callback: function (a, b, c) {
        a == mOwner && (clearTimeout(mMoving), mStalk(mOwner, 1));
    },
    level: 0,
    mode: 1,
    hint:'Summons the bot if not in the same room.'
}] 