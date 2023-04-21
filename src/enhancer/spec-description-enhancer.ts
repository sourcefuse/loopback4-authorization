import {
  Application,
  CoreBindings,
  inject,
  injectable,
  MetadataInspector,
} from '@loopback/core';
import {
  asSpecEnhancer,
  OASEnhancer,
  OpenAPIObject,
  OpenApiSpec,
  RestEndpoint,
} from '@loopback/rest';

@injectable(asSpecEnhancer)
export class DescSpecEnhancer implements OASEnhancer {
  @inject(CoreBindings.APPLICATION_INSTANCE) private readonly app: Application;
  name = 'info';
  modifySpec(spec: OpenAPIObject): OpenApiSpec {
    for (const controller of this.app.find(`${CoreBindings.CONTROLLERS}.*`)) {
      const ctor = controller.valueConstructor;
      if (!ctor) {
        continue;
      }
      const endpoints = MetadataInspector.getAllMethodMetadata<RestEndpoint>(
        'openapi-v3:methods',
        ctor.prototype,
      );
      for (const route in endpoints) {
        const routeData = endpoints[route];
        if (
          routeData?.spec?.description &&
          !spec.paths[routeData.path][routeData.verb].description
        ) {
          spec.paths[routeData.path][routeData.verb].description =
            routeData.spec.description;
        }
      }
    }
    return spec;
  }
}
