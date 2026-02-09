export const selectRecentActivity = (state, limit = 6) => state.activityLog.slice(0, limit);
