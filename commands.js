/**
 * @copyright 2012 yayramen. 
 * @author yayramen
 * @description This is the file that contains all the commands
 */
global.mCommands = [{
    command: 'speak',
    callback: function (a, b) {
        a == mOwner && (mSay(a, mRandom(mSpeak)), LevelUp(30));
    },
    level: 0,
    hint: 'Makes the pet speak'
},
{
    command: 'stats',
    callback: function (a, b) {
        var c = 30;for(i = 0;i < mExpReq.length;i++) {mExp >= mExpReq[i] && (c = mExpReq[i+1])};
        a == mOwner && mSay(a, "Level: "+mLevel+", Exp: "+mExp+"/"+c+", Hunger: "+mHunger+"/100, Cleanliness: "+mClean+"/20");
    },
    level: 0,
    hint: 'Tells the bots stats.'
}];

global.mPMCommands = [{
	command: 'feed',
	callback: function (a, b) {
        var x = 100 - mHunger;if (x > 50) x = 50;
        100 != mHunger && a == mOwner && (mPM(a, mRandom(mFed)), mHunger += x, LevelUp(1));
	},
    level: 0,
	hint: 'help'
},
{
    command: 'clean',
    callback: function (a, b) {
        var x = 20 - mClean;var y = x;if (y > 15) y = 15;
        20 != mClean && a == mOwner && (mPM(a, mRandom(mBathed)),mClean += x, LevelUp(1));
    },
    level: 0,
    hint: 'help'
},
{
    command: 'stats',
    callback: function (a, b) {
        a == mOwner && mPM(a, "Level: "+mLevel+", Exp: "+mExp+"/"+mLevelUpReq+", Hunger: "+mHunger+"/100, Cleanliness: "+mClean+"/20");
    },
    level: 0,
    hint: 'Tells the bots stats.'
},
{
    command: 'come',
    callback: function (a, b) {
        a == mOwner && (clearTimeout(mMoving), mStalk(mOwner, 1));
    },
    level: 0,
    hint:'Summons the bot if not in the same room.'
}] 