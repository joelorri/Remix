import { json, ActionFunction } from '@remix-run/node';
import { SignupInput, ShowErrors } from '../../types/interfaces';
import { login } from '~/auth.server';
import LoginForm from '~/components/auth/LoginForm';

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        await login({ email, password } as SignupInput);
        return login({ email, password });
    } catch (error) {
        console.error('error', error);
        return json({ error: (error as ShowErrors).title }, { status: 401 });
    }
};

export default function Login() {
    return (
        <div>
            <h1>Login</h1>
            <LoginForm />
        </div>
    );
}
