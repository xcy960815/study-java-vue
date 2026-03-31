import { marked } from 'marked'

type ContentTransformerOptions = {
  markdown2Html?: boolean
  transformResponseContent?: AI.ContentTransformer
}

const identityTransformer: AI.ContentTransformer = (text) => text

export const createContentTransformer = (
  options: ContentTransformerOptions
): AI.ContentTransformer => {
  const { markdown2Html, transformResponseContent } = options

  if (transformResponseContent) {
    return transformResponseContent
  }

  if (markdown2Html) {
    return (text: string) => marked(text) as string
  }

  return identityTransformer
}
