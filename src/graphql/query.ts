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

const formDetail = gql`
  query formDetail($_id: String!) {
    formDetail(_id: $_id) {
      title
      description
      buttonText
      numberOfPages
      googleMapApiKey
      code
      fields {
        _id
        name
        type
        text
        content
        description
        options
        locationOptions {
          lat
          lng
          description
          __typename
        }
        objectListConfigs {
          key
          label
          type
          __typename
        }
        isRequired
        order
        validation
        associatedFieldId
        column
        groupId
        logicAction
        pageNumber
        logics {
          fieldId
          logicOperator
          logicValue
          __typename
        }
        products {
          _id
          name
          unitPrice
          attachment {
            url
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
        botData
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
  formDetail,
};
