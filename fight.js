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
    }, 30000)
};

global.mDefense = function(a) {
    clearTimeout(mFightTime);
    mOwnTurn = true;
    mCurrentHP = mCurrentHP - a;
    if (mCurrentHP <= 0) return mFaint();
    mCall("It's your turn! Pick an /attack!");
};

global.mFaint = function() {
    mCall('I fainted!');
    mPM(mOpponent, '/fainted '+mLevel)
    mCalledOut = null;mOpponent = null;mFighting = false;mCooldown = true;mOwnTurn = false;
    setTimeout(function(){ mCooldown = false; }, 1000 * 60 * 5);
};

global.mAttacks = [{
    command: 'attack',
    callback:function(a,b,c){
        var sAttacks = [];
        mAttacks.forEach(function (d) {
            if(mLevel >= d.level) sAttacks.push(d.command);
        });
        var b = "Available attacks: {attacks}"
        mSay(a, b.replace('{attacks}', sAttacks.join(', /')));
    },
    level: 1,
    mode: 1,
    hint: 'shows possible attacks'
},
{
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
    command: 'stats',
    callback: function(a, b, c) {
        b = "HP: "+mCurrentHP+"/"+mHP;
        a == mOwner && (c ? mPM(a, b) : mSay(a, b))
    },
    level: 0,
    mode: 2,
    hint: 'Tells the bots stats.'
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
        mCalledOut = null;mOpponent = null;mFighting = false;mCooldown = true;mOwnTurn = false;
        LevelUp(b*7);
        clearTimeout(mFightTime);
        mCall("Opponent fainted! I gained "+b*7+" exp!");
        setTimeout(function(){ mCooldown = false; }, 1000 * 60 * 5);
    }
},
///Now that we have the handshakes out of the way, the actual attacks
{
    command: 'headbutt',
    callback: function (a,b,c) {
        if (!mOwnTurn) return mCall("It's not my turn to attack!");
        var dmg = Math.floor((10-4)*Math.random()) + 5;
        mPM(mOpponent, "/attacked headbutt "+dmg);
        mOffense();
    },
    level: 1,
    mode: 1,
    hint: 'Makes the pet speak'
},
{
    command: 'scratch',
    callback: function (a,b,c) {
        if (!mOwnTurn) return mCall("It's not my turn to attack!");
        var dmg = Math.floor((15-1)*Math.random()) + 2;
        mPM(mOpponent, "/attacked scratch "+dmg);
        mOffense();
    },
    level: 1,
    mode: 1,
    hint: 'Makes the pet speak'
},
{
    command: 'tackle',
    callback: function (a,b,c) {
        if (!mOwnTurn) return mCall("It's not my turn to attack!");
        var dmg = Math.floor((12-2)*Math.random()) + 3;
        mPM(mOpponent, "/attacked tackle "+dmg);
        mOffense();
    },
    level: 1,
    mode: 1,
    hint: 'Makes the pet speak'
}];