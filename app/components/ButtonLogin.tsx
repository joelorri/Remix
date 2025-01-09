export function ErrorMessage({ error }: { error: string }) {
    return <p style={{ color: 'red' }}>{error}</p>;
}

export function SubmitButton() {
    return (
        <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            Login
        </button>
    );
}