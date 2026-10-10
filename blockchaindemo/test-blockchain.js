const Block = require("./Block");
console.log("开始测试区块链==========");
try {
  const genesis = Block.getGenesis();
  console.log(genesis);
  console.log("genesis.hash", genesis.hash);
  console.log("genesis.prevHash", genesis.prevHash);
} catch (error) {
  console.log(error);
}
