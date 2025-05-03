import React, { useState } from 'react';
import { format } from 'date-fns';
import { useFeed } from '../contexts/FeedContext';
import AppLayout from '../components/layout/AppLayout';
import { Bookmark, ExternalLink, Trash2, Search } from 'lucide-react';

const SavedPage: React.FC = () => {
  const { savedItems, unsaveItem } = useFeed();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<'all' | 'twitter' | 'reddit'>('all');

  const filteredItems = savedItems
    .filter(item => 
      (selectedSource === 'all' || item.source === selectedSource) &&
      (searchTerm === '' || 
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Content</h1>
          <p className="text-gray-600 mt-1">Your personal collection of saved posts</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search saved content..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <select
                id="source-filter"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value as 'all' | 'twitter' | 'reddit')}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="all">All Sources</option>
                <option value="twitter">Twitter</option>
                <option value="reddit">Reddit</option>
              </select>
            </div>
          </div>
          
          {savedItems.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No saved content</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your saved content will appear here. Start exploring the feed to save content you like.
              </p>
              <div className="mt-6">
                <a
                  href="/feed"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Go to Feed
                </a>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="mt-6 divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <div key={item.id} className="py-6 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.source === 'twitter' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {item.source}
                      </span>
                      <span className="text-sm text-gray-500">
                        Saved on {format(new Date(item.savedAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                        title="Open original"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                      <button
                        onClick={() => unsaveItem(item.id)}
                        className="p-2 rounded-full text-gray-400 hover:text-error-500 hover:bg-error-50 transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {item.title && (
                    <h3 className="mt-2 text-lg font-medium text-gray-900">{item.title}</h3>
                  )}
                  
                  <p className="mt-2 text-gray-600">{item.content}</p>
                  
                  {item.imageUrl && (
                    <div className="mt-4 rounded-lg overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt="Content" 
                        className="w-full h-auto object-cover max-h-64 transition-opacity duration-300 hover:opacity-90"
                      />
                    </div>
                  )}
                  
                  <div className="mt-4 text-sm">
                    <span className="text-gray-500">By {item.author}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default SavedPage;