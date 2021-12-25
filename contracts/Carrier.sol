// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

/*
 * Extensible collection airdrop contract.
 *
 * by @NFTChef
 */
contract Carrier is ERC1155, ERC1155Supply, Ownable {
    // @dev: set the URI to your base URI here or call setURI later
    constructor() ERC1155("ipfs://null/{id}.json") {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    /*
     * @dev: Airdrop one token to each address in the calldata list,
     * setting the supply to the length of the list. skips bad addresses
     */
    function airdrop(uint256 _dropNumber, address[] calldata _list)
        public
        onlyOwner
    {
        for (uint256 i = 0; i < _list.length; i++) {
            _mint(_list[i], _dropNumber, 1, "");
        }
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
