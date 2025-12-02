import React, { useState, useEffect, useRef } from "react";
import DynamicForm from "./DynamicForm";
import formConfig from "./formConfig";
import _get from "lodash/get";
import axios from "axios";

const Wrapper = React.memo(({ name = "", masterData = {}, apiConfig = {} }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dynamicConfig, setDynamicConfig] = useState(
    formConfig[name]?.map((item) => ({ ...item, apiFetched: false })) || []
  );
  const apiCache = useRef({});

  const interpolatePayload = (payload) => {
    const strPayload = JSON.stringify(payload);
    return JSON.parse(
      Object.keys(apiConfig).reduce(
        (acc, key) => acc.replace(new RegExp(`\\{${key}\\}`, "g"), apiConfig[key] || ""),
        strPayload
      )
    );
  };

  const fetchData = async ({ url, method = "GET", payload }) => {
    const cacheKey = `${url}-${method}`;
    if (apiCache.current[cacheKey]) {
      return apiCache.current[cacheKey];
    }
    setLoading(true);
    try {
      if (method === "POST" && payload) {
        payload = interpolatePayload(payload);
      }
      const response = await axios({ url, method, data: payload });
      apiCache.current[cacheKey] = response.data; // Cache the API response
      return response.data;
    } catch (error) {
      setError("Failed to fetch data");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const prepareMasterOptions = (el) => {
    const { path, valuePath, labelPath } = el?.source?.masterData || {};
    return _get(masterData, path, []).map((item) => ({
      value: _get(item, valuePath),
      label: _get(item, labelPath),
    }));
  };

  const buildOptions = async () => {
    let updatedConfig = [...dynamicConfig];
    let needsUpdate = false;

    // Handle masterData options
    updatedConfig = updatedConfig.map((el) => {
      if (el?.source?.masterData && !el.options) {
        el.options = prepareMasterOptions(el);
        needsUpdate = true;
      }
      return el;
    });

    // Handle API options
    const apiCalls = updatedConfig
      .filter((el) => el?.source?.api && !el.apiFetched)
      .map(async (el) => {
        const fetchedData = await fetchData(el.source.api);
        if (fetchedData) {
          const { path, valuePath, labelPath } = el.source.api;
          el.options = _get(fetchedData, path, []).map((item) => ({
            value: _get(item, valuePath),
            label: _get(item, labelPath),
          }));
          el.apiFetched = true;
          needsUpdate = true;
        }
        return el;
      });

    // Await all API calls in parallel
    await Promise.all(apiCalls);

    if (needsUpdate) {
      setDynamicConfig(updatedConfig); // Only update if options have changed
    }
  };

  useEffect(() => {
    if (name) buildOptions(); // Only run if `name` is provided
  }, [name]); // Re-run only when the `name` changes

  if (!name) return null;

  const defaultValues = dynamicConfig.reduce((values, field) => {
    values[field.name] = field.type === "checkbox" 
      ? field.default || false 
      : field.type === "number" 
        ? null 
        : field.type === "multiselect" 
          ? [] 
          : field.default || "";
    return values;
  }, {});
console.log(dynamicConfig,'dynamicConfig')
  return loading ? <div>Loading...</div> : error ? <div>Error: {error}</div> : <DynamicForm defaultValues={defaultValues} config={dynamicConfig} />;
});

export default Wrapper;
