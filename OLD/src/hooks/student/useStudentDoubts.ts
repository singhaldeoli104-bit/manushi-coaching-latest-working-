/**
 * useStudentDoubts Hook
 *
 * Fetches and manages student doubts/questions with pagination and real-time updates.
 *
 * Features:
 * - Pagination (10 items per page)
 * - Filter by status (open, answered, resolved)
 * - Real-time subscription for new answers
 * - Calculate response time for answered doubts
 * - Sort by newest first
 * - React Query caching (2 minutes)
 *
 * @example
 * const { doubts, loading, error, hasMore, loadMore, stats } = useStudentDoubts();
 *
 * // With status filter
 * const { doubts } = useStudentDoubts('open');
 *
 * if (loading) return <LoadingState />;
 * if (error) return <ErrorState />;
 *
 * return (
 *   <>
 *     {doubts.map(doubt => (
 *       <Card key={doubt.id}>
 *         <Text>{doubt.question}</Text>
 *         <Text>{doubt.status}</Text>
 *       </Card>
 *     ))}
 *     {hasMore && <Button onPress={loadMore}>Load More</Button>}
 *   </>
 * );
 */

import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useStudent } from '../../context/StudentContext';

// Doubt Status
export type DoubtStatus = 'open' | 'answered' | 'resolved';

// Doubt Priority
export type DoubtPriority = 'low' | 'medium' | 'high' | 'urgent';

// Doubt Answer
export interface DoubtAnswer {
  /** Answer ID */
  id: string;

  /** Answer content */
  content: string;

  /** Teacher/answerer name */
  answeredBy: string;

  /** Teacher/answerer avatar */
  answererAvatar?: string;

  /** Answer timestamp */
  answeredAt: string;

  /** Is this the accepted answer */
  isAccepted: boolean;

  /** Helpful votes count */
  helpfulCount: number;
}

// Student Doubt
export interface StudentDoubt {
  /** Unique doubt ID */
  id: string;

  /** Question text */
  question: string;

  /** Detailed description */
  description?: string;

  /** Subject name */
  subject: string;

  /** Topic/chapter */
  topic?: string;

  /** Doubt status */
  status: DoubtStatus;

  /** Priority level */
  priority: DoubtPriority;

  /** Attachment URLs (images, documents) */
  attachments?: string[];

  /** Answers received */
  answers: DoubtAnswer[];

  /** Number of answers */
  answersCount: number;

  /** Has accepted answer */
  hasAcceptedAnswer: boolean;

  /** Response time in minutes (for answered doubts) */
  responseTimeMinutes?: number;

  /** Is urgent (marked by student) */
  isUrgent: boolean;

  /** Views count */
  viewsCount: number;

  /** Created timestamp */
  createdAt: string;

  /** Last updated timestamp */
  updatedAt?: string;

  /** Resolved timestamp */
  resolvedAt?: string;
}

// Pagination config
const ITEMS_PER_PAGE = 10;

/**
 * Calculate response time in minutes
 */
const calculateResponseTime = (createdAt: string, firstAnswerAt?: string): number | undefined => {
  if (!firstAnswerAt) return undefined;

  const created = new Date(createdAt).getTime();
  const answered = new Date(firstAnswerAt).getTime();
  const diffMinutes = Math.round((answered - created) / (1000 * 60));

  return diffMinutes;
};

/**
 * Fetch student doubts from Supabase with pagination
 */
