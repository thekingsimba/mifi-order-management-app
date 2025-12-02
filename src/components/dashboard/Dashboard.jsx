import React from 'react';
import PropTypes from 'prop-types';
import DashboardView from './DashboardView';

const Dashboard = ({ data }) => <DashboardView data={data} />

Dashboard.propTypes = {
  data: PropTypes.object,
};

Dashboard.defaultProps = {
  data: {},
};
export default Dashboard;
