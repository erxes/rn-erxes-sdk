// Shared visual tokens for the messenger UI.
//
// These mirror the web messenger SDK design system (frontline-widgets):
//   --primary            -> colors.primary        (brand color, also comes from
//                                                   connect uiOptions at runtime)
//   --primary-foreground -> colors.primaryForeground
//   --background/surface -> colors.surface
//   --muted-foreground   -> colors.mutedText
//   --border             -> colors.border
//
// The brand color (primary) is overridden at runtime by the `bgColor` returned
// from the connect mutation; the value here is the same default the web SDK and
// the existing widget fall back to.

export const messengerTheme = {
  colors: {
    primary: '#5629b6', // brand / --primary
    primaryForeground: '#FFFFFF', // --primary-foreground
    background: '#F4F5F7', // chat + list backdrop
    surface: '#FFFFFF', // cards, bubbles, input
    border: '#E6E7EB', // --border
    divider: '#EEF0F3',
    text: '#1F2024', // --foreground
    mutedText: '#71717A', // --muted-foreground
    subtleText: '#9CA3AF',
    incomingBubble: '#FFFFFF',
    outgoingBubble: '#5629b6',
    incomingText: '#27272A', // foreground/85
    outgoingText: '#FFFFFF',
    inputBackground: '#FFFFFF',
    online: '#31C859',
    offline: '#C4C4C4',
    ring: '#FFFFFF',
    danger: '#EF4444',
    brandSecondary: '#2F1F69', // launcher background
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    bubble: 18,
    tail: 6, // the small "tail" corner on grouped message bubbles
    pill: 999,
  },
  // Soft elevation matching the web SDK's `shadow-xs` / `shadow-sm`.
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    bubble: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    floating: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 10,
      elevation: 6,
    },
  },
};

// ---------------------------------------------------------------------------
// Backwards-compatible aliases (kept so existing imports keep working).
// ---------------------------------------------------------------------------
export const COLORS = {
  surface: messengerTheme.colors.surface,
  background: messengerTheme.colors.background,
  textPrimary: messengerTheme.colors.text,
  textSecondary: messengerTheme.colors.mutedText,
  textMuted: messengerTheme.colors.subtleText,
  online: messengerTheme.colors.online,
  offline: messengerTheme.colors.offline,
  ring: messengerTheme.colors.ring,
  brandSecondary: messengerTheme.colors.brandSecondary,
};

export const RADIUS = {
  card: messengerTheme.radius.lg,
  header: 24,
  pill: messengerTheme.radius.pill,
};

export const SPACING = {
  screenH: messengerTheme.spacing.lg,
  cardGap: messengerTheme.spacing.sm,
};
