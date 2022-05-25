import { OperationObject } from 'openapi3-ts';
import { AuthorizationMetadata } from '../types';
export declare const specPreprocessor: (target: Object, propertyKey: string, authorizations: AuthorizationMetadata, spec?: OperationObject | undefined) => OperationObject;
