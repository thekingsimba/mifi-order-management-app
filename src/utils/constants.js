export const STATUS = {
  CAPTURED: 'captured',
  DRAFT: 'draft',
  FAILED: 'failed',
  PAYMENT_PENDING: 'paymentPending',
};

export const PRICE_TYPES = {
  ONE_TIME_CHARGE: 'OneTimeCharge',
  RENTAL: 'Rental',
};

export const resourceBaseTypes = {
  LOGICAL_RESOURCE: 'LogicalResource',
  PHYSICAL_RESOURCE: 'PhysicalResource',
};

export const UI_SCHEMAS = [
  'address',
  'customerInfo',
  'cash',
  'creditAndDebitCard',
  'cheque',
  'gccID',
  'article20',
  'drivingLicense',
  'passport',
  'nonKuwaitiCard',
  'civilId',
  'guestInfo',
  'guestContactInfo',
  'guestAddress',
];

export const PROD_SPEC_LOB = 'productSpecification.LoB';

export const DATE_FORMAT = {
  monthYear: 'MM/YYYY',
  standard: 'DD MMM YYYY',
};

export const ROLES = {
  csrAgent: 'CSRAgent',
  agent: 'Agent',
  ssoUser: 'SSOUser',
  guest: 'Guest',
};
