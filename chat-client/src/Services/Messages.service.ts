import apiClient from "./ApiClient";
import type { Message, SendMessageRequest } from "../Models/Message.model";

class MessagesService {
  private readonly baseRoute = "/messages";

  public async getConversation(userId: number): Promise<Message[]> {
    const { data } = await apiClient.get<Message[]>(
      `${this.baseRoute}/with/${userId}`,
    );
    return data;
  }

  public async send(request: SendMessageRequest): Promise<Message> {
    const { data } = await apiClient.post<Message>(
      `${this.baseRoute}/`,
      request,
    );
    return data;
  }

  public async markAsRead(messageId: number): Promise<Message> {
    const { data } = await apiClient.post<Message>(
      `${this.baseRoute}/${messageId}/read`,
    );
    return data;
  }
}

const messagesService = new MessagesService();
export default messagesService;
