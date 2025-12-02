/* eslint-disable react/prop-types */
import { Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Visible from '../../common/visible/Visible';
import MenuBar from '../subMenus/MenuBar';

export default function ContentWrapper({ menus = [] }) {
  return (
    <Visible
      when={!!menus.length}
      otherwise={
        <Grid container direction="row" spacing={4}>
          <Grid item xs={12}>
            <DynamicCard menus={menus} />
          </Grid>
        </Grid>
      }
    >
      <Grid container direction="row" spacing={4}>
        <Grid item xs={3}>
          <MenuBar menuItems={menus} />
        </Grid>
        <Grid item xs={9}>
          <DynamicCard menus={menus} />
        </Grid>
      </Grid>
    </Visible>
  );
}

const DynamicCard = ({ menus }) => {
  const location = useLocation();
  let label = '';

  const component = menus.map(
    (item) =>
      item.children?.find((item) => item?.path == location?.pathname)?.component
  );

  const label_one = menus?.map((item) => item?.children);
  const correctLabel = label_one.map(
    (item, index) =>
      label_one[index]?.find((item) => item?.path == location?.pathname)?.label
  );
  label = menus.find((item) => item?.path == location?.pathname)?.label;
  const sendLabel = label ? label : correctLabel;
  const parentComponent = menus?.find(
    (item) => item?.path == location?.pathname
  )?.component;
  const correctComponent = parentComponent
    ? parentComponent
    : component.length
    ? component[0]
    : null;

  return (
    <Grid container direction="column" justifyContent="space-between">
      <Grid item>{sendLabel}</Grid>
      <Grid item>{correctComponent ? correctComponent : null}</Grid>
    </Grid>
  );
};


