import axios from 'axios';
import dayjs from 'dayjs';
import _find from 'lodash/find';
import _get from 'lodash/get';
import _isArray from 'lodash/isArray';

import { ROLES } from './constants';


export const userStoreTableHeaderSchema = [
  {
    id: '_id',
    label: 'User Store Id',
    visible: true,
  },
  {
    id: 'name',
    label: 'User Store Name',
    visible: true,
  },
  {
    id: 'tenantId',
    label: 'Tenant Id',
    visible: true,
  },
  {
    id: 'activatedOn',
    label: 'Activated On',
    visible: true,
  },
  {
    id: 'validTill',
    label: 'Valid Till',
    visible: true,
  },
  {
    id: 'status',
    label: 'User Store Status',
    visible: true,
  },
  {
    id: 'tenantStatus',
    label: 'Tenant Status',
    visible: true,
  },
  {
    id: 'comment',
    label: 'Comment',
    visible: true,
  },
  {
    id: 'action',
    label: 'Action',
    visible: true,
  },
];


export const sleep = (ms) =>
  new Promise((res) => {
    setTimeout(res, ms);
  });

export const getTrueKeys = (filters) => {
  const result = {};
  Object.entries(filters).forEach(([key, value]) => {
    // Collect all innerKeys that have a true value
    const trueKeys = Object.entries(value)
      // eslint-disable-next-line no-unused-vars
      .filter(([_, innerValue]) => innerValue === true)
      // eslint-disable-next-line no-unused-vars
      .map(([innerKey, _]) => innerKey);

    // Join the true keys with commas if there are any
    if (trueKeys.length > 0) {
      result[key] = trueKeys.join(',');
    }
  });
  return result;
};

export const getFalseKeys = (filters) => {
  let keys = [];
  Object.entries(filters).forEach(([key, value = {}]) => {
    const innerLen = Object.keys(value).length;
    if (innerLen === 0) {
      keys = [...new Set([...keys, key])];
    } else {
      const ca = [];
      Object.keys(value).forEach((innerKey) => {
        if (value[innerKey] === false) ca.push(innerKey);

        if (ca.length === innerLen) {
          keys = [...new Set([...keys, key])];
        }
      });
    }
  });
  return keys;
};
function getContactMediumDetails(contactMedium, path, objType) {
  let currentObject = contactMedium;
  let keyType = objType;
  for (const key of path.split('/')) {
    if (_isArray(currentObject)) {
      for (const obj of currentObject) {
        if (obj.characteristic && obj.characteristic['@type'] === key) {
          currentObject = obj.characteristic;
          keyType = objType;
          break;
        }
      }
    } else {
      currentObject = currentObject[keyType];
    }
  }
  return currentObject[keyType];
}

export const getContactMediumValue = (contactMedium, type, objType) =>
  contactMedium && type
    ? getContactMediumDetails(contactMedium, `characteristic/${type}`, objType)
    : '';

export const getContactMediumAddress = (contactMedium, addressType) => {
  let characteristic = {};
  for (const item of contactMedium) {
    if (item['@type'] === addressType) {
      characteristic = item.characteristic || {};
    }
  }
  return characteristic;
};

export const findItem = (list, code) => _find(list, { code }) || {};

export const getItemNameByCode = (list, code, defaultValue = '') => {
  const item = findItem(list, code);
  return _get(item, 'name', defaultValue);
};

