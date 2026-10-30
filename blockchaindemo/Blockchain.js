const Block = require('./Block');
const crypto = require('crypto');

// 计算区块哈希：基于 index + 前一个哈希 + 时间戳 + 数据
function computeHash(index, previousHash, timestamp, data) {
  return crypto
    .createHash('sha256')
    .update(`${index}${previousHash}${timestamp}${data}`)
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
    if (newBlock.prevHash !== previousBlock.hash) return false;
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

  // 挖矿：根据传入数据生成并追加一个新区块
  mine(data) {
    const previousBlock = this.latestBlock;
    const index = previousBlock.index + 1;
    const timestamp = Date.now();
    const hash = computeHash(index, previousBlock.hash, timestamp, data);
    const newBlock = new Block(index, timestamp, data, hash, previousBlock.hash);
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
