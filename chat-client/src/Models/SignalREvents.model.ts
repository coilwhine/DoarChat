export interface MessageItem {
  id: number;
  senderUserId: number;
  receiverUserId: number;
  content: string;
  sentAt: string;
  viewedAt: string | null;
}

export interface MessageReadEvent {
  messageId: number;
  readerUserId: number;
  viewedAt: string;
}

export interface UserRegisteredEvent {
  id: number;
  email: string;
  name: string;
}

export interface UserDeletedEvent {
  id: number;
  deletedAt: string;
}
