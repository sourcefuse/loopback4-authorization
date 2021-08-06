import {IAuthUserWithPermissions} from '../../../types';

export const mockUser: IAuthUserWithPermissions = {
  id: '1',
  role: 'Test',
  firstName: 'Test',
  lastName: 'User',
  username: 'test.user',
  authClientId: 0,
  permissions: ['ViewTodo'],
};
