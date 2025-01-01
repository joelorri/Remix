export interface SignupInput {

    email: string;
    password: string;
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface ShowErrors {
    title: string;
    code: string;
}

export interface ActionData {
    error?: string;
}
export interface search {
    query: string;
}

export interface ProfileSearchResult {
    id: number;
    name: string;
    email: string;
    role: string;
    image: string;
    created_at: string;
  }