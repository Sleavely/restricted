# restricted

_restricted_ gives you Access Control Lists (ACL) on user groups, with a declarative syntax.

## Quick Start

Our recommended implementation strategy is to initialize an aclManager and expose it as a module in your project, letting you interact with the same instance regardless of where in your codebase you are.

```js
const { aclManager } = require('restricted')

const acl = new aclManager

// Non-existent groups are created on the fly
acl.group('guest')
  .alias('guests')
  .allow([
    'blogpost.view',
    'comment.view',
    'register',
  ])

acl.group('user')
  .inherit('guest')
  .allow([
    'blogpost',
    'comment',
  ])
  .disallow('register')

module.exports = acl
```

To evaluate whether an ACL group is allowed to perform an action, query it:

```js
acl.group('user').query('blogpost.edit')
// -> true
```

We leave it up to you to decide how to manage memberships and when to actually check for permissions, but a rough implementation could look like this:

```js
class User {

  constructor()
  {
    this.permissionGroups = [
      'user',
    ]
  }

  can(action)
  {
    // First fetch the groups the user is a member of
    const groupMemberships = this.permissionGroups.map(groupName => acl.group(groupName))
    return groupMemberships.some(group => group.query(action))
  }
}

// ...

user.can('blogpost.edit')
```
