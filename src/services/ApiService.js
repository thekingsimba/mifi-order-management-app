import { exchangeTokenWithRefreshToken } from '../auth/authService.js';
import config from '../config';
import http from './http-common';
let fileGeneratorApiUrl;
const resetFileGeneratorApiUrl = () => {
  fileGeneratorApiUrl =
    config.nodeEnv == 'development'
      ? config.devFileGeneratorApiUrl
      : config.prodFileGeneratorApiUrl;
};

let fileGeneratorWebSocketUrl;
export const getFileGeneratorWebSocketUrl = () => {
  fileGeneratorWebSocketUrl =
    config.nodeEnv == 'development'
      ? config.devFileGeneratorWebSocketUrl
      : config.prodFileGeneratorWebSocketUrl;
  return fileGeneratorWebSocketUrl;
};


export const apiErrorHandle = async (res, errorMessage) => {
  if (res && (res.status === 401 || res.status === 412)) {
    await exchangeTokenWithRefreshToken();
  }
  return { ...res, ...{ errorMessage } };
};

export const getSimOrderData = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-order`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM order data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const createSimTypes = async (data) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-type`;
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['createdBy'] = loggedInUser.fullname || '';
  try {
    const response = await http.post(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getSimTypes = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-type`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const updateSimTypes = async (data, seq_id) => {
  //console.log(data, " the data in update")

  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-type/${seq_id}`;
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['lastModifiedBy'] = loggedInUser.fullname || '';

  try {
    const response = await http.put(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    //console.log(error, " the error")
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const deleteSimTypes = async (id) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-type/${id}`;
  try {
    const response = await http.delete(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const createSimCategories = async (data) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-category`;
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['createdBy'] = loggedInUser.fullname || '';
  try {
    const response = await http.post(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getSimCategories = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-category`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const updateSimCategories = async (data, seq_id) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-category/${seq_id}`;
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['lastModifiedBy'] = loggedInUser.fullname || '';
  try {
    const response = await http.put(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const deleteSimCategories = async (id) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-category/${id}`;
  try {
    const response = await http.delete(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getSimConnectionTypes = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-connection-type`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    // console.log(response.data, " connection type list");
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const createSimConnectionTypes = async (data) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-connection-type`;
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['createdBy'] = loggedInUser.fullname || '';
  try {
    const response = await http.post(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const updateSimConnectionTypes = async (data, seq_id) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-connection-type/${seq_id}`;
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['lastModifiedBy'] = loggedInUser.fullname || '';
  try {
    const response = await http.put(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const deleteSimConnectionTypes = async (id) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-connection-type/${id}`;
  try {
    const response = await http.delete(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getSimHlrRequestMapping = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/simHlr-request-mapping`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    // console.log(response.data, " connection type list");
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const createSimHlrRequestMapping = async (data) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/simHlr-request-mapping`;
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['createdBy'] = loggedInUser.fullname || '';
  try {
    const response = await http.post(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const updateSimHlrRequestMapping = async (data, seq_id) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/simHlr-request-mapping/${seq_id}`;
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['lastModifiedBy'] = loggedInUser.fullname || '';
  try {
    const response = await http.put(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const deleteSimHlrRequestMapping = async (id) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/simHlr-request-mapping/${id}`;
  try {
    const response = await http.delete(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const simHlrRequestMappingSequenceID = async (id) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-requestmapping-sequenceId`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getSimPrefixes = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-prefix`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const createSimPrefixes = async (data) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['createdBy'] = loggedInUser.fullname || '';
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-prefix`;
  try {
    const response = await http.post(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const updateSimPrefixes = async (data, seq_id) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['lastModifiedBy'] = loggedInUser.fullname || '';
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-prefix/${seq_id}`;
  try {
    const response = await http.put(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const deleteSimPrefix = async (seq_id) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-prefix/${seq_id}`;

  try {
    const response = await http.delete(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getSimHRL = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-hlr`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const createSimHRLConfig = async (data) => {
  // console.log(data, " the data")
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-hlr`;
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['createdBy'] = loggedInUser.fullname || '';
  try {
    const response = await http.post(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    // console.log(response.data, " the response")
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const updateSimHRLConfig = async (data, seq_id) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['lastModifiedBy'] = loggedInUser.fullname || '';
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-hlr/${seq_id}`;
  try {
    const response = await http.put(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const deleteSimHRLConfig = async (seq_id) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-hlr/${seq_id}`;
  try {
    const response = await http.delete(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getHLRBatchMapping = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-batch-mapping`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const createHLRBatchMapping = async (data) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['createdBy'] = loggedInUser.fullname || '';
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-batch-mapping`;
  try {
    const response = await http.post(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const updateHLRBatchMapping = async (data, categorisationNumber) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['lastModifiedBy'] = loggedInUser.fullname || '';
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-batch-mapping/${categorisationNumber}`;
  try {
    const response = await http.put(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const deleteHLRBatchMapping = async (categorisationNumber) => {
  // console.log(categorisationNumber, ' the batch id');
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-batch-mapping/${categorisationNumber}`;
  try {
    const response = await http.delete(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getHLRImsiNumberRange = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-imsi-number-range`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getHLRImsiNumberRangeSequenceId = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-imsi-sequenceId`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const createHLRImsiNumberRange = async (data) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-imsi-number-range`;
  try {
    const response = await http.post(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const updateHLRImsiNumberRange = async (data, id) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-imsi-number-range/${id}`;
  try {
    const response = await http.put(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const deleteHLRImsiNumberRange = async (categorisationNumber) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-imsi-number-range/${categorisationNumber}`;
  try {
    const response = await http.delete(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getHLRSerialNumberRange = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-serial-number-range`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getHLRSerialNumberRangeSequenceId = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-serial-range-sequenceId`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const createHLRSerialNumberRange = async (data) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-serial-number-range`;
  try {
    const response = await http.post(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const updateHLRSerialNumberRange = async (data, id) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-serial-number-range/${id}`;
  try {
    const response = await http.put(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const deleteHLRSerialNumberRange = async (id) => {
  //console.log(id, " the id")
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-serial-number-range/${id}`;
  try {
    const response = await http.delete(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    console.log(response, ' the response for serial number delete');
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getHLRBatchNumberRange = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-batch-range`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getHLRBatchNumberRangeSequenceId = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-batchmapping-sequenceId`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const createHLRBatchNumberRange = async (data) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-batch-range`;
  try {
    const response = await http.post(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const updateHLRBatchNumberRange = async (data, id) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-batch-range/${id}`;
  try {
    const response = await http.put(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const deleteHLRBatchRange = async (seq_id) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-batch-range/${seq_id}`;
  try {
    const response = await http.delete(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getHLRBatchNumberRangeGenerator = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/batchNumberGenerator`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const createHLRBatchNumberGenerator = async (data) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/batchNumberGenerator`;
  try {
    const response = await http.post(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const updateHLRBatchNumberGenerator = async (data, id) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/batchNumberGenerator/${id}`;
  try {
    const response = await http.put(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const deleteHLRBatchGenerator = async (id) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-batch-number-range/${id}`;
  try {
    const response = await http.delete(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getHLRBatchMappingSequenceId = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlr-batchmapping-sequenceId`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getSimManufacturers = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-manufacturer`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const createSimManufacturers = async (data) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['createdBy'] = loggedInUser.fullname || '';
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-manufacturer`;
  try {
    const response = await http.post(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const updateSimManufacturers = async (data, seq_id) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['lastModifiedBy'] = loggedInUser.fullname || '';
  // console.log(seq_id, the )
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-manufacturer/${seq_id}`;
  try {
    const response = await http.put(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const deleteSimManufacturers = async (id) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-manufacturer/${id}`;
  try {
    const response = await http.delete(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getSimhlrByBatchNumberFilter = async (batchNumber) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/simhlr-by-batch-number-filter/${batchNumber}`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getSimhlrByBatchNumber = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/simhlr-by-batch-number`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const createSimhlrByBatchNumber = async (data) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['createdBy'] = loggedInUser.fullname || '';
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/simhlr-by-batch-number`;
  try {
    const response = await http.post(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const updateSimhlrByBatchNumber = async (data, batchNumber) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['lastModifiedBy'] = loggedInUser.fullname || '';
  //console.log(seq_id, the);
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/simhlr-by-batch-number/${batchNumber}`;
  try {
    const response = await http.put(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const deleteSimhlrByBatchNumber = async (batchNumber) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/simhlr-by-batch-number/${batchNumber}`;
  try {
    const response = await http.delete(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

// ========================================================================================

export const getSimConstantConfigSequenceId = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-constant-config-sequenceId`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getSimConstantConfig = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-constant-configuration`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

// "bsonObject": [
//     {
//         "filterKey" : "ObjectId",
//         "filterValue" : "%searchId%"
//     }
// ],

export const createSimConstantConfig = async (data) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['createdBy'] = loggedInUser.fullname || '';
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-constant-configuration`;
  try {
    const response = await http.post(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const updateSimConstantConfig = async (data, id) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['lastModifiedBy'] = loggedInUser.fullname || '';
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-constant-configuration/${id}`;
  try {
    const response = await http.put(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const deleteSimConstantConfig = async (id) => {
  //console.log(id, " the id in delete function")
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-constant-configuration/${id}`;
  try {
    const response = await http.delete(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    //console.log(response.data, " the response")
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const simOrderSearch = async (fieldName, fieldValue) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/search/${fieldName}/${fieldValue}`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    return await apiErrorHandle(error.response);
  }
};

export const simOrderDetails = async (seqId) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-order-details/${seqId}`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    return await apiErrorHandle(error.response);
  }
};

export const createSimOrder = async (data) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-order`;
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['createdBy'] = loggedInUser.fullname || '';
  try {
    const response = await http.post(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    return await apiErrorHandle(error.response);
  }
};

export const editSimOrder = async (data) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['lastModifiedBy'] = loggedInUser.fullname || '';
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-order/${data.seq_id}`;

  try {
    const response = await http.put(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    return await apiErrorHandle(error.response);
  }
};

export const editSimHLR = async (data) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-order/hrlId`;
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  data['lastModifiedBy'] = loggedInUser.fullname || '';
  try {
    const response = await http.put(apiUrl, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    return await apiErrorHandle(error.response);
  }
};

export const getCsOfferMasterData = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/TSATOffer/v1/csOfferMassterData`;

  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    return false;
  }
};

export const getCsOfferFormMasterSchema = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/TSATForm/v1/formMasterSchema`;

  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    return false;
  }
};

export const fetchTSATMasterData = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/tsat/v1/TSATMasterData`;

  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    return false;
  }
};

export const fetchDBOMasterData = async () => {
  const apiUrl = `${config.baseUrl}/bss-api/api/DCLM/v1/GetBackOfficeMasterData/`;

  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    return false;
  }
};

export const fetchMsisdnConfigData = async (code) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/msisdnOverview/v1/getMsisdnData/${code}`;

  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    return false;
  }
};

export const getTableBodyForTableView = async (additionalUrl) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/${additionalUrl}`;

  try {
    if (!additionalUrl) {
      return [];
    }

    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response.data;
  } catch (error) {
    return false;
  }
};

export const getCsSearchContent = async (searchId) => {
  const apiUrl = `${config.baseUrl}/rms-api/api/SimManager/v1/mockData?name=csOfferSearchData`;

  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    let choosenOffer = response.data.data.filter(
      (offer) => offer.code == searchId
    )[0];

    return choosenOffer;
  } catch (error) {
    return false;
  }
};

export const getOrderSequenceId = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/ordersequenceId`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getHLRSequenceId = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/hlrsequenceId`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getOfferOverviewData = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/SimManager/v1/mockData?name=tsatOverviewCardData`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getAllStateListData = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/SimManager/v1/mockData?name=allStateList`;

  try {
    const response = await http.get(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getAllCitiesListData = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/SimManager/v1/mockData?name=allCitiesList`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const uploadSimOrderOutfile = async (formData) => {
  resetFileGeneratorApiUrl();
  const apiUrl = `${fileGeneratorApiUrl}/sim-file-gen/api/file-generator/outfile/upload-ota-out-file/`;

  try {
    const response = await http.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response;
  } catch (error) {
    return await apiErrorHandle(error.response);
  }
};

export const uploadAllManufacturerFiles = async (formData) => {
  resetFileGeneratorApiUrl();
  const apiUrl = `${fileGeneratorApiUrl}/sim-file-gen/api/file-generator/outfile/upload-manufacturer-zip/`;

  try {
    const response = await http.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN') || ''}`,
      },
    });

    return response;
  } catch (error) {
    return await apiErrorHandle(error.response);
  }
};

export const buildTheCsvFileFromJson = async (formData) => {
  resetFileGeneratorApiUrl();
  const apiUrl = `${fileGeneratorApiUrl}/sim-file-gen/api/file-generator/json-to-csv/convert/`;

  try {
    const response = await http.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'blob',
    });

    return response;
  } catch (error) {
    return await apiErrorHandle(error.response);
  }
};

export const uploadOutfileCsvToRMS = async (formData) => {
  const apiUrl = `${config.baseUrl}/rms/bulk-processor/v1/rms-bulk/create/file`;

  try {
    const response = await http.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response;
  } catch (error) {
    console.log('RMS Error Response', error);
    return { data: null };
    //return await apiErrorHandle(error.response);
  }
};

export const getResourceDetails = async () => {
  const apiUrl = `${config.baseUrl}/rms/resource-inventory/v1/resource-category/?limit=500&offset=0`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });

    return response;
  } catch (error) {
    return await apiErrorHandle(error.response);
  }
};

export const initOrderInfile = async (orderId) => {
  resetFileGeneratorApiUrl();
  const apiUrl = `${fileGeneratorApiUrl}/sim-file-gen/api/file-generator/infile/${orderId}/`;

  try {
    const response = await http.get(apiUrl, {
      responseType: 'blob',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    return await apiErrorHandle(error.response);
  }
};

export const getSIMTypeSequenceID = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-type-sequenceId`;

  try {
    const response = await http.get(apiUrl, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getSIMCategorySequenceID = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-category-sequenceId`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getSIMConnectionTypeSequenceID = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-connection-type-sequenceId`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getSIMPrefixSequenceID = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-prefix-sequenceId`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};

export const getSIMManufacturerSequenceID = async () => {
  const apiUrl = `${config.baseUrl}/rms-api/api/sim-management/v1/sim-manufacturer-sequenceId`;
  try {
    const response = await http.get(apiUrl, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching SIM type data: ${error.response}`);
    return await apiErrorHandle(error.response);
  }
};
