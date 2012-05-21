/**
 * @copyright 2012 yayramen. 
 * @author yayramen
 * @description This is the file that contains the type commands
 * @Type: Dragon
 */

global.mHungry = ["I'm hungry D:", "I require sustenance, mortal.", "I could use a cow."];
global.mSpeak = ["Ohi there :D", "ROAR. Fear me.", "*grumble*. Tell me what to do one more time, see what happens.", "I'm big and bad. Oh yeah, I'm awesome."];
global.mFed = ["Omnomnom!", "That's it? They used to give me feats, you know"];
global.mBathed = ["B'awww, I hate baths!", "Try that one more time, and I'll kill you."];
global.mIdle = ["/me stretches wings", "/me yawns", "rawr.", "brawr!"];
global.mCoolDownFight = "Sorry, I can't fight yet. Let me rest for a bit.";

global.sCommands = [{
    command: 'pet',
    message: ["Oh, a yummy treat. Omnomnom hand.", "Touch me one more time.", "I had a hand for breakfast. Too early for another one."],
    callback: function (a, b) {
        if (aboutMe(b)) Say(a, Random(this.message));
    },
    level: 0,
    mode: 0,
    hint: 'Pets the dragon'
},
{
    command: 'eat',
    callback: function (a, b) {
        Say(a, "/me noms on "+b);
    },
    level: 0,
    mode: 1,
    owner: true,
    hint: 'The dragon eats'
},
{
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

mCommands = _.union(mCommands, sCommands);