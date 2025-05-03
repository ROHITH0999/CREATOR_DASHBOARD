import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useCredits } from '../contexts/CreditContext';
import { useFeed } from '../contexts/FeedContext';
import AppLayout from '../components/layout/AppLayout';
import { CreditCard, Clock, Star, Award, TrendingUp, Rss } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { credits, creditHistory } = useCredits();
  const { savedItems, fetchFeed, feedItems } = useFeed();
  const [greeting, setGreeting] = useState('');

  // Load feed items if not already loaded
  useEffect(() => {
    if (feedItems.length === 0) {
      fetchFeed();
    }
  }, [fetchFeed, feedItems.length]);

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  const recentCredits = creditHistory.slice(0, 5);
  const recentSavedItems = savedItems.slice(0, 3);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{greeting}, {user?.username}!</h1>
            <p className="text-gray-600 mt-1">Welcome to your creator dashboard</p>
          </div>
          {!user?.profileCompleted && (
            <div className="mt-4 md:mt-0">
              <a
                href="/profile"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/profile';
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Complete your profile
              </a>
            </div>
          )}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CreditCard className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Credits</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{credits}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Last Activity</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {creditHistory.length > 0 
                          ? format(new Date(creditHistory[0].timestamp), 'MMM dd, yyyy')
                          : 'No activity yet'}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Star className="h-6 w-6 text-warning-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Saved Items</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{savedItems.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Award className="h-6 w-6 text-accent-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">User Status</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {credits > 100 ? 'Pro Creator' : 'Creator'}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Credit Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Credit Activity</h3>
              </div>
            </div>
            <div className="p-6">
              {recentCredits.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {recentCredits.map((item) => (
                    <li key={item.id} className="py-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.reason}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(item.timestamp), 'MMM dd, yyyy h:mm a')}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-success-600">+{item.amount}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">No credit activity yet</p>
              )}
              {creditHistory.length > 5 && (
                <div className="mt-6">
                  <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                    View all activity
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Recent Saved Items */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center">
                <Rss className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-medium leading-6 text-gray-900">Recently Saved Content</h3>
              </div>
            </div>
            <div className="p-6">
              {recentSavedItems.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {recentSavedItems.map((item) => (
                    <li key={item.id} className="py-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {item.title || item.content.substring(0, 50) + '...'}
                          </p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item.source}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Saved {format(new Date(item.savedAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">No saved content yet</p>
              )}
              {savedItems.length > 3 && (
                <div className="mt-6">
                  <a
                    href="/saved"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = '/saved';
                    }}
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    View all saved content
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;