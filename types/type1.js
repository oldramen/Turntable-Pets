/**
 * @copyright 2012 yayramen. 
 * @author yayramen && Axe_
 * @description This is the file that contains the type commands
 * @Type: Dog
 */

global.mHungry = ["I'm hungry D:", "Can I have a treat? I'm starving!", "forget dog food can i have a bite of what you are eating?"];
global.mSpeak = ["I'm excited to see you!", "ahwooooOOoooOOo. <.<", "GRRRRRRRRR! DON'T MAKE ME BITE.", "I may not seem tuff, but I could rip you to shreds :)"];
global.mFed = ["That tasted way better than i thought it would!", "I usually only eat PREMIUM dog food, but that was alright :)"];
global.mBathed = ["I'm to busy for a bat-SQUIRREL"];
global.mIdle = ["/me stretches and lays down", "/me howls", "Bark.", "i'mmmm sllleeeeeepppppy *yawns*"];

global.sCommands = [{
    command: 'pet',
    message: ["^-^", "GRRRR DON'T TOUCH ME RIGHT NOW", "/me bites hand (don't sneak up on me like that!)"],
    callback: function (a, b) {
        if (b == '@'+mName) mSay(a, mRandom(this.message));
    },
    level: 0,
    mode: 0,
    hint: 'Pets the dog'
},
{
    command: 'eat',
    callback: function (a, b) {
        if (a == mOwner) mSay(a, "/me noms on "+b);
    },
    level: 0,
    mode: 1,
    hint: 'Pets the dog'
}];

mCommands = _.union(mCommands, sCommands);