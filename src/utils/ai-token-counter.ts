import { encode } from 'gpt-tokenizer'

export class GptTokenizerTokenCounter implements AI.TokenCounter {
  async count(text: string): Promise<number> {
    return encode(text).length
  }
}
