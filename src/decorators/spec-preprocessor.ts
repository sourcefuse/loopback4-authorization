import {OperationObject} from 'openapi3-ts';
import {AuthorizationMetadata} from '../types';

const defaultResponse = (ctor: {name: string}, op: string) => ({
  '200': {
    description: `Return value of ${ctor.name}.${op}`,
    content: {},
  },
});

export const specPreprocessor = (
  target: Object,
  propertyKey: string,
  authorizations: AuthorizationMetadata,
  spec?: OperationObject,
) => {
  let desc = spec?.description ?? '';
  if (authorizations?.permissions && authorizations?.permissions.length > 0) {
    authorizations.permissions
      .filter((permission: string) => permission.trim() !== '*')
      .forEach((permission, i) => {
        if (i === 0) {
          desc += `\n\n| Permissions |\n| ------- |\n`;
        }
        desc += `| ${permission}   |\n`;
      });
  }
  if (spec) {
    spec.description = desc;
  } else {
    spec = {
      description: desc,
      responses: defaultResponse(target.constructor, propertyKey),
    } as OperationObject;
  }
  return spec;
};
