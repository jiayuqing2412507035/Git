const messageType = {
    REQUEST_LATEST_BLOCK: 0, // 请求最新的区块
    REQUEST_BLOCKCHAIN: 1,  // 请求整条区块链
    RECEIVE_LATEST_BLOCK: 2,// 响应最新区块
    RECEIVE_BLOCKCHAIN: 3,  // 响应整条链
    HANDSHAKE: 4            // 握手消息
};
module.exports = messageType;