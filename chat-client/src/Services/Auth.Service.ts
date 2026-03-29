import axios from "axios";
import { jwtDecode } from "jwt-decode";
import type {
  AuthCredentials,
  AuthResponse,
  JwtPayload,
  RegistrationData,
} from "../Models/User.model";

class AuthService {
  private readonly serverUrl = import.meta.env.VITE_SERVER_URL;

  public async register(user: RegistrationData): Promise<AuthResponse> {
    await axios.post(`${this.serverUrl}/auth/register`, {
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const { data } = await axios.post<{ token: string }>(
      `${this.serverUrl}/auth/login`,
      { email: user.email, password: user.password },
    );
    const token = data.token;

    return {
      token,
      user: jwtDecode<JwtPayload>(token),
    };
  }

  public async login(loginData: AuthCredentials): Promise<AuthResponse> {
    const { data } = await axios.post<{ token: string }>(
      `${this.serverUrl}/auth/login`,
      { email: loginData.email, password: loginData.password },
    );
    const token = data.token;

    return {
      token,
      user: jwtDecode<JwtPayload>(token),
    };
  }
}

const authService = new AuthService();
export default authService;
