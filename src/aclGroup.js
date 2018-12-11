'use strict'

class aclGroup {

  constructor(name, aclManager)
  {
    this.name = name
    this.aclManager = aclManager
    this.permissions = []
  }

  alias(aliases)
  {
    aliases = [].concat(aliases)

    aliases.forEach(alias => {
      this.aclManager.groups[alias] = this
    })

    return this
  }

  query(actions)
  {
    actions = [].concat(actions)

    return actions.every(action => {
      if(this.permissions.includes(action)) return true

      // If there is no direct match, lets look for more generic namespaces
      const hasUpperLevelPermission = this.permissions.some(permission => {
        return (permission.length > 0 && action.indexOf(permission) === 0)
      })

      return hasUpperLevelPermission
    })
  }

  allow(actions)
  {
    actions = [].concat(actions)

    actions.forEach(action => {
      // Lets allow more generic namespaces to take precedent
      const alreadyExists = this.permissions.find(permission => {
        return permission.length > 0 && action.indexOf(permission) === 0
      })
      // .. but add if we cant find one
      if(!alreadyExists)
      {
        this.permissions.push(action)
        // TODO: check if this new action has made other, more specific ones redundant?
      }
    })

    return this
  }

  disallow(actions)
  {
    actions = [].concat(actions)

    actions.forEach(action => {
      // The downside of how allowing multi-layered permissions is that
      // we cant disallow "user.edit" if you have full access to "user".
      // However, we can do an inverted version of how we add, so if you
      // try to disallow "user" it will revoke permissions for "user.edit".

      this.permissions.forEach((permission, i) => {
        if(action.length > 0 && permission.indexOf(action) === 0)
        {
          //TODO: If removing multiple, the index might be off by one
          // after the forst has been spliced
          this.permissions.splice(i,1)
        }
      })
    })

    return this
  }

  inherit(groups)
  {
    groups = [].concat(groups)

    groups.forEach(groupName => {
      this.allow(this.aclManager.group(groupName).permissions)
    })

    return this
  }
}

module.exports = aclGroup
