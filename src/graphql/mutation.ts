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

const widgetsLeadConnect = gql`
  mutation widgetsLeadConnect(
    $brandCode: String!
    $formCode: String!
    $cachedCustomerId: String
  ) {
    widgetsLeadConnect(
      brandCode: $brandCode
      formCode: $formCode
      cachedCustomerId: $cachedCustomerId
    ) {
      form {
        _id
        title
        description
        __typename
      }
      integration {
        _id
        name
        leadData
        languageCode
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

const widgetsSaveLead = gql`
  mutation widgetsSaveLead(
    $integrationId: String!
    $formId: String!
    $submissions: [FieldValueInput]
    $browserInfo: JSON!
    $cachedCustomerId: String
  ) {
    widgetsSaveLead(
      integrationId: $integrationId
      formId: $formId
      submissions: $submissions
      browserInfo: $browserInfo
      cachedCustomerId: $cachedCustomerId
    ) {
      status
      errors {
        fieldId
        code
        text
      }
    }
  }
`;

export {
  connect,
  widgetsInsertMessage,
  widgetsSaveCustomerGetNotified,
  widgetsLeadConnect,
  widgetsSaveLead,
};
