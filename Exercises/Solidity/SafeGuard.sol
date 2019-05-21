using safeMath for uint256;

    uint private counter = 1;

    modifier entrancyGuard(){
        counter = counter.add(1);
        uint guard = counter;
        _;
        //
        require(guard = counter, 'Thats not allowed');

    }
