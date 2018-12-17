'use strict'
const aclGroup = require('./aclGroup.js')

class aclManager {

  constructor()
  {
    //TODO: when launching, you should define whether you want to be permissive or exclusive in your permissions (i.e. Allow vs Deny as default)
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

  can(actions)
  {
    actions = [].concat(actions)

    return actions.every(action => {
      // Allowed if at least one of the groups allows the action to take place
      return this.groups.some(group => group.query(action))
    })
  }
}

module.exports = aclManager
