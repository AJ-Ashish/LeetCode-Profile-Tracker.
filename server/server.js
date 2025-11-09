const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// LeetCode GraphQL endpoint
const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

/**
 * GraphQL query to fetch user profile data
 */
const getUserDataQuery = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        userAvatar
        ranking
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
    userContestRanking(username: $username) {
      rating
      globalRanking
      totalParticipants
      attendedContestsCount
    }
  }
`;

/**
 * Route to fetch LeetCode user data
 */
app.post('/api/user/:username', async (req, res) => {
  const { username } = req.params;
  
  try {
    // Fetch main user data
    const userDataResponse = await axios.post(LEETCODE_GRAPHQL, {
      query: getUserDataQuery,
      variables: { username }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com/'
      }
    });

    const userData = userDataResponse.data;

    // Check if user exists
    if (!userData.data.matchedUser) {
      return res.status(404).json({ 
        error: 'User not found. Please check the username and try again.' 
      });
    }

    // Process and format the data
    const matchedUser = userData.data.matchedUser;
    const contestData = userData.data.userContestRanking;

    // Extract problem counts by difficulty
    const submissionStats = matchedUser.submitStats.acSubmissionNum;
    const easySolved = submissionStats.find(stat => stat.difficulty === 'Easy')?.count || 0;
    const mediumSolved = submissionStats.find(stat => stat.difficulty === 'Medium')?.count || 0;
    const hardSolved = submissionStats.find(stat => stat.difficulty === 'Hard')?.count || 0;
    const totalSolved = easySolved + mediumSolved + hardSolved;

    // Format response data
    const formattedData = {
      username: matchedUser.username,
      realName: matchedUser.profile.realName,
      avatar: matchedUser.profile.userAvatar,
      ranking: matchedUser.profile.ranking,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      contestRating: contestData?.rating || 0,
      contestRanking: contestData?.globalRanking || 0,
      attendedContests: contestData?.attendedContestsCount || 0
    };

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch user data. Please try again later.' 
    });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});