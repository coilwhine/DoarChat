export interface Message {
  id: number;
  senderUserId: number;
  receiverUserId: number;
  content: string;
  sentAt: string;
  deliveredAt: string | null;
  viewedAt: string | null;
}

export interface SendMessageRequest {
  receiverUserId: number;
  content: string;
}
