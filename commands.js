/**
 * @copyright 2012 yayramen. 
 * @author yayramen
 * @description This is the file that contains all the commands
 */
global.mCommands = [{
    command: 'speak',
    callback: function (a, b) {
        a == mOwner && (mSay(a, mRandom(mSpeak)), mExp += 30, Log("Gained 15 EXP. Total EXP: " + mExp), mLevelUp(mExp));
    },
    hint: 'Makes the pet speak'
},
{
    command: 'stats',
    callback: function (a, b) {
        var c = 30;for(i = 0;i < mExpReq.length;i++) {mExp >= mExpReq[i] && (c = mExpReq[i+1])};
        a == mOwner && mSay(a, "Level: "+mLevel+", Exp: "+mExp+"/"+c+", Hunger: "+mHunger+"/100, Cleanliness: "+mClean+"/20");
    },
    hint: 'Tells the bots stats.'
}];

global.mPMCommands = [{
	command: 'feed',
	callback: function (a, b) {
        var x = 200 - mHunger;var y = x;if (x > 50) y = 50;
        a == mOwner && (mSay(a, mRandom(mFed)),mHunger += y, mExp += 1, Log("Gained 1 EXP. Total EXP: " + mExp), mLevelUp(mExp));
	},
	hint: 'help'
},
{
    command: 'clean',
    callback: function (a, b) {
        var x = 20 - mClean;var y = x;if (y > 15) y = 15;
        a == mOwner && (mSay(a, mRandom(mBathed)),mClean += y, mExp += 1, Log("Gained 1 EXP. Total EXP: " + mExp), mLevelUp(mExp));
    },
    hint: 'help'
},
{
    command: 'come',
    callback: function (a, b) {
        a == mOwner && (clearTimeout(mMoving), mStalk(mOwner, 1));
    },
    hint:'Summons the bot if not in the same room.'
}] 