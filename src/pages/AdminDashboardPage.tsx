import React, { useState } from 'react';
import { format } from 'date-fns';
import AppLayout from '../components/layout/AppLayout';
import { BarChart3, Users, CreditCard, AlertTriangle, Search, PlusCircle, MinusCircle } from 'lucide-react';

// Mock data
const mockUsers = [
  { id: '1', username: 'admin', email: 'admin@example.com', role: 'admin', credits: 500, lastLogin: new Date(), profileCompleted: true },
  { id: '2', username: 'user', email: 'user@example.com', role: 'user', credits: 75, lastLogin: new Date(Date.now() - 86400000), profileCompleted: false },
  { id: '3', username: 'creator1', email: 'creator1@example.com', role: 'user', credits: 120, lastLogin: new Date(Date.now() - 86400000 * 2), profileCompleted: true },
  { id: '4', username: 'creator2', email: 'creator2@example.com', role: 'user', credits: 210, lastLogin: new Date(Date.now() - 86400000 * 3), profileCompleted: true },
  { id: '5', username: 'newuser', email: 'newuser@example.com', role: 'user', credits: 10, lastLogin: new Date(Date.now() - 86400000 * 5), profileCompleted: false },
];

const mockReportedContent = [
  { id: '1', content: 'This is inappropriate content that was reported by a user.', source: 'twitter', reportedBy: 'user', reportedAt: new Date(Date.now() - 86400000), reason: 'Inappropriate content' },
  { id: '2', content: 'This content contains potentially misleading information that needs review.', source: 'reddit', reportedBy: 'creator1', reportedAt: new Date(Date.now() - 86400000 * 2), reason: 'Misinformation' },
];

const AdminDashboardPage: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [creditReason, setCreditReason] = useState<string>('');

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreditUpdate = (userId: string, amount: number) => {
    if (!creditReason || amount === 0) return;
    
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, credits: user.credits + amount } 
          : user
      )
    );
    
    // Reset form
    setSelectedUser(null);
    setCreditAmount(0);
    setCreditReason('');
  };

  const totalUsers = users.length;
  const totalCredits = users.reduce((sum, user) => sum + user.credits, 0);
  const activeUsers = users.filter(user => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    return new Date(user.lastLogin) > lastWeek;
  }).length;
  const completedProfiles = users.filter(user => user.profileCompleted).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage the platform</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{totalUsers}</div>
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
                  <CreditCard className="h-6 w-6 text-success-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Credits</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{totalCredits}</div>
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
                  <BarChart3 className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Users (7d)</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{activeUsers}</div>
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
                  <AlertTriangle className="h-6 w-6 text-warning-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Reported Content</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{mockReportedContent.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-medium leading-6 text-gray-900">User Management</h3>
              </div>
              <div className="text-sm text-gray-500">
                {completedProfiles} of {totalUsers} completed profiles
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Export Users
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.credits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(user.lastLogin), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.profileCompleted 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.profileCompleted ? 'Completed' : 'Incomplete'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedUser(user.id)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Adjust Credits
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {searchTerm && filteredUsers.length === 0 && (
            <div className="py-6 text-center">
              <p className="text-gray-500">No users found matching "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Credit Adjustment Modal */}
        {selectedUser && (
          <div className="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                      <CreditCard className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-grow">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Adjust Credits
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Adjust credits for user: <span className="font-semibold">{users.find(u => u.id === selectedUser)?.username}</span>
                        </p>
                        
                        <div className="mt-4">
                          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Amount
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <div className="relative flex items-stretch flex-grow focus-within:z-10">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {creditAmount >= 0 ? <PlusCircle className="h-5 w-5 text-success-500" /> : <MinusCircle className="h-5 w-5 text-error-500" />}
                              </div>
                              <input
                                type="number"
                                name="amount"
                                id="amount"
                                value={creditAmount}
                                onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                                className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md pl-10 sm:text-sm border-gray-300"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                            Reason
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="reason"
                              id="reason"
                              value={creditReason}
                              onChange={(e) => setCreditReason(e.target.value)}
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              placeholder="e.g. Content bonus, refund, promotion"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => handleCreditUpdate(selectedUser, creditAmount)}
                    disabled={!creditReason || creditAmount === 0}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-300"
                  >
                    Apply Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reported Content Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-warning-500 mr-2" />
              <h3 className="text-lg font-medium leading-6 text-gray-900">Reported Content</h3>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {mockReportedContent.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No reported content to review.</p>
              </div>
            ) : (
              mockReportedContent.map((report) => (
                <div key={report.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.source === 'twitter' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {report.source}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        Reported {format(new Date(report.reportedAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      By {report.reportedBy}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-gray-600">{report.content}</p>
                  </div>
                  
                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900">Report Reason:</h4>
                    <p className="mt-1 text-sm text-gray-600">{report.reason}</p>
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-3">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      Dismiss
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-error-600 hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500">
                      Remove Content
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboardPage;