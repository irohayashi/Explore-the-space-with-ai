"use client";


import { useState, useEffect } from "react";
import { useThemeSync } from "@/components/ui/hero-space";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Share2, Bookmark, MessageCircle } from "lucide-react";
import StarryBackground from "@/components/ui/starry-background";
import SpaceNavbar from "@/components/ui/space-navbar";
import { useParams } from "next/navigation";
import { toast } from "sonner";

// Define the Article type
type Article = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  date: string;
  source: string;
  tags: string[];
  summary: string;
  searchQuery?: string;
};

// Mock data for development - replaced with API data in production
const mockArticles = [
  {
    id: "1",
    title: "The Mysteries of the Orion Nebula",
    content: `The Orion Nebula, located in the constellation Orion, is one of the most photographed objects in the night sky and the closest region of massive star formation to Earth. This stunning stellar nursery is approximately 1,344 light-years away and about 24 light-years across. The nebula contains a very young open cluster, known as the Trapezium due to its triangular appearance, which is a component of the larger Orion Nebula Cluster. 

The Orion Nebula is estimated to contain over 1,000 stars, with the four massive stars of the Trapezium being the most prominent. These stars are only a few hundred thousand years old and are responsible for much of the intense ultraviolet radiation that makes the nebula visible. The energy from these stars illuminates the surrounding gas and dust, creating the beautiful colors we observe.

Recent observations with advanced telescopes have revealed that the Orion Nebula is home to a large number of brown dwarfs, which are low-mass objects that are sometimes called "failed stars." The nebula also contains numerous protoplanetary disks, or proplyds, which are the birthplaces of planetary systems like our own Solar System.

The nebula is part of the larger Orion Molecular Cloud Complex, which spans approximately 100 light-years and includes several other famous star-forming regions. Within this complex, new stars continue to form from the gravitational collapse of molecular hydrogen clouds, making it an important region for understanding stellar evolution.`,
    imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "2024-01-15",
    source: "Hubble Space Telescope",
    tags: ["nebula", "star formation", "orion", "astronomy"],
    summary: "A deep dive into one of the most photographed objects in the night sky, revealing new insights about star formation."
  },
  {
    id: "2",
    title: "Jupiter's Great Red Spot: A Storm of Millennia",
    content: `Jupiter's Great Red Spot is a persistent high-pressure region in the planet's atmosphere, producing an anticyclonic storm that is the largest in the Solar System. This iconic feature has been continuously observed for at least 400 years and is large enough to contain two or three planets the size of Earth. The Great Red Spot has been shrinking for the past several decades, but it remains the most recognizable feature of Jupiter.

The storm rotates counterclockwise with a period of about six days and reaches speeds of up to 432 kilometers per hour (268 mph). The spot's distinctive brick-red color is thought to be produced by complex chemical reactions involving the Sun's ultraviolet light and compounds in Jupiter's atmosphere, possibly phosphorus or sulfur compounds.

The Great Red Spot's longevity is attributed to Jupiter's lack of a solid surface, which allows storms to persist much longer than on Earth. Unlike terrestrial storms, which dissipate when they encounter land masses, Jupiter's storms continue until they interact with other storms or atmospheric conditions change significantly.

Recent observations from NASA's Juno mission have revealed that the Great Red Spot extends deep into Jupiter's atmosphere, possibly reaching down for hundreds of kilometers. The storm also has extremely complex internal dynamics, with structures within the storm rotating at different speeds. Scientists continue to study the Great Red Spot to understand how such a massive storm has maintained its structure for so long.`,
    imageUrl: "https://images.unsplash.com/photo-1482963405972-7ab5e0c1b4d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "2024-01-10",
    source: "Juno Mission",
    tags: ["jupiter", "gas giant", "storms", "planets"],
    summary: "The latest findings about Jupiter's most iconic feature and how it continues to evolve."
  },
  {
    id: "3",
    title: "The James Webb Telescope's Latest Discovery",
    content: `The James Webb Space Telescope (JWST) has revolutionized our understanding of the universe by peering deeper into space and further back in time than any previous telescope. With its unprecedented infrared capabilities, JWST can observe objects that formed just after the Big Bang, providing crucial insights into the formation and evolution of the earliest galaxies.

One of JWST's most significant discoveries is the detection of galaxies that existed when the universe was less than 400 million years old. These ancient galaxies are significantly more massive and mature than theoretical models predicted, challenging our understanding of how quickly galaxies formed in the early universe. The telescope has also revealed that star formation began much earlier than previously thought.

JWST's observations of exoplanet atmospheres have been groundbreaking as well. The telescope can analyze the light filtering through exoplanet atmospheres to determine their composition, including detecting water vapor, carbon dioxide, methane, and other key molecules. These observations are crucial for identifying potentially habitable worlds and understanding planetary formation processes.

The telescope's ability to observe the universe in the infrared spectrum allows it to see through cosmic dust clouds that hide objects from visible light telescopes. This capability has enabled the discovery of previously hidden star-forming regions, stellar nurseries, and some of the most distant galaxies ever observed.`,
    imageUrl: "https://images.unsplash.com/photo-1635070041064-0a8d3d0d3e5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "2024-01-05",
    source: "James Webb Space Telescope",
    tags: ["webb", "galaxies", "early universe", "telescope"],
    summary: "New infrared images reveal galaxies formed just after the Big Bang, reshaping our understanding of the early universe."
  }
];

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [theme] = useThemeSync();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (id) {
      // Check for URL parameters including imageUrl
      const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
      const imageUrlParam = urlParams.get('imageUrl');
      
      // First check if we have a mock article
      const foundArticle = mockArticles.find(a => a.id === id);
      
      if (foundArticle) {
        // If we have a mock article, still generate a full AI article based on the topic
        generateFullArticle(id as string, foundArticle.title, imageUrlParam || foundArticle.imageUrl);
      } else {
        // If not found in mock, generate a full AI article based on the ID
        // Try to decode the URL-friendly ID to a more readable topic
        const decodedTopic = decodeURIComponent(id as string);
        generateFullArticle(id as string, decodedTopic, imageUrlParam || `https://source.unsplash.com/800x600/?${decodedTopic.replace(/-/g, ',')},space`);
      }
    }
  }, [id]);

  // Function to generate full article content using AI
  const generateFullArticle = async (articleId: string, topic: string, imageUrl?: string) => {
    setLoading(true);
    
    try {
      // Decode the topic from URL
      const decodedTopic = decodeURIComponent(topic);
      
      // Call the API to generate a full article based on the topic
      const response = await fetch('/api/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: decodedTopic,
          nasaImages: imageUrl ? [{ url: imageUrl }] : [] // Pass the image URL if available
        }),
      });
      
      if (response.ok) {
        const fullArticle = await response.json();
        setArticle({
          ...fullArticle,
          id: articleId,  // Preserve the original ID
          imageUrl: imageUrl || fullArticle.imageUrl // Use provided image URL if available, otherwise use API response
        });
      } else {
        // If API fails, use fallback
        setArticle({
          id: articleId,
          title: decodedTopic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Format title nicely
          content: `This is a detailed article about ${decodedTopic}. In production, this contains enhanced content based on real NASA data related to this topic. The James Webb Space Telescope and other instruments provide incredible data about phenomena in our universe, which is used to create these articles.`,
          imageUrl: imageUrl || `https://source.unsplash.com/800x600/?${decodedTopic},space`,
          date: new Date().toISOString(),
          source: "NASA Data & Insights",
          tags: [decodedTopic, "space", "astronomy"],
          summary: `An in-depth exploration of ${decodedTopic} based on NASA observations and research.`
        });
      }
    } catch (error) {
      console.error("Error generating full article:", error);
      // Fallback if there's an error
      const decodedTopic = decodeURIComponent(topic);
      setArticle({
        id: articleId,
        title: decodedTopic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Format title nicely
        content: `This is a detailed article about ${decodedTopic}. In production, this contains enhanced content based on real NASA data related to this topic. The James Webb Space Telescope and other instruments provide incredible data about phenomena in our universe, which is used to create these articles.`,
        imageUrl: imageUrl || `https://source.unsplash.com/800x600/?${decodedTopic},space`,
        date: new Date().toISOString(),
        source: "NASA Data & Insights",
        tags: [decodedTopic, "space", "astronomy"],
        summary: `An in-depth exploration of ${decodedTopic} based on NASA observations and research.`
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="relative isolate min-h-screen w-full transition-colors duration-700 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
        <div className="pointer-events-none absolute inset-0 -z-30 bg-gradient-to-br from-gray-950 via-black to-gray-900" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`relative isolate min-h-screen w-full transition-colors duration-700 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 text-neutral-950'}`}>
        <StarryBackground />
        {/* Background with space elements matching reference theme */}
        <div
          className="pointer-events-none absolute inset-0 -z-30"
          style={{
            backgroundColor: theme === 'dark' ? '#040404' : '#f5f5f4',
            backgroundImage: [
              theme === 'dark' 
                ? 'radial-gradient(ellipse 80% 60% at 10% -10%, rgba(100,100,255,0.15), transparent 60%)' 
                : 'radial-gradient(ellipse 80% 60% at 10% -10%, rgba(100,100,255,0.12), transparent 60%)',
              theme === 'dark' 
                ? 'radial-gradient(ellipse 90% 70% at 90% -20%, rgba(100,255,255,0.12), transparent 70%)' 
                : 'radial-gradient(ellipse 90% 70% at 90% -20%, rgba(100,200,255,0.08), transparent 70%)',
              theme === 'dark' 
                ? 'linear-gradient(to bottom, rgba(70,70,255,0.05), transparent 30%)' 
                : 'linear-gradient(to bottom, rgba(100,150,255,0.05), transparent 30%)'
            ].join(', '),
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 -z-20 opacity-80"
          style={{
            backgroundImage: theme === 'dark' 
              ? 'radial-gradient(circle at 25% 25%, rgba(250,250,250,0.08) 0.7px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(250,250,250,0.08) 0.7px, transparent 1px)' 
              : 'radial-gradient(circle at 25% 25%, rgba(17,17,17,0.12) 0.7px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(17,17,17,0.08) 0.7px, transparent 1px)',
            backgroundSize: '12px 12px',
            backgroundRepeat: 'repeat',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              theme === 'dark'
                ? 'radial-gradient(60% 50% at 50% 10%, rgba(100,150,255,0.18), transparent 70%)'
                : 'radial-gradient(60% 50% at 50% 10%, rgba(100,150,255,0.12), transparent 70%)',
            filter: 'blur(22px)',
          }}
        />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 motion-safe:animate-[hero3-intro_1s_cubic-bezier(.22,.68,0,1)_forwards]">
          <div className={`rounded-3xl p-8 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-gray-200'} backdrop-blur-lg`}>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded w-3/4 mb-6 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded w-1/2 mb-4 animate-pulse"></div>
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl mb-6 animate-pulse"></div>
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full animate-pulse"></div>
              <div className="h-6 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded w-4/6 animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded w-5/6 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative isolate min-h-screen w-full transition-colors duration-700 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 text-neutral-950'}`}>
      <StarryBackground />
      {/* Fixed top navigation */}
      <SpaceNavbar currentPath="/article" />
      
      {/* Extra padding to account for fixed header */}
      <div className="h-20" />
      
      {/* Background with space elements */}
      <div
        className="pointer-events-none absolute inset-0 -z-30"
        style={{
          backgroundColor: theme === 'dark' ? '#040404' : '#f5f5f4',
          backgroundImage: [
            theme === 'dark' 
              ? 'radial-gradient(ellipse 80% 60% at 10% -10%, rgba(100,100,255,0.15), transparent 60%)' 
              : 'radial-gradient(ellipse 80% 60% at 10% -10%, rgba(100,100,255,0.12), transparent 60%)',
            theme === 'dark' 
              ? 'radial-gradient(ellipse 90% 70% at 90% -20%, rgba(100,255,255,0.12), transparent 70%)' 
              : 'radial-gradient(ellipse 90% 70% at 90% -20%, rgba(100,200,255,0.08), transparent 70%)',
            theme === 'dark' 
              ? 'linear-gradient(to bottom, rgba(70,70,255,0.05), transparent 30%)' 
              : 'linear-gradient(to bottom, rgba(100,150,255,0.05), transparent 30%)'
          ].join(', '),
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-20 opacity-80"
        style={{
          backgroundImage: theme === 'dark' 
            ? 'radial-gradient(circle at 25% 25%, rgba(250,250,250,0.08) 0.7px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(250,250,250,0.08) 0.7px, transparent 1px)' 
            : 'radial-gradient(circle at 25% 25%, rgba(17,17,17,0.12) 0.7px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(17,17,17,0.08) 0.7px, transparent 1px)',
          backgroundSize: '12px 12px',
          backgroundRepeat: 'repeat',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            theme === 'dark'
              ? 'radial-gradient(60% 50% at 50% 10%, rgba(100,150,255,0.18), transparent 70%)'
              : 'radial-gradient(60% 50% at 50% 10%, rgba(100,150,255,0.12), transparent 70%)',
          filter: 'blur(22px)',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 motion-safe:animate-[hero3-intro_1s_cubic-bezier(.22,.68,0,1)_forwards]">

        {article && (
          <article className="mb-12 motion-safe:animate-[hero3-intro_1s_cubic-bezier(.22,.68,0,1)_forwards]">
            <header className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}>
                      {new Date(article.date).toLocaleDateString()}
                    </span>
                    <span className={`px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}>
                      {article.source}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`rounded-full ${theme === 'dark' ? 'border-white/20' : 'border-gray-200'}`}
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: article.title,
                          text: article.summary,
                          url: window.location.href,
                        }).catch(err => {
                          console.error('Error sharing:', err);
                          // Fallback to clipboard if share fails
                          navigator.clipboard.writeText(window.location.href)
                            .then(() => {
                              toast.success('AI article link copied', {
                                position: 'bottom-center',
                                style: {
                                  background: theme === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                                  color: theme === 'dark' ? '#f0f0f0' : '#111',
                                  border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
                                },
                                className: theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200'
                              });
                            })
                            .catch(copyErr => {
                              console.error('Failed to copy: ', copyErr);
                              toast.error('Failed to copy link', {
                                position: 'bottom-center',
                                style: {
                                  background: theme === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                                  color: theme === 'dark' ? '#f0f0f0' : '#111',
                                  border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
                                },
                                className: theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200'
                              });
                            });
                        });
                      } else {
                        // Fallback for browsers that don't support Web Share API
                        navigator.clipboard.writeText(window.location.href)
                          .then(() => {
                            toast.success('AI article link copied', {
                              position: 'bottom-center',
                              style: {
                                background: theme === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                                color: theme === 'dark' ? '#f0f0f0' : '#111',
                                border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
                              },
                              className: theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200'
                            });
                          })
                          .catch(err => {
                            console.error('Failed to copy: ', err);
                            toast.error('Failed to copy link', {
                              position: 'bottom-center',
                              style: {
                                background: theme === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                                color: theme === 'dark' ? '#f0f0f0' : '#111',
                                border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
                              },
                              className: theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200'
                            });
                          });
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="aspect-video rounded-2xl overflow-hidden border border-white/10">
                  <img 
                    src={article.imageUrl || `https://source.unsplash.com/1200x600/?${article.id},space`} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag: string, index: number) => (
                  <span 
                    key={index} 
                    className={`text-xs px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>
            
            <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
              <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {article.summary}
              </p>
              <div className={`whitespace-pre-line ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`} style={{ wordBreak: 'break-word', lineHeight: '1.8' }}>
                {article.content}
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex justify-end">
                <Link href="/explore" passHref>
                  <Button className={`rounded-full ${
                    theme === 'dark' 
                      ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
                      : 'bg-black/10 text-gray-900 hover:bg-black/20 border border-gray-300'
                  }`}>
                    Explore More Articles
                  </Button>
                </Link>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default ArticleDetailPage;