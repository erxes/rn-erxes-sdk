import { gql } from '@apollo/client';

const conversationMessageInserted = gql`
  subscription conversationMessageInserted($_id: String!) {
    conversationMessageInserted(_id: $_id) {
      _id
      conversationId
      customerId
      userId
      isCustomerRead
      user {
        _id
        details {
          avatar
          fullName
          description
          location
          position
          shortName
        }
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
      }
      botData
      messengerAppData
      attachments {
        url
        name
        size
        type
      }
    }
  }
`;

const conversationClientMessageInserted = gql`
  subscription conversationClientMessageInserted(
    $subdomain: String!
    $userId: String!
  ) {
    conversationClientMessageInserted(subdomain: $subdomain, userId: $userId) {
      _id
      content
    }
  }
`;

const conversationChanged = gql`
  subscription conversationChanged($_id: String!) {
    conversationChanged(_id: $_id) {
      conversationId
      type
    }
  }
`;

// Bot typing indicator — ported from the web messenger SDK
// (frontline-widgets conversationBotTypingStatus); same backend.
const conversationBotTypingStatus = gql`
  subscription conversationBotTypingStatus($_id: String!) {
    conversationBotTypingStatus(_id: $_id)
  }
`;
const conversationExternalIntegrationMessageInserted = gql`
  subscription conversationExternalIntegrationMessageInserted {
    conversationExternalIntegrationMessageInserted
  }
`;

const adminMessageInserted = gql`
  subscription conversationAdminMessageInserted($customerId: String) {
    conversationAdminMessageInserted(customerId: $customerId) {
      unreadCount
    }
  }
`;

export {
  conversationMessageInserted,
  conversationClientMessageInserted,
  conversationChanged,
  conversationExternalIntegrationMessageInserted,
  adminMessageInserted,
  conversationBotTypingStatus,
};
