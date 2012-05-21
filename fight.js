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
global.mCanLearn = false;

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

global.Damage = function(a, b) {
    return Math.floor((b - (a - 1)) * Math.random()) + a
};

global.Faint = function() {
    Call('I fainted!');
    PM(mOpponent, '/fainted '+mLevel)
    mLosses++;
    Save();
    CalledOut = null;mOpponent = null;mFighting = false;mCooldown = true;mOwnTurn = false;
    setTimeout(function(){ mCooldown = false; }, 1000 * 60 * 5);
};

var fCommands = [{
    command: 'fight',
    callback: function(b, a) {
      if(4 == mType) {
        if(mCooldown) return PM(mOwner, mCoolDownFight);
        for(i = 0;i < mUsers.length;i++) {
          mUsers[i].name == a && (PM(mUsers[i].userid, "/reqconf "+mName), CalledOut = true, mOpponent = mUsers[i].userid, mConfTime = setTimeout(function() {
            CalledOut = false;mOpponent = null;}, 5000))
        }
      }
    },
    level: 1,
    mode: 1,
    hidden: true,
    hint: 'Makes the pet fight'
},
{
    command: 'reqconf',
    callback: function(a, b) {
      if(!CalledOut && !mCooldown && !mOpponent) {
          CalledOut = true;mOpponent = a;
          Call(b + " wants to fight! Type /accept to fight!");
          PM(a, "/sendconf");
          mOwnConf = setTimeout(function() {
            PM(mOpponent, "/ftimedout");
            Call("Fight Timed Out!");
            mOpponent = CalledOut = null
          }, 15000)
      };
      if (mCooldown) {PM(a, "/cooldown")}
    },
    level: 1,
    mode: 1,
    hidden: true,
    hint: 'responds to fights'
},
{
    command: 'sendconf',
    callback: function(a,b,c){
        if (a == mOpponent) clearTimeout(mConfTime);
    },
    level: 1,
    mode: 1,
    hidden: true,
    hint: 'confirms is bot'
},
{
    command: 'cooldown',
    callback: function() {
        Call("Oppenent is too weak to fight!");
    },
    level: 1,
    mode: 1,
    hidden: true,
    hint: 'oppenent is cooling down'
},
{
    command: 'ftimedout',
    callback: function(a, b, c) {
        Call('Fight Timed Out!');
        CalledOut = null;mOpponent = null;
    },
    level: 1,
    mode: 1, 
    hidden: true,
    hint: 'times out'
},
{
    command: 'accept',
    callback: function(a,b,c){
        clearTimeout(mOwnConf);
        mFighting = true;
        mOwnTurn = true;
        PM(mOpponent, "/accepted");
        Call("It's your turn! Pick an /attack!");
    },
    level: 1,
    mode: 1,
    hidden: true,
    hint: 'accept a fight'
},
{
    command: 'accepted',
    callback: function(a,b,c){
        mFighting = true;
        Call("Opponent Accepted! Wait for your turn");
    },
    level: 1,
    mode: 1,
    hidden: true,
    hint: 'accepted'
}];

mCommands = _.union(mCommands, fCommands);

global.mAttacks = [{
    command: 'attack',
    callback:function(a,b,c){
        var b = "Available attacks: /{attacks}"
        Call(b.replace('{attacks}', mLearned.join(', ')));
    },
    level: 1,
    mode: 1,
    hidden: true,
    owner: true,
    hint: 'shows possible attacks'
},
{
    command: 'attacked',
    callback: function(c,d){
        var a=d.split(" "),b=a[0],a=a[1];mArena?Say("I got hit by "+b+" for "+a+" damage!"):Call("I got hit by "+b+" for "+a+" damage!");Defense(a)
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
        var dmg = Damage(this.min, this.max);
        PM(mOpponent, "/attacked headbutt "+dmg);
        Offense(dmg);
    },
    level: 1,
    min: 5,
    max: 10,
    hint: 'Headbutt. Range: 5-10'
},
{
    command: 'scratch',
    callback: function (a,b,c) {
        if (!mOwnTurn) return Call("It's not my turn to attack!");
        var dmg = Damage(this.min, this.max);
        PM(mOpponent, "/attacked scratch "+dmg);
        Offense(dmg);
    },
    level: 1,
    min: 2,
    max: 15,
    hint: 'Scratch. Range: 2-15'
},
{
    command: 'tackle',
    callback: function (a,b,c) {
        if (!mOwnTurn) return Call("It's not my turn to attack!");
        var dmg = Damage(this.min, this.max);
        PM(mOpponent, "/attacked tackle "+dmg);
        Offense(dmg);
    },
    level: 1,
    min: 3,
    max: 12,
    hint: 'Tackle. Range: 3-12'
}];