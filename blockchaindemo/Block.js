class Block {
  constructor(index, timestamp, data, hash, previousHash, nonce = 0) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash;
    this.previousHash = previousHash;
    this.nonce = nonce;
  }

  static get genesis() {
    return this.getGenesis();
  }

  static getGenesis() {
    return new Block(
      0,
      1687700000000,
      "first block",
      "00000000000000000005e2d783046270a9f20931097f37f",
      "0",
      0
    );
  }
}

module.exports = Block;
