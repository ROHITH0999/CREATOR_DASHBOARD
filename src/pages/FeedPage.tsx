import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useFeed } from '../contexts/FeedContext';
import { useCredits } from '../contexts/CreditContext';
import AppLayout from '../components/layout/AppLayout';
import { Bookmark, Share2, Flag, ExternalLink, RefreshCw, Filter } from 'lucide-react';

const FeedPage: React.FC = () => {
  const { 
    feedItems, savedItems, isLoading, error, 
    fetchFeed, saveItem, unsaveItem, shareItem, reportItem, isSaved 
  } = useFeed();
  const { earnFeedInteractionCredits } = useCredits();
  const [selectedSource, setSelectedSource] = useState<'all' | 'twitter' | 'reddit'>('all');
  const [reportingItem, setReportingItem] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<string>('');

  useEffect(() => {
    if (feedItems.length === 0) {
      fetchFeed();
    }
  }, [fetchFeed, feedItems.length]);

  const filteredItems = selectedSource === 'all' 
    ? feedItems 
    : feedItems.filter(item => item.source === selectedSource);

  const handleSaveItem = (itemId: string) => {
    const item = feedItems.find(item => item.id === itemId);
    if (!item) return;
    
    if (isSaved(itemId)) {
      unsaveItem(itemId);
    } else {
      saveItem(item);
      earnFeedInteractionCredits();
    }
  };

  const handleShareItem = (itemId: string) => {
    const item = feedItems.find(item => item.id === itemId);
    if (!item) return;
    
    shareItem(item);
    earnFeedInteractionCredits();
  };

  const handleReportClick = (itemId: string) => {
    setReportingItem(itemId);
  };

  const handleCancelReport = () => {
    setReportingItem(null);
    setReportReason('');
  };

  const handleSubmitReport = async (itemId: string) => {
    if (!reportReason.trim()) return;
    
    const item = feedItems.find(item => item.id === itemId);
    if (!item) return;
    
    await reportItem(item, reportReason);
    earnFeedInteractionCredits();
    
    // Reset reporting state
    setReportingItem(null);
    setReportReason('');
  };

  const refreshFeed = () => {
    fetchFeed();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Feed</h1>
            <p className="text-gray-600 mt-1">The latest posts from your favorite platforms</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <div className="relative">
              <select
                id="source"
                name="source"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value as 'all' | 'twitter' | 'reddit')}
                className="pl-8 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="all">All Sources</option>
                <option value="twitter">Twitter</option>
                <option value="reddit">Reddit</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <Filter className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
            </div>
            <button
              onClick={refreshFeed}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoading && feedItems.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {filteredItems.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-8 text-center">
                <p className="text-gray-500">No content found for the selected source.</p>
                <button
                  onClick={refreshFeed}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Refresh Feed
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white shadow rounded-lg overflow-hidden transition-transform duration-200 hover:shadow-md">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.source === 'twitter' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {item.source}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            {format(new Date(item.timestamp), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                      
                      {item.title && (
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{item.title}</h3>
                      )}
                      
                      <p className="text-gray-600 mb-4">{item.content}</p>
                      
                      {item.imageUrl && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            alt="Content" 
                            className="w-full h-auto object-cover transition-opacity duration-300 hover:opacity-90"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <span>By {item.author}</span>
                        </div>
                        
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleSaveItem(item.id)}
                            className={`p-2 rounded-full transition-colors ${
                              isSaved(item.id)
                                ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                                : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                            }`}
                            aria-label={isSaved(item.id) ? 'Unsave item' : 'Save item'}
                          >
                            <Bookmark className="h-5 w-5" />
                          </button>
                          
                          <button
                            onClick={() => handleShareItem(item.id)}
                            className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                            aria-label="Share item"
                          >
                            <Share2 className="h-5 w-5" />
                          </button>
                          
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                            aria-label="Open original"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                          
                          <button
                            onClick={() => handleReportClick(item.id)}
                            className="p-2 rounded-full text-gray-400 hover:text-error-500 hover:bg-error-50 transition-colors"
                            aria-label="Report item"
                          >
                            <Flag className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Report form */}
                      {reportingItem === item.id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Report this content</h4>
                          <textarea
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            placeholder="Please tell us why you're reporting this content..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                            rows={3}
                          />
                          <div className="mt-2 flex justify-end space-x-2">
                            <button
                              onClick={handleCancelReport}
                              className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSubmitReport(item.id)}
                              disabled={!reportReason.trim()}
                              className="px-3 py-1 text-sm text-white bg-error-600 hover:bg-error-700 rounded-md disabled:opacity-50"
                            >
                              Submit Report
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default FeedPage;