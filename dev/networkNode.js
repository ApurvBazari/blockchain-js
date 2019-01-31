import express from 'express';
import bodyParser from 'body-parser';
import uuid from 'uuid/v1';
import Blockchain from './blockchain';
import rp from 'request';

const app = express();

const port = process.argv[2];
const nodeAddress = uuid()
  .split('-')
  .join('');

const coin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
 ** To get the entire blockchain data
 */
app.get('/blockchain', (req, res) => {
  res.send(coin);
});

/*
 ** Add a new transaction to the pending transactions list
 */
app.post('/transaction', (req, res) => {
  const { amount, sender, recipient } = req.body;
  const blockIndex = coin.createNewTransaction(amount, sender, recipient);
  res.json({
    message: `The transaction will be added in the block ${blockIndex}`
  });
});

/*
 ** Mine a new block and add the pending transactions to the newly created block
 */
app.get('/mine', (req, res) => {
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

/*
 ** Register the node and broadcast the node to the entire network
 */
app.post('/register-and-broadcast-node', (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;
  // Register the new node with the current node
  if (coin.networkNodes.indexOf(newNodeUrl) === -1)
    coin.networkNodes.push(newNodeUrl);
  const regNodesPromises = [];
  // Broadcast the new node to all the nodes in the network
  coin.networkNodes.forEach(nodeUrl => {
    const requestOptions = {
      uri: nodeUrl + '/register-node',
      method: 'POST',
      body: { nodeUrl: nodeUrl },
      json: true
    };
    regNodesPromises.push(rp(requestOptions));
  });

  Promise.all(regNodesPromises)
    .then(data => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + '/register-nodes-bulk',
        method: 'POST',
        body: { allNetworkNodes: [...coin.networkNodes, coin.currentNodeUrl] },
        json: true
      };

      return rp(bulkRegisterOptions);
    })
    .then(data => {
      res.json({ note: 'New Node registered successfully.' });
    });
});

/*
 ** Register a node with the network
 */
app.post('/register-node', (req, res) => {
  const newNodeUrl = req.body.nodeUrl;
  const nodeNotPresent = coin.networkNodes.indexOf(newNodeUrl) === -1;
  const notCurrentNode = coin.currentNodeUrl !== newNodeUrl;
  if (nodeNotPresent && notCurrentNode) coin.networkNodes.push(newNodeUrl);
  res.json({ note: 'New node registered succssfully.' });
});

/*
 ** Register multiple nodes at once
 */
app.post('/register-nodes-bulk', (req, res) => {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(nodeUrl => {
    const nodeNotPresent = coin.networkNodes.indexOf(nodeUrl) === -1;
    const notCurrentNode = coin.currentNodeUrl !== nodeUrl;
    if (nodeNotPresent && notCurrentNode) coin.networkNodes.push(nodeUrl);
  });

  res.json({ note: 'Bulk Registration successful' });
});

app.listen(port, () => {
  console.log(`Blockchain server running on port ${port}`);
});
