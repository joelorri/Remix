export function ErrorMessage({ error }: { error: string }) {
    return <p style={{ color: 'red' }}>{error}</p>;
}

export function SubmitButton() {
    return <button type="submit">Login</button>;
}
