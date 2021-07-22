pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract Child {
    mapping(uint256 => uint256) public values;
    
    function exec() external returns (uint256) {
        for (uint256 i = 0; i < 100; i++) values[i] += 1;
        return values[0];
    }

    function get() external view returns (uint256) {
        return values[0];
    }
}

contract Caller {
    event Gas(uint256 gas);
    
    address public impl; // placeholder for non-1967 proxies
    mapping(uint256 => uint256) public values;
    
    function testView(Child child) external view returns (uint256) {
        return child.get();
    }

    function testNoCall(Child child) external returns (uint256) {
        for (uint256 i = 1000; i < 1200; i++) values[i] += 1;

        uint256 startGas = gasleft();
        emit Gas(startGas);
        for (uint256 i = 0; i < 100; i++) values[i] += 1;
        uint256 endGas = gasleft();
        emit Gas(endGas);
        unchecked {
          uint256 requiredGas = startGas - endGas;  
          return requiredGas;
        }
    }

    function testCall(Child child) external returns (uint256) {
        for (uint256 i = 1000; i < 1200; i++) values[i] += 1;

        uint256 startGas = gasleft();
        emit Gas(startGas);
        child.exec();
        uint256 endGas = gasleft();
        emit Gas(endGas);
        unchecked {
          uint256 requiredGas = startGas - endGas;  
          return requiredGas;
        }
    }

    function testWorkBeforeCall(Child child) external returns (uint256) {
        for (uint256 i = 1000; i < 1200; i++) values[i] += 1;
        
        uint256 startGas = gasleft();
        emit Gas(startGas);
        for (uint256 i = 0; i < 100; i++) values[i] += 1;
        child.exec();
        uint256 endGas = gasleft();
        emit Gas(endGas);
        unchecked {
          uint256 requiredGas = startGas - endGas;  
          return requiredGas;
        }
    }

    function testWorkAfterCall(Child child) external returns (uint256) {
        for (uint256 i = 1000; i < 1200; i++) values[i] += 1;

        uint256 startGas = gasleft();
        emit Gas(startGas);
        child.exec();
        for (uint256 i = 0; i < 100; i++) values[i] += 1;
        uint256 endGas = gasleft();
        emit Gas(endGas);
        unchecked {
          uint256 requiredGas = startGas - endGas;  
          return requiredGas;
        }
    }
    
    function testRevert(Child child) external returns (uint256) {
        for (uint256 i = 1000; i < 1200; i++) values[i] += 1;
        
        uint256 startGas = gasleft();
        emit Gas(startGas);
        // value += 1;
        child.exec();
        uint256 endGas = gasleft();
        emit Gas(endGas);
        unchecked {
          uint256 requiredGas = startGas - endGas;  
          revert(string(abi.encodePacked(requiredGas)));
        }        
    }
}