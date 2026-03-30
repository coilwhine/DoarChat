import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import localStorageService from "./LocalStorage.service";
import type { AuthState } from "../Models/Auth.model";

class ChatHubService {
  private static instance: ChatHubService | null = null;
  private connection: HubConnection | null = null;

  static getInstance(): ChatHubService {
    if (!ChatHubService.instance) {
      ChatHubService.instance = new ChatHubService();
    }

    return ChatHubService.instance;
  }

  private buildHubUrl(): string {
    const base = import.meta.env.VITE_SERVER_URL ?? "";
    if (!base) return "";

    return base.endsWith("/") ? `${base}hubs/chat` : `${base}/hubs/chat`;
  }

  private getToken(): string | null {
    const auth = localStorageService.getItem<AuthState>("auth");
    return auth?.token ?? null;
  }

  private createConnection(): HubConnection {
    const hubUrl = this.buildHubUrl();

    return new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => this.getToken() ?? "",
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();
  }

  getConnection(): HubConnection {
    if (!this.connection) {
      this.connection = this.createConnection();
    }

    return this.connection;
  }

  async start(): Promise<void> {
    const token = this.getToken();
    if (!token) return;

    const current = this.getConnection();
    if (current.state === HubConnectionState.Disconnected) {
      await current.start();
    }
  }

  async stop(): Promise<void> {
    if (!this.connection) return;
    if (this.connection.state !== HubConnectionState.Disconnected) {
      await this.connection.stop();
    }
  }
}

const chatHub = ChatHubService.getInstance();
export default chatHub;
