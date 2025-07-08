import { streamText } from 'ai';
import { createLetta } from '@letta-ai/vercel-ai-sdk-provider';

// Validate environment variables
if (!process.env.LETTA_BASE_URL) {
  throw new Error('LETTA_BASE_URL environment variable is required');
}
if (!process.env.LETTA_SERVER_PASSWORD) {
  throw new Error('LETTA_SERVER_PASSWORD environment variable is required');
}
if (!process.env.LETTA_AGENT_ID) {
  throw new Error('LETTA_AGENT_ID environment variable is required');
}

// Create Letta client
const letta = createLetta({
  baseUrl: process.env.LETTA_BASE_URL,
  token: process.env.LETTA_SERVER_PASSWORD,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('Invalid messages format', { status: 400 });
    }
    
    // Get ONLY the latest user message (Letta is stateful!)
    const userMessage = messages[messages.length - 1].content;
    
    if (!userMessage || typeof userMessage !== 'string') {
      return new Response('Invalid message content', { status: 400 });
    }
    
    console.log('Sending to Letta:', { 
      userMessage: userMessage.substring(0, 100) + '...', 
      agentId: process.env.LETTA_AGENT_ID 
    });
    
    // Send SINGLE message to Letta (it maintains conversation history)
    const result = await streamText({
      model: letta(process.env.LETTA_AGENT_ID!),
      // CRITICAL: Only send the new message, not conversation history
      messages: [{ role: 'user', content: userMessage }],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Letta API Error:', error);
    
    // Provide more specific error messages based on Letta error patterns
    if (error instanceof Error) {
      if (error.message.includes('fetch') || error.message.includes('ECONNREFUSED')) {
        return new Response('Unable to connect to Letta server. Check your LETTA_BASE_URL and server status.', { status: 503 });
      }
      if (error.message.includes('401') || error.message.includes('403') || error.message.includes('Unauthorized')) {
        return new Response('Authentication failed. Check your LETTA_SERVER_PASSWORD.', { status: 401 });
      }
      if (error.message.includes('404') || error.message.includes('Agent not found')) {
        return new Response('Agent not found. Check your LETTA_AGENT_ID.', { status: 404 });
      }
      if (error.message.includes('baseUrl') || error.message.includes('baseURL')) {
        return new Response('Invalid base URL configuration. Ensure LETTA_BASE_URL includes protocol (http:// or https://).', { status: 400 });
      }
    }
    
    return new Response(`Error connecting to Letta agent: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}