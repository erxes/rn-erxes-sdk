import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import React, { useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../../context/Context';
import Supporters from '../greetings/Supporters';
import Social from '../greetings/Social';
import { messengerTheme } from '../../theme';
import { BackIcon, ChevronRightIcon } from '../../components/Icons';
import {
  AVAILABILITY_MESSAGE,
  formatOnlineHours,
} from '../../utils/onlineHours';

const LOGO_CHIP = 36;

// Home tab — RN port of the web messenger HeaderHero + Intro.
const Home = () => {
  const value = useContext(AppContext);

  const {
    greetings,
    hasBack,
    onBack,
    bgColor,
    textColor,
    logoUrl,
    integrationId,
    showWidget,
    setShow,
    setConversationId,
    backIcon,
  } = value;

  const greetingMessages = greetings?.messages?.greetings;
  const title = greetingMessages?.title || 'How can we help?';
  const message =
    greetingMessages?.message ||
    "We're here to help. Send us a message and we'll get back to you.";
  const responseRate = greetings?.responseRate;
  const formattedHours = formatOnlineHours({
    onlineHours: greetings?.onlineHours,
    showTimezone: greetings?.showTimezone,
    timezone: greetings?.timezone,
  });

  const startNewConversation = () => {
    AsyncStorage.removeItem('conversationId');
    setConversationId('');
  };

  const renderLogoButton = () => {
    if (!showWidget && !hasBack) {
      return <View style={{ width: LOGO_CHIP, height: LOGO_CHIP }} />;
    }
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => (showWidget ? setShow(true) : onBack())}
        style={styles.logoChip}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {logoUrl ? (
          <Image
            source={{ uri: logoUrl }}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          backIcon || <BackIcon color={bgColor} size={18} />
        )}
      </TouchableOpacity>
    );
  };

  const androidTop =
    Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero */}
        <SafeAreaView style={[styles.hero, { backgroundColor: bgColor }]}>
          <View style={[styles.heroInner, { paddingTop: androidTop + 12 }]}>
            <View style={styles.topRow}>{renderLogoButton()}</View>
            <Text style={[styles.heroEyebrow, { color: textColor }]}>
              Hello there.
            </Text>
            <Text
              numberOfLines={2}
              style={[styles.heroTitle, { color: textColor }]}
            >
              {title}
            </Text>
          </View>
        </SafeAreaView>

        {/* Overlapping "Ask a question" card */}
        <View style={styles.cards}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.card, styles.askCard]}
            onPress={startNewConversation}
          >
            <View style={styles.askTextWrap}>
              <Text style={styles.askTitle}>Ask a question</Text>
              <Text style={styles.askSubtitle}>
                {responseRate
                  ? `Our team typically replies in a few ${responseRate}`
                  : 'Our team can help you out'}
              </Text>
            </View>
            <View style={styles.askRight}>
              <Supporters integrationId={integrationId} compact />
              <ChevronRightIcon
                color={messengerTheme.colors.subtleText}
                size={16}
              />
            </View>
          </TouchableOpacity>

          {/* Greeting message */}
          <View style={styles.card}>
            <Text style={styles.greetTitle}>
              {greetingMessages?.title || 'Welcome'}
            </Text>
            <Text style={styles.greetMessage}>
              {message}
              {'. '}
              {formattedHours ? (
                <>
                  We're available between{' '}
                  <Text style={styles.greetMessageStrong}>
                    {formattedHours.workHours}
                    {formattedHours.formattedTimeZone
                      ? formattedHours.formattedTimeZone
                      : ''}
                  </Text>
                  {formattedHours.onlineDays
                    ? `, ${formattedHours.onlineDays}.`
                    : ''}
                </>
              ) : (
                AVAILABILITY_MESSAGE
              )}
            </Text>
            {greetings?.links ? (
              <View style={styles.links}>
                <Social links={greetings.links} />
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: messengerTheme.colors.background,
  },
  scrollContent: {
    paddingBottom: messengerTheme.spacing.xl,
  },
  hero: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroInner: {
    paddingHorizontal: messengerTheme.spacing.xl,
    paddingBottom: 44,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoChip: {
    width: LOGO_CHIP,
    height: LOGO_CHIP,
    borderRadius: messengerTheme.radius.sm,
    backgroundColor: messengerTheme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 4,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  heroEyebrow: {
    marginTop: 22,
    fontSize: 22,
    fontWeight: '300',
    opacity: 0.7,
  },
  heroTitle: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
  },
  cards: {
    paddingHorizontal: messengerTheme.spacing.md,
    marginTop: -28,
    gap: messengerTheme.spacing.md,
  },
  card: {
    backgroundColor: messengerTheme.colors.surface,
    borderRadius: messengerTheme.radius.lg,
    padding: messengerTheme.spacing.lg,
    ...messengerTheme.shadow.card,
  },
  askCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  askTextWrap: {
    flex: 1,
    marginRight: messengerTheme.spacing.md,
  },
  askTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: messengerTheme.colors.text,
  },
  askSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: messengerTheme.colors.mutedText,
    lineHeight: 16,
  },
  askRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: messengerTheme.spacing.sm,
  },
  greetTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: messengerTheme.colors.text,
  },
  greetMessage: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: messengerTheme.colors.mutedText,
  },
  greetMessageStrong: {
    fontWeight: '700',
    color: messengerTheme.colors.text,
  },
  links: {
    marginTop: messengerTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
