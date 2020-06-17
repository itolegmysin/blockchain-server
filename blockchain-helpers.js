const SHA256 = require("crypto-js/sha256");

const calculateHash = ({ previousHash, timestamp, data, nonce = 1 }) => SHA256(previousHash + timestamp + JSON.stringify(data) + nonce).toString();

const generateGenesisBlock = ({ mark, subject, studentId }) => {
  const block = {
    timestamp: + new Date(),
    subject,
    mark,
    studentId,
    previousHash: "0",
  };
  return {
    ...block,
    hash: calculateHash(block)
  }
}

const checkDifficulty = (difficulty, hash) => hash.substr(0, difficulty) === "0".repeat(difficulty);

const nextNonce = (block) => updateHash({ ...block, nonce: block.nonce + 1 });
const updateHash = (block) => ({ ...block, hash: calculateHash(block) });

function trampoline(func) {
  let result = func.apply(func, ...arguments);
  while (result && typeof (result) === "function") {
    result = result();
  }
  return result;
}

function mineBlock(difficulty, block) {
  function mine(block) {
    const newBlock = nextNonce(block);
    return checkDifficulty(difficulty, newBlock.hash)
      ? newBlock
      : () => mine(nextNonce(block));
  }
  return trampoline(mine(nextNonce(block)));
}

function addBlock(chain, data) {
  const { hash: previousHash } = chain[chain.length - 1];
  const block = { timestamp: + new Date(), ...data, previousHash, nonce: 0 }
  return mineBlock(4, block);
}

function validateChain(chain) {
  function tce(chain, index) {
    if (index === 0) return true;
    const { hash, ...currentBlockWithoutHash } = chain[index];
    const currentBlock = chain[index];
    const previousBlock = chain[index - 1];
    const isValidHash = (hash === calculateHash(currentBlockWithoutHash));
    const isPreviousHashValid = (currentBlock.previousHash === previousBlock.hash);
    const isValidChain = (isValidHash && isPreviousHashValid);

    if (!isValidChain) return false;
    else return tce(chain, index - 1);
  }
  return tce(chain, chain.length - 1)
}

module.exports = {
  calculateHash,
  generateGenesisBlock,
  checkDifficulty,
  addBlock,
  validateChain,
}