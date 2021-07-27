pragma solidity ^0.5.6;

import "./klaytn-contracts/token/KIP17/IKIP17Enumerable.sol";
import "./klaytn-contracts/math/SafeMath.sol";
import "./interfaces/IDSCMateName.sol";

contract DSCMateName is IDSCMateName {
    using SafeMath for uint256;

    IKIP17Enumerable public mate;
    
    mapping(uint256 => string) public names;

    constructor(IKIP17Enumerable _mate) public {
        mate = _mate;
    }

    function set(uint256 mateId, string calldata name) external {
        require(mate.ownerOf(mateId) == msg.sender);
        names[mateId] = name;
        emit Set(msg.sender, mateId, name);
    }
}
