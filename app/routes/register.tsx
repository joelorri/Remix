import { json, ActionFunction } from '@remix-run/node';
import { ShowErrors, RegisterInput } from '../../types/interfaces';
import { register } from '~/auth.server';
import RegisterForm from '~/components/auth/RegisterForm';
import { redirect } from '@remix-run/node';


export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const password_confirmation = formData.get('password_confirmation') as string;

    try {
        await register({ name, email, password, password_confirmation } as RegisterInput);
        return redirect('/login');
    } catch (error) {
        console.error('error', error);
        return json({ error: (error as ShowErrors).title }, { status: 401 });
    }
};


export default function Register() {
    return (
        <div>
            <h1>Register</h1>
            <RegisterForm />
        </div>
    );
}
