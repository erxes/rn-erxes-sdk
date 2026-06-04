/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import React, { useContext, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import HTML from 'react-native-render-html';
import dayjs from 'dayjs';
import AppContext from '../../context/Context';
import { knowledgeBaseTopicDetail } from '../../graphql/query';
import { messengerTheme } from '../../theme';
import { BackIcon, ChevronRightIcon, HelpIcon } from '../../components/Icons';

// FAQ / Knowledge base — RN port of the web messenger KnowledgeBaseView /
// CategoryView / ArticleView. Uses the same `knowledgeBaseTopicDetail` query
// (same backend) and an in-screen topic → category → article stack.
const Faq = () => {
  const value = useContext(AppContext);
  const { greetings, bgColor, textColor } = value;
  const { width } = useWindowDimensions();

  const topicId = greetings?.knowledgeBaseTopicId;

  const { data, loading, error } = useQuery(knowledgeBaseTopicDetail, {
    variables: { _id: topicId },
    skip: !topicId,
  });

  const detail = data?.knowledgeBaseTopicDetail;

  const [stack, setStack] = useState<string[]>([]);
  const [articleId, setArticleId] = useState<string | null>(null);

  const view: 'topic' | 'category' | 'article' = articleId
    ? 'article'
    : stack.length > 0
    ? 'category'
    : 'topic';

  const allCategories = useMemo(
    () => [...(detail?.parentCategories || []), ...(detail?.categories || [])],
    [detail]
  );

  const allArticles = useMemo(
    () => [
      ...(detail?.parentCategories?.flatMap((c: any) => c.articles || []) ??
        []),
      ...(detail?.categories?.flatMap((c: any) => c.articles || []) ?? []),
    ],
    [detail]
  );

  const topLevelCategories =
    detail?.parentCategories?.length > 0
      ? detail.parentCategories
      : (detail?.categories || []).filter((c: any) => !c.parentCategoryId);

  const currentCategoryId = stack[stack.length - 1];
  const currentCategory = allCategories.find(
    (c: any) => c._id === currentCategoryId
  );
  const subCategories = (detail?.categories || []).filter(
    (c: any) => c.parentCategoryId === currentCategoryId
  );
  const article = allArticles.find((a: any) => a._id === articleId);

  const goBack = () => {
    if (articleId) {
      setArticleId(null);
    } else {
      setStack((prev) => prev.slice(0, -1));
    }
  };

  const headerTitle =
    view === 'article'
      ? currentCategory?.title || 'Article'
      : view === 'category'
      ? currentCategory?.title || 'Help'
      : detail?.title || 'Help';

  const headerSubtitle =
    view === 'topic'
      ? 'Browse our help articles'
      : currentCategory?.description;

  const androidTop =
    Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  const articleCount = (n?: number) =>
    n === 1 ? '1 article' : `${n || 0} articles`;

  const renderCategoryCard = (cat: any, onPress: () => void) => (
    <TouchableOpacity
      key={cat._id}
      activeOpacity={0.85}
      style={styles.card}
      onPress={onPress}
    >
      <View style={[styles.cardIcon, { backgroundColor: bgColor + '1A' }]}>
        <HelpIcon color={bgColor} size={20} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {cat.title}
        </Text>
        {cat.description ? (
          <Text style={styles.cardDesc} numberOfLines={2}>
            {cat.description}
          </Text>
        ) : null}
        <Text style={styles.cardMeta}>
          {articleCount(cat.numOfArticles)}
          {cat.childrens?.length ? ` · ${cat.childrens.length} sections` : ''}
        </Text>
      </View>
      <ChevronRightIcon color={messengerTheme.colors.subtleText} size={18} />
    </TouchableOpacity>
  );

  const renderArticleCard = (a: any) => (
    <TouchableOpacity
      key={a._id}
      activeOpacity={0.85}
      style={styles.card}
      onPress={() => setArticleId(a._id)}
    >
      <View style={[styles.cardIcon, styles.cardIconMuted]}>
        <HelpIcon color={messengerTheme.colors.mutedText} size={18} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {a.title}
        </Text>
        {a.modifiedDate ? (
          <Text style={styles.cardMeta}>
            Updated {dayjs(a.modifiedDate).format('MMM YYYY')}
          </Text>
        ) : null}
      </View>
      <ChevronRightIcon color={messengerTheme.colors.subtleText} size={18} />
    </TouchableOpacity>
  );

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.stateWrap}>
          <ActivityIndicator color={bgColor} />
        </View>
      );
    }
    if (error || !topicId) {
      return (
        <View style={styles.stateWrap}>
          <Text style={styles.stateTitle}>Help center unavailable</Text>
          <Text style={styles.stateSubtitle}>
            We couldn't load the help articles right now.
          </Text>
        </View>
      );
    }

    if (view === 'article' && article) {
      return (
        <View style={styles.articleWrap}>
          <Text style={styles.articleTitle}>{article.title}</Text>
          {article.modifiedDate ? (
            <Text style={styles.articleDate}>
              Updated {dayjs(article.modifiedDate).format('MMM YYYY')}
            </Text>
          ) : null}
          <View style={styles.articleDivider} />
          <HTML
            contentWidth={width - 2 * messengerTheme.spacing.lg}
            source={{ html: article.content || '' }}
            baseStyle={{
              color: messengerTheme.colors.text,
              fontSize: 14,
              lineHeight: 21,
            }}
            tagsStyles={{
              a: { color: bgColor },
              h1: { fontSize: 18, fontWeight: '700' },
              h2: { fontSize: 16, fontWeight: '600' },
              li: { color: messengerTheme.colors.text },
            }}
            ignoredDomTags={['meta', 'script', 'font', 'title']}
          />
        </View>
      );
    }

    if (view === 'category') {
      const articles = currentCategory?.articles || [];
      if (subCategories.length === 0 && articles.length === 0) {
        return (
          <View style={styles.stateWrap}>
            <Text style={styles.stateSubtitle}>
              No articles in this category yet.
            </Text>
          </View>
        );
      }
      return (
        <View style={styles.list}>
          {subCategories.map((sub: any) =>
            renderCategoryCard(sub, () => setStack((p) => [...p, sub._id]))
          )}
          {articles.length > 0 ? (
            <>
              {subCategories.length > 0 ? (
                <Text style={styles.sectionLabel}>ARTICLES</Text>
              ) : null}
              {articles.map((a: any) => renderArticleCard(a))}
            </>
          ) : null}
        </View>
      );
    }

    // topic view
    if (!topLevelCategories?.length) {
      return (
        <View style={styles.stateWrap}>
          <Text style={styles.stateSubtitle}>No help articles yet.</Text>
        </View>
      );
    }
    return (
      <View style={styles.list}>
        {topLevelCategories.map((cat: any) =>
          renderCategoryCard(cat, () => setStack((p) => [...p, cat._id]))
        )}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={{ backgroundColor: bgColor }}>
        <View style={[styles.header, { paddingTop: androidTop + 12 }]}>
          <View style={styles.headerRow}>
            {view !== 'topic' ? (
              <TouchableOpacity
                onPress={goBack}
                style={styles.backButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <BackIcon
                  color={messengerTheme.colors.primaryForeground}
                  size={18}
                />
              </TouchableOpacity>
            ) : null}
            <Text
              numberOfLines={1}
              style={[
                styles.headerTitle,
                { color: textColor },
                view !== 'topic' && { marginLeft: messengerTheme.spacing.sm },
              ]}
            >
              {headerTitle}
            </Text>
          </View>
          {headerSubtitle ? (
            <Text
              numberOfLines={1}
              style={[styles.headerSubtitle, { color: textColor }]}
            >
              {headerSubtitle}
            </Text>
          ) : null}
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderBody()}
      </ScrollView>
    </View>
  );
};

