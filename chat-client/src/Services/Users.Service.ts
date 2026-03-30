import apiClient from "./ApiClient";
import type { User } from "../Models/User.model";

class UsersService {
  private readonly baseRoute = "/users";

  public async getAll(): Promise<User[]> {
    const { data } = await apiClient.get<User[]>(`${this.baseRoute}/`);
    return data;
  }
}

const usersService = new UsersService();
export default usersService;
