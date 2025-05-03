import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

export type FeedItem = {
  id: string;
  source: 'twitter' | 'reddit';
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
  timestamp: Date;
  url: string;
};

type SavedFeedItem = FeedItem & {
  savedAt: Date;
};

type FeedContextType = {
  feedItems: FeedItem[];
  savedItems: SavedFeedItem[];
  isLoading: boolean;
  error: string | null;
  fetchFeed: () => Promise<void>;
  saveItem: (item: FeedItem) => void;
  unsaveItem: (itemId: string) => void;
  shareItem: (item: FeedItem) => void;
  reportItem: (item: FeedItem, reason: string) => Promise<void>;
  isSaved: (itemId: string) => boolean;
};

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved items from localStorage
  useEffect(() => {
    if (user) {
      const savedItemsFromStorage = localStorage.getItem(`savedItems_${user.id}`);
      if (savedItemsFromStorage) {
        try {
          const parsed = JSON.parse(savedItemsFromStorage) as SavedFeedItem[];
          // Convert string dates back to Date objects
          const items = parsed.map(item => ({
            ...item,
            timestamp: new Date(item.timestamp),
            savedAt: new Date(item.savedAt)
          }));
          setSavedItems(items);
        } catch (e) {
          console.error('Error parsing saved items:', e);
        }
      }
    }
  }, [user]);

  // Save items to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`savedItems_${user.id}`, JSON.stringify(savedItems));
    }
  }, [savedItems, user]);

  const fetchFeed = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API fetch - in reality, you'd fetch from your backend
      // which would aggregate data from Twitter and Reddit APIs
      const mockData = await mockFetchFeed();
      setFeedItems(mockData);
    } catch (err) {
      setError('Failed to fetch feed items. Please try again later.');
      console.error('Feed fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveItem = (item: FeedItem) => {
    if (!user) return;
    
    const savedItem: SavedFeedItem = {
      ...item,
      savedAt: new Date()
    };
    
    setSavedItems(prev => {
      // Prevent duplicates
      if (prev.some(i => i.id === item.id)) {
        return prev;
      }
      return [savedItem, ...prev];
    });
  };

  const unsaveItem = (itemId: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const shareItem = (item: FeedItem) => {
    // In a real app, this might open a share dialog
    // Here we'll just copy the URL to clipboard
    navigator.clipboard.writeText(item.url)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
        alert('Failed to copy link to clipboard');
      });
  };

  const reportItem = async (item: FeedItem, reason: string) => {
    // In a real app, send a report to your backend
    console.log(`Reported item ${item.id} for reason: ${reason}`);
    alert('Content has been reported. Thank you for helping keep our platform safe!');
    return Promise.resolve();
  };

  const isSaved = (itemId: string): boolean => {
    return savedItems.some(item => item.id === itemId);
  };

  // Mock data function
  const mockFetchFeed = async (): Promise<FeedItem[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: '1',
        source: 'twitter',
        title: '',
        content: 'Just launched our new creator platform! Check it out and start earning today! #CreatorEconomy #DigitalContent',
        author: 'TechStartup',
        imageUrl: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        url: 'https://twitter.com/example/status/1'
      },
      {
        id: '2',
        source: 'reddit',
        title: 'How I earned 1000 credits in my first week as a creator',
        content: 'I wanted to share my experience with this amazing platform. In just one week, I was able to earn over 1000 credits by posting daily, engaging with other creators, and completing all profile sections...',
        author: 'u/successful_creator',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        url: 'https://reddit.com/r/example/comments/2'
      },
      {
        id: '3',
        source: 'twitter',
        content: '5 tips for growing your audience as a new content creator: 1) Post consistently 2) Engage with your community 3) Collaborate with others 4) Analyze your metrics 5) Stay authentic',
        title: '',
        author: 'GrowthGuru',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        url: 'https://twitter.com/example/status/3'
      },
      {
        id: '4',
        source: 'reddit',
        title: 'Best practices for managing your creator finances',
        content: 'As creators, we often focus on content but neglect the financial side. Here are some best practices I\'ve learned over the years for managing income, taxes, and investments as a creator...',
        author: 'u/finance_creator',
        imageUrl: 'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        url: 'https://reddit.com/r/example/comments/4'
      },
      {
        id: '5',
        source: 'twitter',
        content: 'Just hit 100K followers! Thank you to this amazing community. To celebrate, I\'m hosting a live Q&A session tomorrow at 6PM EST. Drop your questions below!',
        author: 'ContentCreator',
        title: '',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        url: 'https://twitter.com/example/status/5'
      },
      {
        id: '6',
        source: 'reddit',
        title: 'How to balance creative work with mental health',
        content: 'After burning out twice, I\'ve learned some valuable lessons about balancing creative output with mental wellbeing. Here\'s my approach to sustainable content creation...',
        author: 'u/mindful_creator',
        imageUrl: 'https://images.pexels.com/photos/3755761/pexels-photo-3755761.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        url: 'https://reddit.com/r/example/comments/6'
      }
    ];
  };

  return (
    <FeedContext.Provider value={{
      feedItems,
      savedItems,
      isLoading,
      error,
      fetchFeed,
      saveItem,
      unsaveItem,
      shareItem,
      reportItem,
      isSaved
    }}>
      {children}
    </FeedContext.Provider>
  );
};