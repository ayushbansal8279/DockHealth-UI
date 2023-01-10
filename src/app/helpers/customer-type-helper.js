export const getCustomerTypeLabel = currentUser => {
  const { organizationCustomerType } = currentUser;

  switch (organizationCustomerType) {
    case 'PATIENT':
      return 'patient';

    case 'CLIENT':
      return 'client';

    case 'MEMBER':
      return 'member';

    case 'CUSTOMER':
      return 'customer';

    default:
      return 'patient';
  }
};

export const getCustomerUniqueIDLabel = currentUser => {
  const { organizationCustomerType } = currentUser;

  // eslint-disable-next-line sonarjs/no-small-switch
  switch (organizationCustomerType) {
    case 'PATIENT':
      return 'MRN';

    default:
      return 'Unique Identifier';
  }
};

export const getCustomerUniqueIDShortLabel = currentUser => {
  const { organizationCustomerType } = currentUser;

  // eslint-disable-next-line sonarjs/no-small-switch
  switch (organizationCustomerType) {
    case 'PATIENT':
      return 'MRN';

    default:
      return 'ID';
  }
};
