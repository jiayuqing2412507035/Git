const messageType = require("./messages-type.js");

class Messages {
    // 请求最新的区块
    static getLatestBlock() {
        return {
            type: messageType.REQUEST_LATEST_BLOCK,
        };
    }
    // 返回最新区块
    static sendLatestBlock(block) {
        return {
            type: messageType.RECEIVE_LATEST_BLOCK,
            data: block,
        };
    }
    // 请求整条区块链
    static getBlockchain() {
        return {
            type: messageType.REQUEST_BLOCKCHAIN,
        };
    }
    // 返回整条区块链
    static sendBlockchain(blockchain) {
        return {
            type: messageType.RECEIVE_BLOCKCHAIN,
            data: blockchain,
        };
    }
    // 握手消息，传递端口
    static sendHandshake(port) {
        return {
            type: messageType.HANDSHAKE,
            data: port,
        };
    }
}
module.exports = Messages;