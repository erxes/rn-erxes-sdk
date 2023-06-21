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
        details {
          avatar
          fullName
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

const knowledgeBaseTopicDetail = gql`
  query knowledgeBaseTopicDetail($_id: String!) {
    knowledgeBaseTopicDetail(_id: $_id) {
      title
      description
      categories {
        _id
        title
        description
        numOfArticles
        parentCategoryId
        icon
        __typename
      }
      parentCategories {
        _id
        title
        description
        numOfArticles
        parentCategoryId
        icon
        __typename
      }
      __typename
    }
  }
`;

const knowledgeBaseCategoryDetail = gql`
  query knowledgeBaseCategoryDetail($_id: String!) {
    knowledgeBaseCategoryDetail(_id: $_id) {
      _id
      title
      description
      numOfArticles
      parentCategoryId
      icon
      parentCategoryId
      articles {
        _id
        title
        summary
        content
        createdDate
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
            __typename
          }
          __typename
        }
        content
        createdAt
        internal
        fromBot
        contentType
        videoCallData {
          url
          status
          __typename
        }
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
      operatorStatus
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
          __typename
        }
        links
        __typename
      }
      __typename
    }
  }
`;

export {
  widgetsMessengerSupporters,
  widgetsConversations,
  widgetsConversationDetail,
  knowledgeBaseTopicDetail,
  knowledgeBaseCategoryDetail,
};
