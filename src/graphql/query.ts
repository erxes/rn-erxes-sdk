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

export {
  widgetsMessengerSupporters,
  widgetsConversations,
  widgetsConversationDetail,
  widgetsTotalUnreadCount,
};
