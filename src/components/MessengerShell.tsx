import { View, StyleSheet } from 'react-native';
import React, { useContext, useState } from 'react';
import AppContext from '../context/Context';
import Home from '../screen/home/Home';
import Messages from '../screen/messages/Messages';
import Faq from '../screen/faq/Faq';
import Navigation from './nav/Navigation';
import type { TabKey } from './nav/constants';
import { messengerTheme } from '../theme';

// RN port of the web messenger app shell (frontline-widgets app/app.tsx):
// a tab content area (Home / Messages) above a bottom navigation bar. The chat
// (conversation detail) is rendered separately by Widget when a conversation
// is open, matching the web behavior where the nav is hidden during chat.
const MessengerShell = () => {
  const value = useContext(AppContext);
  const { bgColor, totalUnreadCount, greetings } = value;

  const hasKnowledgeBase = Boolean(greetings?.knowledgeBaseTopicId);
  const hiddenTabs: TabKey[] = hasKnowledgeBase ? [] : ['faq'];

  const [activeTab, setActiveTab] = useState<TabKey>('home');

  const renderTab = () => {
    if (activeTab === 'messages') {
      return <Messages />;
    }
    if (activeTab === 'faq') {
      return <Faq />;
    }
    return <Home />;
  };

  return (
    <View style={styles.root}>
      <View style={styles.content}>{renderTab()}</View>
      <Navigation
        activeTab={activeTab}
        onChange={setActiveTab}
        bgColor={bgColor}
        unreadCount={totalUnreadCount}
        hiddenTabs={hiddenTabs}
      />
    </View>
  );
};

export default MessengerShell;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: messengerTheme.colors.background,
  },
  content: {
    flex: 1,
  },
});
