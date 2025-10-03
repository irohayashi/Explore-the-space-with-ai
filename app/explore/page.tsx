"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, Home, User, Sparkles, Compass } from "lucide-react";
import { useThemeSync } from "@/components/ui/hero-space";
import SpaceChatbotThemed from "@/components/ui/space-chatbot-themed";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import StarryBackground from "@/components/ui/starry-background";
import SpaceNavbar from "@/components/ui/space-navbar";


const ExplorePage = () => {
  const [theme, setTheme] = useThemeSync();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false); // Track if we're in search mode
  
  // State for loading messages to show during data fetching
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState("");
  const [galleryLoadingMessage, setGalleryLoadingMessage] = useState("");
  const [articlesLoadingMessage, setArticlesLoadingMessage] = useState("");
  
  // Generate diverse loading messages for better UX
  const getRandomSearchMessage = (query: string) => {
    const searchAdjectives = [
      "breathtaking", "mysterious", "awe-inspiring", "enigmatic", 
      "mesmerizing", "extraordinary", "remarkable", "astounding",
      "captivating", "spectacular", "phenomenal", "incredible",
      "striking", "marvelous", "fantastic", "wondrous"
    ];
    
    const searchNouns = [
      "cosmic phenomena", "celestial wonders", "stellar formations", 
      "galactic marvels", "astronomical curiosities", "interstellar mysteries",
      "extraterrestrial anomalies", "universal spectacles", "orbital oddities",
      "cosmic curiosities", "heavenly spectacles", "stellar phenomena"
    ];
    
    const actions = [
      "Decrypting", "Unraveling", "Decoding", "Interpreting",
      "Investigating", "Analyzing", "Examining", "Probing",
      "Exploring", "Scanning", "Researching", "Studying",
      "Delving into", "Uncovering", "Revealing", "Discovering"
    ];
    
    const randomAdjective = searchAdjectives[Math.floor(Math.random() * searchAdjectives.length)];
    const randomNoun = searchNouns[Math.floor(Math.random() * searchNouns.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    
    // Create more varied and interesting search messages
    const searchTemplates = [
      `${randomAction} ${randomAdjective} ${randomNoun}...`,
      `${randomAction} the ${randomAdjective} depths of ${query || 'the cosmos'}...`,
      `Navigating through ${randomAdjective} ${query || 'astronomical'} territories...`,
      `Unlocking secrets of ${query || 'celestial'} ${randomNoun}...`,
      `Revealing ${randomAdjective} aspects of ${query || 'space'}...`,
      `Venturing into ${randomAdjective} ${query || 'interstellar'} realms...`,
      `Interpreting ${randomAdjective} ${query || 'cosmic'} signals...`,
      `Cataloging ${randomAdjective} ${query || 'stellar'} formations...`,
      `Traversing the ${randomAdjective} ${query || 'galactic'} landscape...`,
      `Analyzing ${randomAdjective} ${query || 'celestial'} patterns...`
    ];
    
    return searchTemplates[Math.floor(Math.random() * searchTemplates.length)];
  };
  // Define types for articles
  type Article = {
    id: string | number;
    title: string;
    summary: string;
    content?: string;
    imageUrl: string;
    date: string;
    source: string;
    tags: string[];
    searchQuery?: string;
  };

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Set a random loading message on initial load
    setCurrentLoadingMessage(getRandomSearchMessage("space data"));
  }, []);

  // Sample data for development - replaced with NASA API data in production
  const mockArticles: Article[] = [
    {
      id: 1,
      title: "The Mysteries of the Orion Nebula",
      summary: "A deep dive into one of the most photographed objects in the night sky, revealing new insights about star formation.",
      imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      date: "2024-01-15",
      source: "Hubble Space Telescope",
      tags: ["nebula", "star formation", "orion"]
    },
    {
      id: 2,
      title: "Jupiter's Great Red Spot: A Storm of Millennia",
      summary: "The latest findings about Jupiter's most iconic feature and how it continues to evolve.",
      imageUrl: "https://images.unsplash.com/photo-1482963405972-7ab5e0c1b4d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      date: "2024-01-10",
      source: "Juno Mission",
      tags: ["jupiter", "gas giant", "storms"]
    },
    {
      id: 3,
      title: "The James Webb Telescope's Latest Discovery",
      summary: "New infrared images reveal galaxies formed just after the Big Bang, reshaping our understanding of the early universe.",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      date: "2024-01-05",
      source: "James Webb Space Telescope",
      tags: ["webb", "galaxies", "early universe"]
    },
    {
      id: 4,
      title: "Dark Matter Mapping: The Invisible Universe",
      summary: "Scientists create the most detailed map of dark matter distribution in our cosmic neighborhood.",
      imageUrl: "https://images.unsplash.com/photo-1635070041064-0a8d3d0d3e5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      date: "2024-01-01",
      source: "Euclid Space Telescope",
      tags: ["dark matter", "cosmology", "mapping"]
    },
    {
      id: 5,
      title: "Exoplanets: Worlds Beyond Our Solar System",
      summary: "The search for Earth-like planets continues with new discoveries in the habitable zones of distant stars.",
      imageUrl: "https://images.unsplash.com/photo-1454789548928-9a7310581f68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      date: "2023-12-28",
      source: "TESS Mission",
      tags: ["exoplanets", "habitability", "telescope"]
    },
    {
      id: 6,
      title: "The Lifecycle of a Star",
      summary: "From stellar nurseries to supernova explosions, understanding the cosmic processes that create elements essential for life.",
      imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      date: "2023-12-20",
      source: "Multiple Observatories",
      tags: ["stars", "supernova", "elements"]
    }
  ];

  // Fetch NASA image data
  const [nasaImages, setNasaImages] = useState<Array<{
    id: number;
    url: string;
    title: string;
    description?: string;
  }>>([]);

  // Function to fetch NASA images
  const fetchNasaImages = async (searchQuery: string) => {
    const loadingMessage = getRandomSearchMessage(searchQuery);
    setCurrentLoadingMessage(loadingMessage);
    setGalleryLoadingMessage(loadingMessage);
    setIsLoadingGallery(true);
    
    try {
      // Determine which endpoint to use based on whether there's a search query
      let endpoint = 'apod';
      let params = '';
      
      if (searchQuery.trim()) {
        // Use NASA image library with search query
        endpoint = 'images';
        params = `&q=${encodeURIComponent(searchQuery)}`;
      } else {
        // For general space images without search, use a random space-related query to make it more diverse
        const randomSpaceTopics = [
          'galaxy', 'nebula', 'star', 'cosmos', 'universe', 'milky way', 
          'constellation', 'planetary nebula', 'supernova', 'black hole',
          'pulsar', 'quasar', 'exoplanet', 'astrophysics', 'cosmology',
          'stellar formation', 'interstellar', 'celestial', 'astronomy', 'orbit'
        ];
        const randomTopic = randomSpaceTopics[Math.floor(Math.random() * randomSpaceTopics.length)];
        endpoint = 'images';
        params = `&q=${encodeURIComponent(randomTopic)}`;
      }
      
      // Add media_type=image to specifically get images
      params += '&media_type=image';
      
      const response = await fetch(`/api/nasa?endpoint=${endpoint}${params}`);
      
      console.log('NASA API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('NASA API response data:', data);
        
        let formattedImages: Array<{
          id: number;
          url: string;
          title: string;
          description?: string;
        }> = [];
        
        if (data.collection?.items) {
          // Get random selection of images from the collection
          let allItems = [...data.collection.items];
          
          // Shuffle the array to get random images
          allItems = allItems.sort(() => Math.random() - 0.5);
          
          // Take the first 6 items after shuffling (or fewer if less available)
          const selectedItems = allItems.slice(0, 6);
          
          // Define types for NASA API response
          interface NasaItem {
            links?: Array<{ href: string }>;
            data?: Array<{ title: string; description?: string }>;
          }
          
          formattedImages = selectedItems.map((item: NasaItem, index: number) => {
            const image = item.links?.[0];
            const description = item.data?.[0];
            
            return {
              id: index + 1,
              url: image?.href || `https://source.unsplash.com/1200x800/?${searchQuery || 'space'},astronomy`,
              title: description?.title || `Space Image ${index + 1}`,
              description: description?.description?.substring(0, 100) + '...' || 'Astronomy image'
            };
          });
        }
        
        // If no images were found from the image library, try APOD as fallback
        if (formattedImages.length === 0 && endpoint === 'images') {
          // Fetch from APOD as fallback
          const apodResponse = await fetch(`/api/nasa?endpoint=apod&count=6`);
          if (apodResponse.ok) {
            const apodData = await apodResponse.json();
            if (Array.isArray(apodData)) {
              // Shuffle APOD data too
              const shuffledApod = [...apodData].sort(() => Math.random() - 0.5);
              const selectedApod = shuffledApod.slice(0, 6);
              
              // Define type for APOD data
              interface ApodItem {
                url?: string;
                hdurl?: string;
                title?: string;
                explanation?: string;
              }
              
              // Take only the first 6 APOD images
              formattedImages = selectedApod.map((item: ApodItem, index: number) => ({
                id: index + 1,
                url: item.url || item.hdurl || `https://source.unsplash.com/1200x800/?${searchQuery || 'space'},astronomy`,
                title: item.title || `APOD Image ${index + 1}`,
                description: item.explanation?.substring(0, 100) + '...' || 'Astronomy Picture of the Day'
              }));
            }
          }
        }
        
        // If still no images, use fallbacks
        if (formattedImages.length === 0) {
          // Generate random space-related images
          const categories = ['galaxy', 'nebula', 'planet', 'star', 'cosmos', 'universe', 'milkyway', 'constellation'];
          const randomCategories = [...categories].sort(() => Math.random() - 0.5).slice(0, 6);
          
          formattedImages = randomCategories.map((category, index) => ({
            id: index + 1,
            url: `https://source.unsplash.com/1200x800/?${category},space`,
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} Image`,
            description: `A beautiful ${category} captured by space telescopes`
          }));
        }
        
        setNasaImages(formattedImages);
      } else {
        // Fallback: Use unsplash images if NASA API fails
        console.warn('NASA API returned non-OK status:', response.status);
        const categories = ['space', 'galaxy', 'nebula', 'planet', 'star', 'cosmos'];
        const randomCategories = [...categories].sort(() => Math.random() - 0.5);
        
        const fallbackImages: Array<{
          id: number;
          url: string;
          title: string;
          description?: string;
        }> = randomCategories.map((category, index) => ({
          id: index + 1,
          url: `https://source.unsplash.com/1200x800/?${category},astronomy`,
          title: `${category.charAt(0).toUpperCase() + category.slice(1)} View`,
          description: `A stunning view of ${category}`
        }));
        
        setNasaImages(fallbackImages);
      }
    } catch (error) {
      console.error("Error fetching NASA images:", error);
      // Fallback to unsplash images
      const categories = ['space', 'galaxy', 'nebula', 'planet', 'star', 'cosmos'];
      const randomCategories = [...categories].sort(() => Math.random() - 0.5);
      
      const fallbackImages: Array<{
        id: number;
        url: string;
        title: string;
        description?: string;
      }> = randomCategories.map((category, index) => ({
        id: index + 1,
        url: `https://source.unsplash.com/1200x800/?${category},astronomy`,
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Image`,
        description: `Space image ${index + 1}`
      }));
      
      setNasaImages(fallbackImages);
    } finally {
      setIsLoadingGallery(false);
      setCurrentLoadingMessage("");
      setGalleryLoadingMessage("");
    }
  };

  // Function to fetch and generate multiple random articles
  const fetchRandomArticles = async () => {
    const loadingMessage = getRandomSearchMessage("");
    setCurrentLoadingMessage(loadingMessage);
    setArticlesLoadingMessage(loadingMessage);
    setIsLoadingArticles(true);
    try {
      // If we don't have a specific articles loading message yet, set one
      if (!articlesLoadingMessage) {
        setArticlesLoadingMessage(getRandomSearchMessage("articles"));
      }
      // Fetch random space topics to generate articles about
      const spaceTopics = [
        'nebula', 'galaxy', 'black hole', 'exoplanet', 'supernova', 'pulsar',
        'quasar', 'dark matter', 'cosmic radiation', 'stellar evolution',
        'planetary formation', 'cosmic microwave background', 'red giant',
        'white dwarf', 'neutron star', 'interstellar medium'
      ];
      
      // Randomly select exactly 6 topics for articles
      const shuffledTopics = [...spaceTopics].sort(() => Math.random() - 0.5);
      const selectedTopics = shuffledTopics.slice(0, 6); // Exactly 6 articles
      
      // Create arrays to store promises for parallel execution
      const imagePromises = selectedTopics.map(topic => 
        fetch(`/api/nasa?endpoint=images&q=${encodeURIComponent(topic)}&media_type=image`)
      );
      
      // Wait for all image fetches to complete
      const imageResponses = await Promise.allSettled(imagePromises);
      
      // Process image responses to get image URLs
      const imageResults = await Promise.allSettled(
        imageResponses.map(async (responsePromise, index) => {
          if (responsePromise.status === 'fulfilled') {
            const response = responsePromise.value;
            if (response.ok) {
              try {
                const data = await response.json();
                let imageUrl = `https://source.unsplash.com/800x600/?${selectedTopics[index]},space`;
                
                if (data.collection?.items && data.collection.items.length > 0) {
                  // Shuffle and select a random image from results
                  const shuffledItems = [...data.collection.items].sort(() => Math.random() - 0.5);
                  const randomItem = shuffledItems[0];
                  const imageLink = randomItem.links?.[0];
                  if (imageLink) {
                    imageUrl = imageLink.href;
                  }
                }
                return imageUrl;
              } catch (error) {
                console.error(`Error processing image response for ${selectedTopics[index]}:`, error);
                return `https://source.unsplash.com/800x600/?${selectedTopics[index]},space`;
              }
            } else {
              return `https://source.unsplash.com/800x600/?${selectedTopics[index]},space`;
            }
          } else {
            return `https://source.unsplash.com/800x600/?${selectedTopics[index]},space`;
          }
        })
      );
      
      // Create array of image URLs
      const imageUrls = imageResults.map(result => 
        result.status === 'fulfilled' ? result.value : `https://source.unsplash.com/800x600/?space,random`
      );
      
      // Now generate AI articles in parallel
      const articlePromises = selectedTopics.map((topic, index) => 
        fetch('/api/generate-article', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            query: topic,
            nasaImages: [{ url: imageUrls[index] }] // Pass the image URL for context
          }),
        })
      );
      
      // Wait for all AI generation requests to complete
      const articleResponses = await Promise.allSettled(articlePromises);
      
      // Process the article responses
      const newArticles = [];
      for (let i = 0; i < selectedTopics.length; i++) {
        const topic = selectedTopics[i];
        const imageUrl = imageUrls[i];
        
        const response = articleResponses[i];
        if (response.status === 'fulfilled' && response.value.ok) {
          try {
            const article = await response.value.json();
            newArticles.push({
              ...article,
              id: Date.now() + Math.random() + i, // Ensure unique ID
              title: article.title || `${topic.charAt(0).toUpperCase() + topic.slice(1)}: New Discoveries`,
              summary: article.summary || `Latest findings and insights about ${topic}`,
              imageUrl: article.imageUrl || imageUrl
            });
          } catch (err) {
            // If JSON parsing fails, use fallback
            newArticles.push({
              id: Date.now() + Math.random() + i,
              title: `${topic.charAt(0).toUpperCase() + topic.slice(1)}: Cosmic Wonders`,
              summary: `Exploring the fascinating properties of ${topic} in our universe`,
              imageUrl: imageUrl,
              date: new Date().toISOString(),
              source: "NASA/Space Data",
              tags: [topic, "astronomy", "space"],
              content: `This article explores the fascinating ${topic} and its role in cosmic phenomena. Scientists continue to study these celestial objects to better understand the universe.`
            });
          }
        } else {
          // Fallback article if AI generation fails
          newArticles.push({
            id: Date.now() + Math.random() + i,
            title: `${topic.charAt(0).toUpperCase() + topic.slice(1)}: Cosmic Wonders`,
            summary: `Exploring the fascinating properties of ${topic} in our universe`,
            imageUrl: imageUrl,
            date: new Date().toISOString(),
            source: "NASA/Space Data",
            tags: [topic, "astronomy", "space"],
            content: `This article explores the fascinating ${topic} and its role in cosmic phenomena. Scientists continue to study these celestial objects to better understand the universe.`
          });
        }
      }
      
      setArticles(newArticles);
    } catch (error) {
      console.error("Error fetching random articles:", error);
      // Set default mock articles as fallback
      setArticles(mockArticles);
    } finally {
      setIsLoadingArticles(false);
      setCurrentLoadingMessage("");
      setArticlesLoadingMessage("");
    }
  };

  useEffect(() => {
    // Reset search mode when page loads
    setIsSearchMode(false);
    
    // When the page loads, fetch NASA images and random articles simultaneously
    const initialLoadingMessage = getRandomSearchMessage("space data");
    setCurrentLoadingMessage(initialLoadingMessage);
    setGalleryLoadingMessage(initialLoadingMessage);
    setArticlesLoadingMessage(initialLoadingMessage);
    setIsLoadingGallery(true); // Show loading screen for gallery on initial page load
    setIsLoadingArticles(true); // Show loading screen for articles on initial page load
    Promise.all([
      fetchNasaImages(''),
      fetchRandomArticles()
    ]).catch(error => {
      console.error("Error during initial data fetch:", error);
    }).finally(() => {
      // Update overall loading state to false when both are done
      setIsLoading(false);
      setCurrentLoadingMessage("");
      setGalleryLoadingMessage("");
      setArticlesLoadingMessage("");
    });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Set search mode to true when performing a search
    setIsSearchMode(true);
    
    // Set a consistent loading message for this operation
    setCurrentLoadingMessage(getRandomSearchMessage(searchQuery));
    setIsLoadingGallery(true);
    setIsLoadingArticles(true);
    
    // Add to search history
    if (!searchHistory.includes(searchQuery)) {
      setSearchHistory(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
    
    try {
      // If we don't have a specific gallery loading message yet, set one
      if (!galleryLoadingMessage) {
        const galleryMsg = getRandomSearchMessage(searchQuery);
        setGalleryLoadingMessage(galleryMsg);
        setCurrentLoadingMessage(galleryMsg);
      }
      // Fetch new NASA images based on search query
      await fetchNasaImages(searchQuery);
      
      // Generate 6 unique articles based on the search query
      const searchArticles = [];
      const relatedTopics = [
        `${searchQuery} origin and formation`,
        `${searchQuery} recent discoveries`,
        `${searchQuery} structural characteristics`,
        `${searchQuery} observational techniques`,
        `${searchQuery} scientific significance`,
        `${searchQuery} evolutionary processes`
      ];
      
      // Fetch unique image for the main article
      const mainImageResponse = await fetch(`/api/nasa?endpoint=images&q=${encodeURIComponent(searchQuery)}&media_type=image&count=1`);
      let mainImageUrl = `https://source.unsplash.com/800x600/?${searchQuery},space`;
      
      if (mainImageResponse.ok) {
        const mainImageData = await mainImageResponse.json();
        if (mainImageData.collection?.items && mainImageData.collection.items.length > 0) {
          // Get a random image from the results
          const shuffledItems = [...mainImageData.collection.items].sort(() => Math.random() - 0.5);
          const randomItem = shuffledItems[0];
          const imageLink = randomItem.links?.[0];
          if (imageLink) {
            mainImageUrl = imageLink.href;
          }
        }
      }

      // Generate the main article first
      const mainResponse = await fetch('/api/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: searchQuery,
          nasaImages: [{ url: mainImageUrl }] // Use the unique main image
        }),
      });
      
      if (mainResponse.ok) {
        const mainArticle = await mainResponse.json();
        mainArticle.id = `search-main-${searchQuery}-${Date.now()}`;
        mainArticle.imageUrl = mainArticle.imageUrl || mainImageUrl; // Ensure the correct image URL
        searchArticles.push(mainArticle);
      } else {
        // Fallback for main article
        searchArticles.push({
          id: `search-main-${searchQuery}-${Date.now()}`,
          title: `Information about ${searchQuery}`,
          summary: `Search results for ${searchQuery} in our space database`,
          imageUrl: mainImageUrl,
          date: new Date().toISOString(),
          source: "NASA Data & Insights",
          tags: [searchQuery, "space", "astronomy"],
          content: `This article contains information about ${searchQuery}. This content was created based on available space data and research.`
        });
      }
      
      // Generate 5 additional related articles with different topics specific to the search query
      const searchPromises = [];
      const specificRelatedTopics = [
        `${searchQuery} physical properties and composition`,
        `${searchQuery} historical discovery and observations`, 
        `${searchQuery} atmospheric and surface features`,
        `${searchQuery} orbital mechanics and celestial dynamics`,
        `${searchQuery} notable missions and exploratory efforts`
      ];
      
      for (let i = 0; i < 5; i++) {
        const relatedTopic = specificRelatedTopics[i];
        searchPromises.push(
          (async () => {
            try {
              // Fetch unique images for each related topic
              const imageResponse = await fetch(`/api/nasa?endpoint=images&q=${encodeURIComponent(relatedTopic)}&media_type=image&count=1`);
              let relatedImageUrl = `https://source.unsplash.com/800x600/?${searchQuery},${['composition', 'surface', 'orbit', 'moons', 'atmosphere'][i % 5]}`;
              
              if (imageResponse.ok) {
                const imageData = await imageResponse.json();
                if (imageData.collection?.items && imageData.collection.items.length > 0) {
                  // Get a random image from the results
                  const shuffledItems = [...imageData.collection.items].sort(() => Math.random() - 0.5);
                  const randomItem = shuffledItems[0];
                  const imageLink = randomItem.links?.[0];
                  if (imageLink) {
                    relatedImageUrl = imageLink.href;
                  }
                }
              }
              
              const relatedResponse = await fetch('/api/generate-article', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  query: relatedTopic,
                  nasaImages: [{ url: relatedImageUrl }] // Use the unique image for this topic
                }),
              });
              
              if (relatedResponse.ok) {
                const relatedArticle = await relatedResponse.json();
                // Ensure unique ID and correct topic
                relatedArticle.id = `search-related-${searchQuery}-${i}-${Date.now()}`;
                relatedArticle.title = relatedArticle.title || `${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}: ${relatedTopics[i]}`;
                relatedArticle.summary = relatedArticle.summary || `Information about ${relatedTopic}`;
                relatedArticle.imageUrl = relatedArticle.imageUrl || relatedImageUrl;
                return relatedArticle;
              } else {
                // Fallback for related article with more specific content
                return {
                  id: `search-related-${searchQuery}-${i}-${Date.now()}`,
                  title: `${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}: ${specificRelatedTopics[i]}`,
                  summary: `Detailed information about ${specificRelatedTopics[i]}`,
                  imageUrl: relatedImageUrl,
                  date: new Date().toISOString(),
                  source: "NASA Data & AI Insights",
                  tags: [searchQuery, specificRelatedTopics[i].split(' ')[1] || "space", "astronomy"], // Get the second word as tag
                  content: `This article explores ${specificRelatedTopics[i]} in detail. Through advanced telescopic observation and space missions, scientists have gathered significant data about ${searchQuery} which has enhanced our understanding of ${searchQuery}'s unique characteristics.`
                };
              }
            } catch (error) {
              console.error(`Error generating related article ${i + 1}:`, error);
              // Add a fallback if generation fails with specific content
              const fallbackImageUrl = `https://source.unsplash.com/800x600/?${searchQuery},${['composition', 'surface', 'orbit', 'moons', 'atmosphere'][i % 5]}`;
              return {
                id: `search-related-${searchQuery}-${i}-${Date.now()}`,
                title: `${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}: ${specificRelatedTopics[i]}`,
                summary: `Information about ${specificRelatedTopics[i]} based on NASA data`,
                imageUrl: fallbackImageUrl,
                date: new Date().toISOString(),
                source: "NASA Data & AI Insights",
                tags: [searchQuery, specificRelatedTopics[i].split(' ')[1] || "space", "astronomy"],
                content: `This article provides insights on ${specificRelatedTopics[i]}. Our AI has analyzed available data about ${searchQuery} to provide this comprehensive overview.`
              };
            }
          })()
        );
      }
      
      // Wait for all related articles to be generated
      const relatedArticles = await Promise.all(searchPromises);
      searchArticles.push(...relatedArticles);
      
      // Set the unique search articles
      setArticles(searchArticles);
    } catch (error) {
      console.error("Error in search process:", error);
      // Fallback if there's an error
      const fallbackArticles = Array.from({ length: 6 }, (_, i) => ({
        id: `search-fallback-${searchQuery}-${i}-${Date.now()}`,
        title: `${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)} - Result ${i+1}`,
        summary: `Search result ${i+1} for ${searchQuery} in our space database`,
        imageUrl: `https://source.unsplash.com/800x600/?${searchQuery},${['space', 'astronomy', 'universe', 'cosmos', 'galaxy', 'star'][i % 6]}`,
        date: new Date().toISOString(),
        source: "Space Explorer",
        tags: [searchQuery, "space", "astronomy"],
        content: `This article contains information about ${searchQuery}. This content was created based on available space data and research.`
      }));
      setArticles(fallbackArticles);
    } finally {
      setIsLoadingGallery(false);
      setIsLoadingArticles(false);
      setCurrentLoadingMessage("");
      setGalleryLoadingMessage("");
      setArticlesLoadingMessage("");
    }
  };

  const loadMore = async () => {
    if (articles.length >= 18) {
      // Maximum of 18 articles reached
      return;
    }

    const loadingMessage = getRandomSearchMessage("more articles");
    setCurrentLoadingMessage(loadingMessage);
    setArticlesLoadingMessage(loadingMessage);
    setIsLoadingArticles(true);
    
    try {
      // Check if we're in search mode
      if (isSearchMode && searchQuery) {
        // If we're in search mode, load more articles related to the search query
        const searchArticles: Article[] = [];
        const relatedTopics = [
          `${searchQuery} advanced research`,
          `${searchQuery} latest discoveries`, 
          `${searchQuery} scientific breakthroughs`
        ];
        
        // Fetch unique images for each related topic
        const searchPromises = [];
        
        for (let i = 0; i < 3; i++) {
          const relatedTopic = relatedTopics[i];
          searchPromises.push(
            (async () => {
              try {
                // Fetch unique images for each related topic
                const imageResponse = await fetch(`/api/nasa?endpoint=images&q=${encodeURIComponent(relatedTopic)}&media_type=image&count=1`);
                let relatedImageUrl = `https://source.unsplash.com/800x600/?${searchQuery},${['research', 'discoveries', 'science'][i % 3]}`;
                
                if (imageResponse.ok) {
                  const imageData = await imageResponse.json();
                  if (imageData.collection?.items && imageData.collection.items.length > 0) {
                    // Get a random image from the results
                    const shuffledItems = [...imageData.collection.items].sort(() => Math.random() - 0.5);
                    const randomItem = shuffledItems[0];
                    const imageLink = randomItem.links?.[0];
                    if (imageLink) {
                      relatedImageUrl = imageLink.href;
                    }
                  }
                }
                
                const relatedResponse = await fetch('/api/generate-article', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ 
                    query: relatedTopic,
                    nasaImages: [{ url: relatedImageUrl }] // Use the unique image for this topic
                  }),
                });
                
                if (relatedResponse.ok) {
                  const relatedArticle = await relatedResponse.json();
                  // Ensure unique ID and correct topic
                  relatedArticle.id = `search-more-${searchQuery}-${i}-${Date.now()}`;
                  relatedArticle.title = relatedArticle.title || `${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}: ${relatedTopics[i]}`;
                  relatedArticle.summary = relatedArticle.summary || `Information about ${relatedTopic}`;
                  relatedArticle.imageUrl = relatedArticle.imageUrl || relatedImageUrl;
                  return relatedArticle;
                } else {
                  // Fallback for related article with more specific content
                  return {
                    id: `search-more-${searchQuery}-${i}-${Date.now()}`,
                    title: `${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}: ${relatedTopics[i]}`,
                    summary: `Detailed information about ${relatedTopics[i]}`,
                    imageUrl: relatedImageUrl,
                    date: new Date().toISOString(),
                    source: "NASA Data & AI Insights",
                    tags: [searchQuery, relatedTopics[i].split(' ')[1] || "space", "astronomy"],
                    content: `This article explores ${relatedTopics[i]} in detail. Through advanced telescopic observation and space missions, scientists have gathered significant data about ${searchQuery} which has enhanced our understanding of ${searchQuery}'s unique characteristics.`
                  };
                }
              } catch (error) {
                console.error(`Error generating related article ${i + 1}:`, error);
                // Add a fallback if generation fails with specific content
                const fallbackImageUrl = `https://source.unsplash.com/800x600/?${searchQuery},${['research', 'discoveries', 'science'][i % 3]}`;
                return {
                  id: `search-more-${searchQuery}-${i}-${Date.now()}`,
                  title: `${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}: ${relatedTopics[i]}`,
                  summary: `Information about ${relatedTopics[i]} based on NASA data`,
                  imageUrl: fallbackImageUrl,
                  date: new Date().toISOString(),
                  source: "NASA Data & AI Insights",
                  tags: [searchQuery, relatedTopics[i].split(' ')[1] || "space", "astronomy"],
                  content: `This article provides insights on ${relatedTopics[i]}. Our AI has analyzed available data about ${searchQuery} to provide this comprehensive overview.`
                };
              }
            })()
          );
        }
        
        // Wait for all related articles to be generated
        const newArticles = await Promise.all(searchPromises);
        searchArticles.push(...newArticles);
        
        // Add the new search articles to the existing ones
        setArticles(prevArticles => [...prevArticles, ...searchArticles]);
      } else {
        // If not in search mode, load more random articles as before
        const spaceTopics = [
          'nebula', 'galaxy', 'black hole', 'exoplanet', 'supernova', 'pulsar',
          'quasar', 'dark matter', 'cosmic radiation', 'stellar evolution',
          'planetary formation', 'cosmic microwave background', 'red giant',
          'white dwarf', 'neutron star', 'interstellar medium'
        ];
        
        // Randomly select 3 topics for new articles
        const shuffledTopics = [...spaceTopics].sort(() => Math.random() - 0.5);
        const selectedTopics = shuffledTopics.slice(0, 3);
        
        // For each new topic, create an article
        const newArticlePromises = selectedTopics.map(async (topic) => {
          try {
            // Fetch image for this topic
            const imageResponse = await fetch(`/api/nasa?endpoint=images&q=${encodeURIComponent(topic)}&media_type=image&count=1`);
            let imageUrl = `https://source.unsplash.com/800x600/?${topic},space`;
            
            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              if (imageData.collection?.items && imageData.collection.items.length > 0) {
                // Get a random image from the results
                const shuffledItems = [...imageData.collection.items].sort(() => Math.random() - 0.5);
                const randomItem = shuffledItems[0];
                const imageLink = randomItem.links?.[0];
                if (imageLink) {
                  imageUrl = imageLink.href;
                }
              }
            }
            
            // Generate AI content for the article
            const aiResponse = await fetch('/api/generate-article', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                query: topic,
                nasaImages: [{ url: imageUrl }]
              }),
            });
            
            if (aiResponse.ok) {
              const article = await aiResponse.json();
              return {
                ...article,
                id: `loadmore-${Date.now()}-${Math.random()}`, // Ensure unique ID
                title: article.title || `${topic.charAt(0).toUpperCase() + topic.slice(1)}: Cosmic Discoveries`,
                summary: article.summary || `Latest findings about ${topic} from space missions`,
                imageUrl: article.imageUrl || imageUrl
              };
            } else {
              // Fallback if AI generation fails
              return {
                id: `loadmore-${Date.now()}-${Math.random()}`,
                title: `${topic.charAt(0).toUpperCase() + topic.slice(1)}: Cosmic Wonders`,
                summary: `Exploring the fascinating properties of ${topic} in our universe`,
                imageUrl: imageUrl,
                date: new Date().toISOString(),
                source: "NASA Data & Insights",
                tags: [topic, "space", "astronomy"],
                content: `This article explores the fascinating ${topic} and its role in cosmic phenomena. Scientists continue to study these celestial objects to better understand the universe.`
              };
            }
          } catch (error) {
            console.error(`Error creating article for ${topic}:`, error);
            // Fallback article if anything goes wrong
            return {
              id: `loadmore-${Date.now()}-${Math.random()}`,
              title: `${topic.charAt(0).toUpperCase() + topic.slice(1)}: Cosmic Wonders`,
              summary: `Information about ${topic} in our universe`,
              imageUrl: `https://source.unsplash.com/800x600/?${topic},space`,
              date: new Date().toISOString(),
              source: "NASA Data & Insights",
              tags: [topic, "space", "astronomy"],
              content: `This article explores the fascinating ${topic} and its role in cosmic phenomena. Scientists continue to study these celestial objects to better understand the universe.`
            };
          }
        });
        
        // Wait for all new articles to be generated
        const newArticles = await Promise.all(newArticlePromises);
        
        // Add the new articles to the existing ones  
        setArticles(prevArticles => [...prevArticles, ...newArticles]);
      }
    } catch (error) {
      console.error("Error loading more articles:", error);
      // Add fallback articles if there's an error
      const fallbackArticles = Array.from({ length: 3 }, (_, i) => ({
        id: `fallback-${Date.now()}-${i}`,
        title: `Space Article ${articles.length + i + 1}`,
        summary: `Additional space information and discoveries`,
        imageUrl: `https://source.unsplash.com/800x600/?space,cosmos`,
        date: new Date().toISOString(),
        source: "NASA Data & Insights",
        tags: ["space", "astronomy", "cosmos"],
        content: `This is additional space content to expand your exploration experience.`
      }));
      setArticles(prevArticles => [...prevArticles, ...fallbackArticles]);
    } finally {
      setIsLoadingArticles(false);
      setCurrentLoadingMessage("");
      setArticlesLoadingMessage("");
    }
  };

  if (!isClient) {
    // Render a simplified version during SSR to prevent hydration mismatch
    return (
      <div className="relative isolate min-h-screen w-full transition-colors duration-700 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
        {/* Simplified background for SSR */}
        <div className="pointer-events-none absolute inset-0 -z-30 bg-gradient-to-br from-gray-950 via-black to-gray-900" />
      </div>
    );
  }

  return (
    <div className={`relative isolate min-h-screen w-full transition-colors duration-700 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 text-neutral-950'}`}>
      <StarryBackground />
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
      
      {/* Floating stars */}
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            opacity: Math.random() * 0.7 + 0.3,
            animation: `twinkle ${Math.random() * 5 + 3}s infinite ${Math.random() * 2}s`
          }}
        />
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col items-center w-full">
          {/* Navbar positioning with consistent spacing */}
          <div className="w-full max-w-7xl mb-8">
            <SpaceNavbar currentPath="/explore" />
          </div>
        </div>
        
        
        {/* Search bar with consistent spacing */}
        <div className="w-full max-w-md mx-auto mb-4 mt-4">
          <div className={`p-1.5 rounded-2xl backdrop-blur-sm border ${
            theme === 'dark' 
              ? 'bg-black/70 border-white/30' 
              : 'bg-white/90 border-gray-300'
          } shadow-lg w-full`}>
            <form onSubmit={handleSearch} className="flex gap-1.5 w-full flex-1">
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search space topics..."
                className={`flex-1 px-4 py-2.5 rounded-2xl ${theme === 'dark' ? 'bg-white/10 text-white placeholder:text-white/60' : 'bg-white text-gray-900 placeholder:text-gray-500'} focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-white/40' : 'focus:ring-gray-900/40'} text-sm min-w-0 w-full`}
                autoComplete="off"
              />
              <button 
                type="submit"
                disabled={isLoadingGallery || isLoadingArticles}
                className={`group relative p-2.5 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer overflow-hidden ${
                  (isLoadingGallery || isLoadingArticles) 
                    ? 'opacity-70 cursor-not-allowed' 
                    : `hover:scale-110 hover:shadow-lg ${
                        theme === 'dark' 
                          ? 'bg-white text-black hover:bg-white/90' 
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`
                }`}
                onMouseMove={(e) => {
                  if (isLoadingGallery || isLoadingArticles) return;
                  const target = e.currentTarget;
                  const rect = target.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  target.style.setProperty('--x', `${x}px`);
                  target.style.setProperty('--y', `${y}px`);
                }}
                onMouseLeave={(e) => {
                  if (isLoadingGallery || isLoadingArticles) return;
                  const target = e.currentTarget;
                  target.style.removeProperty('--x');
                  target.style.removeProperty('--y');
                }}
                onClick={(e) => {
                  if (isLoadingGallery || isLoadingArticles) {
                    e.preventDefault();
                  }
                }}
              >
                <span className="relative z-10">
                  {(isLoadingGallery || isLoadingArticles) ? (
                    <div className={`w-4 h-4 border-2 ${theme === 'dark' ? 'border-white border-t-transparent' : 'border-gray-900 border-t-transparent'} rounded-full animate-spin`}></div>
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </span>
                <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
                  style={{
                    background: 
                      theme === 'dark'
                        ? 'radial-gradient(100px circle at var(--x, 50%) var(--y, 50%), rgba(0,0,0,0.18), transparent 72%)'
                        : 'radial-gradient(100px circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.18), transparent 72%)',
                  }}
                />
              </button>
            </form>
          </div>
        </div>
        
        {/* Consistent loading animation positioning */}
        <div className="w-full max-w-md mx-auto mb-6 flex justify-center">
          {(isLoadingGallery || isLoadingArticles) && (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
              theme === 'dark' 
                ? 'bg-white/20 text-white' 
                : 'bg-gray-200 text-gray-900'
            }`}>
              <div className={`w-3 h-3 border-2 ${theme === 'dark' ? 'border-white border-t-transparent' : 'border-gray-900 border-t-transparent'} rounded-full animate-spin`}></div>
              <span className="max-w-xs truncate">{currentLoadingMessage || "Loading content..."}</span>
            </div>
          )}
        </div>
        
        <main className="py-8 motion-safe:animate-[hero3-intro_1s_cubic-bezier(.22,.68,0,1)_forwards]">
          <div className="mb-12 text-center motion-safe:animate-[hero3-intro_1s_cubic-bezier(.22,.68,0,1)_forwards]">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Enhanced <span className="text-blue-400">Space Articles</span>
            </h1>
            <p className={`max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Discover the wonders of space through real NASA data enhanced with artificial intelligence. 
              Explore articles and imagery from across the cosmos.
            </p>
          </div>

          {/* Image Gallery */}
          <section className="mb-16 motion-safe:animate-[hero3-intro_1s_cubic-bezier(.22,.68,0,1)_forwards]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Space Gallery</h2>
              <div className={`text-sm px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}>
                {nasaImages.length} images
              </div>
            </div>
            
            {isLoadingGallery && nasaImages.length === 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div 
                    key={`loading-${index}`} 
                    className="rounded-xl overflow-hidden border"
                  >
                    <div className={`aspect-square ${
                      theme === 'dark' 
                        ? 'bg-white/10 animate-pulse' 
                        : 'bg-black/10 animate-pulse'
                    }`}></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {nasaImages.map((image) => (
                  <Link
                    key={image.id} 
                    href={`/article/${encodeURIComponent(image.title.toLowerCase().replace(/\s+/g, '-'))}?imageUrl=${encodeURIComponent(image.url)}`}
                    className={`block rounded-xl overflow-hidden border ${theme === 'dark' ? 'border-white/10 hover:border-white/30' : 'border-gray-200 hover:border-gray-400'} transition-all duration-300 hover:scale-[1.03]`}
                  >
                    <div className="aspect-square bg-gray-200 border-b border-gray-300 relative">
                      <img 
                        src={image.url} 
                        alt={image.title} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-2 left-2 text-white text-xs font-medium">
                        {image.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {/* Gallery loading indicator - only show if main loading message is empty */}
            {isLoadingGallery && nasaImages.length > 0 && !currentLoadingMessage && (
              <div className="mt-4 flex justify-center">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  <div className={`w-2 h-2 border-2 ${theme === 'dark' ? 'border-white border-t-transparent' : 'border-gray-900 border-t-transparent'} rounded-full animate-spin`}></div>
                  <span>{galleryLoadingMessage || "Updating gallery..."}</span>
                </div>
              </div>
            )}
          </section>

          {/* Articles */}
          <section className="mb-16 motion-safe:animate-[hero3-intro_1s_cubic-bezier(.22,.68,0,1)_forwards]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Enhanced Articles</h2>
              <div className={`text-sm px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}>
                Updated in real-time
              </div>
            </div>
            
            {(isLoadingArticles && articles.length === 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div 
                    key={`article-loading-${index}`} 
                    className={`rounded-2xl overflow-hidden border ${
                      theme === 'dark' 
                        ? 'bg-white/5' 
                        : 'bg-white'
                    }`}
                  >
                    <div className={`aspect-video ${
                      theme === 'dark' 
                        ? 'bg-white/10' 
                        : 'bg-black/10'
                    } animate-pulse`}></div>
                    <div className="p-5">
                      <div className={`h-6 rounded mb-4 ${
                        theme === 'dark' 
                          ? 'bg-white/10' 
                          : 'bg-black/10'
                      }`}></div>
                      <div className="space-y-2">
                        <div className={`h-4 rounded ${
                          theme === 'dark' 
                            ? 'bg-white/10' 
                            : 'bg-black/10'
                        }`}></div>
                        <div className={`h-4 rounded w-5/6 ${
                          theme === 'dark' 
                            ? 'bg-white/10' 
                            : 'bg-black/10'
                        }`}></div>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <div className={`h-4 w-1/3 rounded ${
                          theme === 'dark' 
                            ? 'bg-white/10' 
                            : 'bg-black/10'
                        }`}></div>
                        <div className={`h-6 w-16 rounded-full ${
                          theme === 'dark' 
                            ? 'bg-white/10' 
                            : 'bg-black/10'
                        }`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Link 
                    href={`/article/${encodeURIComponent(article.searchQuery || article.title.toLowerCase().replace(/\s+/g, '-'))}?imageUrl=${encodeURIComponent(article.imageUrl || `https://source.unsplash.com/800x600/?${article.searchQuery || 'space'},astronomy`)}`} 
                    key={article.id} 
                    className={`block rounded-2xl overflow-hidden border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'} transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
                  >
                    <div className="aspect-video bg-gray-200 relative">
                      <img 
                        src={article.imageUrl || `https://source.unsplash.com/800x600/?${article.searchQuery || 'space'},astronomy`} 
                        alt={article.title} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback image if the primary image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = `https://source.unsplash.com/800x600/?${article.searchQuery || 'space'},cosmos`;
                        }}
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-black/50 text-white' : 'bg-white text-gray-900'}`}>
                          {article.source}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg line-clamp-2">{article.title}</h3>
                      </div>
                      <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {article.summary}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(article.date).toLocaleDateString()}
                        </div>
                        <div className="flex gap-1">
                          {article.tags.slice(0, 2).map((tag: string, idx: number) => (
                            <span 
                              key={idx} 
                              className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}
                            >
                              {tag}
                            </span>
                          ))}
                          {article.tags.length > 2 && (
                            <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}>
                              +{article.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {/* Articles loading indicator */}
            {isLoadingArticles && articles.length > 0 && !currentLoadingMessage && (
              <div className="mt-4 flex justify-center">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  <div className={`w-2 h-2 border-2 ${theme === 'dark' ? 'border-white border-t-transparent' : 'border-gray-900 border-t-transparent'} rounded-full animate-spin`}></div>
                  <span>{articlesLoadingMessage || "Updating articles..."}</span>
                </div>
              </div>
            )}
            
            <div className="mt-12 flex justify-center">
              <Button 
                onClick={loadMore} 
                disabled={isLoadingArticles}
                className={`group relative rounded-full px-8 py-6 text-base font-semibold transition-all duration-300 flex items-center justify-center overflow-hidden hover:scale-105 hover:shadow-lg shadow-md ${
                  theme === 'dark' 
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
                    : 'bg-black/10 text-gray-900 hover:bg-black/20 border border-gray-300'
                }`}
                onMouseMove={(e) => {
                  const target = e.currentTarget;
                  const rect = target.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  target.style.setProperty('--x', `${x}px`);
                  target.style.setProperty('--y', `${y}px`);
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.removeProperty('--x');
                  target.style.removeProperty('--y');
                }}
              >
                <span className="relative z-10">
                  {isLoadingArticles ? (
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 border-2 ${theme === 'dark' ? 'border-white border-t-transparent' : 'border-gray-900 border-t-transparent'} rounded-full animate-spin`}></div>
                      <span>Loading more articles...</span>
                    </div>
                  ) : (
                    'Load More Articles'
                  )}
                </span>
                <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
                  style={{
                    background: 
                      theme === 'dark'
                        ? 'radial-gradient(160px circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.18), transparent 72%)'
                        : 'radial-gradient(160px circle at var(--x, 50%) var(--y, 50%), rgba(0,0,0,0.18), transparent 72%)',
                  }}
                />
              </Button>
            </div>
          </section>
        </main>
        
        <SpaceChatbotThemed />
      </div>
    </div>
  );
};

export default ExplorePage;