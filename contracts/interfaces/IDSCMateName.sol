pragma solidity ^0.5.6;

interface IDSCMateName {
    
    event Set(address indexed owner, uint256 indexed mateId, string name);
    
    function names(uint256 mateId) view external returns (string memory);
    function set(uint256 mateId, string calldata name) external;
}
