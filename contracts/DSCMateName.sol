pragma solidity ^0.5.6;

import "./klaytn-contracts/token/KIP17/IKIP17Enumerable.sol";
import "./klaytn-contracts/token/KIP7/KIP7Burnable.sol";
import "./klaytn-contracts/ownership/Ownable.sol";
import "./klaytn-contracts/math/SafeMath.sol";
import "./interfaces/IDSCMateName.sol";

contract DSCMateName is Ownable, IDSCMateName {
    using SafeMath for uint256;

    IKIP17Enumerable public mate;
    KIP7Burnable public token;
    uint256 public tokenAmountForChanging = 100 * 1e18;
    
    mapping(uint256 => string) public names;

    constructor(IKIP17Enumerable _mate) public {
        mate = _mate;
    }

    function setToken(KIP7Burnable _token) onlyOwner external {
        token = _token;
    }

    function setTokenAmountForChanging(uint256 amount) onlyOwner external {
        tokenAmountForChanging = amount;
    }

    function set(uint256 mateId, string calldata name) external {
        require(mate.ownerOf(mateId) == msg.sender);
        if (bytes(names[mateId]).length != 0 && address(token) != address(0)) {
            token.burnFrom(msg.sender, tokenAmountForChanging);
        }
        names[mateId] = name;
        emit Set(msg.sender, mateId, name);
    }
}
