# ⛔ restricted

[ ![npm version](https://img.shields.io/npm/v/restricted.svg?style=flat) ](https://npmjs.org/package/restricted "View this project on npm") [ ![CircleCI](https://img.shields.io/travis/Sleavely/restricted) ](https://travis-ci.org/Sleavely/restricted) [ ![Issues](https://img.shields.io/github/issues/Sleavely/restricted.svg) ](https://github.com/Sleavely/restricted/issues)

_restricted_ gives you scoped Access Control Lists (ACL) for user groups.

* [About](#about)
* [Install](#install)
* [Quick Start](#quick-start)
* [API](#api)
* [License](#license)

---

## About

> What makes _restricted_ different?

Many ACL modules on NPM are tied to frameworks[[1]](https://www.npmjs.com/package/express-acl)[[2]](https://www.npmjs.com/package/hapi-authorization) or conventions that force you to think in CRUDdy terms[[3]](https://www.npmjs.com/package/accesscontrol). We're trying a different approach.

_restricted_ lets you define cascading permissions, we call them _scopes_. All scopes are automatically divided into  `.` For example, imagine the following set of possible actions for a guest:

```
USERS
✅ user.register
✅ user.view
⛔ user.view.email
✅ user.view.username
✅ user.view.photo
```

With _restricted_, you can set scopes on both broad and granular permissions for a group.

```js
acl.group('users')
     .allow('user')
     .allow('user.view.email.own') // Like in CSS, specificity matters
  .disallow('user.view.email')
```

Depending on which library you compare with, the potential downside to be aware of is that it expects you to define your groups before you try to test permission scopes aganst them.

---

## Install

```sh
npm install restricted
```

---

## Quick Start

Our recommended implementation strategy is to initialize an AclManager and expose it as a module in your project, letting you interact with the same instance regardless of where in your codebase you are.

```js
const { AclManager } = require('restricted')

const acl = new AclManager

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

  * <a href="#aclmanager-constructor"><code>new <b>AclManager</b></code></a>
    * <a href="#aclmanager-group"><code>AclManager<b>#group()</b></code></a>
    * <a href="#aclmanager-can"><code>AclManager<b>#can()</b></code></a>
    * <a href="#aclmanager-canall"><code>AclManager<b>#canAll()</b></code></a>
    * <a href="#aclmanager-cansome"><code>AclManager<b>#canSome()</b></code></a>

  * <a href="#aclgroup-constructor"><code><b>AclGroup</b></code></a>
    * <a href="#aclgroup-default"><code>AclGroup<b>#default()</b></code></a>
    * <a href="#aclgroup-alias"><code>AclGroup<b>#alias()</b></code></a>
    * <a href="#aclgroup-query"><code>AclGroup<b>#query()</b></code></a>
    * <a href="#aclgroup-allow"><code>AclGroup<b>#allow()</b></code></a>
    * <code>AclGroup<b>#disallow()</b></code>
    * <code>AclGroup<b>#forget()</b></code>
    * <code>AclGroup<b>#inherit()</b></code>

---
<a name="aclmanager-constructor"></a>
### new AclManager()

The main class that keeps track of your defined groups, and lets you evaluate against them.

```js
const acl = new AclManager
```

---
<a name="aclmanager-group"></a>
#### AclManager#group(name)

Find an ACL group by name or alias. Creates it if it does not exist.

Returns [`AclGroup`](#aclgroup-constructor)

---
<a name="aclmanager-can"></a>
#### AclManager#can()

Alias for [canAll()](#aclmanager-canall)

Returns `boolean`

---
<a name="aclmanager-canall"></a>
#### AclManager#canAll(scopes, groups)

Evaluate whether the combination of groups can access all of the scopes.

  * `scopes` - a single scope as a string, or an array of several scopes
  * `groups` - a single group name as a string, or an array

Returns `boolean`

---
<a name="aclmanager-cansome"></a>
#### AclManager#canSome(scopes, groups)

Evaluate whether any of the groups is allowed at least one of the scopes.

  * `scopes` - a single scope as a string, or an array of several scopes
  * `groups` - a single group name as a string, or an array

Returns `boolean`

---
<a name="aclmanager-originalgroups"></a>
#### AclManager#originalGroups()

Retrieve a list of unique (excluding aliases) [`AclGroup`](#aclgroup-constructor)s that have been defined.

Returns `array` of [`AclGroup`](#aclgroup-constructor)

---
<a name="aclgroup-constructor"></a>
### AclGroup

ACL groups are automatically initialized by the manager when you call [`AclManager#group()`](#aclmanager-group), so normally you wouldn't deal with the constructor itself.

However, if you're into hacking, the call signature is `new AclGroup(name, AclManager)`, where `AclManager` is the reference to the parent class.

---
<a name="aclgroup-default"></a>
#### AclGroup#default(allowed)

  * `allowed` - the fallback state for this group. Can be one of `true`, `false`, `undefined` (default)

Returns [`AclGroup`](#aclgroup-constructor)

---
<a name="aclgroup-alias"></a>
#### AclGroup#alias(aliases)

Register a nickname for the ACL group in the [`AclManager`](#aclmanager-constructor)

  * `aliases` - a single group name as a string, or an array

Returns [`AclGroup`](#aclgroup-constructor)

---
<a name="aclgroup-query"></a>
#### AclGroup#query(scopes)

Evaluate whether the group has access to the scope(s).

  * `scopes` - a single permission scope as a string, or an array of multiple scopes that the group must be able to access all of.

Returns `boolean`

---
<a name="aclgroup-allow"></a>
#### AclGroup#allow(scopes)

Define scope(s) that the group can access.

  * `scopes` - a single permission scope as a string, or an array of multiple scopes

Returns [`AclGroup`](#aclgroup-constructor)

```js
AclManager.group('logged-in')
  .allow('profile.edit')
  .allow(['user.logout', 'comment'])

AclManager.can('profile.edit.photo', 'user') // true
```

---
<a name="aclgroup-disallow"></a>
#### AclGroup#disallow(scopes)

Define scope(s) that the group is not allowed to access.

  * `scopes` - a single permission scope as a string, or an array of multiple scopes

Returns [`AclGroup`](#aclgroup-constructor)

```js
AclManager.group('guest')
     .allow('comment.own')
  .disallow('comment.own.delete')

AclManager.can('comment.own.delete', 'guest') // false
```

---

## License

The license declaration can be found in [LICENSE](./LICENSE). (It's **MIT**)
