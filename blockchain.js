"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Blockchain = function Blockchain() {
  var _this = this;

  _classCallCheck(this, Blockchain);

  _defineProperty(this, "createNewBlock", function (nonce, previousBlockHash, hash) {
    var newBlock = {
      index: _this.chain.length + 1,
      // Specifies the Block Number in the BlockChain
      timestamp: Date.now(),
      // Record the time when this new Block was created
      transactions: _this.pendingTransactions,
      // All the transactions in this block should be the pending transactions waiting to get confirmed
      nonce: nonce,
      // used for POW verification. Basically a proof that this block was created in a legitimate manner
      previousBlockHash: previousBlockHash,
      // Hash of the data of the previous Block
      hash: hash // Hash of the data of this new Block.

    };
    _this.pendingTransactions = []; // Clear out the pending transactions array so that we can start with fresh pending trasactions in the next Block Creation

    _this.chain.push(newBlock);

    return newBlock;
  });

  _defineProperty(this, "getLastBlock", function () {
    return _this.chain[_this.chain.length - 1];
  });

  _defineProperty(this, "createNewTransaction", function (amount, sender, recipient) {
    var newTransaction = {
      amount: amount,
      sender: sender,
      recipient: recipient
    };

    _this.pendingTransactions.push(newTransaction);

    return _this.getLastBlock()['index'] + 1; // Returns the index of the block where this transaction will be recorded to
  });

  _defineProperty(this, "hashBlock", function (blockData) {});

  this.chain = [];
  this.pendingTransactions = [];
}
/*
  Adding new Block to the BlockChain. Also known as mining.
  All the pendingTransacions are verified and written in this block
*/
;

exports.Blockchain = Blockchain;