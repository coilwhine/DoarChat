export interface RegistrationData {
  name: string;
  email: string;
  password: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: JwtPayload;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  nbf: number;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
}

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
