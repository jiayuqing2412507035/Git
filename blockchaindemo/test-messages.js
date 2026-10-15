const messageType = require("./messages-type.js");
const Messages = require("./messages.js");

console.log("================消息类型和消息工厂测试开始================");
try{
    console.log("1. 测试消息类型枚举");
    console.log("REQUEST_LATEST_BLOCK:", messageType.REQUEST_LATEST_BLOCK);
    console.log("REQUEST_BLOCKCHAIN:", messageType.REQUEST_BLOCKCHAIN);
    console.log("RECEIVE_LATEST_BLOCK:", messageType.RECEIVE_LATEST_BLOCK);
    console.log("RECEIVE_BLOCKCHAIN:", messageType.RECEIVE_BLOCKCHAIN);
    console.log("HANDSHAKE:", messageType.HANDSHAKE);
}catch(err){
    console.error("消息类型和消息工厂测试失败：",err);
}