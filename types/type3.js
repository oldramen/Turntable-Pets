/**
 * @copyright 2012 yayramen. 
 * @author yayramen && Axe_
 * @description This is the file that contains the type commands
 * @Type: Hamster
 */

global.mHungry = ["I'm out of food in my bowl!", "my water is getting pretty low, fill it up for me? :)", "Hey.. you do realize i need food every so often?"];
global.mSpeak = ["Cats scare me, they look like they want to eat me!", "I <3 my hamster wheel!", "Can I get a new cage?", "Get the hamster ball, I want to explore!"];
global.mFed = ["I love you so much", "haha my belly is bulging xD", "Man that was good, but i'm stuffed!)"];
global.mBathed = ["I require a dust bath."];
global.mIdle = ["/me curls up in a ball", "/me runs on my hamster wheel", "squeak.", "I. need. exercize!"];

global.sCommands = [{
    command: 'pet',
    message: ["^-^ Thank youuuuu :D", "<3", ":hamster: (happy)", "/me bites hand (don't sneak up on me like that!)"],
    callback: function (a, b) {
        if (aboutMe(b)) Say(a, Random(this.message));
    },
    level: 0,
    mode: 0,
    hint: 'Pets the Hamster'
},
{
    command: 'eat',
    callback: function (a, b) {
        Say(a, "/me nibbles on "+b);
    },
    level: 0,
    mode: 1,
    owner: true,
    hint: 'The hamster eats'
}];

mCommands = _.union(mCommands, sCommands);