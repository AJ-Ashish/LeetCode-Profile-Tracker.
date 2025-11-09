import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load last searched username from localStorage on mount
  useEffect(() => {
    const lastUsername = localStorage.getItem('lastLeetcodeUsername');
    if (lastUsername) {
      setUsername(lastUsername);
    }
  }, []);

  /**
   * Fetch user data from backend API
   * @param {string} username - LeetCode username
   */
  const fetchUserData = async (username) => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');
    setUserData(null);

    try {
      const response = await axios.post(`http://localhost:5000/api/user/${username}`);
      setUserData(response.data);
      
      // Save username to localStorage
      localStorage.setItem('lastLeetcodeUsername', username);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(err.response.data.error || 'User not found');
      } else {
        setError('Failed to fetch data. Please try again.');
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchUserData(username);
  };

  const chartData = userData ? [
    { name: 'Easy', value: userData.easySolved, color: '#10b981' },
    { name: 'Medium', value: userData.mediumSolved, color: '#fb923c' },
    { name: 'Hard', value: userData.hardSolved, color: '#ef4444' }
  ] : [];

  return (
    <div className="min-h-screen bg-dark p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-orange mb-2">
            LeetCode Profile Tracker
          </h1>
          <p className="text-gray-400">
            Track your coding progress and statistics
          </p>
        </header>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter LeetCode username"
              className="flex-1 px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-orange text-dark font-semibold rounded-lg hover:bg-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Tracking...
                </span>
              ) : (
                'Track Progress'
              )}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-center fade-in">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl">⏳</div>
            <p className="mt-4 text-gray-400">Fetching user data...</p>
          </div>
        )}

        {/* User Data Display */}
        {userData && !loading && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-dark-card rounded-xl border border-dark-border fade-in">
              {/* Profile Picture */}
              <img
                src={userData.avatar}
                alt={`${userData.username}'s avatar`}
                className="w-24 h-24 rounded-full border-4 border-orange"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/96/1a1a1a/fb923c?text=' + userData.username[0].toUpperCase();
                }}
              />
              
              {/* Profile Info */}
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-3xl font-bold text-orange mb-2">{userData.username}</h2>
                {userData.realName && (
                  <p className="text-gray-400 mb-2">{userData.realName}</p>
                )}
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-sm">
                  <span className="bg-dark px-3 py-1 rounded-full">
                    🏆 Rank: #{userData.ranking?.toLocaleString() || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-dark-card p-6 rounded-xl border border-dark-border hover:border-orange transition-all duration-300 fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">✅</span>
                  <span className="text-orange text-sm font-semibold">Total Solved</span>
                </div>
                <p className="text-3xl font-bold">{userData.totalSolved}</p>
              </div>
              <div className="bg-dark-card p-6 rounded-xl border border-dark-border hover:border-green-500 transition-all duration-300 fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🟢</span>
                  <span className="text-green-500 text-sm font-semibold">Easy</span>
                </div>
                <p className="text-3xl font-bold">{userData.easySolved}</p>
              </div>
              <div className="bg-dark-card p-6 rounded-xl border border-dark-border hover:border-orange transition-all duration-300 fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🟡</span>
                  <span className="text-yellow-500 text-sm font-semibold">Medium</span>
                </div>
                <p className="text-3xl font-bold">{userData.mediumSolved}</p>
              </div>
              <div className="bg-dark-card p-6 rounded-xl border border-dark-border hover:border-red-500 transition-all duration-300 fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🔴</span>
                  <span className="text-red-500 text-sm font-semibold">Hard</span>
                </div>
                <p className="text-3xl font-bold">{userData.hardSolved}</p>
              </div>
            </div>

            {/* Contest Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-dark-card p-6 rounded-xl border border-dark-border hover:border-yellow-500 transition-all duration-300 fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🏆</span>
                  <span className="text-yellow-500 text-sm font-semibold">Contest Rating</span>
                </div>
                <p className="text-3xl font-bold">{userData.contestRating || 'N/A'}</p>
              </div>
              <div className="bg-dark-card p-6 rounded-xl border border-dark-border hover:border-purple-500 transition-all duration-300 fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">📊</span>
                  <span className="text-purple-500 text-sm font-semibold">Contest Rank</span>
                </div>
                <p className="text-3xl font-bold">#{userData.contestRanking?.toLocaleString() || 'N/A'}</p>
              </div>
              <div className="bg-dark-card p-6 rounded-xl border border-dark-border hover:border-pink-500 transition-all duration-300 fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🎯</span>
                  <span className="text-pink-500 text-sm font-semibold">Contests Attended</span>
                </div>
                <p className="text-3xl font-bold">{userData.attendedContests}</p>
              </div>
            </div>

            {/* Difficulty Chart */}
            <div className="bg-dark-card p-6 rounded-xl border border-dark-border fade-in">
              <h3 className="text-xl font-bold text-orange mb-4">Problems by Difficulty</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #2a2a2a',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    wrapperStyle={{ color: '#ffffff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-8 mt-12 border-t border-dark-border">
          <p className="text-gray-500 text-sm">
            Made with ❤️ by Ashish Jaiswal using React, Node.js, and LeetCode API
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;