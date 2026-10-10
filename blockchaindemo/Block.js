class Block {
  constructor(index, timestamp, data, hash, prevHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash;
    this.prevHash = prevHash;
  }

  static getGenesis() {
    return new Block(
      0,
      1687700000000,
      "first block",
      "00000000000000000005e2d783046270a9f20931097f37f",
      "0"
    );
  }
}

module.exports = Block;
