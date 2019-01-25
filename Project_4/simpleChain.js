/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

/* ===== Persist data with LevelDB ===========================*/

const SHA256 = require('crypto-js/sha256')
const Block = require('./block')
const db = require('level')('./data/chain')


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

    async getBlockHeight(){

      return new Promise((resolve, reject) => {
        let i = -1;
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

    async getBlock(blockHeight){
      return await this.getBlockByHeight(blockHeight)
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

    async getBlockByHeight (key) {
      return new Promise((resolve, reject) => {
        db.get(key, (error, value) => {
          if (value === undefined) {
            return reject('Not Found')
          } else if (error) {
            return reject(error)
          }
          value = JSON.parse(value)

          if (parseInt(key) > 0) {
          value.body.star.storyDecoded = new Buffer(value.body.star.story, 'hex').toString()
        }
          return resolve(value)
        })
      })
    }

    // Get Blocj By Hash

    async getBlockByHash (hash) {
      let block

      return new Promise((resolve, reject) => {
        db.createReadStream().on('data', (data) => {
          block = JSON.parse(data.value)

          if(block.hash === hash) {
            if(!this.isGenesis(data.key)) {
              block.body.star.storyDecoded = new Buffer(block.body.star.story, 'hex').toString()
              return resolve(block)
            } else {
              resolve(block)
            }
          }
        }).on('error', (error) => {
          return reject(error)
        }).on('close', () => {
          return reject('Not Found')
        })
      })
    }

    // Get Block By Address

    async getBlocksByAddress (address) {
      const blocks = []
      let block

      return new Promise((resolve, reject) => {
        db.createReadStream().on('data',(data) => {

          if(!this.isGenesis(data.key)) {
            block = JSON.parse(data.value)

            if (block.body.address === address) {
              block.body.star.storyDecoded = new Buffer(block.body.star.story, 'hex').toString()
              blocks.push(block)
            }
          }
        }).on('error', (error) => {
          return reject(error)
        }).on('close',() => {
          return resolve(blocks)
        })
      })
    }

    // check if Block is Genesis blocks

    isGenesis (key) {
      return parseInt(key) === 0
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
