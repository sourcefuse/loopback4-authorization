import { BindingKey } from '@loopback/context';
import { MetadataAccessor } from '@loopback/metadata';
import { AuthorizeFn, AuthorizationMetadata, UserPermissionsFn, AuthorizationConfig, CasbinAuthorizeFn, CasbinEnforcerConfigGetterFn, CasbinResourceModifierFn } from './types';
/**
 * Binding keys used by this component.
 */
export declare namespace AuthorizationBindings {
    const AUTHORIZE_ACTION: BindingKey<AuthorizeFn>;
    const CASBIN_AUTHORIZE_ACTION: BindingKey<CasbinAuthorizeFn>;
    const METADATA: BindingKey<AuthorizationMetadata | undefined>;
    const USER_PERMISSIONS: BindingKey<UserPermissionsFn<string>>;
    const CASBIN_ENFORCER_CONFIG_GETTER: BindingKey<CasbinEnforcerConfigGetterFn>;
    const CASBIN_RESOURCE_MODIFIER_FN: BindingKey<CasbinResourceModifierFn>;
    const CONFIG: BindingKey<AuthorizationConfig>;
    const PATHS_TO_ALLOW_ALWAYS = "sf.userAuthorization.allowAlways";
}
export declare const AUTHORIZATION_METADATA_ACCESSOR: MetadataAccessor<AuthorizationMetadata, MethodDecorator>;
