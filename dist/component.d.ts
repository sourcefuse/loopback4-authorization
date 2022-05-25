import { Binding, Component, ProviderMap } from '@loopback/core';
import { AuthorizationConfig } from './types';
export declare class AuthorizationComponent implements Component {
    private readonly config?;
    providers?: ProviderMap;
    bindings?: Binding[];
    constructor(config?: AuthorizationConfig | undefined);
}
