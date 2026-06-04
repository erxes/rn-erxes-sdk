import { gql } from '@apollo/client';

const widgetsMessengerSupporters = gql`
  query widgetsMessengerSupporters($integrationId: String!) {
    widgetsMessengerSupporters(integrationId: $integrationId) {
      supporters {
        _id
        isActive
        details {
          avatar
          fullName
          shortName
          location
          __typename
        }
        isOnline
        __typename
      }
      isOnline
      __typename
    }
  }
`;

const widgetsConversations = gql`
  query widgetsConversations(
    $integrationId: String!
    $customerId: String
    $visitorId: String
  ) {
    widgetsConversations(
      integrationId: $integrationId
      customerId: $customerId
      visitorId: $visitorId
    ) {
      _id
      content
      createdAt
      participatedUsers {
        _id
        details {
          avatar
          fullName
          shortName
          __typename
        }
        __typename
      }
      messages {
        _id
        content
        createdAt
        customerId
        userId
        isCustomerRead
        fromBot
        user {
          _id
          details {
            avatar
            fullName
            shortName
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

const widgetsConversationDetail = gql`
  query widgetsConversationDetail($_id: String, $integrationId: String!) {
    widgetsConversationDetail(_id: $_id, integrationId: $integrationId) {
      _id
      messages {
        _id
        conversationId
        customerId
        user {
          _id
          details {
            avatar
            fullName
            description
            location
            position
            shortName
            __typename
          }
          __typename
        }
        content
        createdAt
        internal
        fromBot
        contentType
        engageData {
          content
          kind
          sentAs
          messageId
          brandId
          __typename
        }
        botData
        messengerAppData
        attachments {
          url
          name
          size
          type
          __typename
        }
        __typename
      }
      isOnline
      participatedUsers {
        _id
        details {
          avatar
          fullName
          shortName
          description
          position
          location
        }
        links
      }
      persistentMenus
      __typename
    }
  }
`;

const widgetsTotalUnreadCount = gql`
  query widgetsTotalUnreadCount(
    $integrationId: String!
    $customerId: String
    $visitorId: String
  ) {
    widgetsTotalUnreadCount(
      integrationId: $integrationId
      customerId: $customerId
      visitorId: $visitorId
    )
  }
`;

// Knowledge base topic details — ported from the web messenger SDK
// (frontline-widgets GET_KNOWLEDGE_BASE_TOPIC_DETAILS); same backend.
const knowledgeBaseTopicDetail = gql`
  query knowledgeBaseTopicDetail($_id: String!) {
    knowledgeBaseTopicDetail(_id: $_id) {
      _id
      title
      description
      color
      code
      categories {
        _id
        title
        description
        numOfArticles(status: "publish")
        countArticles
        parentCategoryId
        icon
        articles(status: "publish") {
          _id
          title
          summary
          content
          categoryId
          modifiedDate
          publishedAt
        }
      }
      parentCategories {
        _id
        title
        description
        numOfArticles(status: "publish")
        parentCategoryId
        icon
        childrens {
          _id
        }
        articles {
          _id
          title
          summary
          content
          categoryId
          modifiedDate
          publishedAt
        }
      }
    }
  }
`;

export {
  widgetsMessengerSupporters,
  widgetsConversations,
  widgetsConversationDetail,
  widgetsTotalUnreadCount,
  knowledgeBaseTopicDetail,
};
