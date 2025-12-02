import PropTypes from 'prop-types';
import { Route, Routes as Switch } from 'react-router-dom';
import CardLayout from '../cardLayout/CardLayout';

const DashboardView = ({ data }) => {
  return (
    <Switch>
      <Route path="/" element={<CardLayout data={data} />} />
    </Switch>
  );
};

DashboardView.propTypes = {
  data: PropTypes.object.isRequired,
};

export default DashboardView;
