import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';

export const UpperCase = (data) =>
  (data || '').charAt(0).toUpperCase() + (data || '').slice(1);
export const mapSchemaData = (apiData, masterSchema, schemaType) => {
  const processedUiSchema = Array.isArray(masterSchema) ? masterSchema : [];
  if (schemaType === 'card') {
    const cardSchema = processedUiSchema.filter(
      (schema) => schema.schemaType === 'card'
    );
    return mapCardData(apiData, cardSchema);
  }
  if (schemaType === 'table') {
    const tableSchema = processedUiSchema.filter(
      (schema) => schema.schemaType === 'table'
    );
    return mapCardTable(apiData, tableSchema);
  }
  return [];
};

const mapCardTable = (_apiData, _masterSchema) => {
  return null;
};

const mapCardData = (apiData, masterSchema) => {
  const ssoConfig = localStorage.getItem('config');
  const processedUiSchema = masterSchema ?? [];
  const { basePath } = ssoConfig;
  apiData = { ...apiData, ...{ env: { basePath } } };
  return processedUiSchema.length > 0
    ? processedUiSchema.map((section) => {
        const updatedFields = section.fields.map((field) => {
          let replacedValue = field.value;
          const placeholders = replacedValue.match(/\{\{[^}]+\}\}/g);

          if (placeholders) {
            placeholders.forEach((placeholder) => {
              const apiPath = placeholder.slice(2, -2); // Remove the {{ }} symbols
              const apiValue = _.get(apiData, apiPath, '');
              replacedValue = replacedValue.replace(placeholder, apiValue);
            });
          }
          let replacedHref = field.href;
          const placeholdersHref = replacedHref.match(/\{\{[^}]+\}\}/g);

          if (placeholdersHref) {
            placeholdersHref.forEach((placeholder) => {
              const apiPath = placeholder.slice(2, -2); // Remove the {{ }} symbols
              const apiValue = _.get(apiData, apiPath, '');
              replacedHref = replacedHref.replace(placeholder, apiValue);
            });
          }

          return { ...field, value: replacedValue, href: replacedHref };
        });

        return { ...section, fields: updatedFields };
      })
    : [];
};

export const orderStepTabs = (data) => {
  return data.length > 0
    ? data.map((tab) => {
        let formattedName = getFormatApi(tab);
        formattedName = convertToWordsWithSpaces(formattedName);
        tab.name = UpperCase(formattedName);
        return tab;
      })
    : [];
};

export const processPrepareData = (input) => {
  const result =
    input.length > 0
      ? input.map((obj) => {
          const headers = [];
          const dataFirstIndex = obj?.data[0];
          Object.keys(dataFirstIndex).forEach((key) => {
            const headerName = {};
            headerName.id = key;
            headerName.headerName = UpperCase(convertToWordsWithSpaces(key));
            headerName.align = 'left';
            headers.push(headerName);
          });
          return { ...obj, headers };
        })
      : [];
  return result;
};
const getFormatApi = ({ api }) => {
  if (api !== undefined) {
    const res = api !== undefined ? api.split('/') : '';
    let checkSpecialChar = res[0];

    checkSpecialChar = checkSpecialChar.includes('?')
      ? checkSpecialChar.split('?')[0]
      : checkSpecialChar;

    return res.length > 1
      ? checkSpecialChar === 'Task'
        ? `${res[1]}`
        : checkSpecialChar
      : checkSpecialChar;
  }
  {
    return '';
  }
};
const getMode = ({ api }) => {
  if (api !== undefined) {
    const res = api.split('/');
    return res.length > 1 ? `Manual` : `Automatic`;
  } else {
    return '';
  }
};
export const convertToWordsWithSpaces = (inputString) =>
  inputString.split(/(?=[A-Z])/).join(' ');
export const prepareTableData = (tableData) => {
  return isTableDataValid(tableData)
    ? tableData.map((data) => {
        const slaYear = moment(data.nextSlaBreach).year();
        let formattedName = getFormatApi(data);
        formattedName = convertToWordsWithSpaces(formattedName);
        data.stepName = getStepName(data, formattedName);
        data.mode = getMode(data);
        data.success = handleSuccessStatus(data.success);
        data.slaStatus = calculateSlaStatus(data, slaYear);
        data.nextSlaBreach = slaYear === 2099 ? data.nextSlaBreach : 'Not Set';
        data.notes = data.notes !== '' ? data.notes : 'NA';
        data.username = data.username !== '' ? data.username : 'System';
        return data;
      })
    : [];
};

