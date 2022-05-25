import { OASEnhancer, OpenAPIObject, OpenApiSpec } from '@loopback/rest';
export declare class DescSpecEnhancer implements OASEnhancer {
    private readonly app;
    name: string;
    modifySpec(spec: OpenAPIObject): OpenApiSpec;
}
