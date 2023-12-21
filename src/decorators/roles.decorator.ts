import { SetMetadata } from '@nestjs/common';

import { Role } from 'src/roles/enums/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);