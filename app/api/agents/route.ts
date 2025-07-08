// Optional: Add agent management capabilities
// app/api/agents/route.ts

import { LettaClient } from '@letta-ai/letta-client';

const client = new LettaClient({
  baseUrl: process.env.LETTA_BASE_URL,
  token: process.env.LETTA_SERVER_PASSWORD,
});

export async function GET() {
  try {
    const agents = await client.agents.list();
    return Response.json({ agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return new Response('Error fetching agents', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, memoryBlocks } = await req.json();
    
    const agent = await client.agents.create({
      name,
      memoryBlocks: memoryBlocks || [
        {
          label: "human",
          value: "The user is a developer working with Letta integration."
        },
        {
          label: "persona", 
          value: "I am a helpful AI assistant specialized in helping with development tasks and Letta integration."
        }
      ],
      model: "openai/gpt-4o-mini",
      embedding: "openai/text-embedding-3-small"
    });
    
    return Response.json({ agent });
  } catch (error) {
    console.error('Error creating agent:', error);
    return new Response('Error creating agent', { status: 500 });
  }
}
