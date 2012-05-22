/**
 * @copyright 2012 yayramen. 
 * @author yayramen
 * @description This is the file that contains all the commands
 * @flags: level = level required to use command. mode = 0(chat), 1(pm), 2(both);
 */
global.mCommands = [{
    command: 'actions',
    callback: function(a,b,c) {
        var sCmds = [];
        mCommands.forEach(function (d) {
            if(mLevel >= d.level && !d.hidden) sCmds.push(d.command);
        });   
        var e = "Actions: /{cmds}";
        var e = e.replace('{cmds}', sCmds.join(', /'))
        c ? PM(a, e) : Say(a, e)
    },
    level: 0,
    mode: 2,
    hint: 'Tells available actions'
},
{
    command: 'speak',
    callback: function (a, b, c) {
        Say(a, Random(mSpeak)), LevelUp(50);
    },
    level: 0,
    mode: 0,
    owner: true,
    hint: 'Makes the pet speak'
},
{
    command: 'stats',
    callback: function(a, b, c) {
        if (mType < 4) { b = "Level: "+mLevel+", Exp: "+mExp+"/"+mLevelUpReq+", Hunger: "+mHunger+"/100, Cleanliness: "+mClean+"/20"; }
        else { b = "Level: "+mLevel+", HP: "+mCurrentHP+"/"+mHP+", Exp: "+mExp+"/"+mLevelUpReq+", Hunger: "+mHunger+"/100, Cleanliness: "+mClean+"/20"; }
        c ? PM(a, b) : Say(a, b)
    },
    level: 0,
    mode: 2,
    owner: true,
    hint: 'Tells the bots stats.'
},
{
	command: 'feed',
	callback: function (a, b, c) {
        var x = 100 - mHunger;if (x > 50) x = 50;
        100 != mHunger && (PM(a, Random(mFed)), mHunger += x, LevelUp(1));
	},
    level: 0,
    mode: 1,
    owner: true,
	hint: 'help'
},
{
    command: 'clean',
    callback: function (a, b, c) {
        var x = 20 - mClean;var y = x;if (y > 15) y = 15;
        20 != mClean && (PM(a, Random(mBathed)),mClean += x, LevelUp(1));
    },
    level: 0,
    mode: 1,
    owner: true,
    hint: 'help'
},
{
    command: 'come',
    callback: function (a, b, c) {
        if (mStay) mStay = false;
        clearTimeout(mMoving), Stalk(mOwner, 1);
    },
    level: 0,
    mode: 1,
    owner: true,
    hint:'Summons the bot if not in the same room.'
},
{
    command: 'stay',
    callback: function(a,b,c){
        mStay = true;
        Call("I'll stay here til you get back!");
    },
    level: 0,
    mode: 2,
    owner: true,
    hint: 'Makes the bot stay'
},
{
    command: 'learn',
    callback: function(c, a) {
      if(mCanLearn) {
        if(!a) return Call("Use /learn attack - where attack is the attack you want to learn!");
        mAttacks.forEach(function(b) {
          b.command == a && (mLevel == b.level && !b.hidden && -1 == mLearned.indexOf(a)) && (mLearned.push(b.command), Call("Learned " + a + "!"), Save())
        });
        mCanLearn = false;
      }
    },
    level: 2,
    mode: 1,
    hidden: true,
    owner: true,
    hint: 'Learn a new attack'
},
{
    command: 'arena',
    callback: function(a,b,c){
        isMaster(a)&&b&&("on"==b?(mArena=true,mSpeak(a,"Arena Mode Enabled!")):(mArena=false,mSpeak(a,"Arena Mode Disabled!")))
    },
    level: 1,
    mode: 1,
    hidden: true,
    hint: 'gm command to go into Arena mode'
}] 