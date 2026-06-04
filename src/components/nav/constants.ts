// Bottom navigation items, mirroring the web messenger SDK NAVIGATION_MENU
// (frontline-widgets components/nav/constants.ts). Home + Messages are always
// shown; Help (FAQ) appears only when the integration has a knowledge base
// topic. Tickets/Notifications require extra GraphQL not yet wired on mobile.
export type TabKey = 'home' | 'messages' | 'faq';

export type NavItem = {
  key: TabKey;
  label: string;
};

export const NAVIGATION_MENU: NavItem[] = [
  { key: 'home', label: 'Home' },
  { key: 'messages', label: 'Messages' },
  { key: 'faq', label: 'Help' },
];
