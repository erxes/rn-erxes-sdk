/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  knowledgeBaseCategoryDetail,
  knowledgeBaseTopicDetail,
} from './graphql/query';
import MaterialCommunityIcons from './icons/MaterialCommunityIcons';

const FAQ = (props: any) => {
  const { knowledgeBaseTopicId } = props;

  const [selectedParent, setSelectedParent] = useState<any>('');
  const [selectedCategory, setSelectedCategory] = useState<any>('');

  const { data, loading } = useQuery(knowledgeBaseTopicDetail, {
    variables: {
      _id: knowledgeBaseTopicId,
    },
  });

  const { data: dataCategory, loading: loadingCategory } = useQuery(
    knowledgeBaseCategoryDetail,
    {
      variables: {
        _id: selectedCategory?._id,
      },
      skip: !selectedCategory,
    }
  );

  if (loading) {
    return null;
  }

  const renderItem = ({ item, index }: any) => {
    const isParent = item?.parentCategoryId === null;
    const childrenCount = isParent
      ? data?.knowledgeBaseTopicDetail?.categories?.filter(
          (e: any) => e?.parentCategoryId === item?._id
        )?.length
      : item?.numOfArticles;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          if (item?.parentCategoryId === null) {
            return setSelectedParent(item);
          }
          return setSelectedCategory(item);
        }}
        style={styles.container}
      >
        <Text>
          {item?.title} ({childrenCount})
        </Text>
        <Text style={{ color: '#393C40', marginTop: 5 }}>
          {item?.description}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderArticles = ({ item, index }: any) => {
    return (
      <TouchableOpacity key={index} style={styles.container}>
        <Text>{item?.title}</Text>
        <Text style={{ marginTop: 5, color: '#393C40' }}>{item?.summary}</Text>
      </TouchableOpacity>
    );
  };

  const renderCategoryDetail = () => {
    if (loadingCategory) {
      return (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <FlatList
        data={dataCategory?.knowledgeBaseCategoryDetail?.articles}
        renderItem={renderArticles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10, paddingBottom: 60 }}
        ItemSeparatorComponent={seperator}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListHeaderComponent={() => {
          return (
            <TouchableOpacity
              style={{ backgroundColor: '#f7f6f9', padding: 5 }}
              onPress={() => {
                setSelectedCategory('');
              }}
            >
              <Text style={{ marginLeft: 5 }}>Back to Categories</Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  const header = () => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: '#f7f6f9',
          padding: 5,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          setSelectedParent('');
        }}
      >
        <MaterialCommunityIcons
          allowFontScaling={false}
          name={'arrow-left'}
          size={24}
          color={'red'}
          direction="ltr"
        />
        <Text style={{ marginLeft: 5 }}>Back to FAQ</Text>
      </TouchableOpacity>
    );
  };

  const seperator = () => {
    return (
      <View style={{ height: 1, backgroundColor: '#000', marginTop: 10 }} />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {selectedCategory ? (
        renderCategoryDetail()
      ) : selectedParent ? (
        <FlatList
          data={data?.knowledgeBaseTopicDetail?.categories?.filter(
            (e: any) => e?.parentCategoryId === selectedParent?._id
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10, paddingBottom: 60 }}
          ItemSeparatorComponent={seperator}
          ListHeaderComponent={header}
        />
      ) : (
        <FlatList
          data={data?.knowledgeBaseTopicDetail?.parentCategories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10 }}
          ItemSeparatorComponent={seperator}
        />
      )}
    </View>
  );
};

export default FAQ;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 10,
  },
});
