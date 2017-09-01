var assert = require('assert');
var sinon = require('sinon');
var should = require('should');

var DomustoEmitter = require('./DomustoEmitter');

describe('DomustoEmitter', function () {
    describe('#emit()', function () {
        it('should invoke the callback', function () {
            var spy = sinon.spy();

            DomustoEmitter.on('foo', spy);
            DomustoEmitter.emit('foo');
            spy.called.should.equal.true;
        })

        it('should not invoke the callback on not subsribbed messages', function () {
            var spy = sinon.spy();

            DomustoEmitter.on('foo2', spy);
            DomustoEmitter.emit('foo');
            spy.called.should.equal.false;
        })

        it('should pass arguments to the callbacks', function () {
            var spy = sinon.spy();

            DomustoEmitter.on('foo', spy);
            DomustoEmitter.emit('foo', 'bar', 'baz');
            sinon.assert.calledOnce(spy);
            sinon.assert.calledWith(spy, 'bar', 'baz');
        })
    })
})