/**
 * @copyright 2012 yayramen. 
 * @author yayramen
 * @description This is the file that contains the type commands
 * @Type: Cat
 */
 
global.mHungry = ["I'm hungry D:"];
global.mSpeak = ["Ohi there :D"];
global.mFed = ["Omnomnom!"];
global.mBathed = ["B'awww, I hate baths!"];

global.sCommands = [];

global.sPMCommands = [] ;

mCommands = _.union(mCommands, sCommands);
mPMCommands = _.union(mPMCommands, sPMCommands);