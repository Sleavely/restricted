const { expect } = require('chai')

const aclManager = require('./../src/aclManager.js')

describe('README examples', function() {
  beforeEach(function() {
    this.acl = new aclManager
  })

  it('## About', function() {
    this.acl.group('users')
         .allow('user')
         .allow('user.view.email.own')
      .disallow('user.view.email')

    expect(this.acl.canAll([
      'user.register',
      'user.view',
      'user.view.email.own',
      'user.view.username',
      'user.view.photo',
    ], 'users')).to.be.true

    expect(this.acl.canAll([
      'user.view.email',
    ], 'users')).to.be.false
  })

  it('## Quick Start', function() {
    this.acl.group('guest')
      .alias('guests')
      .allow([
        'blogpost.view',
        'comment.view',
        'register',
      ])

    this.acl.group('user')
      .inherit('guest')
      .allow([
        'blogpost',
        'comment',
      ])
      .disallow('register')

      expect(this.acl.can('blogpost.edit', ['guest'])).to.be.false
      expect(this.acl.can('blogpost.edit', ['user'])).to.be.true
  })
})
