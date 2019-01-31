import sha256 from 'sha256';

const currentNodeUrl = process.argv[3];
export default class Blockchain {
  constructor() {
    this.chain = []; // The Main Chain for our Blockchain.
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = []; // Keep a list of all the Urls in the blockchain network
    this.pendingTransactions = [];
    this.createNewBlock(0, '0', '0'); // To create the genesis block.
  }

  /*
    Adding new Block to the BlockChain. Also known as mining.
    All the pendingTransacions are verified and written in this block
  */
  createNewBlock = (nonce, previousBlockHash, hash) => {
    const newBlock = {
      index: this.chain.length + 1, // Specifies the Block Number in the BlockChain
      timestamp: Date.now(), // Record the time when this new Block was created
      transactions: this.pendingTransactions, // All the transactions in this block should be the pending transactions waiting to get confirmed
      nonce, // used for POW verification. Basically a proof that this block was created in a legitimate manner
      previousBlockHash, // Hash of the data of the previous Block
      hash // Hash of the data of this new Block.
    };
    this.pendingTransactions = []; // Clear out the pending transactions array so that we can start with fresh pending trasactions in the next Block Creation
    this.chain.push(newBlock);

    return newBlock;
  };

  /* 
    Returns the last mined block of the Blockchain
  */
  getLastBlock = () => this.chain[this.chain.length - 1];

  /*
    Creates a new trasaction and adds it to the pendingTransactions array.
    The transaction is verified once a new block is added to the blockchain,
    in the createNewBlock method.
  */
  createNewTransaction = (amount, sender, recipient) => {
    const newTransaction = {
      amount,
      sender,
      recipient
    };
    this.pendingTransactions.push(newTransaction);
    return this.getLastBlock()['index'] + 1; // Returns the index of the block where this transaction will be recorded to
  };

  /*
    Takes a block from the Blockchain and hashes that block into a fixed length string
  */
  hashBlock = (prevBlockHash, currentBlockData, nonce) => {
    const data =
      prevBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(data);
    return hash;
  };

  /*
    Proof Of Work consensus algorithm which provides the security of the 
    blockchain.
    For this particular POW we check in the first 4 digits of the new hash 
    equals to '0000'. Else change the nonce and try again till the condition
    is satisfied.
    It finds the correct nonce which helps to satisfy the given condition
  */
  proofOfWork = (prevBlockHash, currentBlockData) => {
    let nonce = 0;
    let hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);
    //  Conditional Check
    while (hash.substring(0, 4) !== '0000') {
      nonce++;
      hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);
    }
    return nonce;
  };
}