const fetchStudentDoubts = async (
  studentId: string,
  statusFilter?: DoubtStatus,
  page: number = 0
): Promise<{ doubts: StudentDoubt[]; hasMore: boolean }> => {
  const from = page * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from('doubts')
    .select('*, answers:doubt_answers(*)', { count: 'exact' })
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .range(from, to);

  // Apply status filter if provided
  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data: rawDoubts, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch doubts: ${error.message}`);
  }

  if (!rawDoubts) {
    return { doubts: [], hasMore: false };
  }

  // Transform doubts
  const doubts: StudentDoubt[] = rawDoubts.map((doubt) => {
    const answers: DoubtAnswer[] = (doubt.answers || []).map((answer: any) => ({
      id: answer.id,
      content: answer.content,
      answeredBy: answer.answered_by || 'Teacher',
      answererAvatar: answer.answerer_avatar,
      answeredAt: answer.answered_at,
      isAccepted: answer.is_accepted || false,
      helpfulCount: answer.helpful_count || 0,
    }));

    const hasAcceptedAnswer = answers.some((a) => a.isAccepted);
    const firstAnswer = answers.length > 0 ? answers[0] : null;
    const responseTime = firstAnswer
      ? calculateResponseTime(doubt.created_at, firstAnswer.answeredAt)
      : undefined;

    return {
      id: doubt.id,
      question: doubt.question || 'Question',
      description: doubt.description,
      subject: doubt.subject || 'General',
      topic: doubt.topic,
      status: doubt.status as DoubtStatus,
      priority: doubt.priority || 'medium',
      attachments: doubt.attachments || [],
      answers,
      answersCount: answers.length,
      hasAcceptedAnswer,
      responseTimeMinutes: responseTime,
      isUrgent: doubt.is_urgent || false,
      viewsCount: doubt.views_count || 0,
      createdAt: doubt.created_at,
      updatedAt: doubt.updated_at,
      resolvedAt: doubt.resolved_at,
    };
  });

  const hasMore = count ? from + doubts.length < count : false;

  return { doubts, hasMore };
};

/**
 * Hook to fetch and manage student doubts with pagination
 *
 * @param statusFilter - Optional status filter (open, answered, resolved)
 * @returns Doubts with pagination, loading, and error states
 */
export const useStudentDoubts = (statusFilter?: DoubtStatus) => {
  const { student } = useStudent();
  const studentId = student?.id;
  const queryClient = useQueryClient();

  const {
    data: pages,
    isLoading: loading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<{ doubts: StudentDoubt[]; hasMore: boolean }, Error>({
    queryKey: ['studentDoubts', studentId, statusFilter],
    queryFn: ({ pageParam = 0 }) => fetchStudentDoubts(studentId!, statusFilter, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined;
    },
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    initialPageParam: 0,
  });

  // Flatten all doubts from all pages
  const allDoubts = pages?.pages.flatMap((page) => page.doubts) || [];

  // Real-time subscription for doubt answers
  useEffect(() => {
    if (!studentId) return;

    // Subscribe to new answers on student's doubts
    const answersSubscription = supabase
      .channel('doubt-answers-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'doubt_answers',
          filter: `doubt_id=in.(${allDoubts.map((d) => d.id).join(',')})`,
        },
        () => {
          // Invalidate and refetch doubts when new answer arrives
          queryClient.invalidateQueries({ queryKey: ['studentDoubts', studentId, statusFilter] });
        }
      )
      .subscribe();

    // Subscribe to doubt status changes
    const doubtsSubscription = supabase
      .channel('doubts-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'doubts',
          filter: `student_id=eq.${studentId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['studentDoubts', studentId, statusFilter] });
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      answersSubscription.unsubscribe();
      doubtsSubscription.unsubscribe();
    };
  }, [studentId, statusFilter, queryClient, allDoubts.length]);

  // Calculate statistics
  const stats = {
    total: allDoubts.length,
    open: allDoubts.filter((d) => d.status === 'open').length,
    answered: allDoubts.filter((d) => d.status === 'answered').length,
    resolved: allDoubts.filter((d) => d.status === 'resolved').length,
    urgent: allDoubts.filter((d) => d.isUrgent).length,
    withAcceptedAnswer: allDoubts.filter((d) => d.hasAcceptedAnswer).length,
    averageResponseTime: allDoubts.length > 0
      ? Math.round(
          allDoubts
            .filter((d) => d.responseTimeMinutes !== undefined)
            .reduce((sum, d) => sum + (d.responseTimeMinutes || 0), 0) /
            allDoubts.filter((d) => d.responseTimeMinutes !== undefined).length
        )
      : 0,
  };

  return {
    doubts: allDoubts,
    loading,
    error: error as Error | null,
    refetch,
    hasMore: hasNextPage || false,
    loadMore: fetchNextPage,
    loadingMore: isFetchingNextPage,
    stats,
  };
};

export default useStudentDoubts;
