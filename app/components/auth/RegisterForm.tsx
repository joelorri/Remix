import { Form, useActionData } from '@remix-run/react';
import { ErrorMessage, SubmitButton } from '~/components/ButtonLogin';
import { ActionData } from '../../../types/interfaces';

export default function RegisterForm() {
    const actionData = useActionData<ActionData>();

    return (
        <Form method="post">
            <input type="hidden" name="actionType" value="register" />
            <div>
                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" required />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" required />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" required />
            </div>
            <div>
                <label htmlFor="password_confirmation">Confirm Password</label>
                <input
                    type="password"
                    name="password_confirmation"
                    id="password_confirmation"
                    required
                />
            </div>
            {actionData?.error && <ErrorMessage error={actionData.error} />}
            <SubmitButton />
        </Form>
    );
}
