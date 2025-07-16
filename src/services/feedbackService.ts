import { FeedbackMessage } from '../types';

export class FeedbackService {
  private static readonly STORAGE_KEY = 'feedback_messages';

  static submitFeedback(message: string): void {
    const feedback: FeedbackMessage = {
      id: this.generateId(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    const messages = this.getAllMessages();
    messages.unshift(feedback);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messages));
  }

  static getAllMessages(): FeedbackMessage[] {
    const messages = localStorage.getItem(this.STORAGE_KEY);
    return messages ? JSON.parse(messages) : [];
  }

  static getMessagesPaginated(page: number, limit: number = 10): {
    messages: FeedbackMessage[];
    totalPages: number;
    currentPage: number;
    totalMessages: number;
  } {
    const allMessages = this.getAllMessages();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const messages = allMessages.slice(startIndex, endIndex);
    
    return {
      messages,
      totalPages: Math.ceil(allMessages.length / limit),
      currentPage: page,
      totalMessages: allMessages.length
    };
  }

  static markAsRead(id: string): void {
    const messages = this.getAllMessages();
    const messageIndex = messages.findIndex(msg => msg.id === id);
    
    if (messageIndex !== -1) {
      messages[messageIndex].isRead = true;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messages));
    }
  }

  static deleteMessage(id: string): void {
    const messages = this.getAllMessages();
    const filteredMessages = messages.filter(msg => msg.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredMessages));
  }

  static getUnreadCount(): number {
    return this.getAllMessages().filter(msg => !msg.isRead).length;
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }
}