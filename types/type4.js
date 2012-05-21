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

var sCommands = [{
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
}];

var dAttacks = [{
    command: 'fireball',
    callback: function (a,b,c) {
        if (!mOwnTurn) return Call("It's not my turn to attack!");
        var dmg = Damage(this.min, this.max);
        PM(mOpponent, "/attacked fireball "+dmg);
        Offense(dmg);
    },
    level: 2,
    min: 10,
    max: 30,
    hint: 'Fireball. Range: 10 - 30'
},
{
    command: 'scorch',
    callback: function (a,b,c) {
        if (!mOwnTurn) return Call("It's not my turn to attack!");
        var dmg = Damage(this.min, this.max);
        PM(mOpponent, "/attacked scorch "+dmg);
        Offense(dmg);
    },
    level: 2,
    min: 5,
    max: 35,
    hint: 'Scorch. Range: 5 - 35'
}]

mCommands = _.union(mCommands, sCommands);
mAttacks = _.union(mAttacks, dAttacks);