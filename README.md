# loopback4-authorization

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

[![Node version](https://img.shields.io/node/v/loopback4-authorization.svg?style=flat-square)](https://nodejs.org/en/download/)
[![Dependencies Status](https://img.shields.io/david/sourcefuse/loopback4-authorization.svg?style=flat-square)](https://github.com/sourcefuse/loopback4-authorization)
[![Loopback Core Version](https://img.shields.io/npm/dependency-version/loopback4-authorization/dev/@loopback/core.svg?color=dark%20green&style=flat-square)](https://github.com/strongloop/loopback-next)
[![npm vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/loopback4-authorization.svg?label=npm%20vulnerabilities&style=flat-square)](https://www.npmjs.com/package/loopback4-authorization)

[![Latest version](https://img.shields.io/npm/v/loopback4-authorization.svg?style=flat-square)](https://www.npmjs.com/package/loopback4-authorization)
[![License](https://img.shields.io/github/license/sourcefuse/loopback4-authorization.svg?color=blue&label=License&style=flat-square)](https://github.com/sourcefuse/loopback4-authorization/blob/master/LICENSE)
[![Downloads](https://img.shields.io/npm/dw/loopback4-authorization.svg?label=Downloads&style=flat-square&color=blue)](https://www.npmjs.com/package/loopback4-authorization)
[![Total Downloads](https://img.shields.io/npm/dt/loopback4-authorization.svg?label=Total%20Downloads&style=flat-square&color=blue)](https://www.npmjs.com/package/loopback4-authorization)

A loopback-next extension for authorization in loopback applications. Its a very simplistic yet powerful and effective implementation using simple string based permissions.

It provides three ways of integration

1. **User level permissions only** - Permissions are associated directly to user. In this case, each user entry in DB contains specific array of permission keys.
2. **Role based permissions** - Permissions are associated to roles and users have a specific role attached. This actually reduces redundancy in DB a lot, as most of the time, users will have many common permissions. If that is not the case for you, then, use method #1 above.
3. **Role based permissions with user level override** - This is the most flexible architecture. In this case, method #2 is implemented as is. On top of it, we also add user-level permissions override, allow/deny permissions over role permissions. So, say there is user who can perform all admin role actions except he cannot remove users from the system. So, DeleteUser permission can be denied at user level and role can be set as Admin for the user.

Refer to the usage section below for details on integration

## Install

```sh
npm install loopback4-authorization
```

## Quick Starter

For a quick starter guide, you can refer to our [loopback 4 starter](https://github.com/sourcefuse/loopback4-starter) application which utilizes method #3 from the above in a simple multi-tenant application.

## Usage

In order to use this component into your LoopBack application, please follow below steps.

- Add component to application.

```ts
this.bind(AuthorizationBindings.CONFIG).to({
  allowAlwaysPaths: ['/explorer'],
});
this.component(AuthorizationComponent);
```

- If using method #1 from above, implement Permissions interface in User model and add permissions array.

```ts
@model({
  name: 'users',
})
export class User extends Entity implements Permissions<string> {
  // .....
  // other attributes here
  // .....

  @property({
    type: 'array',
    itemType: 'string',
  })
  permissions: string[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}
```

- If using method #2 or #3 from above, implement Permissions interface in Role model and add permissions array.

```ts
@model({
  name: 'roles',
})
export class Role extends Entity implements Permissions<string> {
  // .....
  // other attributes here
  // .....

  @property({
    type: 'array',
    itemType: 'string',
  })
  permissions: string[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}
```

- If using method #3 from above, implement UserPermissionsOverride interface in User model and add user level permissions array as below.
  Do this if there is a use-case of explicit allow/deny of permissions at user-level in the application.
  You can skip otherwise.

```ts
@model({
  name: 'users',
})
export class User extends Entity implements UserPermissionsOverride<string> {
  // .....
  // other attributes here
  // .....

  @property({
    type: 'array',
    itemType: 'object',
  })
  permissions: UserPermission<string>[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}
```

- For method #3, we also provide a simple provider function [_AuthorizationBindings.USER_PERMISSIONS_](<[./src/providers/user-permissions.provider.ts](https://github.com/sourcefuse/loopback4-authorization/blob/master/src/providers/user-permissions.provider.ts)>) to evaluate the user permissions based on its role permissions and user-level overrides. Just inject it

```ts
@inject(AuthorizationBindings.USER_PERMISSIONS)
private readonly getUserPermissions: UserPermissionsFn<string>,
```

and invoke it

```ts
const permissions = this.getUserPermissions(user.permissions, role.permissions);
```

- Add a step in custom sequence to check for authorization whenever any end
  point is hit.

```ts
import {inject} from '@loopback/context';
import {
  FindRoute,
  HttpErrors,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {AuthenticateFn, AuthenticationBindings} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizeErrorKeys,
  AuthorizeFn,
  UserPermissionsFn,
} from 'loopback4-authorization';

import {AuthClient} from './models/auth-client.model';
import {User} from './models/user.model';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<AuthUser>,
    @inject(AuthenticationBindings.CLIENT_AUTH_ACTION)
    protected authenticateRequestClient: AuthenticateFn<AuthClient>,
    @inject(AuthorizationBindings.AUTHORIZE_ACTION)
    protected checkAuthorisation: AuthorizeFn,
    @inject(AuthorizationBindings.USER_PERMISSIONS)
    private readonly getUserPermissions: UserPermissionsFn<string>,
  ) {}

  async handle(context: RequestContext) {
    const requestTime = Date.now();
    try {
      const {request, response} = context;
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      request.body = args[args.length - 1];
      await this.authenticateRequestClient(request);
      const authUser: User = await this.authenticateRequest(request);

      // Do ths if you are using method #3
      const permissions = this.getUserPermissions(
        authUser.permissions,
        authUser.role.permissions,
      );
      // This is the important line added for authorization. Needed for all 3 methods
      const isAccessAllowed: boolean = await this.checkAuthorisation(
        permissions, // do authUser.permissions if using method #1
        request,
      );
      // Checking access to route here
      if (!isAccessAllowed) {
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }

      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}
```

The above sequence also contains user authentication using [loopback4-authentication](https://github.com/sourcefuse/loopback4-authentication) package. You can refer to the documentation for the same for more details.

- Now we can add access permission keys to the controller methods using authorize
  decorator as below.

```ts
@authorize(['CreateRole'])
@post(rolesPath, {
  responses: {
    [STATUS_CODE.OK]: {
      description: 'Role model instance',
      content: {
        [CONTENT_TYPE.JSON]: {schema: {'x-ts-type': Role}},
      },
    },
  },
})
async create(@requestBody() role: Role): Promise<Role> {
  return await this.roleRepository.create(role);
}
```

This endpoint will only be accessible if logged in user has permission
'CreateRole'.

A good practice is to keep all permission strings in a separate enum file like this.

```ts
export const enum PermissionKey {
  ViewOwnUser = 'ViewOwnUser',
  ViewAnyUser = 'ViewAnyUser',
  ViewTenantUser = 'ViewTenantUser',
  CreateAnyUser = 'CreateAnyUser',
  CreateTenantUser = 'CreateTenantUser',
  UpdateOwnUser = 'UpdateOwnUser',
  UpdateTenantUser = 'UpdateTenantUser',
  UpdateAnyUser = 'UpdateAnyUser',
  DeleteTenantUser = 'DeleteTenantUser',
  DeleteAnyUser = 'DeleteAnyUser',

  ViewTenant = 'ViewTenant',
  CreateTenant = 'CreateTenant',
  UpdateTenant = 'UpdateTenant',
  DeleteTenant = 'DeleteTenant',

  ViewRole = 'ViewRole',
  CreateRole = 'CreateRole',
  UpdateRole = 'UpdateRole',
  DeleteRole = 'DeleteRole',

  ViewAudit = 'ViewAudit',
  CreateAudit = 'CreateAudit',
  UpdateAudit = 'UpdateAudit',
  DeleteAudit = 'DeleteAudit',
}
```

## Feedback

If you've noticed a bug or have a question or have a feature request, [search the issue tracker](https://github.com/sourcefuse/loopback4-authorization/issues) to see if someone else in the community has already created a ticket.
If not, go ahead and [make one](https://github.com/sourcefuse/loopback4-authorization/issues/new/choose)!
All feature requests are welcome. Implementation time may vary. Feel free to contribute the same, if you can.
If you think this extension is useful, please [star](https://help.github.com/en/articles/about-stars) it. Appreciation really helps in keeping this project alive.

## Contributing

Please read [CONTRIBUTING.md](https://github.com/sourcefuse/loopback4-authorization/blob/master/.github/CONTRIBUTING.md) for details on the process for submitting pull requests to us.

## Code of conduct

Code of conduct guidelines [here](https://github.com/sourcefuse/loopback4-authorization/blob/master/.github/CODE_OF_CONDUCT.md).

## License

[MIT](https://github.com/sourcefuse/loopback4-authorization/blob/master/LICENSE)
