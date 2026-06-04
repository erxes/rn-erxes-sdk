import { gql } from '@apollo/client';

const connect = gql`
  mutation connect(
    $integrationId: String!
    $visitorId: String
    $cachedCustomerId: String
    $email: String
    $isUser: Boolean
    $phone: String
    $code: String
    $data: JSON
    $companyData: JSON
  ) {
    widgetsMessengerConnect(
      integrationId: $integrationId
      visitorId: $visitorId
      cachedCustomerId: $cachedCustomerId
      email: $email
      isUser: $isUser
      phone: $phone
      code: $code
      data: $data
      companyData: $companyData
    ) {
      integrationId
      messengerData
      languageCode
      uiOptions
      customerId
      visitorId
      ticketConfig
      customer {
        _id
        firstName
        lastName
        phones
        emails
        __typename
      }
      __typename
    }
  }
`;

const widgetsInsertMessage = gql`
  mutation WidgetsInsertMessage(
    $integrationId: String!
    $customerId: String
    $visitorId: String
    $conversationId: String
    $contentType: String
    $message: String
    $attachments: [AttachmentInput]
  ) {
    widgetsInsertMessage(
      integrationId: $integrationId
      customerId: $customerId
      visitorId: $visitorId
      conversationId: $conversationId
      contentType: $contentType
      message: $message
      attachments: $attachments
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

const widgetsSaveBrowserInfo = gql`
  mutation widgetsSaveBrowserInfo(
    $customerId: String
    $visitorId: String
    $browserInfo: JSON!
  ) {
    widgetsSaveBrowserInfo(
      customerId: $customerId
      visitorId: $visitorId
      browserInfo: $browserInfo
    ) {
      _id
      conversationId
      customerId
    }
  }
`;

export {
  connect,
  widgetsInsertMessage,
  widgetsSaveCustomerGetNotified,
  widgetsSaveBrowserInfo,
};
