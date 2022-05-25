/// <reference types="express" />
import { Getter, Provider } from '@loopback/core';
import { Request } from '@loopback/express';
import { AuthorizationMetadata, CasbinAuthorizeFn, CasbinEnforcerConfigGetterFn, IAuthUserWithPermissions, ResourcePermissionObject } from '../types';
export declare class CasbinAuthorizationProvider implements Provider<CasbinAuthorizeFn> {
    private readonly getCasbinMetadata;
    private readonly getCasbinEnforcerConfig;
    private readonly allowAlwaysPath;
    constructor(getCasbinMetadata: Getter<AuthorizationMetadata>, getCasbinEnforcerConfig: CasbinEnforcerConfigGetterFn, allowAlwaysPath: string[]);
    value(): CasbinAuthorizeFn;
    action(user: IAuthUserWithPermissions, resource: string, request?: Request): Promise<boolean>;
    getUserName(id: string): string;
    createCasbinPolicy(resPermObj: ResourcePermissionObject[], subject: string): string;
    checkIfAllowedAlways(req: Request): boolean;
}
