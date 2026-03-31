import apiClient from "./ApiClient";
import type { User } from "../Models/User.model";

class UsersService {
  private readonly baseRoute = "/users";

  public async getAll(): Promise<User[]> {
    const { data } = await apiClient.get<User[]>(`${this.baseRoute}/`);
    return data;
  }

  public async deleteById(id: number): Promise<void> {
    await apiClient.delete(`${this.baseRoute}/${id}`);
  }
}

const usersService = new UsersService();
export default usersService;
