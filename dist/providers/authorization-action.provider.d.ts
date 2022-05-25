import { Getter, Provider } from '@loopback/context';
import { AuthorizationMetadata, AuthorizeFn } from '../types';
import { Request } from 'express';
import { Context } from '@loopback/core';
export declare class AuthorizeActionProvider implements Provider<AuthorizeFn> {
    private readonly getMetadata;
    private readonly allowAlwaysPath;
    private readonly requestContext;
    constructor(getMetadata: Getter<AuthorizationMetadata>, allowAlwaysPath: string[], requestContext: Context);
    value(): AuthorizeFn;
    action(userPermissions: string[], request?: Request): Promise<boolean>;
    checkIfAllowedAlways(req: Request): boolean;
}
