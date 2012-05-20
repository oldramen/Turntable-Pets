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
},
{
    command: 'speak',
    callback: function (a, b, c) {
        a == mOwner && (Say(a, Random(mSpeak)), LevelUp(30));
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
        a == mOwner && (c ? PM(a, b) : Say(a, b))
    },
    level: 0,
    mode: 2,
    hint: 'Tells the bots stats.'
},
{
	command: 'feed',
	callback: function (a, b, c) {
        var x = 100 - mHunger;if (x > 50) x = 50;
        100 != mHunger && a == mOwner && (PM(a, Random(mFed)), mHunger += x, LevelUp(1));
	},
    level: 0,
    mode: 1,
	hint: 'help'
},
{
    command: 'clean',
    callback: function (a, b, c) {
        var x = 20 - mClean;var y = x;if (y > 15) y = 15;
        20 != mClean && a == mOwner && (PM(a, Random(mBathed)),mClean += x, LevelUp(1));
    },
    level: 0,
    mode: 1,
    hint: 'help'
},
{
    command: 'come',
    callback: function (a, b, c) {
        if (mStay) mStay = false;
        a == mOwner && (clearTimeout(mMoving), Stalk(mOwner, 1));
    },
    level: 0,
    mode: 1,
    hint:'Summons the bot if not in the same room.'
},
{
    command: 'stay',
    callback: function(a,b,c){
        a == mOwner && mStay = true;
        Call("I'll stay here til you get back!");
    },
    level: 0,
    mode: 2,
    hint: 'Makes the bot stay'
},
{
    command: 'arena',
    callback: function(a,b,c){
        isMaster(a)&&b&&("on"==b?(mArena=true,mSpeak(a,"Arena Mode Enabled!")):(mArena=false,mSpeak(a,"Arena Mode Disabled!")))
    },
    level: 1,
    mode: 1,
    hint: 'gm command to go into Arena mode'
}] 