const compression = require('compression');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const Block = require('./block');
const Blockchain = require('./simpleChain');
const validateStar = require('./StarValidation');
let bc = new Blockchain();

  validateAddress = async (req, res, next) => {
    try {
      const validateStr = new validateStar(req)
      validateStr.validateAddress()
      next()
    } catch (err){
      res.status(400).json({
        status:400,
        message: err.message
      })
    }
  }

  validateSignature = async (req, res, next) => {
    try {

      const validateStr = new validateStar(req)
      validateStr.validateSignature()
      next()
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: err.messaage
      })
    }
  }

  validateNewStarRequest = async (req, res, next) => {
    try {
      const validateStr = new validateStar(req)
      validateStr.validateNewStarRequest()
      next()
    } catch(err) {
      res.status(400).json({
        status:400,
        message: err.message
      })
    }
  }

    app.use(compression())
    app.listen(8000, () => console.log('Listening on port 8000'));
    app.use(bodyParser.json());
    app.get('/', (req, res) => res.status(404).json({
      "status": 404,
      "message":"Accepted endpoints: POST or GET "
    }))


  //  Criteria: Web API post endpoint validates request

    app.post('/requestValidation', [validateAddress], async (req, res) => {
        const validateStr = new validateStar(req)
        const address = req.body.address


        try {
          data = await validateStr.getPendingAddressRequest(address)
        } catch(err) {
          data = await validateStr.saveNewRequestValidation(address)
        }
        res.json(data)
      })

  //   Criteria: API post endpoint validates message signature

    app.post('/message-signature/validate', [validateAddress, validateSignature], async (req, res) => {
      const validateStr = new validateStar(req)
      try {
        const { address, signature } = req.body
        const response = await validateStr.validateMessageSignature(address, signature)

        if (response.registerStar) {
          res.json(response)
        } else {
          res.status(401).json(response)
        }
      } catch (err) {
        res.status(404).json({
          status: 404,
          message: err.message
        })
      }
    })

  /**
  * Criteria: POST Block endpoint using key/value pair within request body. Preferred URL path http://localhost:8000/block
  */


    app.post('/block', [validateNewStarRequest], async (req,res) => {
      const validateStr = new validateStar(req)

      try {
        const isValid = await validateStr.isValid()

        if(!isValid) {
          throw new err('Invalid Signature')
        }
      } catch (err){
        res.status(401).json({
          status:401,
          messagge: err.message
        })

        return
      }

      const body = { address, star } = req.body
      const story = star.story

      body.star = {
        dec: star.dec,
        ra: star.ra,
        story: new Buffer(story).toString('hex'),
        mag: star.mag,
        con: star.con
      }

        await bc.addBlock(new Block(body))
        const height = await bc.getBlockHeight()
        console.log('height =', height)
        const response = await bc.getBlock(height)

       validateStr.invalidate(address)
       res.status(201).send(response)
    })

    // Get star block by wallet address

    app.get('/stars/address:address', async (req, res) => {
      try {
        const address = req.params.address.slice(1)
        const response = await bc.getBlocksByAddress(address)

        res.send(response)
      } catch(err) {
        res.status(404).json({
          status: 404,
          message: 'Cannot Find Block'
        })
      }
    })

  // Get star block by hash with

    app.get('/stars/hash:hash', async(req, res) => {
      try {
        const hash = req.params.hash.slice(1)
        const response = await bc.getBlockByHash(hash)

        res.send(response)
      } catch (err) {
        res.status(404).json({
          status: 404,
          message: 'Cannot Find Block'
        })
      }
    })
    /**
     * Criteria: GET Block endpoint using URL path with block height parameter. Preferred URL path http://localhost:8000/block/{BLOCK_HEIGHT}
     */


   app.get('/block/:blockHeight', async (req, res) => {
     let bHeight = req.params.blockHeight;

     try {
        // Get block height
        bc.getBlockHeight().then((height) => {
           // Check that block height doesn't go beyond block height
              if (height >= bHeight) {
              // If valid return the block
              bc.getBlock(bHeight).then((block) => {
                 res.send(block);
              }).catch((err) => {
                 res.send("err: fetching the block at height " + bHeight + ":" + err);
              });
              // Otherwise, not valid height so just warn user.
           } else {
              res.send(" block height is not valid");
           }
        }).catch((err) => {
           res.send("err:" + err);
        });
     } catch (err) {
        res.send("err:" + err);
     }
  })
