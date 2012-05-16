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

global.sCommands = [{
    command: 'pet',
    message: ["Oh, a yummy treat. Omnomnom hand.", "Touch me one more time.", "I had a hand for breakfast. Too early for another one."],
    callback: function (a, b) {
        if (b == '@'+mName) mSay(a, mRandom(this.message));
    },
    level: 0,
    hint: 'Pets the dragon'
}];

global.sPMCommands = [{
    command: 'eat',
    callback: function (a, b) {
        if (a == mOwner) mSay(a, "/me noms on "+b);
    },
    level: 0,
    hint: 'Pets the dragon'
}];

mCommands = _.union(mCommands, sCommands);
mPMCommands = _.union(mPMCommands, sPMCommands);