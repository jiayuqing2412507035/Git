// 双节点 P2P 同步自动验证脚本
// 模拟手动操作流程：
//   节点 A (2727) open 2727
//   节点 B (2828) open 2828 → connect localhost 2727
//   节点 B mine "asdsad"
//   等待异步传播后，校验 A、B 链完全一致

const Blockchain = require('./Blockchain.js');
const P2p = require('./P2p.js');

console.log('========双节点 P2P 同步测试开始==========');

const chainA = new Blockchain();
const chainB = new Blockchain();
const p2pA = new P2p(chainA);
const p2pB = new P2p(chainB);

// 1. A 开 2727，B 开 2828
p2pA.startServer(2727);
p2pB.startServer(2828);

setTimeout(() => {
  // 2. B 主动连 A
  p2pB.connectToPeer('localhost', 2727);

  setTimeout(() => {
    console.log('\n--- 连接后：A 的链长度 =', chainA.get().length,
                '；B 的链长度 =', chainB.get().length);
    console.log('--- A 连接的 peer 数 =', p2pA.peers.length,
                '；B 连接的 peer 数 =', p2pB.peers.length);

    // 3. B 挖矿 "asdsad" 并广播
    console.log('\n[B] mine "asdsad" ...');
    chainB.mine('asdsad');
    p2pB.broadcastLatest();

    // 4. 等待 TCP 消息传播
    setTimeout(() => {
      console.log('\n--- 挖矿并广播后：');
      console.log('A 链长度 =', chainA.get().length,
                  '；B 链长度 =', chainB.get().length);
      console.log('A 最新块 index =', chainA.latestBlock.index,
                  '；data =', JSON.stringify(chainA.latestBlock.data));
      console.log('B 最新块 index =', chainB.latestBlock.index,
                  '；data =', JSON.stringify(chainB.latestBlock.data));

      const same = JSON.stringify(chainA.get()) === JSON.stringify(chainB.get());
      console.log('\n>>> A、B 两条链是否一致：', same);

      // 5. 再在 A 上挖一个，反向验证
      console.log('\n[A] mine "1111" ...');
      chainA.mine('1111');
      p2pA.broadcastLatest();

      setTimeout(() => {
        console.log('\n--- 反向挖矿后：');
        console.log('A 链长度 =', chainA.get().length,
                    '；B 链长度 =', chainB.get().length);
        const same2 = JSON.stringify(chainA.get()) === JSON.stringify(chainB.get());
        console.log('A 最新 data =', JSON.stringify(chainA.latestBlock.data));
        console.log('B 最新 data =', JSON.stringify(chainB.latestBlock.data));
        console.log('>>> A、B 两条链是否一致：', same2);

        p2pA.closeConnection();
        p2pB.closeConnection();
        console.log('\n========双节点同步测试结束==========');
        process.exit(same && same2 ? 0 : 1);
      }, 800);
    }, 800);
  }, 500);
}, 300);
