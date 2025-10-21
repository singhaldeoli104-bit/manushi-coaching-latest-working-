/**
 * Custom hook for Parent Dashboard data
 * Uses React Query for data fetching and caching
 */

import { useQuery } from '@tanstack/react-query';
import {
  getParentProfile,
  getParentChildren,
  getParentNotifications,
  getParentFinancialSummary,
} from '../services/api/parentApi';

/**
 * Hook to fetch parent dashboard data
 */
export const useParentDashboard = (parentId: string) => {
  // Fetch parent profile
  const profileQuery = useQuery({
    queryKey: ['parent', 'profile', parentId],
    queryFn: () => getParentProfile(parentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!parentId,
  });

  // Fetch children
  const childrenQuery = useQuery({
    queryKey: ['parent', 'children', parentId],
    queryFn: () => getParentChildren(parentId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!parentId,
  });

  // Fetch notifications
  const notificationsQuery = useQuery({
    queryKey: ['parent', 'notifications', parentId],
    queryFn: () => getParentNotifications(parentId, 5),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    enabled: !!parentId,
  });

  // Fetch financial summary
  const financialQuery = useQuery({
    queryKey: ['parent', 'financial', parentId],
    queryFn: () => getParentFinancialSummary(parentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!parentId,
  });

  return {
    profile: profileQuery.data,
    children: childrenQuery.data || [],
    notifications: notificationsQuery.data || [],
    financialSummary: financialQuery.data,
    isLoading:
      profileQuery.isLoading ||
      childrenQuery.isLoading ||
      notificationsQuery.isLoading,
    isError:
      profileQuery.isError ||
      childrenQuery.isError ||
      notificationsQuery.isError,
    refetch: () => {
      profileQuery.refetch();
      childrenQuery.refetch();
      notificationsQuery.refetch();
      financialQuery.refetch();
    },
  };
};