export const toAddressText = (addressProp, countries) => {
  const {
    addressLine1,
    addressLine2,
    addressLine3,
    addressLine4,
    streetName,
    landmark,
    city,
    country = 'KW',
    postCode,
    streetNr,
    stateOrProvince,
    digitalAddress,
    geographicSubAddress = [],
  } = addressProp?.characteristic || {};
  const {
    subUnitType,
    '@type': type,
    buildingName,
    levelNumber,
    subUnitNumber,
  } = {
    ...addressProp,
    ...(geographicSubAddress?.[0] || {}),
  };
  const countryObj = findItem(countries, country);
  const countryName = _get(countryObj, 'name', country);
  const provinces = _get(countryObj, 'province', []);
  const provinceObj = findItem(provinces, stateOrProvince);
  const provinceName = _get(provinceObj, 'name', stateOrProvince);
  const cities = _get(provinceObj, 'city', []);
  const cityName = getItemNameByCode(cities, city);
  const addressLine1Text =
    (addressLine1 || '').length > 10
      ? `${(addressLine1 || '').substr(0, 10)}...`
      : addressLine1;
  return [
    addressLine1Text,
    addressLine2,
    addressLine3,
    addressLine4,
    subUnitType,
    type,
    buildingName,
    levelNumber,
    subUnitNumber,
    streetName,
    streetNr,
    cityName,
    provinceName,
    countryName,
    postCode,
    landmark,
    digitalAddress,
  ]
    .filter((item) => item)
    .join(', ');
};

export const getAddressList = (contactMedium = []) =>
  contactMedium.filter((i) => i?.mediumType === 'Address');

export const getIdentificationItem = ({
  type,
  identificationId,
  issueDate = null,
  expiryDate = null,
}) => {
  const item = {
    type,
    identificationId,
  };

  if (issueDate) item.issueDate = issueDate;
  if (expiryDate) item.expiryDate = expiryDate;
  return item;
};

export const getEmailItem = (email) => ({
  characteristic: {
    emailAddress: email,
    '@type': 'emailAddress',
  },
  mediumType: 'EmailAddress',
  preferred: true,
});

export const getMobileNumberItem = (phoneNumber, type = 'mobile') => ({
  characteristic: {
    phoneNumber,
    '@type': type,
  },
  mediumType: 'Phone',
  preferred: false,
});

export const createAgentItem = (item) => ({
  name: item?.sub || item?.name || item?.family_name,
  '@referredType': ROLES.ssoUser,
  role: ROLES.agent,
});

// Civil ID patternvalidation specific to STC
export const civilIdValidations = (str) => {
  let sum = 0;
  const multiplicationArray = [2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < str.length - 1; i++) {
    sum += parseInt(str[i], 10) * multiplicationArray[i];
  }
  const checkDigit = 11 - (sum - parseInt(sum / 11, 10) * 11);
  return checkDigit === parseInt(str[11], 10);
};

export const poAddressToPayloadFormat = (currentAddress = {}) => {
  const formattedPayload = {
    mediumType: 'Address',
    characteristic: {
      addressLine1: currentAddress.addressLine1,
      addressLine2: currentAddress.addressLine2,
      addressLine3: currentAddress.addressLine3,
      addressLine4: currentAddress.addressLine4,
      city: currentAddress.city,
      country: currentAddress.country,
      postCode: currentAddress.postCode,
      stateOrProvince: currentAddress.stateOrProvince,
      streetName: currentAddress.streetName,
      streetNr: currentAddress.streetNr,
      type: currentAddress.addressFormat,
      landmark: currentAddress.landmark,
      locality: currentAddress.locality,
      latitude: currentAddress.latitude,
      longitude: currentAddress.longitude,
      digitalAddress: currentAddress.digitalAddress,
      addressCategory: currentAddress.addressCategory,
    },
  };
  const {
    type,
    levelNumber,
    buildingName,
    subUnitNumber,
    subUnitType,
    lat,
    lng,
  } = currentAddress;
  if (type || levelNumber || buildingName || subUnitNumber || subUnitType) {
    formattedPayload.characteristic.geographicSubAddress = [
      {
        type,
        levelNumber,
        buildingName,
        subUnitNumber,
        subUnitType,
      },
    ];
  }

  if (lat || lng) {
    formattedPayload.characteristic.geographicLocation = {
      type: 'GeographicLocation',
      geometry: [
        {
          x: lat,
          y: lng,
        },
      ],
    };
  }
  formattedPayload.preferred = false;
  formattedPayload.role = 'ResidenceAddress';

  return formattedPayload;
};

