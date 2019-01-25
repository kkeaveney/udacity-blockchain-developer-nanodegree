
## Project overview

In this project, we built a Star Registry Service that allows users to claim ownership of their favorite star in the night sky.

## Project specification

https://review.udacity.com/#!/rubrics/2098/view

---

## Framework used

* [Express](http://expressjs.com/)
* [NodeJS](https://nodejs.org/en/)
* [LevelDB](http://leveldb.org/)

## Getting started

Open a command prompt or shell terminal after install node.js and execute:

```
npm install
```

```
npm init
```
- Install Express. Used as our web API framework. Make sure to provide **"--save"** flag to save dependency to our package.json

```
npm install express --save
```

- Install crypto-js. Used for sha256 hashing.

```
npm install crypto-js --save
```

- Install level. Used for persisting blockchain state.

```
npm install level --save
```

- Install body-parser. Used for parsing incoming request bodies.

```
npm install body-parser --save
```


- Install bitcoinjs-lib package. A javascript Bitcoin library for node.js and browsers.

```
npm install bitcoinjs-lib --save
```

- Install bitcoinjs-message package. This will be used to verify a bitcoin message.

```
npm install bitcoinjs-message --save
```

Install compression

```
npm install compression --save




### Running
Run the node application:

```
node index.js
```

If successful, it should display:

```
Listening on port 8000
```

### Testing

The following **6 API Block Endpoints** are as follows:

**POST BLOCK ENDPOINT**:
____

**1. Validates User Request**

Example:

```
http://localhost:8000/requestValidation
```
Post body
```
{
    "address": "TestAddress1"
}
```

Returns
```
{
  "address": "TestWalletAddress1",
  "message": "TestWalletAddress1:starRegistry",
  "requestTimeStamp": 1545652004793,
  "validationWindow": 300
}
```
**2.    Validates User Request**


Example:

```
http://localhost:8000/message-signature/validate
```
Post body
```
{
    "address": "TestWalletAddress1",
    "signature": "TestWalletSignature1"
}
```

Returns
```
{
    "registerStar": true,
    "status": {
        "address": "TestWalletAddress1",
        "message": "TestWalletAddress1:1545652004793:starRegistry",
        "requestTimeStamp": 1545652004793,
        "validationWindow": 221,
        "messageSignature": "valid"
    }
}
```


**3. Register a star**


Example:

```
http://localhost:8000/block
```
Post body
```
{
	"address" : "TestWalletAddress1",
	"star" : {
			"dec": "61° 52' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "Found star using https://www.google.com/sky/"
        }

}
```

Returns
```
{
  {
      "hash": "92a76b52bc520c6bd2bd3d8d72d98a0d6ac3de1dbd06561f58ad2e68e978f340",
      "height": 1,
      "body": {
          "address": "TestWalletAddress1",
          "star": {
              "dec": "61° 52' 56.9",
              "ra": "16h 29m 1.0s",
              "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
              "storyDecoded": "Found star using https://www.google.com/sky/"
          }
      },
      "time": "1545652236",
      "previousBlockHash": "c1d2b4473856cb3599edf26365b65a367622878659251d6e36c9e8605d4b5465"
  }
```

**GET BLOCK ENDPOINT**:
____
**4. Get stars by wallet address**

Example:

```
http://localhost:8000/stars/address:TestWalletAddress1
```
Returns
```
[
    {
        "hash": "92a76b52bc520c6bd2bd3d8d72d98a0d6ac3de1dbd06561f58ad2e68e978f340",
        "height": 1,
        "body": {
            "address": "TestWalletAddress1",
            "star": {
                "dec": "61° 52' 56.9",
                "ra": "16h 29m 1.0s",
                "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
                "storyDecoded": "Found star using https://www.google.com/sky/"
            }
        },
        "time": "1545652236",
        "previousBlockHash": "c1d2b4473856cb3599edf26365b65a367622878659251d6e36c9e8605d4b5465"
    }
]
```

**5. Get star by blockchain hash**

Example:

```
http://localhost:8000/stars/hash:92a76b52bc520c6bd2bd3d8d72d98a0d6ac3de1dbd06561f58ad2e68e978f340
```
Returns
```
{
    "hash": "92a76b52bc520c6bd2bd3d8d72d98a0d6ac3de1dbd06561f58ad2e68e978f340",
    "height": 1,
    "body": {
        "address": "TestWalletAddress1",
        "star": {
            "dec": "61° 52' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1545652236",
    "previousBlockHash": "c1d2b4473856cb3599edf26365b65a367622878659251d6e36c9e8605d4b5465"
}
```

**6. Get star by block height**

Example:

```
http://localhost:8000/block/1
```
Returns
```
{
    "hash": "92a76b52bc520c6bd2bd3d8d72d98a0d6ac3de1dbd06561f58ad2e68e978f340",
    "height": 1,
    "body": {
        "address": "TestWalletAddress1",
        "star": {
            "dec": "61° 52' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1545652236",
    "previousBlockHash": "c1d2b4473856cb3599edf26365b65a367622878659251d6e36c9e8605d4b5465"
}
```
