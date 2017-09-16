import { suite, test, it } from 'mocha-typescript';
import * as assert from 'assert';
import * as sinon from 'sinon';
import * as should from 'should';

import DomustoEmitter from './DomustoEmitter';

@suite
class DomustoEmitterTest {

    public static before() {
        // require chai and use should() assertions
        let chai = require('chai');
        chai.should();
    }

    @test('should create a new User')
    public create() {

        let spy = sinon.spy();

        DomustoEmitter.on('foo', spy);
        DomustoEmitter.emit('foo');
        spy.called.should.equal(true);

    }

}

// describe('DomustoEmitter', function () {
//     describe('#emit()', function () {
//         it('should invoke the callback', function () {
//             let spy = sinon.spy();

//             DomustoEmitter.on('foo', spy);
//             DomustoEmitter.emit('foo');
//             spy.called.should.equal(true);
//         });

//         it('should not invoke the callback on not subsribbed messages', function () {
//             let spy = sinon.spy();

//             DomustoEmitter.on('foo2', spy);
//             DomustoEmitter.emit('foo');
//             spy.called.should.equal(false);
//         });

//         it('should pass arguments to the callbacks', function () {
//             let spy = sinon.spy();

//             DomustoEmitter.on('foo', spy);
//             DomustoEmitter.emit('foo', 'bar', 'baz');
//             sinon.assert.calledOnce(spy);
//             sinon.assert.calledWith(spy, 'bar', 'baz');
//         });
//     });
// });