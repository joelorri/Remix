import { Form, useActionData } from '@remix-run/react';
import { ErrorMessage, SubmitButton } from '~/components/ButtonLogin';
import { ActionData } from '../../../types/interfaces';

export default function LoginForm() {
    const actionData = useActionData<ActionData>();
    return (
        <Form method="post" className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            {actionData?.error && <ErrorMessage error={actionData.error} />}
            <SubmitButton />
        </Form>
    );
}
