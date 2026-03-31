export class InMemoryConversationStore implements AI.ConversationStore {
  private readonly store = new Map<string, AI.Conversation>()

  async get(messageId: string): Promise<AI.Conversation | undefined> {
    return this.store.get(messageId)
  }

  async set(message: AI.Conversation): Promise<void> {
    this.store.set(message.messageId, { ...message })
  }

  async clear(): Promise<void> {
    this.store.clear()
  }

  async list(): Promise<Array<AI.Conversation>> {
    return Array.from(this.store.values())
  }
}
