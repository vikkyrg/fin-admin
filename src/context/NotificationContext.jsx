import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { enquiryService } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

const INITIAL_COUNTS = {
  homepage: 0,
  'personal-loan': 0,
  'loan-against-securities': 0,
  'business-loan': 0,
  'home-loan': 0,
  'loan-against-property': 0,
  'education-loan': 0,
  'gold-loan': 0,
  'vehicle-loan': 0
};

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [unreadCounts, setUnreadCounts] = useState(INITIAL_COUNTS);
  const [totalUnread, setTotalUnread] = useState(0);
  const [unreadHomepage, setUnreadHomepage] = useState(0);
  const [unreadLoans, setUnreadLoans] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  const isFetchingRef = useRef(false);

  // Fetch unread counts from backend API
  const refreshUnreadCounts = useCallback(async () => {
    if (!isAuthenticated) return;
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    try {
      const res = await enquiryService.getUnreadCounts();
      if (res.data?.success && res.data.data) {
        const { counts, totalUnread: total, unreadHomepage: home, unreadLoans: loans, timestamp } = res.data.data;
        setUnreadCounts(prev => ({
          ...prev,
          ...counts
        }));
        setTotalUnread(total || 0);
        setUnreadHomepage(home || 0);
        setUnreadLoans(loans || 0);
        setLastUpdated(timestamp || new Date().toISOString());
      }
    } catch (error) {
      // Quietly handle network / polling hiccups
    } finally {
      isFetchingRef.current = false;
    }
  }, [isAuthenticated]);

  // Mark a category as read and immediately zero out the badge
  const markCategoryAsRead = useCallback(async (category, cutoffTime = new Date().toISOString()) => {
    if (!isAuthenticated || !category) return;

    // Optimistically update local UI badge immediately for instant responsiveness
    setUnreadCounts(prev => {
      const prevCount = prev[category] || 0;
      if (prevCount === 0) return prev;

      const newCounts = { ...prev, [category]: 0 };
      setTotalUnread(t => Math.max(0, t - prevCount));
      if (category === 'homepage') {
        setUnreadHomepage(h => Math.max(0, h - prevCount));
      } else {
        setUnreadLoans(l => Math.max(0, l - prevCount));
      }
      return newCounts;
    });

    try {
      await enquiryService.markAsRead(category, cutoffTime);
      // Re-sync with backend to ensure perfect consistency
      await refreshUnreadCounts();
    } catch (err) {
      // On error, sync back with database truth
      refreshUnreadCounts();
    }
  }, [isAuthenticated, refreshUnreadCounts]);

  // Set up polling and window focus listeners
  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCounts(INITIAL_COUNTS);
      setTotalUnread(0);
      setUnreadHomepage(0);
      setUnreadLoans(0);
      return;
    }

    // Initial fetch
    refreshUnreadCounts();

    // Fast, lightweight real-time polling every 3.5 seconds
    const intervalId = setInterval(() => {
      // Only poll if document is visible to save battery / CPU when tab is hidden
      if (!document.hidden) {
        refreshUnreadCounts();
      }
    }, 3500);

    // Refresh immediately whenever user focuses back on the tab or window
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshUnreadCounts();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', refreshUnreadCounts);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', refreshUnreadCounts);
    };
  }, [isAuthenticated, refreshUnreadCounts]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCounts,
        totalUnread,
        unreadHomepage,
        unreadLoans,
        lastUpdated,
        refreshUnreadCounts,
        markCategoryAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
