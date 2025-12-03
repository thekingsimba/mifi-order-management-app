import { format, isValid, parseISO } from 'date-fns';
import { number, object, string } from 'yup';
import {
  defaultTableHeaderKey,
  excludeFromTableHeaderKey,
} from '../../constant/mifi-management-constant';
import { buildTheCsvFileFromJson } from 'src/services/ApiService';

export const getParentTableHeader_ForSimOrders = (singleSimOrderObject) => {
  const objectCopy = singleSimOrderObject;
  for (let key of excludeFromTableHeaderKey) {
    delete objectCopy[key];
  }

  return Object.keys(objectCopy).map((theKey) => {
    return {
      id: theKey,
      label: formatStringFromCamelCase(theKey),
      visible: defaultTableHeaderKey.includes(theKey),
      value: objectCopy[theKey],
    };
  });
};

export const getChildTableHeader_ForSimOrders = (
  singleSimOrderDetailsObject
) => {
  const keyListForTableHeader = Object.keys(singleSimOrderDetailsObject);
  keyListForTableHeader.unshift('select');
  // keyListForTableHeader.push('action');

  return keyListForTableHeader.map((theKey, index) => {
    // console.log(theKey);
    return {
      id: theKey,
      label: formatStringFromCamelCase(theKey),
      // just want to show 5 item in the table first (user can edit)
      visible: (index < 11 && theKey !== 'id') || theKey == 'action',
    };
  });
};

export const getVisibleHeaderColumnList = (fullParentHeaderList) => {
  const visibleHeader = {};
  fullParentHeaderList.forEach((tableHeaderObject) => {
    visibleHeader[tableHeaderObject.id] = tableHeaderObject.visible;
  });

  return visibleHeader;
};

export const getHeaderColumnList = (visibleHeaderOject) => {
  return Object.keys(visibleHeaderOject).map((theKey) => {
    return {
      id: theKey,
      label: formatStringFromCamelCase(theKey),
      visible: visibleHeaderOject[theKey],
    };
  });
};

export const flattenObject = (obj, parentKey = '', result = {}) => {
  delete obj?._id;
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = parentKey ? `${parentKey}_${key}` : key;
      if (valueIsAnObject(obj, key)) {
        flattenObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
};

const valueIsAnObject = (obj, key) => {
  return (
    typeof obj[key] === 'object' &&
    obj[key] !== null &&
    !Array.isArray(obj[key])
  );
};

export const flattenObjectAndAppendData = (obj) => {
  const objectChildData = obj.data;
  const flattenedOjectWithoutData = flattenObject(obj);
  flattenedOjectWithoutData.data = objectChildData;
  const flattenedOjectWithData = flattenedOjectWithoutData;
  return flattenedOjectWithData;
};

export const transformSimOrderData = (simOrderOriginalArray) => {
  const transformedData = [];
  for (let simOrderObjData of simOrderOriginalArray) {
    const newObject = flattenObjectAndAppendData(simOrderObjData);
    transformedData.push(newObject);
  }
  //console.log(transformedData);
  return transformedData;
};

export const formatStringFromCamelCase = (input) => {
  let result = input.replace(/_/g, ' ');
  result = result.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Split the result into words
  let words = result.split(' ');

  // reduce size of number that are more longer than 8 letter
  words = words.map((word) => {
    if (word.length > 8) {
      const newLength = Math.floor(word.length * 0.7);
      return word.slice(0, newLength);
    }
    return word;
  });
  // Join the words back into a single string
  result = words.join(' ');

  // Capitalize the first letter of the result and make the rest lowercase
  result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();

  return result;
};

export const formFromCamelCase = (input) => {
  let result = input.replace(/_/g, ' ');
  result = result.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Split the result into words
  let words = result.split(' ');

  // Join the words back into a single string
  result = words.join(' ');

  // Capitalize the first letter of the result and make the rest lowercase
  result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();

  return result;
};

export const splitArray = (arr, excludedKeys = []) => {
  const newArrayToDisplay = arr.filter((item) => {
    // console.log(excludedKeys);
    return !excludedKeys.includes(item.key);
  });

  // Calculate the middle point
  const middleIndex = Math.ceil(newArrayToDisplay.length / 2);

  // Split the array into two parts
  const firstGridData = newArrayToDisplay.slice(0, middleIndex);
  const secondGridData = newArrayToDisplay.slice(middleIndex);

  return { firstGridData, secondGridData };
};

export const stringAvatar = (name, space = true) => {
  let displayInitials;
  if (space) {
    displayInitials = `${name.split(' ')[0][0]}${
      name.split(' ')[1][0]
    }`.toUpperCase();
  }
  if (!space) {
    displayInitials = `${name.slice(0, 2)}`.toUpperCase();
  }
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: displayInitials,
  };
};

