const { expect } = require('chai')

const aclManager = require('./../src/aclManager.js')

describe('aclManager units', function() {
  beforeEach(function() {
    this.acl = new aclManager
  })

  describe('group()', function () {
    it('automatically adds groups that dont exist')

    it('returns existing groups if names match')
  })

  describe('originalGroups()', function () {
    it('returns only unique groups')
  })

  describe('canAll()', function () {
    it('returns true if you are allowed ALL of the scopes')
  })

  describe('canSome()', function () {
    it('returns true if you are allowed at least ONE of the scopes')
  })

  describe('can()', function () {
    it('is an alias for canAll()')
  })
})

