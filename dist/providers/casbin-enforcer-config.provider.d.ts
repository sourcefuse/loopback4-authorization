import { Provider } from '@loopback/context';
import { CasbinEnforcerConfigGetterFn } from '../types';
export declare class CasbinEnforcerProvider implements Provider<CasbinEnforcerConfigGetterFn> {
    constructor();
    value(): CasbinEnforcerConfigGetterFn;
}
