import { Form, useActionData } from '@remix-run/react';
import { ErrorMessage, SubmitButton } from '~/components/ButtonLogin';
import { ActionData } from '../../../types/interfaces';

export default function LoginForm() {
    const actionData = useActionData<ActionData>();

    return (
        
        <Form method="post">
            <h1>Login</h1>
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" required />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" required />
            </div>
            {actionData?.error && <ErrorMessage error={actionData.error} />}
            <SubmitButton />
        </Form>
    );
}
