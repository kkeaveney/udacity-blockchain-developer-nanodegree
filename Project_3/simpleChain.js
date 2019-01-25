/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

/* ===== Persist data with LevelDB ===========================*/

const SHA256 = require('crypto-js/sha256');
const Block = require('./block');

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);


/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain

  Genesis block persist as the first block in the blockchain using LevelDB.

|  ================================================*/

    class Blockchain{
      constructor(){
          this.getBlockHeight().then((height) => {
          if (height === -1) {
            this.addBlock(new Block("Genesis block")).then(() => console.log("Genesis Block Added"));
          }
        })
      }

    /* =====  addBlock(newBlock) includes a method to store newBlock within LevelDB ===========================*/

    async addBlock(newBlock){
      // Block height
      newBlock.height = await this.getBlockHeight() + 1;
      // UTC timestamp
      newBlock.time = new Date().getTime().toString().slice(0,-3);
      // previous block hash
      if(newBlock.height>0){
        const previousBlock = await this.getBlock(newBlock.height-1);
        newBlock.previousBlockHash = previousBlock.hash;
      }
      // Block hash with SHA256 using newBlock and converting to a string
      newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
      // Adding block object to chain
    	this.addLevelDBData(newBlock.height, JSON.stringify(newBlock));
    }

  // getBlockHeight() function retrieves current block height within the LevelDB chain.

    getBlockHeight(){
      let i = -1;
      return new Promise((resolve, reject) => {
        db.createReadStream()
         .on('data', function(data) {
           i++;
         }).on('error', function(err) {
           reject(err);
         }).on('close', function() {
          resolve(i);
         });
      });
    }

    // getBlock() function retrieves a block by block height within the LevelDB chain.

    getBlock(blockHeight){
      return new Promise((resolve, reject) => {
        db.get(blockHeight, function(err, value) {
          if(err) return console.log('Block not Found', err);
          resolve(JSON.parse(value));
        });
      })
    }

    // validateBlock() function to validate a block stored within levelDB

    async validateBlock(blockHeight){
      // get block object
      let block = await this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash===validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

   // validateChain() function to validate blockchain stored within levelDB
    async validateChain(){
      let errorLog = [];
      const height = await this.getBlockHeight()+1;

      if(height == 1) {
        if(!this.validateBlock(i))errorLog.push(i);
      } else {
      for (var i = 0; i < height -1; i++) {
        // validate block
        if (!this.validateBlock(i))errorLog.push(i);
        // compare blocks hash link
        let block = await this.getBlock(i);
        let blockHash = block.hash;

        let nextBlock = await this.getBlock(i+1);
        let prevBlockHash = nextBlock.previousBlockHash;

        if (blockHash!==prevBlockHash)  {
          errorLog.push(i);
          }
        }
      }
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
      } else {
        console.log('No errors detected');
      }
    }


    // Level DB chaindata

    addLevelDBData(key, value){
      db.put(key, value, function(err) {
        if (err) return console.log('Failed to Add Data',  err);
      })
    }

    getLevelDBData(key){
      db.get(key, function(err,value) {
        if(err) return console.log('Not Found', err);
        console.log('Value = ' + value);
      })
    }
}

module.exports = Blockchain;
