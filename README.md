# loopback4-authorization

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

## Install

```
npm install lb4-authorization
```

## Usage

In order to use the above component into our REST API application, we have a few
more steps to go.

- Add component to application.

```ts
this.component(AuthenticationComponent);
```

- Add permissions array to the role model.

```ts
@model({
  name: 'roles',
})
export class Role extends Entity {
  // .....
  // other attributes here
  // .....

  @property.array(String, {
    required: true,
  })
  permissions: PermissionKey[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}
```

- Add user level permissions array to the user model. Do this if there is a use
  case of explicit allow/deny of permissions at user-level in the application.
  You can skip otherwise.

```ts
@model({
  name: 'users',
})
export class User extends Entity {
  // .....
  // other attributes here
  // .....

  @property.array(String)
  permissions: UserPermission[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}
```

- Add a step in custom sequence to check for authorization whenever any end
  point is hit.

```ts
import {inject} from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
  HttpErrors,
} from '@loopback/rest';
import {AuthenticationBindings, AuthenticateFn} from './authenticate';
import {
  AuthorizatonBindings,
  AuthorizeFn,
  AuthorizeErrorKeys,
} from './authorization';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
    @inject(AuthorizatonBindings.USER_PERMISSIONS)
    protected fetchUserPermissons: UserPermissionsFn,
    @inject(AuthorizatonBindings.AUTHORIZE_ACTION)
    protected checkAuthorization: AuthorizeFn,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      // Do authentication of the user and fetch user permissions below
      const authUser: AuthResponse = await this.authenticateRequest(request);
      // Parse and calculate user permissions based on role and user level
      const permissions: PermissionKey[] = this.fetchUserPermissons(
        authUser.permissions,
        authUser.role.permissions,
      );
      // This is main line added to sequence
      // where we are invoking the authorize action function to check for access
      const isAccessAllowed: boolean = await this.checkAuthorization(
        permissions,
      );
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

Now we can add access permission keys to the controller methods using authorize
decorator as below.

```ts
@authorize([PermissionKey.CreateRoles])
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
'CreateRoles'.
