import axios from "axios";
import { jwtDecode } from "jwt-decode";
import type {
  AuthCredentials,
  AuthResponse,
  JwtPayload,
  RegistrationData,
} from "../Models/User.model";

class AuthService {
  public async register(user: RegistrationData): Promise<AuthResponse> {
    await axios.post("http://localhost:5207/auth/register", {
      username: user.email,
      password: user.password,
    });

    const { data: token } = await axios.post<string>(
      "http://localhost:5207/auth/login",
      { username: user.email, password: user.password },
    );

    return {
      token,
      user: jwtDecode<JwtPayload>(token),
    };
  }

  public async login(loginData: AuthCredentials): Promise<AuthResponse> {
    const { data: token } = await axios.post<string>(
      "http://localhost:5207/auth/login",
      { username: loginData.email, password: loginData.password },
    );

    return {
      token,
      user: jwtDecode<JwtPayload>(token),
    };
  }
}

const authService = new AuthService();
export default authService;
