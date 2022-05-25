import { Constructor, Provider } from '@loopback/context';
import { AuthorizationMetadata } from '../types';
export declare class AuthorizationMetadataProvider implements Provider<AuthorizationMetadata | undefined> {
    private readonly controllerClass;
    private readonly methodName;
    constructor(controllerClass: Constructor<{}>, methodName: string);
    value(): AuthorizationMetadata | undefined;
}
export declare function getAuthorizeMetadata(controllerClass: Constructor<{}>, methodName: string): AuthorizationMetadata | undefined;
