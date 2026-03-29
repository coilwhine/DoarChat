export interface AuthState {
  loggedIn: boolean;
  token: string | null;
  user: {
    email: string | null;
    sub: string | null;
    role: string | null;
    nbf: number | null;
    exp: number | null;
    iat: number | null;
    iss: string | null;
    aud: string | null;
  };
}
