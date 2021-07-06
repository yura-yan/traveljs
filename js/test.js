describe('Timer', function() {
    it('Return a object', function() {
        assert.typeOf(getTimeRemaining(), 'object')
    });

    describe('Total amout', function() {
        it('Begin equal 0', function() {
            assert.equal(total, 0);
        });
    });
});