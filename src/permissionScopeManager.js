'use strict'

const _ = {
  get: require('lodash.get'),
  set: require('lodash.set'),
  unset: require('lodash.unset'),
}

class PermissionScopeManager {

  constructor()
  {
    this.permissionMap = {}
  }

  default(allowed)
  {
    this.permissionMap['$'] = allowed
  }

  evaluate(prop)
  {
    // Start with foo.bar.baz, then try foo.bar, etc.
    const scopeComponents = prop.split('.')
    for(let i = scopeComponents.length; i > 0; i--)
    {
      const scope = scopeComponents.slice(0,i).join('.')
      if (typeof this.get(scope) !== 'undefined') return this.get(scope)
    }
    // Default
    return this.permissionMap['$']
  }

  get(scope)
  {
    return _.get(this.permissionMap, scope + '.$')
  }
  set(scope, val)
  {
    return _.set(this.permissionMap, scope + '.$', !!val)
  }
  remove(scope) {
    return _.unset(this.permissionMap, scope + '.$')
  }

  // List all scopes that have an explicit setting
  list(foundPaths, currentPath)
  {
    foundPaths = foundPaths || []

    const targetObj = (!currentPath ? this.permissionMap : _.get(this.permissionMap, currentPath))
    for(let nextPath in targetObj)
    {
      if (nextPath === '$' && typeof targetObj[nextPath] !== 'undefined') foundPaths.push(currentPath)
      if (nextPath !== '$') foundPaths = this.list(foundPaths, (currentPath ? currentPath + '.' : '') + nextPath)
    }
    return foundPaths
  }

  toJSON() {
    return this.list().sort().reduce((output, scope) => {
      output[scope] = this.get(scope)
      return output
    }, {})
  }
}

module.exports = PermissionScopeManager
