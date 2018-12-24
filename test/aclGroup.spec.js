const { expect } = require('chai')

const aclGroup = require('./../src/aclGroup.js')

describe('aclGroup', function () {
  beforeEach(function() {
    this.group = new aclGroup('guests')
  })

  it('is self-aware', function() {
    expect(this.group.name).to.equal('guests')
  })

  describe('default()', function () {
    it('is an alias for permissions.default()')
  })

  describe('alias()', function () {

    it('throws when an aclManager hasnt been attached')

    it('is stores a reference to the instance on the aclManager')

    it('throws when the alias already exists')

    it('supports string and array arguments')
  })

  describe('query()', function () {
    it('works')
  })

  describe('allow()', function () {
    it('works')
  })

  describe('disallow()', function () {
    it('works')
  })

  describe('forget()', function () {
    it('works')
  })

  describe('inherit()', function () {
    it('works')
  })

  describe('toJSON()', function () {
    it('works')
  })
})