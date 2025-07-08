import { streamText } from 'ai';
import { createLetta } from '@letta-ai/vercel-ai-sdk-provider';

// Create Letta client
const letta = createLetta({
  baseURL: process.env.LETTA_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.LETTA_SERVER_PASSWORD}`,
  },
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Get the latest user message
    const userMessage = messages[messages.length - 1].content;
    
    // Send to Letta and stream response
    const result = await streamText({
      model: letta(process.env.LETTA_AGENT_ID!),
      messages: [{ role: 'user', content: userMessage }],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Letta API Error:', error);
    return new Response('Error connecting to Letta', { status: 500 });
  }
}