import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        // Extract the `prompt` from the body of the request
        // const { prompt } = await req.json();
        const prompt =
        "What's a dream destination?";
        // Ask OpenAI for a streaming completion given the prompt
        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            max_tokens: 2000,
            stream: true,
            prompt,
        });
        // Convert the response into a friendly text-stream
        const stream = OpenAIStream(response);
        // Respond with the stream
        return new StreamingTextResponse(stream);
    } catch (error) {
        // Check if the error is an APIError
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error;
            return NextResponse.json({ name, status, headers, message }, { status });
        } else {
            console.log('Unexpected error in openai route : ', error);
            throw error;
        }
    }
}