const { expect } = require('chai')

const PermissionScopeManager = require('./../src/permissionScopeManager.js')

describe('PermissionScopeManager', function(){

  beforeEach(function(){
    this.scopes = new PermissionScopeManager
  })

  describe('get()', function () {

    it('returns undefined for non-existent and empty scopes', function() {
      this.scopes.permissionMap = {
        user: {
          edit: { '$': false }
        }
      }
      // If you're reading the test suite to understand what's going on, have a look at .evaluate() instead
      expect(this.scopes.get('user')).to.be.undefined

    })

    it('retrieves set scopes', function() {
      this.scopes.permissionMap = {
        user: {
          edit: { '$': false },
          view: { '$': true }
        }
      }
      expect(this.scopes.get('user.edit')).to.be.false
      expect(this.scopes.get('user.view')).to.be.true
    })

    it('can look at multi-level undefines without exploding', function() {
      expect(this.scopes.get('user.hack.computer')).to.be.undefined
    })
  })

  describe('set()', function () {

    it('sets the value on a scope', function() {
      this.scopes.set('user', true)
      expect(this.scopes.permissionMap).to.have.property('user')
      expect(this.scopes.permissionMap.user).to.have.property('$', true)
    })

    it('can update existing scope values', function() {
      this.scopes.permissionMap = {
        user: {'$': true}
      }
      this.scopes.set('user', false)
      expect(this.scopes.permissionMap.user['$']).to.be.false
    })

    it('creates nested tree when setting a multi-tiered scope', function() {
      this.scopes.set('user.edit.name', true)
      expect(this.scopes.permissionMap).to.have.property('user')
      expect(this.scopes.permissionMap.user).to.have.property('edit')
      expect(this.scopes.permissionMap.user.edit).to.have.property('name')
      expect(this.scopes.permissionMap.user.edit.name).to.have.property('$', true)
    })
  })

  describe('remove()', function () {
    it('does not break when removing a non-existent scope', function() {
      this.scopes.remove('foo.bar')
      expect(this.scopes.permissionMap).to.not.have.property('foo')
    })

    it('removing a parent does not remove explicitly set children', function() {
      this.scopes.set('page', true)
      this.scopes.set('page.login', true)
      expect(this.scopes.permissionMap.page).to.have.property('$', true)
      this.scopes.remove('page')
      expect(this.scopes.permissionMap).to.have.property('page')
      expect(this.scopes.permissionMap.page).to.not.have.property('$')
      expect(this.scopes.permissionMap.page).to.have.property('login')

    })
  })

  describe('evaluate()', function () {

    it('returns the value of a scope', function() {
      this.scopes.set('foo.bar.baz', true)
      expect(this.scopes.evaluate('foo.bar.baz')).to.be.true
    })

    it('traverses upwards until it finds an existing scope', function() {
      this.scopes.set('blog', true)
      expect(this.scopes.evaluate('blog.comment.post')).to.be.true
      expect(this.scopes.evaluate('user.edit.name')).to.be.undefined
    })

    it('can have explicitly disallowed paths in a generally allowed tree', function() {
      this.scopes.set('user', true)
      this.scopes.set('user.edit.password', false)
      expect(this.scopes.evaluate('user')).to.be.true
      expect(this.scopes.evaluate('user.edit')).to.be.true
      expect(this.scopes.evaluate('user.edit.password')).to.be.false
      expect(this.scopes.evaluate('user.edit.password.plaintext')).to.be.false
      expect(this.scopes.evaluate('user.edit.photo')).to.be.true
    })
  })

  describe('default()', function () {
    it('lets you set a default value', function () {
      expect(this.scopes.evaluate('foo.bar.doesnt.exist')).to.be.undefined
      this.scopes.default(true)
      expect(this.scopes.evaluate('foo.bar.doesnt.exist')).to.be.true
    })
  })

  describe('list()', function () {
    it('returns explicitly defined scopes', function () {
      this.scopes.set('user.edit.name', true)
      this.scopes.set('user.edit', false)
      expect(this.scopes.list()).to.deep.equal(['user.edit.name', 'user.edit'])
    })
  })

  describe('toJSON()', function () {
    it('serializes a list of defined scopes when stringified', function() {
      this.scopes.set('user.edit', true)
      expect(JSON.stringify(this.scopes)).to.equal('{"user.edit":true}')
    })
  })

})
