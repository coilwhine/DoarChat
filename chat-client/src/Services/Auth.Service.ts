import { jwtDecode } from "jwt-decode";
import type {
  AuthCredentials,
  AuthResponse,
  JwtPayload,
  RegistrationData,
} from "../Models/Auth.model";
import apiClient from "./ApiClient";

class AuthService {
  public async register(user: RegistrationData): Promise<AuthResponse> {
    await apiClient.post("/auth/register", {
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const { data } = await apiClient.post<{ token: string }>(
      "/auth/login",
      { email: user.email, password: user.password },
    );
    const token = data.token;

    return {
      token,
      user: jwtDecode<JwtPayload>(token),
    };
  }

  public async login(loginData: AuthCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<{ token: string }>(
      "/auth/login",
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