const isTableDataValid = (tableData) => {
  return (
    tableData !== undefined && Array.isArray(tableData) && tableData.length > 0
  );
};
const getStepName = (data, formattedName) => {
  if (!data && !formattedName) {
    return null;
  }
  return data.api !== undefined ? UpperCase(formattedName) : data?.id;
};

const handleSuccessStatus = (status) => {
  switch (status) {
    case 'Success':
      return 'Completed';
    case 'ResponseAwaited':
      return 'In Progress';
    case '':
      return 'Yet To Start';
  }
};
const calculateSlaStatus = (data, slaYear) => {
  let slaStatus = 'Not Set';
  if (slaYear < 2099) {
    if (data.slaStatus === '0') {
      slaStatus = 'Not Breached';
    } else if (data.slaStatus !== undefined) {
      slaStatus = `Breached (Level ${data.slaStatus})`;
    }
  }
  return slaStatus;
};
export const tableDate = (date) => moment(date).format('DD MMM YYYY hh:mm A');

export const tableTime = (date) => moment(date).format('hh:mm:ss A');

const documentUploadBy = (data) => {
  const result =
    data !== undefined && Array.isArray(data) && data.length > 0
      ? data.find((val) => _.get(val, '@referredType', '') === 'SSOUser')
      : '';
  return result !== '' && result !== undefined ? result?.id : 'NA';
};

export const docHistoryMapper = (masterList, list) => {
  const docMaster = masterList?.masterData?.documentType || [];
  const docList = list !== undefined ? list : [];
  return docList.length > 0
    ? docList.map((data) => {
        const findData = docMaster.find(
          (doc) => doc.code === data.documentSpecification
        );
        data.name = findData?.name || data.documentSpecification || '';
        data.status = UpperCase(data?.lifecycleState);
        data.uploadedBy = documentUploadBy(data?.relatedParty);
        return data;
      })
    : [];
};

const handleAssigning = (taskData, userGroup, assignedLevel) => {
  let AssignedToMyGroup = 'N';
  let AssignedToMe = 'N';
  if (assignedLevel === 'Group') {
    AssignedToMyGroup =
      _.get(taskData, 'assignmentInfo.assignedTo.id') === userGroup?.groupName
        ? 'Y'
        : 'N';
  } else {
    AssignedToMe =
      _.get(taskData, 'assignmentInfo.assignedTo.id') !== null &&
      _.get(taskData, 'assignmentInfo.assignedTo.id') !== undefined &&
      _.get(taskData, 'assignmentInfo.assignedTo.id') ===
        userGroup?.preferred_username
        ? 'Y'
        : 'N';
  }
  return {
    AssignedToMyGroup: AssignedToMyGroup,
    AssignedToMe: AssignedToMe,
  };
};
const handleEnableAppointmentIcon = (taskData, AssignedToMe) => {
  let enableAppointmentIcon = _.get(
    taskData,
    'assignmentInfo.enableAppointmentIcon',
    false
  );
  if (AssignedToMe === 'Y' && enableAppointmentIcon) {
    enableAppointmentIcon = true;
  } else {
    enableAppointmentIcon = false;
  }
  return enableAppointmentIcon;
};
const canPushFinalList = (enableAppointmentIcon, taskData) =>
  (enableAppointmentIcon || enableAppointmentIcon === 'true') &&
  _.get(taskData, 'status', '') === 'ResponseAwaited';
