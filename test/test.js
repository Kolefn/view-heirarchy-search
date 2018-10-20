var assert = require('assert');
var {searchHeirarchy, getHeirarchy, parseInput} = require('../index');
var heirarchy = require('./heirarchy');

describe('index', function() {
  describe('#getHeirarchy()', function() {
    it('should return a valid JS object.', function() {
      getHeirarchy().then((data)=> assert.ok(typeof data == 'object')).catch(assert.fail);
    });
  });

  describe ('#parseInput()', function(){
    it('should parse identifiers correctly', function(){
      assert.deepEqual( parseInput('#System'), [{type: 'identifier', value: 'System'}] );
    });

    it('should parse classes correctly', function(){
      assert.deepEqual( parseInput('StackView'), [{type: 'class', value: 'StackView'}] );
    });

    it('should parse class names correctly', function(){
      assert.deepEqual( parseInput('.container'), [{type: 'classNames', value: 'container'}] );
    });

    it('should parse compound selectors correctly', function(){
      assert.deepEqual( parseInput('View#body'), [{type: 'class', value: 'View'}, {type: 'identifier', value: 'body'}] );
    });

    it('should parse selector chains correctly', function(){
      assert.deepEqual( parseInput('StackView .container'), [{type: 'class', value: 'StackView'}, {type: 'classNames', value: 'container'}] );
    });

  });

  describe('#searchHeirarchy()', function(){
    it('should return a valid JSON.', function(){
      assert.ok( typeof searchHeirarchy(heirarchy, '#System') == 'object');
    });

    it('should return empty array for invalid input.', function(){
      assert.equal(searchHeirarchy(heirarchy).length, 0);
      assert.equal(searchHeirarchy(heirarchy, [{type: null, value: 'container'}]).length, 0);
      assert.equal(searchHeirarchy(heirarchy, [{type: 'class', value: null}]).length, 0);
    });

    it('should return correct number of views for a class selector.', function(){
      assert.equal(searchHeirarchy(heirarchy, parseInput('Input')).length, 26);
    });

    it('should return correct number of views for a className selector.', function(){
      assert.equal(searchHeirarchy(heirarchy,parseInput('.container')).length, 6);
    });

    it('should return correct number of views for an identifier selector.', function(){
      assert.equal(searchHeirarchy(heirarchy, parseInput('#videoMode')).length, 1);
    });

    it('should return correct number of views for a compound selector.', function(){
      assert.equal(searchHeirarchy(heirarchy, parseInput('CvarSelect#anisotropy')).length, 1);
      assert.equal(searchHeirarchy(heirarchy, parseInput('.accessoryView#apply')).length, 1);
    });

    it('should return correct number of views for a selector chain.', function(){
      assert.equal(searchHeirarchy(heirarchy, parseInput('StackView CvarSlider')).length, 13);
      assert.equal(searchHeirarchy(heirarchy, parseInput('StackView .accessoryView')).length, 1);
    });
  });
});