export const stringToColor = (string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

export const createSimOrderFormValidationSchema = () => {
  const schema = {
    connectionType: string().required('Connection type is required'),
    simType: string().required('SIM Type is required'),
    manufacturer: string().required('SIM Manufacturer is required'),
    simCategory: string().required('SIM Category is required'),
    simPrefix: string().required('Sim Prefix is required'),
    quantity: number().required('Quantity is required'),
    partCode: string().required('Part Code is required'),
    comments: string().notRequired(),
    graphicalProfile: string(),
    hlr: string(),
    status: string(),
    purchaseOrder: string().required('Purchase Order is required'),
    kitNumber: string().required('Kit Number is required'),
    serialNumber: string().required('Serial Number is required'),
  };

  return object().shape(schema);
};

export const createHLRFormValidationSchema = () => {
  const schema = {
    graphKey: string().required('Graph Key is required'),
    quantity: number().required('Quantity is required'),
    electricProfile: string().required('Electric Profile is required'),
    transportKey: string().required('Transport Key is required'),
    hlr: string().required('HLR is required'),
  };
  return object().shape(schema);
};

export const formatObjectDates = (obj) => {
  const formattedObj = {};

  for (const key in obj) {
    const value = obj[key];
    if (key.includes('Date')) {
      const dateValue = parseISO(value);
      if (isValid(dateValue)) {
        formattedObj[key] = format(dateValue, 'MM/dd/yyyy hh:mm:ss a');
      } else {
        formattedObj[key] = value;
      }
    } else {
      formattedObj[key] = value;
    }
  }

  return formattedObj;
};

export const stringifyKeys = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => stringifyKeys(item));
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[String(key)] = stringifyKeys(value);
    return acc;
  }, {});
};

function formatToNdigits(number, n) {
  if (number.toString().length <= n) {
    return number.toString().padStart(n, '0');
  } else {
    return number.toString();
  }
}

export const removePrefix = (prefixLength, value) => {
  const valueToEdit = `${value}`;
  return valueToEdit.slice(prefixLength);
};

export const addPrefix = (prefix, suffixSize, value) => {
  const stringPrefix = `${prefix}`;
  const valueToEdit = formatToNdigits(value, suffixSize);
  return `${stringPrefix}${valueToEdit}`;
};

export function formatToDecimal(num) {
  const number = parseFloat(num);

  if (isNaN(number)) {
    return num.toString();
  }

  return number.toFixed(2);
}

export const joinOutputVariablesData = (
  otaFileData,
  outFileData,
  businessTypeKey,
  transportKey
) => {
  // console.log('otaFileData', otaFileData);
  // console.log('outFileData', outFileData);
  const additionalKeys = {};
  additionalKeys['PIN1'] = otaFileData?.header['PIN1'];
  additionalKeys['PIN2'] = otaFileData?.header['PIN2'];
  additionalKeys['SIM-TYPE'] = otaFileData?.header?.Productcode.replace(
    'TOKEN',
    ''
  );
  additionalKeys['BUSINESS-TYPE'] = businessTypeKey;
  additionalKeys['KIND'] = transportKey;

  const combinedData = otaFileData?.output_variables.map((otaFileRow) => {
    const relatedOutFileRow = outFileData?.output_variables.find(
      (outFileRow) => outFileRow['IMSI'] === otaFileRow['IMSI']
    );
    if (relatedOutFileRow) {
      relatedOutFileRow['QRData'] = relatedOutFileRow['QR'];
      delete relatedOutFileRow['IMSI'];
      delete relatedOutFileRow['QR'];
      return { ...otaFileRow, ...relatedOutFileRow, ...additionalKeys };
    }
  });

  return combinedData;
};

export const prepareDataForRMS = (arrayOfObj) => {
  return arrayOfObj.map((item) => {
    // console.log('prepareDataForRMS building CSV', item);
    const row = {};
    row['SIM'] = item['ICCID']?.toString() || '';
    row['IMSI'] = item['IMSI']?.toString() || '';
    row['KI'] = item['KI']?.toString() || '';
    row['KIND'] = item['KIND']?.toString() || '';
    row['CARDPROFILE'] = item['CardProfile']?.toString() || '';
    row['PUK1'] = item['PUK1']?.toString() || '';
    row['PUK2'] = item['PUK2']?.toString() || '';
    row['PIN1'] = item['PIN1']?.toString() || '';
    row['PIN2'] = item['PIN2']?.toString() || '';
    row['QRData'] = item['QRData']?.toString() || '';
    row['KIT'] = item['KIT']?.toString() || '';
    row['SIM-TYPE'] = item['SIM-TYPE']?.toString() || '';
    row['BUSINESS-TYPE'] = item['BUSINESS-TYPE']?.toString() || '';
    return row;
  });
};

export const downloadCsvFormJson = async (arrayOfJson, fileName) => {
  const csvResponse = await buildTheCsvFileFromJson(
    JSON.stringify(arrayOfJson)
  );
  if (csvResponse.data) {
    // DOWNLOAD CSV =============================================
    const url = window.URL.createObjectURL(new Blob([csvResponse.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};