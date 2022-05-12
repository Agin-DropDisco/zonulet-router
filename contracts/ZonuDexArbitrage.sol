pragma solidity ^0.6.6  ;

import './libraries/ZonuDexLibrary.sol';
import './interfaces/IZonuDexRouter.sol';
import './interfaces/IZonuDexPair.sol';
import './interfaces/IZonuDexFactory.sol';
import './interfaces/IERC20.sol';

contract ZonuDexArbitrage {
  address public factory;
  uint constant deadline = 10 days;
  IZonuDexRouter public zonuDexRoute;

  constructor(address _factory, address _zonuDexRoute) public {
    factory = _factory;  
    zonuDexRoute = IZonuDexRouter(_zonuDexRoute);
  }

  function startZonuDexArbitrage(
    address token0, 
    address token1, 
    uint amount0, 
    uint amount1
  ) external {
    address pairAddress = IZonuDexFactory(factory).getPair(token0, token1);
    require(pairAddress != address(0), 'This pool does not exist');
    IZonuDexPair(pairAddress).swap(
      amount0, 
      amount1, 
      address(this), 
      bytes('not empty')
    );
  }

  function uniswapV2Call(
    address _sender, 
    uint _amount0, 
    uint _amount1, 
    bytes calldata _data
  ) external {
    address[] memory path = new address[](2);
    uint amountToken = _amount0 == 0 ? _amount1 : _amount0;
    address token0 = IZonuDexPair(msg.sender).token0();
    address token1 = IZonuDexPair(msg.sender).token1();

    require(
      msg.sender == ZonuDexLibrary.pairFor(factory, token0, token1), 
      'Unauthorized'
    ); 
    require(_amount0 == 0 || _amount1 == 0);

    path[0] = _amount0 == 0 ? token1 : token0;
    path[1] = _amount0 == 0 ? token0 : token1;

    IERC20 token = IERC20(_amount0 == 0 ? token1 : token0);
    
    token.approve(address(zonuDexRoute), amountToken);

    uint amountRequired = ZonuDexLibrary.getAmountsIn(
      factory, 
      amountToken, 
      path
    )[0];
    uint amountReceived = zonuDexRoute.swapExactTokensForTokens(
      amountToken, 
      amountRequired, 
      path, 
      msg.sender, 
      deadline
    )[1];

    IERC20 otherToken = IERC20(_amount0 == 0 ? token0 : token1);
    otherToken.transfer(msg.sender, amountRequired);
    otherToken.transfer(tx.origin, amountReceived - amountRequired);
  }
}