// API route for fetching NASA data including APOD, Mars photos, and image library
// Features: Multiple endpoint support, caching, error handling
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'apod';
    const date = searchParams.get('date');
    const params = searchParams.get('params'); // Additional params as a JSON string
    
    // Base API URL depends on the endpoint
    let apiUrl;
    
    if (endpoint === 'apod') {
      apiUrl = `https://api.nasa.gov/planetary/apod?api_key=fZBwhaLS5PSQgvAgpxB632pzt29Aeae8WaeifV8p`;
    } else if (endpoint === 'mars-photos') {
      apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=fZBwhaLS5PSQgvAgpxB632pzt29Aeae8WaeifV8p`;
    } else if (endpoint === 'images') {
      // Use NASA Image and Video Library API
      const query = searchParams.get('q') || 'space';
      apiUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;
    } else {
      apiUrl = `https://api.nasa.gov/planetary/${endpoint}?api_key=fZBwhaLS5PSQgvAgpxB632pzt29Aeae8WaeifV8p`;
    }
    
    if (date) {
      apiUrl += `&date=${date}`;
    }
    
    // Add additional parameters if provided
    if (params) {
      try {
        const additionalParams = JSON.parse(params);
        for (const [key, value] of Object.entries(additionalParams)) {
          apiUrl += `&${key}=${value}`;
        }
      } catch (e) {
        console.warn('Invalid params JSON provided');
      }
    }

    // Add count parameter for APOD endpoint to get multiple images
    if (endpoint === 'apod' && !apiUrl.includes('count=')) {
      apiUrl += '&count=6';
    }

    console.log('Calling NASA API:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'ExploringSpace/1.0'
      }
    });

    console.log('NASA API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NASA API error response:', errorText);
      throw new Error(`NASA API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800' // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error calling NASA API:', error);
    
    // Type guard to check if error is an Error object
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ 
        error: 'Sorry, I\'m having trouble connecting to the NASA API right now.',
        details: errorMessage
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