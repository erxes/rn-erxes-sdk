import { gql } from '@apollo/client';

const connect = gql`
  mutation connect(
    $brandCode: String!
    $email: String
    $phone: String
    $code: String
    $isUser: Boolean
    $data: JSON
    $companyData: JSON
    $cachedCustomerId: String
    $visitorId: String
  ) {
    widgetsMessengerConnect(
      brandCode: $brandCode
      email: $email
      phone: $phone
      code: $code
      isUser: $isUser
      data: $data
      companyData: $companyData
      cachedCustomerId: $cachedCustomerId
      visitorId: $visitorId
    ) {
      integrationId
      messengerData
      languageCode
      uiOptions
      customerId
      visitorId
      brand {
        name
        description
        __typename
      }
      __typename
    }
  }
`;

const widgetsInsertMessage = gql`
  mutation widgetsInsertMessage(
    $integrationId: String!
    $customerId: String
    $visitorId: String
    $message: String
    $contentType: String
    $conversationId: String
    $attachments: [AttachmentInput]
    $skillId: String
  ) {
    widgetsInsertMessage(
      integrationId: $integrationId
      customerId: $customerId
      visitorId: $visitorId
      contentType: $contentType
      message: $message
      conversationId: $conversationId
      attachments: $attachments
      skillId: $skillId
    ) {
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
  }
`;

const widgetsSaveCustomerGetNotified = gql`
  mutation widgetsSaveCustomerGetNotified(
    $customerId: String
    $visitorId: String
    $type: String!
    $value: String!
  ) {
    widgetsSaveCustomerGetNotified(
      customerId: $customerId
      visitorId: $visitorId
      type: $type
      value: $value
    )
  }
`;

export { connect, widgetsInsertMessage, widgetsSaveCustomerGetNotified };
