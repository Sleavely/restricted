'use strict'

const PermissionScopeManager = require('./permissionScopeManager.js')

class AclGroup {
  constructor (name, aclManager) {
    this.name = name
    this.aclManager = aclManager
    this.permissions = new PermissionScopeManager()
  }

  default (allowed) {
    this.permissions.default(allowed)

    return this
  }

  alias (aliases) {
    if (!this.aclManager) throw new Error('You cant create aliases without an aclManager attached to the group')

    aliases = [].concat(aliases)

    aliases.forEach(alias => {
      if (this.aclManager.groups[alias]) throw new Error(`The alias ${JSON.stringify(alias)} already exists`)
      this.aclManager.groups[alias] = this
    })

    return this
  }

  query (actions) {
    actions = [].concat(actions)

    return actions.every(action => {
      // TODO: what happens in the case of true+undefined+true ?
      return this.permissions.evaluate(action)
    })
  }

  allow (actions) {
    actions = [].concat(actions)

    actions.forEach(action => {
      this.permissions.set(action, true)
    })

    return this
  }

  disallow (actions) {
    actions = [].concat(actions)

    actions.forEach(action => {
      this.permissions.set(action, false)
    })

    return this
  }

  forget (actions) {
    actions = [].concat(actions)

    actions.forEach(action => {
      this.permissions.remove(action)
    })

    return this
  }

  inherit (groups) {
    groups = [].concat(groups)

    groups.forEach(groupName => {
      const groupPermissions = this.aclManager.group(groupName).permissions
      groupPermissions.list().forEach(scope => {
        groupPermissions.get(scope) ? this.allow(scope) : this.disallow(scope)
      })
    })

    return this
  }

  toJSON () {
    return this.permissions.toJSON()
  }
}

module.exports = AclGroup
