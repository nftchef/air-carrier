(extensible) airdrop collection contract

This is a very simple mint + airdrop contract that can handle future airdrops to the same collection using the `dropID` to mint and add to a token supply. This contract is intended to reward the holders of any given token by first taking a snapshot of the holder addresses. You can however use this to airdrop to any list of addresses.

Be kind, Don't spam.

# Airdropping

```js
function airdrop(uint256 _dropNumber, address[] calldata _list)
```

use the airdrop function to mint and send tokens to/form a given token id using the `_dropNumber` parameter.

In instances where the `_list` calldata is too large for a single tx, the airdrop can be batched into multiple tx by supplying the _same_ `_dropNumber`. `_dropNumber` is the `tokenID`.

`_list` with 500 addresses uses `14822307` gas. This is a pretty costly airdrop if dropping to thousands of addresses on Ethereum. It is intended for Polygon (or other EVM's) or smaller airdrops.

# testing

```
npx hardhat test
```

Included in the test directory are a few long lists valid, but dummy wallet addresses created with https://github.com/nftchef/Eth-Tools
