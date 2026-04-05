import { renderMarkdownText } from '@plugins/markdown'

export const defaultChatMessageRenderer: AI.ContentTransformer = (content: string) => {
  return renderMarkdownText(content)
}