const returnValueOrEmptyArr = (value) => {
  if (!_.isEmpty(value) || value !== undefined) {
    return value;
  } else {
    return [];
  }
};
export const cardActionFilter = (
  masterData,
  taskData,
  permission,
  userGroup,
  actions
) => {
  const allowedActions = returnValueOrEmptyArr(actions?.allowedActivity);
  const actionArr = returnValueOrEmptyArr(masterData?.cardActions);
  const masterIconList =
    masterData !== null && masterData !== undefined && actionArr.length > 0
      ? masterData?.cardActions.filter((action) =>
          permission.includes(action.permission)
        )
      : [];
  const referredType = _.get(
    taskData,
    'assignmentInfo.assignedTo.@referredType'
  );
  const assignedLevel = referredType === 'Group' ? 'Group' : 'User';
  const apiName = _.get(taskData, 'api', '').split('/')[0];
  const isOrderOpen = taskData?.status === 'ResponseAwaited' ? 'Y' : 'N';
  const { AssignedToMyGroup, AssignedToMe } = handleAssigning(
    taskData,
    userGroup,
    assignedLevel
  );
  const enableAppointmentIcon = handleEnableAppointmentIcon(
    taskData,
    AssignedToMe
  );

  const activityIcons =
    masterIconList.filter((item) => {
      const iconCondition = item.iconCondition;
      return (
        iconCondition.WorkOrderOpen === isOrderOpen &&
        iconCondition.AssignedToMyGroup === AssignedToMyGroup &&
        iconCondition.AssignedtoMe === AssignedToMe
      );
    }) || [];

  const finalActivityIcons = activityIcons.filter((iconData) => {
    const iconExists = allowedActions.includes(iconData.id);
    return iconExists ? iconData : null;
  });
  const checkSpecialAccess =
    permission.includes('mifi-order.ui.action.activity.superaccess.isAllowed') ===
      true &&
    AssignedToMyGroup === 'N' &&
    AssignedToMe === 'N'
      ? true
      : false;
  if (checkSpecialAccess && apiName === 'Task' && isOrderOpen === 'Y') {
    const stealAccess = masterIconList.find((icon) => icon.id === 'steal');
    finalActivityIcons.unshift(stealAccess);
  }
  const uniqueObjectsSet = new Set();

  const finalList = finalActivityIcons.filter((jsonObj) => {
    const uniqueProperty = jsonObj.id;
    if (!uniqueObjectsSet.has(uniqueProperty)) {
      uniqueObjectsSet.add(uniqueProperty);
      return true;
    }
    return false;
  });
  if (canPushFinalList(enableAppointmentIcon, taskData)) {
    finalList.push({
      iconName: 'calender',
      name: 'Schedule Appointment',
      id: 'calender',
      apiName: 'TaskAction',
      schemaForm: true,
    });
  }
  return finalList;
};

const assignValueFunc = (tabValue, groupName, preferred_username) => {
  if (tabValue === 'Group') {
    return groupName || '';
  } else if (tabValue === 'SSOUser') {
    return preferred_username || '';
  } else {
    return '';
  }
};

export const mapSearchParams = (
  tabValue,
  data,
  searchKey,
  fromDate,
  toDate
) => {
  const searchKeyword =
    searchKey !== undefined && searchKey !== null ? searchKey : '';
  let assignValue = '';
  if (data !== null && typeof data === 'object') {
    const { groupName, preferred_username } = data;
    assignValue = assignValueFunc(tabValue, groupName, preferred_username);
  }
  const startDate =
    fromDate !== undefined
      ? fromDate
      : tabValue === 'ALL'
      ? moment().subtract(3, 'week').toDate()?.toISOString()
      : moment().subtract(3, 'months').toDate()?.toISOString();
  const endDate = toDate !== undefined ? toDate : new Date()?.toISOString();
  const initialParams = `?status=ResponseAwaited&fromDate=${startDate}
    &toDate=${endDate}&assignValue=${assignValue}&assignLevel=${tabValue}&keyword=${searchKeyword}`;
  return initialParams;
};

export function fData(number) {
  const format = number ? numeral(number).format('0.0 b') : '';
  return result(format, '.0');
}

export const prepareTaskData = (data) => {
  const slaExpiryDate = new Date(data?.slaEndDate);
  const currentTime = new Date();

  const dataList = {
    slaReminder: 'G',
    enable: true,
  };
  const targetMoment = moment(data?.slaEndDate);
  const currentMoment = moment();
  const slaYear = targetMoment.diff(currentMoment, 'years');
  if (slaYear > 10) {
    dataList.enable = false;
    dataList.remainingDate = 'Not Set';
  } else {
    if (slaExpiryDate < currentTime) {
      dataList.enable = false;
      dataList.remainingDate = 'SLA Breached';
      dataList.slaReminder = 'R';
    } else {
      const distance = slaExpiryDate - currentTime;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let remainingTime = '';
      let remainingDate = '';
      if (days > 0) {
        remainingDate = moment(data?.slaEndDate).format('DD MMM YYYY');
        remainingTime = data?.slaEndDate;
      } else if (hours > 0) {
        remainingDate = 'Today';
        remainingTime = data?.slaEndDate;
      } else {
        remainingTime = data?.slaEndDate;
        dataList.slaReminder = 'A';
      }

      dataList.remainingDate = remainingDate;
      dataList.remainingTime = remainingTime;
    }
  }

  return {
    ...data,
    slaInfo: dataList,
  };
};

