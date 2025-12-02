let masterData = {
  dclm: {
    gender: [
      { code: "male", name: "Male" },
      { code: "female", name: "Female" },
      { code: "others", name: "Others" },
    ],
    country: [
      { value: "", label: "Select your country", state: [] },
      {
        value: "usa",
        label: "United States",
        state: [
          {
            value: "california",
            label: "California",
            city: [
              { value: "los_angeles", label: "Los Angeles" },
              { value: "san_francisco", label: "San Francisco" },
            ],
          },
          {
            value: "texas",
            label: "Texas",
            city: [
              { value: "houston", label: "Houston" },
              { value: "austin", label: "Austin" },
            ],
          },
        ],
      },
      {
        value: "canada",
        label: "Canada",
        state: [
          {
            value: "ontario",
            label: "Ontario",
            city: [
              { value: "toronto", label: "Toronto" },
              { value: "ottawa", label: "Ottawa" },
            ],
          },
          {
            value: "quebec",
            label: "Quebec",
            city: [
              { value: "montreal", label: "Montreal" },
              { value: "quebec_city", label: "Quebec City" },
            ],
          },
        ],
      },
    ],
  },
};
export default masterData;
