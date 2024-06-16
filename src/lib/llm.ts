'use server'

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getCompletion(items: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `Please provide 3 healthy, kid friendly meal ideas based on the following items: ${items} ` }],
  });
  console.log(completion.choices[0]?.message?.content);
  return completion.choices[0]?.message?.content;
}
