// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract OTCDesk {
    struct Deal {
        address userA;
        address userB;
        address tokenA;
        address tokenB;
        uint256 amountA;
        uint256 amountB;
        bool userADeposited;
        bool userBDeposited;
    }

    mapping(uint256 => Deal) public deals;
    uint256 public dealCount;

    event DealCreated(uint256 indexed dealId, address indexed userA, address indexed userB, address tokenA, address tokenB, uint256 amountA, uint256 amountB);
    event Deposited(uint256 indexed dealId, address indexed user, uint256 amount);
    event Withdrawn(uint256 indexed dealId, address indexed user, uint256 amount);

    function createDeal(
        address _userB,
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB
    ) external returns (uint256) {
        dealCount++;
        deals[dealCount] = Deal({
            userA: msg.sender,
            userB: _userB,
            tokenA: _tokenA,
            tokenB: _tokenB,
            amountA: _amountA,
            amountB: _amountB,
            userADeposited: false,
            userBDeposited: false
        });

        emit DealCreated(dealCount, msg.sender, _userB, _tokenA, _tokenB, _amountA, _amountB);
        return dealCount;
    }

    function deposit(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];
        require(msg.sender == deal.userA || msg.sender == deal.userB, "Not a participant in this deal");

        if (msg.sender == deal.userA) {
            require(!deal.userADeposited, "User A already deposited");
            IERC20(deal.tokenA).transferFrom(msg.sender, address(this), deal.amountA);
            deal.userADeposited = true;
        } else if (msg.sender == deal.userB) {
            require(!deal.userBDeposited, "User B already deposited");
            IERC20(deal.tokenB).transferFrom(msg.sender, address(this), deal.amountB);
            deal.userBDeposited = true;
        }

        emit Deposited(_dealId, msg.sender, msg.sender == deal.userA ? deal.amountA : deal.amountB);
    }

    function withdraw(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];
        require(deal.userADeposited && deal.userBDeposited, "Both users must deposit");
        require(msg.sender == deal.userA || msg.sender == deal.userB, "Not a participant in this deal");

        if (msg.sender == deal.userA) {
            uint256 amountB = deal.amountB;
            deal.amountB = 0;
            IERC20(deal.tokenB).transfer(deal.userA, amountB);
            emit Withdrawn(_dealId, deal.userA, amountB);
        } else if (msg.sender == deal.userB) {
            uint256 amountA = deal.amountA;
            deal.amountA = 0;
            IERC20(deal.tokenA).transfer(deal.userB, amountA);
            emit Withdrawn(_dealId, deal.userB, amountA);
        }
    }

    function cancelDeal(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];
        require(msg.sender == deal.userA || msg.sender == deal.userB, "Not a participant in this deal");

        if (msg.sender == deal.userA && deal.userADeposited) {
            uint256 amountA = deal.amountA;
            deal.amountA = 0;
            IERC20(deal.tokenA).transfer(deal.userA, amountA);
            deal.userADeposited = false;
            emit Withdrawn(_dealId, deal.userA, amountA);
        } else if (msg.sender == deal.userB && deal.userBDeposited) {
            uint256 amountB = deal.amountB;
            deal.amountB = 0;
            IERC20(deal.tokenB).transfer(deal.userB, amountB);
            deal.userBDeposited = false;
            emit Withdrawn(_dealId, deal.userB, amountB);
        }

        // Clear the deal to free up space
        if (!deal.userADeposited && !deal.userBDeposited) {
            delete deals[_dealId];
        }
    }
}
