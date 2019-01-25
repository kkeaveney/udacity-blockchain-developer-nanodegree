const Blockchain = require('./simpleChain');
const Block = require('./block');


let bc = new Blockchain();


(function theLoop (i) {
  setTimeout(function () {
      console.log(i);
      let testBlock = new Block("Test Block - " + (i+1));
      bc.addBlock(testBlock ).then(() => {
          bc.getBlock(i).then(block => console.log(block))
          i++;
          if (i < 10) theLoop(i);
      });
  }, 10);
})(0);
