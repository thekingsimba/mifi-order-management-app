import { Box, Tab, Tabs, Typography } from "@mui/material"; // Using Material-UI for Tabs
import React, { useState } from "react";
import AdvancedDynamicForm from "../DynamicForm/AdvancedDynamicForm";
import SimPreActivation from "../../pages/sim-management-pages/preActivation/SimPreActivation";

const tabData = [
  {
    label: "Automatic",
    content: <SimPreActivation name="config-three" />,
  },
  {
    label: "Manual",
    content: <SimPreActivation name="config-four" />,
  },
  {
    label: "Reserved",
    content: <SimPreActivation name="config-two" />,
  },
  {
    label: "Pattern Based",
    content: <SimPreActivation name="config-three" />,
  },
  
];

// Sub-tabs component to render inside a main tab (vertical)
const VerticalSubTabs = ({ subTabData }) => {
  const [activeSubTab, setActiveSubTab] = useState(0); // State for active sub-tab

  const handleSubTabChange = (event, newValue) => {
    setActiveSubTab(newValue); // Update active sub-tab
  };

  return (
    <Box display="flex">
      {/* Render vertical sub-tabs */}
      <Tabs
        orientation="vertical"
        value={activeSubTab}
        onChange={handleSubTabChange}
        scrollButtons="auto" // Automatically show scroll buttons when needed
        sx={{
          borderRight: 1,
          borderColor: "divider",
          minWidth: "150px",
        }} // Add maxHeight for
      >
        {subTabData.map((subTab, index) => (
          <Tab key={index} label={subTab.label} />
        ))}
      </Tabs>

      <Box p={3}>
        {subTabData.map((subTab, index) => (
          <div key={index} role="tabpanel" hidden={activeSubTab !== index}>
            {activeSubTab === index && (
              <Typography>{subTab.content}</Typography>
            )}
          </div>
        ))}
      </Box>
    </Box>
  );
};

// Main Tabs Component (vertical)
const DynamicTabs = () => {
  const [activeTab, setActiveTab] = useState(0); // State for active main tab

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue); // Update active main tab
  };

  return (
    <Box sx={{ width: 'calc(100vw - 200px)' }} display="flex">
      {/* Render vertical main tabs */}
      <Tabs
        orientation="vertical"
        value={activeTab}
        onChange={handleTabChange}
        scrollButtons="auto" // Automatically show scroll buttons when needed
        sx={{
          borderRight: 1,
          borderColor: 'divider',
          minWidth: '150px',
        }} // Add maxHeight for
      >
        {tabData.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      {/* Render sub-tabs or content for the active main tab */}
      <Box p={3}>
        {tabData.map((tab, index) => (
          <div key={index} role="tabpanel" hidden={activeTab !== index}>
            {activeTab === index && (
              <Box>
                {/* If there are sub-tabs, render them */}
                {tab.subTabs ? (
                  <VerticalSubTabs subTabData={tab.subTabs} />
                ) : (
                  <Typography>{tab.content}</Typography>
                )}
              </Box>
            )}
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default DynamicTabs;