export const calculateRemainingTime = (targetDateTime) => {
  const targetMoment = moment(targetDateTime);
  const currentMoment = moment();
  const duration = moment.duration(targetMoment.diff(currentMoment));
  const hours = duration.hours().toString().padStart(2, '0');
  const minutes = duration.minutes().toString().padStart(2, '0');
  const seconds = duration.seconds().toString().padStart(2, '0');
  const remainingTime = `${hours} : ${minutes} : ${seconds}`;
  return remainingTime;
};

export const tableApplyFilter = ({ inputData, comparator }) => {
  const stabilizedThis =
    inputData.length > 0 ? inputData.map((el, index) => [el, index]) : [];

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
};

export const getTaskIds = (data) => {
  return data.length > 0
    ? data.reduce((acc, task) => [...acc, task.id], [])
    : [];
};

export const orderFilterSelectList = (masterList) => {
  const {
    orderTypes,
    technologyList,
    lineOfBusinesses,
    businessTypeList,
    actionList,
    actionSubTypeList,
    offeringCategoryList,
    offeringSubCategoryList,
    channelList,
    flowList,
    yesNo,
  } = masterList;
  const headers = [
    {
      id: 'type',
      headerName: 'Type',
      align: 'left',
      isSelectable: true,
      dropdownList: orderTypes,
    },
    {
      id: 'channel',
      headerName: 'Channel',
      align: 'left',
      isSelectable: true,
      dropdownList: channelList,
    },
    {
      id: 'technology',
      headerName: 'Tech',
      align: 'left',
      isSelectable: true,
      dropdownList: technologyList,
    },
    {
      id: 'lob',
      headerName: 'Lob',
      align: 'left',
      isSelectable: true,
      dropdownList: lineOfBusinesses,
    },
    {
      id: 'businessType',
      headerName: 'Business',
      align: 'left',
      isSelectable: true,
      dropdownList: businessTypeList,
    },
    {
      id: 'action',
      headerName: 'Action',
      align: 'left',
      isSelectable: true,
      dropdownList: actionList,
    },
    {
      id: 'actionSubType',
      headerName: 'SubType',
      align: 'left',
      isSelectable: true,
      dropdownList: actionSubTypeList,
    },
    {
      id: 'offeringCategory',
      headerName: 'Category',
      align: 'left',
      isSelectable: true,
      dropdownList: offeringCategoryList,
    },
    {
      id: 'offeringSubCategory',
      headerName: 'SubCategory',
      align: 'left',
      isSelectable: true,
      dropdownList: offeringSubCategoryList,
    },
    {
      id: 'flow',
      headerName: 'Flow',
      align: 'left',
      isSelectable: true,
      dropdownList: flowList,
    },
    {
      id: 'paymentMethod',
      headerName: 'Payment',
      align: 'left',
      isSelectable: false,
    },
    {
      id: 'interactionType',
      headerName: 'Interaction',
      align: 'left',
      isSelectable: false,
    },
    { id: 'stageSeq', headerName: 'Order', align: 'left', isSelectable: false },
    { id: 'apiName', headerName: 'Api', align: 'left', isSelectable: false },
    {
      id: 'enabled',
      headerName: 'Enabled',
      align: 'left',
      isSelectable: true,
      dropdownList: yesNo,
    },

    { id: 'rowAction', headerName: '', align: 'right', isSelectable: false },
  ];
  return headers;
};

export const getOrderFlowFormat = (orderFlows) => {
  return orderFlows.length > 0
    ? orderFlows.map((flow) => {
        let apiName = flow.api;
        apiName = apiName.includes('?') ? apiName.split('?')[0] : apiName;
        apiName = apiName.split('/').join(' | ');
        return { ...flow, apiName };
      })
    : [];
};

