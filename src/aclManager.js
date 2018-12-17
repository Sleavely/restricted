'use strict'
const aclGroup = require('./aclGroup.js')

class aclManager {

  constructor()
  {
    this.groups = {}
  }

  originalGroups()
  {
    return [...(new Set(Object.values(this.groups)))]
  }

  group(name)
  {
    if(!this.groups[name]) {
      this.groups[name] = new aclGroup(name, this)
    }
    return this.groups[name]
  }

  can(actions, groups)
  {
    return this.canAll(actions, groups)
  }
  canAll(actions, groups)
  {
    actions = [].concat(actions)
    groups = [].concat(groups)

    return actions.every(action => {
      // Allowed if at least one of the groups allows the action to take place
      return groups.some(group => this.group(group).query(action))
    })
  }

  canSome(actions, groups)
  {
    actions = [].concat(actions)
    groups = [].concat(groups)

    return actions.some(action => {
      // Allowed if at least one of the groups allows the action to take place
      return groups.some(group => this.group(group).query(action))
    })
  }
}

module.exports = aclManager