export default Faq;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: messengerTheme.colors.background,
  },
  header: {
    paddingHorizontal: messengerTheme.spacing.xl,
    paddingBottom: messengerTheme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    opacity: 0.7,
  },
  scrollContent: {
    paddingBottom: messengerTheme.spacing.xl,
  },
  list: {
    paddingHorizontal: messengerTheme.spacing.md,
    paddingTop: messengerTheme.spacing.md,
    gap: messengerTheme.spacing.sm,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '700',
    color: messengerTheme.colors.subtleText,
    marginTop: messengerTheme.spacing.sm,
    marginLeft: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: messengerTheme.colors.surface,
    borderRadius: messengerTheme.radius.lg,
    padding: 14,
    ...messengerTheme.shadow.card,
  },
  cardIcon: {
    width: 38,
    height: 38,
    borderRadius: messengerTheme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: messengerTheme.spacing.md,
  },
  cardIconMuted: {
    backgroundColor: messengerTheme.colors.background,
  },
  cardBody: {
    flex: 1,
    marginRight: messengerTheme.spacing.sm,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: messengerTheme.colors.text,
  },
  cardDesc: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: messengerTheme.colors.mutedText,
  },
  cardMeta: {
    marginTop: 3,
    fontSize: 11,
    color: messengerTheme.colors.subtleText,
    fontWeight: '500',
  },
  articleWrap: {
    paddingHorizontal: messengerTheme.spacing.lg,
    paddingTop: messengerTheme.spacing.lg,
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: messengerTheme.colors.text,
    lineHeight: 26,
  },
  articleDate: {
    marginTop: 6,
    fontSize: 12,
    color: messengerTheme.colors.mutedText,
  },
  articleDivider: {
    height: 1,
    backgroundColor: messengerTheme.colors.border,
    marginVertical: messengerTheme.spacing.md,
  },
  stateWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 64,
    paddingHorizontal: messengerTheme.spacing.xxl,
  },
  stateTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: messengerTheme.colors.text,
  },
  stateSubtitle: {
    marginTop: 6,
    color: messengerTheme.colors.mutedText,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});
