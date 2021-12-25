const {
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");
const { assert } = require("hardhat");

contract("Prod - Presale limits", () => {
  let contractInstance = null;
  let signer;
  let owner;
  let acc1;
  let acc2;
  let acc3;

  before(async () => {
    const Contract = await ethers.getContractFactory("Carrier");
    contractInstance = await Contract.deploy();

    [owner, acc1, acc2, acc3] = await ethers.getSigners();
  });

  it("Airdrops tokens to a list of addresses", async () => {
    assert.isOk(
      await contractInstance.airdrop(1, [
        acc1.address,
        acc2.address,
        acc3.address,
      ])
    );
  });

  it("get's the correct URI after updating", async () => {
    // set the uri with {id}
    const newURI =
      "ipfs://QmTYBmerPZXCko76Pwxdttfypa9yre5HKrbtnq5RCv4bDD/{id}.json";
    await contractInstance.setURI(newURI);

    // call airdrop to create the token
    await contractInstance.airdrop(1, [acc1.address]);
    const result = await contractInstance.uri(1);

    function replaceIDPlaceholder(uri, id) {
      return uri.replace("{id}", id);
    }
    assert.equal(
      replaceIDPlaceholder(result, 1),
      "ipfs://QmTYBmerPZXCko76Pwxdttfypa9yre5HKrbtnq5RCv4bDD/1.json",
      "URI is incorrect"
    );
  });

  it("Airdrops 220 addresses", async () => {
    const addresses = require("./addresses220.json");

    assert.isOk(await contractInstance.airdrop(1, addresses));
  });
  it("Airdrops 500 addresses", async () => {
    const addresses = require("./addresses500.json");

    assert.isOk(await contractInstance.airdrop(1, addresses));
  });

  it("Handles multible batches of drops to the same tokenId", async () => {
    // drop batch 1
    await contractInstance.airdrop(2, [acc1.address, acc2.address]);
    // drop batch 2
    await contractInstance.airdrop(2, [acc2.address, acc3.address]);

    // total 4 sent^
    const result = await contractInstance.balanceOfBatch(
      [acc1.address, acc2.address, acc3.address],
      [2, 2, 2]
    );

    const totalSupply = result.reduce((acc, count) => {
      return acc + count.toNumber();
    }, 0);

    assert.equal(totalSupply, 4, "total supply does not match");
  });

  // it("Presale CANNOT mint above presale limit", async () => {
  //   const { hash: h, signature: s } = await sign(
  //     contractInstance.address,
  //     acc1.address
  //   );

  //   expectRevert(
  //     contractInstance.connect(acc1).presalePurchase(1, h, s, {
  //       value: ethers.utils.parseEther("0.08"),
  //     }),
  //     "Quantity exceeds per-wallet limit"
  //   );
  // });

  // it("Presale CAN mint above presale limit, UP TO public when public is open", async () => {
  //   const { hash: h, signature: s } = await sign(
  //     contractInstance.address,
  //     acc2.address
  //   );

  //   assert.isOk(
  //     await contractInstance.connect(acc2).presalePurchase(4, h, s, {
  //       value: ethers.utils.parseEther("0.32"),
  //     })
  //   );

  //   // open up pubic sales
  //   await contractInstance.setPresale(false);

  //   assert.isOk(
  //     await contractInstance.connect(acc2).purchase(6, {
  //       value: ethers.utils.parseEther("0.48"),
  //     })
  //   );

  //   // check balance
  //   const total = await contractInstance.balanceOf(acc2.address);

  //   assert.equal(total.toNumber(), 10, "wallet balance is not as expected");
  // });

  // it("Presale CANNOT mint above public limit after also maxing presale", async () => {
  //   // reset up presale
  //   await contractInstance.setPresale(true);

  //   const { hash: h, signature: s } = await sign(
  //     contractInstance.address,
  //     acc3.address
  //   );

  //   assert.isOk(
  //     await contractInstance.connect(acc3).presalePurchase(4, h, s, {
  //       value: ethers.utils.parseEther("0.32"),
  //     })
  //   );

  //   // open up pubic sales
  //   await contractInstance.setPresale(false);

  //   expectRevert(
  //     contractInstance.connect(acc3).presalePurchase(7, h, s, {
  //       value: ethers.utils.parseEther("0.56"),
  //     }),
  //     "Quantity exceeds per-wallet limit"
  //   );
  // });
});

// contract("Prod - Public & NO Wallet Limit", (accounts) => {
//   let contractInstance = null;

//   before(async () => {
//     contractInstance = await Contract.new(
//       "ipfs://cid",
//       params.keyHash,
//       params.vrfCoordinator,
//       params.linkToken,
//       params.linkFee,
//       params.wallets,
//       params.shares,
//       params.OSproxy
//     );
//     Strange.setAsDeployed(contractInstance);
//     await contractInstance.setPaused(false);
//     await contractInstance.setPresale(false);
//     await contractInstance.setWalletLimit(false);
//   });

//   after(async () => {
//     await contractInstance.setPresale(true);
//     await contractInstance.setWalletLimit(true);
//   });

//   it("Total per wallet MAY exceed limit if limit is turned off", async () => {
//     const supply = 0;
//     const firstBuy = 5;
//     const secondBuy = 4;
//     const quantity = firstBuy + secondBuy;
//     // First, buy the max of 5
//     await contractInstance.purchase(firstBuy, {
//       from: accounts[1],
//       value: web3.utils.toWei("1", "ether"),
//     });
//     // then try to buy some more
//     await contractInstance.purchase(secondBuy, {
//       from: accounts[1],
//       value: web3.utils.toWei("1", "ether"),
//     });
//     const supplyAfterPurchase = await contractInstance.maxTokenId();
//     assert.equal(
//       supplyAfterPurchase.toNumber() + 1,
//       supply + quantity,
//       "totals do not match"
//     );
//   });
// });

// contract("Gifting", (accounts) => {
//   before(async () => {
//     contractInstance = await Strange.new(
//       "ipfs://cid",
//       params.keyHash,
//       params.vrfCoordinator,
//       params.linkToken,
//       params.linkFee,
//       params.wallets,
//       params.shares,
//       params.OSproxy
//     );
//     Strange.setAsDeployed(contractInstance);
//   });

//   it("Increase Gift Supply", async () => {
//     await contractInstance.gift([accounts[1], accounts[2]]);
//     const totalGifts = await contractInstance.maxTokenId();

//     assert.equal(totalGifts.toNumber() + 1, 2);
//   });
// });

// contract("Token URI", (accounts) => {
//   let contractInstance = null;
//   before(async () => {
//     contractInstance = await Strange.new(
//       "ipfs://cid",
//       params.keyHash,
//       params.vrfCoordinator,
//       params.linkToken,
//       params.linkFee,
//       params.wallets,
//       params.shares,
//       params.OSproxy
//     );
//     Strange.setAsDeployed(contractInstance);
//     await contractInstance.setPresale(false);
//     await contractInstance.setPaused(false);
//     await contractInstance.gift([accounts[1]]);
//   });

//   it("Returns the baseURI + Token num when exists", async () => {
//     const revealURI = "https://test.io/cid/";
//     const expected = `${revealURI}0`;
//     await contractInstance.setBaseURI(revealURI);
//     const tokenURI = await contractInstance.tokenURI(0);

//     console.log({ tokenURI });
//     assert.equal(tokenURI, expected);
//   });

//   it("Returns Throws an errow if not minted", async () => {
//     expectRevert(
//       contractInstance.tokenURI(555),
//       "ERC721Metadata: tokenId does not exist"
//     );
//   });

//   it("Returns the baseURI + Token num when exists AND revealed", async () => {
//     const revealURI = "https://test.io/cid/";
//     const expected = `${revealURI}0`;
//     await contractInstance.setBaseURI(revealURI);
//     await contractInstance.setReveal(true);
//     const tokenURI = await contractInstance.tokenURI(0);

//     console.log({ tokenURI });
//     assert.equal(tokenURI, expected);
//   });
// });
