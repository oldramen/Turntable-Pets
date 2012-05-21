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

global.Offense = function(a){
    mOwnTurn = false;
    Call("My attack hit for "+a+" damage!");
    Log('No longer my turn')
    mFightTime = setTimeout(function(){ 
        PM(mOpponent, "/ftimedout");
        Call('Fight Timed Out!');
        CalledOut = null;mOpponent = null;mFighting = false;mOwnTurn = false;
    }, 30000)
};

global.Defense = function(a) {
    clearTimeout(mFightTime);
    mOwnTurn = true;
    Log('Took '+a+' damage, starting my turn.');
    mCurrentHP = mCurrentHP - a;
    if (mCurrentHP < 1) return Faint();
    Call("It's your turn! Pick an /attack!");
};

global.Faint = function() {
    Call('I fainted!');
    PM(mOpponent, '/fainted '+mLevel)
    mLosses++;
    Save();
    CalledOut = null;mOpponent = null;mFighting = false;mCooldown = true;mOwnTurn = false;
    setTimeout(function(){ mCooldown = false; }, 1000 * 60 * 5);
};

global.mAttacks = [{
    command: 'attack',
    callback:function(a,b,c){
        var sAttacks = [];
        mAttacks.forEach(function (d) {
            if(mLevel >= d.level && !d.hidden) sAttacks.push(d.command);
        });
        var b = "Available attacks: /{attacks}"
        Call(b.replace('{attacks}', sAttacks.join(', /')));
    },
    level: 1,
    mode: 1,
    hidden: true,
    hint: 'shows possible attacks'
},
{
    command: 'attacked',
    callback: function(c,d){
        var a=d.split(" "),b=a[0],a=a[1];mArena?Say("I got hit by "+b+" for "+a+" damage!"):Call(c,"I got hit by "+b+" for "+a+" damage!");Defense(a)
    },
    level: 1,
    mode: 1,
    hidden: true,
    hint: 'change of information'
},
{
    command: 'stats',
    callback: function(a, b, c) {
        b = "HP: "+mCurrentHP+"/"+mHP;
        a == mOwner && (c ? PM(a, b) : Say(a, b))
    },
    level: 0,
    mode: 2,
    hidden: true,
    hint: 'Tells the bots stats.'
},
{
    command: 'ftimedout',
    callback: function(a, b, c) {
        Call('Fight Timed Out!');
        CalledOut = null;mOpponent = null;mFighting = false;mOwnTurn = false;
    },
    level: 1,
    mode: 1, 
    hidden: true,
    hint: 'times out'
},
{
    command: 'fainted',
    callback: function(a, b, c) {
        CalledOut = null;mOpponent = null;mFighting = false;mCooldown = true;mOwnTurn = false;
        var d = Math.floor((10-4)*Math.random()) + 5;
        LevelUp(b*d);
        clearTimeout(mFightTime);
        Call("Opponent fainted! I gained "+b*d+" exp!");
        setTimeout(function(){ mCooldown = false; }, 1000 * 60 * 5);
    },
    level: 1,
    mode: 1,
    hidden: true,
    hint: 'faints'
},
///Now that we have the handshakes out of the way, the actual attacks
{
    command: 'headbutt',
    callback: function (a,b,c) {
        if (!mOwnTurn) return Call("It's not my turn to attack!");
        var dmg = Math.floor((10-4)*Math.random()) + 5;
        PM(mOpponent, "/attacked headbutt "+dmg);
        Offense(dmg);
    },
    level: 1,
    mode: 1,
    hint: 'Headbutt. Range: 5-10'
},
{
    command: 'scratch',
    callback: function (a,b,c) {
        if (!mOwnTurn) return Call("It's not my turn to attack!");
        var dmg = Math.floor((15-1)*Math.random()) + 2;
        PM(mOpponent, "/attacked scratch "+dmg);
        Offense(dmg);
    },
    level: 1,
    mode: 1,
    hint: 'Scratch. Range: 2-15'
},
{
    command: 'tackle',
    callback: function (a,b,c) {
        if (!mOwnTurn) return Call("It's not my turn to attack!");
        var dmg = Math.floor((12-2)*Math.random()) + 3;
        PM(mOpponent, "/attacked tackle "+dmg);
        Offense(dmg);
    },
    level: 1,
    mode: 1,
    hint: 'Tackle. Range: 3-12'
}];