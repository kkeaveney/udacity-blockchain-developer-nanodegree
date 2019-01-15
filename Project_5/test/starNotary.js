
require('babel-register')();
require('babel-polyfill');

const StarNotary = artifacts.require('./starNotary.sol')

let instance;
let accounts;
const name = 'Mega Star 101!';
const tokenId = 1;

contract('StarNotary', async (accs) => {
    accounts = accs;

    let account1 = accounts[1];
    let account2 = accounts[2];
    let starPrice = web3.toWei(.01, "ether");

    instance = await StarNotary.deployed();
  });


  it('can Create a Star', async() => {
    let tokenId = 1;
    await instance.createStar(name, tokenId, {from: accounts[0]});
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), name);
  });


  it('The token name and token symbol are added properly', async() => {
    assert.equal(await instance.name.call(), 'StarToken');
    assert.equal(await instance.symbol.call(), 'KST');
  });


  it('Two users can exchange their stars', async() => {
    let user1 = accounts[1],
        user2 = accounts[2];

    let starId1 = 2,
        starId2 = 3;

    await instance.createStar('star1', starId1, {from: user1});
    await instance.createStar('star2', starId2, {from: user2});

    assert.equal(await instance.ownerOf.call(starId1), user1);
    assert.equal(await instance.ownerOf.call(starId2), user2);

    await instance.exchangeStars(starId1, starId2, {from: user1});

    assert.equal(await instance.ownerOf.call(starId1), user2);
    assert.equal(await instance.ownerOf.call(starId2), user1);
  });


  it('Stars Tokens can be transferred from one address to another', async() => {
    let user1 = accounts[1],
        user2 = accounts[2];

    let starId = 4;

    await instance.createStar('star', starId, {from: user1});
    assert.equal(await instance.ownerOf.call(starId), user1);

    await instance.transferStar(starId, user2, {from: user1});
    assert.equal(await instance.ownerOf.call(starId), user2);
  });
