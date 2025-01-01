import { Form } from '@remix-run/react';
import { ActionFunction, json } from '@remix-run/node';
import { logout } from '~/auth.server';

export const action: ActionFunction = async () => {
    try {
        // Ejecuta la lógica de logout
        await logout();

        // Redirige al usuario a la página de inicio de sesión
        return logout();
    } catch (error) {
        console.error('Logout failed:', error);

        // Devuelve un error JSON si ocurre un problema
        return json(
            { error: 'Logout failed. Please try again later.' },
            { status: 500 }
        );
    }
};

export default function LogoutButton() {
    return (
        <Form method="post" action="/logout">
            <button type="submit">Logout</button>
        </Form>
    );
}