export const orderFlowEditDataTransform = (data) => {
  const {
    type,
    channel,
    technology,
    lob,
    businessType,
    action,
    actionSubType,
    offeringCategory,
    offeringSubCategory,
    paymentMethod,
    flow,
    interactionType,
  } = data;
  return {
    ...data,
    type: Array.isArray(type) ? type : type.split(' '),
    channel: Array.isArray(channel) ? channel : channel.split(' '),
    technology: Array.isArray(technology) ? technology : technology.split(' '),
    lob: Array.isArray(lob) ? lob : lob.split(' '),
    businessType: Array.isArray(businessType)
      ? businessType
      : businessType.split(' '),
    action: Array.isArray(action) ? action : action.split(' '),
    actionSubType: Array.isArray(actionSubType)
      ? actionSubType
      : actionSubType.split(' '),
    offeringCategory: Array.isArray(offeringCategory)
      ? offeringCategory
      : offeringCategory.split(' '),
    offeringSubCategory: Array.isArray(offeringSubCategory)
      ? offeringSubCategory
      : offeringSubCategory.split(' '),
    paymentMethod: Array.isArray(paymentMethod)
      ? paymentMethod
      : paymentMethod.split(' '),
    flow: Array.isArray(flow) ? flow : flow.split(' '),
    interactionType: Array.isArray(interactionType)
      ? interactionType
      : interactionType.split(' '),
  };
};

const isDateString = (str) => {
  const date = new Date(str);
  return !isNaN(date) && date instanceof Date;
};
const isDate = (str) => {
  const _regExp = new RegExp(
    '^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$'
  );
  return _regExp.test(str);
};
const isNumericString = (str) => /^\d+$/.test(str);
export const formatTableCell = (data, header) => {
  let result = '';
  if (isNumericString(data)) {
    result = data;
  } else if (isDateString(data)) {
    if (header === 'startTime' || header === 'endTime') {
      result = moment(data).format('DD MMM YYYY hh:mm A');
    } else {
      if (isDate(data)) {
        result = moment(data).format('DD-MM-YYYY hh:mm');
      } else {
        const mappedData = UpperCase(convertToWordsWithSpaces(data));
        result = mappedData;
      }
    }
  } else {
    let value = data;
    value = value.includes('?') ? value.split('?')[0] : value;
    value = value.split('/').join(' | ');
    const mappedData = UpperCase(convertToWordsWithSpaces(value));
    result = mappedData;
  }

  return result;
};

export const authenticationSchema = (action, authSchemas) => {
  const authSchemaList =
    authSchemas?.authentication !== undefined
      ? authSchemas?.authentication
      : [];
  return authSchemaList.length > 0
    ? authSchemaList.find((schema) => schema.activity === action)
    : null;
};

export const checkAuthSkipPermission = (accessKey, permissions) =>
  permissions.includes(accessKey);

export const prepareFIlterFields = (masterData, fields = []) => {
  const queryFilterMaster = masterData?.searchQueryFilters || [];
  const result = {};
  fields.forEach((fieldName) => {
    const queryMaster = queryFilterMaster.find(
      (query) => query?.key === fieldName?.key
    );
    result[queryMaster.code] = fieldName?.value;
  });

  return result;
};

export const getDependentFieldType = (selectedType, masterData) => {
  const queryFilterMaster = masterData?.searchQueryFilters || [];
  const res =
    queryFilterMaster.length > 0
      ? queryFilterMaster.find((query) => query.key === selectedType)
      : { type: '' };
  if (res?.type === 'select') {
    const dropdownList = _.get(masterData, res?.masterDataPath, []);
    return { ...res, dropdownList };
  } else {
    return res;
  }
};

export const prepareTaskResponse = (responseData) => {
  const sourceData =
    responseData !== undefined && responseData !== null ? responseData : {};
  const transformedArray = Object.entries(sourceData).map(([key, value]) => ({
    name: key,
    value,
  }));
  return transformedArray;
};

export const prepareData = (masterList, reportData) => {
  const master = masterList?.orderReport;
  const mappedData = reportData.map((data) => {
    const mappedObject = {};
    master.forEach((masterItem) => {
      mappedObject[masterItem.name] = _.get(data, masterItem.path, '');
    });
    return mappedObject;
  });
  return mappedData;
};
