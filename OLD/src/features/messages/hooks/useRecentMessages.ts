/**
 * useRecentMessages Hook
 * Fetches recent/important parent communication
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

export type MessagePreview = {
  threadId: string;
  name: string;
  snippet: string;
  unreadCount: number;
  timeLabel: string;
  senderId: string;
  avatarUrl: string | null;
};

export const useRecentMessages = () => {
  const { user } = useAuth();
  const userId = user?.id || 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

  const query = useQuery({
    queryKey: ['recent-messages', userId],
    queryFn: async (): Promise<MessagePreview[]> => {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('id, content, created_at, read, sender_id')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      if (!messages || messages.length === 0) {
        return [];
      }

      const senderIds = [...new Set(messages.map(m => m.sender_id))];

      const { data: profiles } = await supabase
        .from('parent_profiles')
        .select('id, name, avatar_url')
        .in('id', senderIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const threadMap = new Map<string, typeof messages>();
      messages.forEach((msg) => {
        if (!threadMap.has(msg.sender_id)) {
          threadMap.set(msg.sender_id, []);
        }
        threadMap.get(msg.sender_id)!.push(msg);
      });

      const previews: MessagePreview[] = [];
      let count = 0;

      for (const [senderId, msgs] of Array.from(threadMap.entries())) {
        if (count >= 3) break;

        const latestMsg = msgs[0];
        const unreadCount = msgs.filter((m) => !m.read).length;
        const profile = profileMap.get(senderId);

        const msgDate = new Date(latestMsg.created_at);
        const now = new Date();
        const isToday = msgDate.toDateString() === now.toDateString();
        const timeLabel = isToday
          ? msgDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const snippet = latestMsg.content.length > 60
          ? latestMsg.content.slice(0, 60) + '...'
          : latestMsg.content;

        previews.push({
          threadId: senderId,
          name: profile?.name || 'Unknown',
          snippet,
          unreadCount,
          timeLabel,
          senderId,
          avatarUrl: profile?.avatar_url || null,
        });

        count++;
      }

      return previews;
    },
    staleTime: 1 * 60 * 1000,
  });

  return {
    messages: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
