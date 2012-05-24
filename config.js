/**
 * @copyright 2012 yayramen.
 * @author yayramen
 * @description This is the config file, which contains the setup values. 
 */

//Main Authorization
global.mAuthId = "auth";//authid of bot
global.mUserId = "userid";//userid of bot
global.mName = "name";//name of Bot

//the Type 1:Dog,2:Cat,3:Hamster,4:Dragon
global.mType = 4;

//variant of the type:[avatar style]
global.mVar = 1;

//Owner of the Bot
global.mOwner = 'youruserid';

//Let's start the bot
require("../main.js");