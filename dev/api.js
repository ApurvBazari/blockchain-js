import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'uuid/v1';
import Blockchain from './blockchain';

const app = express();

const nodeAddress = uuid()
  .split('-')
  .join('');

const coin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', function(req, res) {
  res.send(coin);
});

app.post('/transaction', function(req, res) {
  const { amount, sender, recipient } = req.body;
  const blockIndex = coin.createNewTransaction(amount, sender, recipient);
  res.json({
    message: `The transaction will be added in the block ${blockIndex}`
  });
});

app.get('/mine', function(req, res) {
  const lastBlock = coin.getLastBlock();
  const prevBlockHash = lastBlock['hash'];
  const currentBlockData = {
    transactions: coin.pendingTransactions,
    index: lastBlock['index'] + 1
  };

  const nonce = coin.proofOfWork(prevBlockHash, currentBlockData);
  const currentBlockHash = coin.hashBlock(
    prevBlockHash,
    currentBlockData,
    nonce
  );
  coin.createNewTransaction(10, '000', nodeAddress);
  const newBlock = coin.createNewBlock(nonce, prevBlockHash, currentBlockHash);
  res.json({
    message: `New Block mined successfully`,
    block: newBlock
  });
});

app.listen(8080, function() {
  console.log('Blockchain server running on port 8080');
});
