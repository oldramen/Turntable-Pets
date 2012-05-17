/**
 * @copyright 2012 yayramen. 
 * @author yayramen && Axe_
 * @description This is the file that contains the type commands
 * @Type: Cat
 */

global.mHungry = ["I'm hungry D:", "/me cateyes", "i'll just be mean until I get my food."];
global.mSpeak = ["No.", "let me be llaaaaazzzzyyyyyy. <.<", "you cat to be kitten me right meow!", "Hamster souds good right about- I mean meow :cat:"];
global.mFed = ["That tasted, meeeeh. it was alright", "MEOW! THAT WAS GOOD!"];
global.mBathed = ["If you make me take a bath i'll claw your eyes out!"];
global.mIdle = ["/me goes to sleeep. meeoww.", "I'm lonely :(", "Meow.", "*yawns*"];

global.sCommands = [{
    command: 'pet',
    message: ["purrrrrrrrr", ":cat: (happy)", "miiieeeoowwwww.", "HISSSSS! you scared me!"],
    callback: function (a, b) {
        if (b == '@'+mName) mSay(a, mRandom(this.message));
    },
    level: 0,
    mode: 0,
    hint: 'Pets the cat'
},
{
    command: 'eat',
    callback: function (a, b) {
        if (a == mOwner) mSay(a, "/me quietly chews on "+b);
    },
    level: 0,
    mode: 1,
    hint: 'the cat eats'
}];

mCommands = _.union(mCommands, sCommands);
