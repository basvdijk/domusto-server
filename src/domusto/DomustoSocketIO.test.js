var assert = require('assert');
// var mock = require('mock-require');

// let DomustoSocketIO = require('./DomustoSocketIO');

// mock('socketIO', { 
//     emit: function() {
//         return true;
//     }
// });

// var io = require('socketIO');




// describe('DomustoSocketIO', function() {

//   describe('#setIO()', function() {
//     it('should return -1 when the value is not present', function() {
//       assert.equal(-1, [1,2,3].indexOf(4));
//     });
//   });

// });


describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });

});