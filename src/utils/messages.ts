// Message list helpers ported from the web messenger SDK
// (frontline-widgets conversation-details.tsx): date keys, friendly date
// labels, and grouping messages by sender + a 5-minute time window so that only
// the last message of a run shows an avatar/timestamp and the first shows the
// sender name.
import dayjs from 'dayjs';

export const MESSAGE_GROUP_TIME_WINDOW = 5 * 60 * 1000;

export const getDateKey = (date: any): string =>
  dayjs(date).format('YYYY-MM-DD');

export const formatMessageDate = (dateKey: string): string => {
  const d = dayjs(dateKey);
  if (d.isSame(dayjs(), 'day')) {
    return 'Today';
  }
  if (d.isSame(dayjs().subtract(1, 'day'), 'day')) {
    return 'Yesterday';
  }
  return d.format('MMM D, YYYY');
};

const isOutgoing = (m: any): boolean => Boolean(m?.customerId);

// Two messages belong to the same visual group when they are from the same
// side (customer vs operator), the same operator user, on the same day, and
// within the grouping time window.
const sameGroup = (a: any, b: any): boolean => {
  if (isOutgoing(a) !== isOutgoing(b)) {
    return false;
  }
  if (!isOutgoing(a) && (a?.user?._id || '') !== (b?.user?._id || '')) {
    return false;
  }
  if (getDateKey(a?.createdAt) !== getDateKey(b?.createdAt)) {
    return false;
  }
  return (
    Math.abs(
      new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
    ) <= MESSAGE_GROUP_TIME_WINDOW
  );
};

export type ChatRow =
  | { type: 'welcome'; id: string; content?: string }
  | { type: 'date'; id: string; label: string }
  | {
      type: 'message';
      id: string;
      item: any;
      isFirstInGroup: boolean;
      isLastInGroup: boolean;
    };

/**
 * Build the chronological row list (welcome → date separators → grouped
 * messages) for the chat screen.
 *
 * @param chronological messages oldest-first
 * @param welcomeContent optional welcome bubble shown at the very top
 */
export const buildChatRows = (
  chronological: any[],
  welcomeContent?: string
): ChatRow[] => {
  const rows: ChatRow[] = [];

  // Hide internal notes; bot/welcome handled separately.
  const visible = (chronological || []).filter((m) => !m?.internal);

  let lastDateKey: string | null = null;

  visible.forEach((m, i) => {
    const dateKey = getDateKey(m?.createdAt);
    if (dateKey !== lastDateKey) {
      rows.push({
        type: 'date',
        id: `date-${dateKey}-${i}`,
        label: formatMessageDate(dateKey),
      });
      lastDateKey = dateKey;
    }

    const prev = visible[i - 1];
    const next = visible[i + 1];
    const isFirstInGroup = !prev || !sameGroup(prev, m);
    const isLastInGroup = !next || !sameGroup(m, next);

    rows.push({
      type: 'message',
      id: m._id,
      item: m,
      isFirstInGroup,
      isLastInGroup,
    });
  });

  if (welcomeContent) {
    rows.unshift({ type: 'welcome', id: 'welcome', content: welcomeContent });
  }

  return rows;
};
