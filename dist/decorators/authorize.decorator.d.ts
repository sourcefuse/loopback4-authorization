import { AuthorizationMetadata } from '../types';
export declare function authorize(metadata: AuthorizationMetadata): <T>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => void;
