/**
 * @copyright 2012 yayramen. 
 * @author yayramen
 * @description This is the file that contains all the commands
 * @flags: level = level required to use command. mode = 0(chat), 1(pm), 2(both);
 */
global.mCommands = [{
    command: 'fight',
    callback: function(a, b, c) {
      //if type = 4, cycle through names (b). If b exists, pm b a message to fight
      //if b is bot, b will pm its owner if it wants to fight or not, if yes, fight starts
    },
    level: 1,
    mode: 1,
    hint: 'Makes the pet speak'
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