export const poAddressToPoBoxFormat = (address = {}) => {
  const { x: lat = '', y: lng = '' } = _get(
    address,
    'characteristic.geographicLocation.geometry[0]',
    {}
  );
  return {
    addressFormat: 'postcode',
    addressLine1: _get(address, 'characteristic.addressLine1', ''),
    addressLine2: _get(address, 'characteristic.addressLine2', ''),
    addressLine3: _get(address, 'characteristic.addressLine3', ''),
    locality: _get(address, 'characteristic.locality', ''),
    addressLine4: _get(address, 'characteristic.addressLine4', ''),
    streetName: _get(
      address,
      'characteristic.streetName',
      _get(address, 'characteristic.streetName', '')
    ),
    streetNr: _get(address, 'characteristic.streetNr', ''),
    landmark: _get(address, 'characteristic.landmark', ''),
    latitude: _get(address, 'characteristic.latitude', ''),
    longitude: _get(address, 'characteristic.longitude', ''),
    city: _get(address, 'characteristic.city', ''),
    postcode: _get(address, 'characteristic.postcode', ''),
    stateOrProvince: _get(address, 'characteristic.stateOrProvince', ''),
    country: _get(address, 'characteristic.country', ''),
    addressCategory: _get(address, 'characteristic.addressCategory', ''),
    digitalAddress: _get(address, 'characteristic.digitalAddress', ''),
    lat,
    lng,
    ..._get(address, 'characteristic.geographicSubAddress[0]', {}),
  };
};

export const convertISOToDateStr = (isoDateString) => {
  const date = new Date(isoDateString);

  // Define options for toLocaleString()
  const options = {
    day: '2-digit', // Use two digits for the day
    month: 'short', // Use abbreviated month name
    year: 'numeric', // Use full numeric year
    hour: '2-digit', // Use two digits for the hour
    minute: '2-digit', // Use two digits for minutes
    timeZone: 'Asia/Kolkata', // Set timezone to IST
    hour12: false, // Use 24-hour format
  };

  let formattedDate = date.toLocaleString('en-IN', options);

  // Replace the comma and add IST at the end
  formattedDate = `${formattedDate.replace(',', '')} IST`;

  return formattedDate;
};

export const decimalService = (number) => {
  const numbers = +number;
  const options = {
    // We will use it, once masterData implemented
    // style: 'currency',
    // currency: 'KWD',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  };

  const formattedNumber = numbers.toLocaleString('en-US', options);
  return formattedNumber;
};

export const isISODate = (str) =>
  dayjs(str).isValid() && str === dayjs(str).toISOString();

export const dataURLtoFile = async (dataURL, filename) => {
  // Convert base64 to a Blob
  const response = await axios.get(dataURL, {
    responseType: 'blob',
  });
  const blob = response.data;

  // Convert Blob to File
  const file = new File([blob], filename, { type: 'image/jpeg' });

  return file;
};

export const fileToUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject();
    };

    reader.readAsDataURL(file);
  });

export const filterUnsupportedFiles = (files) => {
  const supportedTypes = [
    'image/png',
    'image/jpeg',
    'application/pdf',
    'image/jpg',
  ];
  return [...files].filter((file) => !supportedTypes.includes(file.type));
};

export const getAge = (dateString) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    // eslint-disable-next-line no-plusplus
    age--;
  }
  return age;
};


export const getRandomStringOfNumbers = (length) => {
    // Ensure the length is a positive integer
    if (typeof length !== 'number' || length <= 0 || length % 1 !== 0) {
      throw new Error('Length must be a positive integer');
    }
  
    let randomNumber = '';
    for (let i = 0; i < length; i++) {
      const digit = Math.floor(Math.random() * 10); // Generate a random digit (0-9)
      randomNumber += digit.toString(); // Append the digit to the number as a string
    }
  
    return randomNumber;
}

export const separateWord = (text) => {
  
  const segmenter = new Intl.Segmenter([], { granularity: 'word' });
  const segmentedText = segmenter.segment(text);
  const words = [...segmentedText].filter(s => s.isWordLike).map(s => s.segment);
  return words;
}

