import { SetMetadata } from '@nestjs/common';
import { Perms } from 'src/enums/permissions.enum';

export const PERMS_KEY = 'perms';
export const Permission = (perms: Perms[]) => SetMetadata(PERMS_KEY, perms);