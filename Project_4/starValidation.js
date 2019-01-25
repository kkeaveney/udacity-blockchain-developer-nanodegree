const db = require('level')('./data/star');
const bitcoinMessage = require('bitcoinjs-message');

class StarValidation {
  constructor (req) {
    this.req = req;
  }


  validateAddress() {
    if (!this.req.body.address) {
      throw new Error ('add the address parameter');
    }
    return true;
  }

  validateSignature() {
  if (!this.req.body.signature) {
    throw new Error('add the signature parameter')
  }
}

  validateNewStarRequest() {
    const MAXIMUM_STORY_BYTES = 500;
    const { star } = this.req.body;
    const {dec, ra, story} = star;

    if (!this.validateAddress() || !this.req.body.star) {
      throw new Error('add the star and address parameters');
    }

    if (typeof dec !== 'string' || typeof ra != 'string' || typeof story !== 'string' || !dec.length || !ra.length || !story.length){
      throw new Error("Star information should include non-empty string properties 'dec', 'ra' and 'story'");
    }

    if(new Buffer(story).length > MAXIMUM_STORY_BYTES) {
      throw new Error('Star story is too long, maximum size is 500 bytes');
    }

    const isASCII = ((str) => /^[\x00-\x7F]*$/.test(str))

    if (!isASCII(story)){
      throw new Error('Star story contains non-ASCII symbols');
    }

  }

    isValid() {
      return db.get(this.req.body.address)
        .then ((value) => {
          value = JSON.parse(value)
          return value.messageSignature === 'valid'
        })
        .catch(() => {throw new Error ('Unable to authorise')})
    }

    invalidate(address) {
      db.del(address);
    }

    async validateMessageSignature(address, signature) {
      return new Promise((resolve, reject) => {
        db.get(address, (error, value) => {
          if (value === undefined) {
            return reject(new Error('Not found'))
          } else if (error) {
            return reject(error)
          }

          value = JSON.parse(value)

          if (value.messageSignature === 'valid') {
            return resolve({
              registerStar: true,
              status: value
          })
          } else {
            const nowSubFiveMinutes = Date.now() - (5 * 60 * 1000)
            const isExpired = value.requestTimeStamp < nowSubFiveMinutes
            let isValid = false

            if (isExpired) {
                value.validationWindow = 0
                value.messageSignature = 'Validation window was expired'
            } else {
                value.validationWindow = Math.floor((value.requestTimeStamp - nowSubFiveMinutes) / 1000)

                try {
                  isValid = bitcoinMessage.verify(value.message, address, signature)
                } catch (error) {
                  isValid = false
                }

                value.messageSignature = isValid ? 'valid' : 'invalid'
            }

            db.put(address, JSON.stringify(value))

            return resolve({
                registerStar: !isExpired && isValid,
                status: value
            })
          }
        })
      })
    }

    saveNewRequestValidation (address) {
      const timestamp = Date.now()
      const message = `${address}:${timestamp}:starRegistry`
      const validationWindow = 300

      const data = {
        address: address,
        message: message,
        requestTimeStamp: timestamp,
        validationWindow: validationWindow
      }

      db.put(data.address, JSON.stringify(data))

      return data
    }

    async getPendingAddressRequest(address) {
      return new Promise((resolve, reject) => {
        db.get(address, (error, value) => {
          if (value === undefined) {
            return reject(new Error('Not found'))
          } else if (error) {
            return reject(error)
          }

          value = JSON.parse(value)

          const nowSubFiveMinutes = Date.now() - (5 * 60 * 1000)
          const isExpired = value.requestTimeStamp < nowSubFiveMinutes

          if (isExpired) {
              resolve(this.saveNewRequestValidation(address))
          } else {
            const data = {
              address: address,
              message: value.message,
              requestTimeStamp: value.requestTimeStamp,
              validationWindow: Math.floor((value.requestTimeStamp - nowSubFiveMinutes) / 1000)
            }

            resolve(data)
          }
        })
      })
    }


    saveNewRequestValidation (address) {
      const timestamp = Date.now()
      const message = `${address}:${timestamp}:starRegistry`
      const validationWindow = 300

      const data = {
        address: address,
        message: message,
        requestTimeStamp: timestamp,
        validationWindow: validationWindow
      }

      db.put(data.address, JSON.stringify(data))

      return data
    }

  async getPendingAddressRequest(address) {
    return new Promise((resolve, reject) => {
      db.get(address, (error, value) => {
        if (value === undefined) {
          return reject (new Error ('Not Found'))
        } else if (error) {
          return reject (error)
        }

        value = JSON.parse(value)

        const nowSubFiveMinutes = Date.now() - (5 * 60 * 1000);
        const isExpired = value.requestTimeStamp < nowSubFiveMinutes;

        if(isExpired) {
          resolve(this.saveNewRequestValidation(address))
        } else {
          const data = {
            address: address,
            message: value.message,
            requestTimeStamp: value.requestTimeStamp,
            validationWindow: Math.floor((value.requestTimeStamp - nowSubFiveMinutes) / 1000)

          }
          resolve(data)
        }
      })
    })
  }
}

  module.exports = StarValidation;
