import { gql } from '@apollo/client';

const userDetailFields = `
  avatar
  fullName
`;

const messageFields = `
  _id
  conversationId
  customerId
  user {
    _id
    details {
      ${userDetailFields}
    }
  }
  content
  createdAt
  internal
  fromBot
  contentType
  videoCallData {
    url
    status
  }
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
`;

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

const saveBrowserInfo = `
  mutation widgetsSaveBrowserInfo($customerId: String $visitorId: String $browserInfo: JSON!) {
    widgetsSaveBrowserInfo(customerId: $customerId visitorId: $visitorId browserInfo: $browserInfo) {
      ${messageFields}
    }
  }
`;

const customersAdd = gql`
  mutation customersAdd(
    $state: String
    $avatar: String
    $firstName: String
    $lastName: String
    $middleName: String
    $sex: Int
    $birthDate: Date
    $primaryEmail: String
    $primaryPhone: String
    $phones: [String]
    $emails: [String]
    $ownerId: String
    $position: String
    $department: String
    $leadStatus: String
    $hasAuthority: String
    $description: String
    $isSubscribed: String
    $links: JSON
    $customFieldsData: JSON
    $code: String
    $emailValidationStatus: String
    $phoneValidationStatus: String
  ) {
    customersAdd(
      state: $state
      avatar: $avatar
      firstName: $firstName
      lastName: $lastName
      middleName: $middleName
      sex: $sex
      birthDate: $birthDate
      primaryEmail: $primaryEmail
      primaryPhone: $primaryPhone
      phones: $phones
      emails: $emails
      ownerId: $ownerId
      position: $position
      department: $department
      leadStatus: $leadStatus
      hasAuthority: $hasAuthority
      description: $description
      isSubscribed: $isSubscribed
      links: $links
      customFieldsData: $customFieldsData
      code: $code
      emailValidationStatus: $emailValidationStatus
      phoneValidationStatus: $phoneValidationStatus
    ) {
      _id
      firstName
      middleName
      lastName
      avatar
      sex
      birthDate
      primaryEmail
      emails
      primaryPhone
      phones
      state
      visitorContactInfo
      modifiedAt
      position
      department
      leadStatus
      hasAuthority
      description
      isSubscribed
      code
      emailValidationStatus
      phoneValidationStatus
      score
      isOnline
      lastSeenAt
      sessionCount
      links
      ownerId
      owner {
        _id
        details {
          fullName
        }
      }
      integrationId
      createdAt
      remoteAddress
      location
      customFieldsData
      trackedData
      tagIds
      getTags {
        _id
        name
        colorCode
      }
    }
  }
`;

export {
  connect,
  widgetsInsertMessage,
  widgetsSaveCustomerGetNotified,
  saveBrowserInfo,
  customersAdd,
};
