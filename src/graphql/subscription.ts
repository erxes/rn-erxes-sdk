import { gql } from '@apollo/client';

const conversationMessageInserted = gql`
  subscription conversationMessageInserted($_id: String!) {
    conversationMessageInserted(_id: $_id) {
      _id
      attachments {
        url
        name
        type
        size
      }
      botData
      content
      contentType
      conversationId
      createdAt
      customer {
        avatar
        firstName
        lastName
        primaryEmail
        primaryPhone
        _id
        state
      }
      customerId
      internal
      fromBot
      user {
        _id
        username
        details {
          avatar
          fullName
          position
        }
      }
      userId
      videoCallData {
        url
        name
        status
        recordingLinks
      }
      mentionedUserIds
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
};
