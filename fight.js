/**
 * @copyright 2012 yayramen. 
 * @author yayramen
 * @description This is where the battle functions will be held.
 * @Type: Dragon
 */

global.mOpponent = null;
global.mCooldown = false;
global.mConfTime = null;
global.mOwnConf = null;
global.mOwnTurn = false;
global.mFightTime = null;

global.mOffense = function(){
    mOwnTurn = false;
    mFightTime = setTimeout(function(){ 
        mPM(mOpponent, "/ftimedout");
        mCall('Fight Timed Out!');
        mCalledOut = null;mOpponent = null;mFighting = false;mOwnTurn = false;
    })
};

global.mDefense = function(a) {
    clearTimeout(mFightTime);
    mOwnTurn = true;
    mCurrentHP = mCurrentHP - a;
    if (mCurrentHP <= 0) return mFaint();
    mCall("It's your turn! Pick an attack!");
};

global.mFaint = function() {
    mCall('I fainted!');
    mPM(mOpponent, '/fainted '+mLevel)
    mCalledOut = null;mOpponent = null;mFighting = false;mCooldown = true;mOwnTurn = false;
    setTimeout(function(){ mCooldown = false; }, 1000 * 60 * 5);
};

global.mAttacks = [{
    command: 'attacked',
    callback: function(a,b,c){
        if (!b) return;
        var d = b.split(" ");
        mPet.speak("I got hit by "+d[0]+" for "+d[1]+" damage!");
        mDefense(d[1]);
    },
    level: 1,
    mode: 1,
    hint: 'change of information'
},
{
    command: 'ftimedout',
    callback: function(a, b, c) {
        mCall('Fight Timed Out!');
        mCalledOut = null;mOpponent = null;mFighting = false;mOwnTurn = false;
    },
    level: 1,
    mode: 1, 
    hint: 'times out'
},
{
    command: 'fainted',
    callback: function(a, b, c) {
        //some exotic function here to determine how much
        //exp you get, based on the level of the oppent,sent as b.
        //LevelUp(b);
        mCall("Opponent fainted!");
        mCalledOut = null;mOpponent = null;mFighting = false;mCooldown = true;mOwnTurn = false;
        setTimeout(function(){ mCooldown = false; }, 1000 * 60 * 5);
    }
},
{
    command: 'headbutt',
    callback: function (a,b,c) {
        if (!mOwnTurn) return mCall("It's not my turn to attack!");
        mPM(mOpponent, "/attacked headbutt 10");
        mOffense();
    },
    level: 1,
    mode: 1,
    hint: 'Makes the pet speak'
}];