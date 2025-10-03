// API route for generating enhanced space articles based on NASA data
// Features: Cloudflare AI integration, article storage, content generation
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query, nasaImages } = await request.json();

    // Call the Cloudflare API to generate content
    const aiResponse = await fetch(
      'https://api.cloudflare.com/client/v4/accounts/3c99926365970b68f77fd167c70fc491/ai/run/@cf/meta/llama-3.1-8b-instruct',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer FOMe6KlCMG01J6nODq5LW9cQx6oGfWCIjkE4KzIR',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Write a comprehensive and complete article about ${query}. Include information about its characteristics, location, discovery, significance in space exploration, and any known scientific findings. Make it 500-800 words with natural paragraph breaks. Do not use markdown formatting such as **, ##, etc. Use plain text with natural line breaks. Ensure the article is fully detailed and not cut off. Start with an engaging introduction, provide detailed body content, and end with a conclusion that ties the information together.`,
          max_tokens: 1024
        }),
      }
    );

    if (!aiResponse.ok) {
      throw new Error(`API request failed with status ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let articleContent = aiData.result?.response || "No content generated";
    
    // Clean markdown formatting from content
    articleContent = articleContent
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/## (.*?)[\n\r]/g, '$1\n') // Remove H2 markdown
      .replace(/# (.*?)[\n\r]/g, '$1\n') // Remove H1 markdown
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Remove links
      .replace(/!\[(.*?)\]\((.*?)\)/g, '') // Remove images
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/^\s*-\s+/gm, '• ') // Replace list markers with bullets
      .replace(/^\s*\*\s+/gm, '• ') // Replace list markers with bullets
      .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
      .replace(/\n{3,}/g, '\n\n') // Replace multiple line breaks with double
      .trim();

    // Determine the best image URL from NASA images or use fallback
    let imageUrl = `https://source.unsplash.com/800x600/?${query},space`;
    
    if (nasaImages && nasaImages.length > 0) {
      // Define type for NASA image object
      interface NasaImage {
        url?: string;
        hdurl?: string;
      }
      // Try to find the best image from NASA data
      const primaryImage = nasaImages.find((img: NasaImage) => img.url || img.hdurl);
      if (primaryImage) {
        imageUrl = primaryImage.url || primaryImage.hdurl || imageUrl;
      } else {
        // Use the first image if available
        imageUrl = nasaImages[0].url || nasaImages[0].hdurl || imageUrl;
      }
    }

    // Clean summary to remove markdown formatting and ensure it's meaningful
    let cleanSummary = articleContent.substring(0, 200);
    cleanSummary = cleanSummary
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/## (.*?)[\n\r]/g, '$1 ')
      .replace(/# (.*?)[\n\r]/g, '$1 ')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
      
    // Create article object with meaningful title and summary
    const article = {
      id: Date.now().toString(),
      title: `${query.charAt(0).toUpperCase() + query.slice(1)}`, // Meaningful title without AI prefix
      summary: cleanSummary + '...', // Clean summary from the generated content
      content: articleContent,
      imageUrl: imageUrl,
      date: new Date().toISOString(),
      source: "NASA Data & Insights",
      tags: [query, "space", "astronomy"],
      searchQuery: query
    };

    // Store article in temporary storage (in a real app, use a persistent DB)
    // For now, we'll just return the data directly
    // await kv.set(`article:${article.id}`, article);

    return new Response(JSON.stringify(article), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error generating article:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Sorry, I\'m having trouble generating an article right now.' 
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