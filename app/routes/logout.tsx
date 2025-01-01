import { ActionFunction } from '@remix-run/node';
import { logout } from '~/auth.server';

export const action: ActionFunction = async () => {
    return logout();
};
