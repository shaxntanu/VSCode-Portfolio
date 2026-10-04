// Raw LeetCode API response types from leetcode-query

export interface LeetCodeSubmissionStat {
  difficulty: 'All' | 'Easy' | 'Medium' | 'Hard';
  count: number;
  submissions: number;
}

export interface LeetCodeUserMatchedUser {
  username: string;
  submitStats: {
    acSubmissionNum: LeetCodeSubmissionStat[];
  };
  profile: {
    realName?: string;
    userAvatar: string;
    userSlug: string;
  };
}

export interface LeetCodeUserResponse {
  data: {
    matchedUser: LeetCodeUserMatchedUser;
  };
}

export interface LeetCodeRecentSubmission {
  title: string;
  titleSlug: string;
  status: string;
  lang: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timestamp: number;
}

export interface LeetCodeRecentSubmissionsResponse {
  data: {
    recentAcSubmissionList: LeetCodeRecentSubmission[];
  };
}

export interface LeetCodeContest {
  title?: string;
  startTime?: number;
  duration?: number;
  rating?: number;
  ranking?: number;
  attended?: boolean;
}

export interface LeetCodeContestResponse {
  data: {
    userContestRanking: LeetCodeContest[];
  };
}
