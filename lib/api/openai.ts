import OpenAI from 'openai';
import { AnalysisRequest } from '@/types/api';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzePR = async ({ prContext, conversation }: AnalysisRequest) => {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: "You are a helpful code reviewer analyzing GitHub pull requests."
    },
    {
      role: "user",
      content: `Please analyze this PR and provide key insights: ${prContext}`
    }
  ];

  if (conversation) {
    messages.push(...(conversation as ChatCompletionMessageParam[]));
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: messages,
  });

  return response.choices[0].message.content;
}; 