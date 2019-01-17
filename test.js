"use strict";

var Blockchain = require('./blockchain.js').Blockchain;

var coin = new Blockchain();
coin.createNewBlock(3242, 'AS455ET4C3CR34CC', 'DW4R3EFDSDC');
coin.createNewTransaction(10, 'APURV43242RFDS', 'BAZARI2442534');
coin.createNewBlock(65443, 'DW4R3EFDSDC', 'DFWER34EWFSDF');
console.log(coin);