const Block = require('./Block');
const crypto = require('crypto');

// 挖矿难度：哈希值需要以多少个 0 开头
const DIFFICULTY = 3;

// 计算区块哈希：基于 index + 前一个哈希 + 时间戳 + 数据 + 随机数 nonce
function computeHash(index, previousHash, timestamp, data, nonce) {
  return crypto
    .createHash('sha256')
    .update(`${index}${previousHash}${timestamp}${data}${nonce}`)
    .digest('hex');
}

class Blockchain {
  constructor() {
    // 初始化区块链，创世区块作为第一个区块
    this.chain = [Block.getGenesis()];
    // cli.js / HTTP 接口里直接用 blockchain.blockchain 访问数组，做个别名
    this.blockchain = this.chain;
  }

  // 获取整条区块链
  get() {
    return this.chain;
  }

  // 获取最新区块
  get latestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // 校验新区块是否可以挂到前一个区块后面
  isValidNewBlock(newBlock, previousBlock) {
    if (!newBlock || !previousBlock) return false;
    if (newBlock.index !== previousBlock.index + 1) return false;
    if (newBlock.previousHash !== previousBlock.hash) return false;
    return true;
  }

  // 添加新区块
  addBlock(newBlock) {
    if (this.isValidNewBlock(newBlock, this.latestBlock)) {
      this.chain.push(newBlock);
    } else {
      throw new Error('无效的新区块，无法添加');
    }
  }

  // 挖矿：不断调整 nonce 计算哈希，直到满足难度要求（工作量证明）
  mine(data) {
    const previousBlock = this.latestBlock;
    const index = previousBlock.index + 1;
    const timestamp = Date.now();
    let nonce = 0;
    let hash = computeHash(index, previousBlock.hash, timestamp, data, nonce);
    while (!hash.startsWith('0'.repeat(DIFFICULTY))) {
      nonce += 1;
      hash = computeHash(index, previousBlock.hash, timestamp, data, nonce);
    }
    const newBlock = new Block(index, timestamp, data, hash, previousBlock.hash, nonce);
    this.addBlock(newBlock);
    return newBlock;
  }

  // 校验整条链是否合法
  isValidChain(chain) {
    if (!Array.isArray(chain) || chain.length === 0) return false;
    // 第一个区块必须是创世区块
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.getGenesis())) {
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      if (!this.isValidNewBlock(chain[i], chain[i - 1])) {
        return false;
      }
    }
    return true;
  }

  // 用收到的更长、更合法的链替换本地区块链
  replaceChain(newChain) {
    if (!this.isValidChain(newChain)) {
      throw new Error('收到的区块链不合法，拒绝替换');
    }
    if (newChain.length <= this.chain.length) {
      throw new Error('收到的区块链不比本地更长，拒绝替换');
    }
    this.chain = newChain;
    this.blockchain = this.chain; // 同步别名
  }
}

module.exports = Blockchain;
