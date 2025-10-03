import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    const response = await fetch(
      'https://api.cloudflare.com/client/v4/accounts/3c99926365970b68f77fd167c70fc491/ai/run/@cf/meta/llama-3.1-8b-instruct',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer FOMe6KlCMG01J6nODq5LW9cQx6oGfWCIjkE4KzIR',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 200
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.result?.response || "I'm sorry, I couldn't generate a response at this time.";

    return new Response(JSON.stringify({ response: aiResponse }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error calling AI API:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Sorry, I\'m having trouble connecting to the AI service right now. Please try again later.' 
      }), 
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
}