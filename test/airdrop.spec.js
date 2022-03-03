const {
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");
const { ethers } = require("hardhat");
const { assert } = require("chai");

describe("========= AIRDROP ===========", () => {
  const uri = "https://startingURI/{1}.json";
  let contractInstance = null;
  let owner;
  let acc1;
  let acc2;
  let acc3;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("Carrier");
    contractInstance = await Contract.deploy(uri);

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

  it("sets the uri from deployment", async () => {
    assert.equal(await contractInstance.uri(1), uri, "URI Not set");
  });

  it("get's the correct URI after updating", async () => {
    // set the uri with {id}
    const newURI =
      "ipfs://QmTYBmerPZXCko76Pwxdttfypa9yre5HKrbtnq5RCv4bDD/{id}.json";
    await contractInstance.setURI(newURI);

    // call airdrop to create the token
    await contractInstance.airdrop(1, [acc1.address]);
    const result = await contractInstance.uri(1);

    // This replicates a standard {id} replacement handled off-chain
    // by marketplaces and wallets.
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

  it("Handles multiple batches of drops to the same tokenId", async () => {
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

  it("Batch Mint tokens to a single address", async () => {
    const startBalance = await contractInstance.balanceOf(acc3.address, 1);
    assert.equal(startBalance.toNumber(), 0, "start balance is not 0");

    await contractInstance.batchMint(1, acc3.address, 50);
    const endBalance = await contractInstance.balanceOf(acc3.address, 1);

    assert.equal(endBalance.toNumber(), 50, "Tokens not all minted to address");
  });

  it("transfer ownership", async () => {
    await expectRevert(
      contractInstance.connect(acc1).airdrop(1, [acc1.address]),
      "Ownable: caller is not the owner"
    );

    await contractInstance.transferOwnership(acc1.address);
    assert.isOk(
      await contractInstance.connect(acc1).airdrop(1, [acc1.address]),
      "New owner cannot airdrop"
    );
  });
});
