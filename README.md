# restricted [![Build Status](https://travis-ci.org/Sleavely/restricted.svg?branch=master)](https://travis-ci.org/Sleavely/restricted)

[Github](https://github.com/Sleavely/restricted) | [NPM](https://www.npmjs.com/package/restricted) | [Travis](https://travis-ci.org/Sleavely/restricted)

_restricted_ gives you scoped Access Control Lists (ACL) for user groups.


* [Quick Start](#quick-start)
* [API](#api)
* [License](#license)

---

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

We leave it up to you to decide how to manage memberships and when to actually check for permissions, but a rough implementation could look like this:

```js
class User {
  constructor() {
    this.groupMemberships = [
      'user'
    ]
  }

  can(action) {
    return acl.can(action, this.groupMemberships)
  }
}

// ... then, in your business logic:

user.can('blogpost.edit')
```

---

## API

  * <a href="#aclmanager-constructor"><code>new <b>aclManager</b></code></a>
    * <a href="#aclmanager-group"><code>aclManager<b>#group()</b></code></a>
    * <a href="#aclmanager-can"><code>aclManager<b>#can()</b></code></a>
    * <a href="#aclmanager-canall"><code>aclManager<b>#canAll()</b></code></a>
    * <a href="#aclmanager-cansome"><code>aclManager<b>#canSome()</b></code></a>

  * <a href="#aclgroup-constructor"><code><b>aclGroup</b></code></a>
    * <a href="#aclgroup-default"><code>aclGroup<b>#default()</b></code></a>
    * <a href="#aclgroup-alias"><code>aclGroup<b>#alias()</b></code></a>
    * <a href="#aclgroup-query"><code>aclGroup<b>#query()</b></code></a>
    * <a href="#aclgroup-allow"><code>aclGroup<b>#allow()</b></code></a>
    * <code>aclGroup<b>#disallow()</b></code>
    * <code>aclGroup<b>#forget()</b></code>
    * <code>aclGroup<b>#inherit()</b></code>

---
<a name="aclmanager-constructor"></a>
### new aclManager()

The main class that keeps track of your defined groups, and lets you evaluate against them.

```js
const acl = new aclManager
```

---
<a name="aclmanager-group"></a>
#### aclManager#group(name)

Find an ACL group by name or alias. Creates it if it does not exist.

Returns [`aclGroup`](#aclgroup-constructor)

---
<a name="aclmanager-can"></a>
#### aclManager#can(scopes, groups)

Alias for [canAll()](#aclmanager-canall)

  * `scopes` - a single scope as a string, or an array of several scopes
  * `groups` - a single group name as a string, or an array

Returns `boolean`

---
<a name="aclmanager-canall"></a>
#### aclManager#canAll(scopes, groups)

Evaluate whether the combination of groups can access all of the scopes.

  * `scopes` - a single scope as a string, or an array of several scopes
  * `groups` - a single group name as a string, or an array

Returns `boolean`

---
<a name="aclmanager-cansome"></a>
#### aclManager#canSome(scopes, groups)

Evaluate whether any of the groups is allowed at least one of the scopes.

  * `scopes` - a single scope as a string, or an array of several scopes
  * `groups` - a single group name as a string, or an array

Returns `boolean`

---
<a name="aclmanager-originalgroups"></a>
#### aclManager#originalGroups()

Retrieve a list of unique (excluding aliases) [`aclGroup`](#aclgroup-constructor)s that have been defined.

Returns `array` of [`aclGroup`](#aclgroup-constructor)

---
<a name="aclgroup-constructor"></a>
### aclGroup

ACL groups are automatically initialized by the manager when you call [`aclManager#group()`](#aclmanager-group), so normally you wouldn't deal with the constructor itself.

However, if you're into hacking, the call signature is `new aclGroup(name, aclManager)`, where `aclManager` is the reference to the parent class.

---
<a name="aclgroup-default"></a>
#### aclGroup#default(allowed)

  * `allowed` - the fallback state for this group. Can be one of `true`, `false`, `undefined` (default)

Returns [`aclGroup`](#aclgroup-constructor)

---
<a name="aclgroup-alias"></a>
#### aclGroup#alias(aliases)

Register a nickname for the ACL group in the [`aclManager`](#aclmanager-constructor)

  * `aliases` - a single group name as a string, or an array

Returns [`aclGroup`](#aclgroup-constructor)

---
<a name="aclgroup-query"></a>
#### aclGroup#query(scopes)

Evaluate whether the group has access to the scope(s).

  * `scopes` - a single permission scope as a string, or an array of multiple scopes that the group must be able to access all of.

Returns `boolean`

---
<a name="aclgroup-allow"></a>
#### aclGroup#allow(scopes)

Define scope(s) that the group can access.

  * `scopes` - a single permission scope as a string, or an array of multiple scopes

Returns [`aclGroup`](#aclgroup-constructor)

```js
aclManager.group('logged-in')
  .allow('profile.edit')
  .allow(['user.logout', 'comment'])

aclManager.can('profile.edit.photo', 'user') // true
```

---
<a name="aclgroup-disallow"></a>
#### aclGroup#disallow(scopes)

Define scope(s) that the group is not allowed to access.

  * `scopes` - a single permission scope as a string, or an array of multiple scopes

Returns [`aclGroup`](#aclgroup-constructor)

```js
aclManager.group('guest')
     .allow('comment.own')
  .disallow('comment.own.delete')

aclManager.can('comment.own.delete', 'guest') // false
```

---

## License

The license declaration can be found in [LICENSE](./LICENSE). (It's **MIT**)
