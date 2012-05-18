/**
 * @copyright 2012 yayramen. 
 * @author yayramen
 * @description This is where the battle functions will be held.
 * @Type: Dragon
 */

global.mOpponent = null;
global.mCooldown = false;
global.mConfTime = null;
global.mOwnConf = null;
global.mOwnTurn = false;

global.mAttacks = [{
    command: 'headbutt',
    callback: function (a, b, c) {
        
    },
    level: 0,
    mode: 0,
    hint: 'Makes the pet speak'
}]