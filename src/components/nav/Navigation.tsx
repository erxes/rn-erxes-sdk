// Bottom tab bar — RN port of the web messenger "FluidTabs"
// (frontline-widgets components/nav/navigation.tsx): equal-width tabs with an
// icon over a label, the active tab tinted with the brand color over a subtle
// brand-tinted highlight, and an unread badge on Messages.
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { messengerTheme } from '../../theme';
import { HomeIcon, MessageIcon, HelpIcon } from '../Icons';
import { NAVIGATION_MENU, TabKey } from './constants';

type Props = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  bgColor: string;
  unreadCount?: number;
  // Tabs to hide (e.g. 'faq' when there is no knowledge base topic).
  hiddenTabs?: TabKey[];
};

const renderIcon = (key: TabKey, color: string) => {
  if (key === 'home') {
    return <HomeIcon color={color} size={22} />;
  }
  if (key === 'faq') {
    return <HelpIcon color={color} size={22} />;
  }
  return <MessageIcon color={color} size={22} />;
};

const Navigation = ({
  activeTab,
  onChange,
  bgColor,
  unreadCount = 0,
  hiddenTabs = [],
}: Props) => {
  const items = NAVIGATION_MENU.filter((i) => !hiddenTabs.includes(i.key));
  return (
    <View style={styles.bar}>
      {items.map((item) => {
        const isActive = activeTab === item.key;
        const color = isActive ? bgColor : messengerTheme.colors.mutedText;
        const showBadge = item.key === 'messages' && unreadCount > 0;

        return (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.7}
            style={styles.tab}
            onPress={() => onChange(item.key)}
          >
            <View
              style={[
                styles.highlight,
                isActive && { backgroundColor: bgColor + '14' },
              ]}
            >
              <View style={styles.iconWrap}>
                {renderIcon(item.key, color)}
                {showBadge ? (
                  <View style={[styles.badge, { backgroundColor: bgColor }]}>
                    <Text style={styles.badgeText}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text style={[styles.label, { color }]}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: messengerTheme.colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: messengerTheme.colors.border,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 18 : 8,
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  highlight: {
    width: '94%',
    maxWidth: 112,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 8,
    borderRadius: messengerTheme.radius.md,
  },
  iconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
});
