import { Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HoverBox,
  HoverBoxItem,
  Sidebar,
  SidebarButtonContainer,
  SidebarContainer,
  SidebarItemContainer,
  SidebarLabel,
} from '../components/sim-styles/simStyles';

import CreditScoreIcon from '@mui/icons-material/CreditScore';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import SimCardIcon from '@mui/icons-material/SimCard';

const SidebarWithChildrenBox = ({ menuItems = [] }) => {
  //console.log(menuItems);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [parentPath, setParentPath] = useState('/');
  const [validMenuItem, setValidMenuItem] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Track the top offset of the hovered item
  const [hoveredItemTop, setHoveredItemTop] = useState(0);

  const navigateTo = (e, path) => {
    e.preventDefault();
    navigate(`${path}`);
  };

  const handleClick = (e, path, children = []) => {
    if (children.length) {
      return;
    }
    setParentPath(path);
    navigateTo(e, path);
  };

  const handleChildNavigation = (childPath, parentPath) => {
    setParentPath(parentPath);
    navigate(`${childPath}`);
  };

  const sidebarRef = useRef(null); // Reference to the sidebar

  const handleMouseEnter = (index, event) => {
    setHoveredItem(index);
    const itemTop = event.target.offsetTop;

    setHoveredItemTop(itemTop);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  useEffect(() => {
    const currentPath = `${location.pathname}`;
    setParentPath(currentPath);
    const validMenuItem = menuItems.filter((item) => item.hasPermission);
    // console.log(validMenuItem);
    setValidMenuItem(validMenuItem);
  }, [parentPath, location.pathname]);

  if (menuItems.length) {
    const showSideBar = menuItems.some((item) => item.hasPermission);
    if (!showSideBar) {
      return null;
    }
  }

  return (
    <SidebarContainer ref={sidebarRef}>
      {validMenuItem.length > 2 && (
        <Sidebar>
          {validMenuItem.map(
            (
              {
                path = '',
                icon = '',
                label = '',
                children = [],
                isMenuItem = false,
                hasPermission = false,
              },
              index
            ) => {
              return (
                isMenuItem &&
                hasPermission && (
                  <SidebarItemContainer
                    onMouseEnter={(e) => handleMouseEnter(index, e)}
                    onMouseLeave={handleMouseLeave}
                    key={path}
                  >
                    {/* Parent Item */}
                    <SidebarButtonContainer
                      onClick={(e) => handleClick(e, path, children)}
                      key={path}
                      active={parentPath.startsWith(path) ? 'true' : 'false'}
                    >
                      <Stack alignItems="center">
                        {IconMatching(icon)}
                        <SidebarLabel variant="body2">{label}</SidebarLabel>
                      </Stack>
                    </SidebarButtonContainer>

                    {hoveredItem === index && children.length > 0 && (
                      <HoverBox hoveredItemTop={hoveredItemTop}>
                        {children.map(
                          (child, i) =>
                            child.isSubMenuItem && (
                              <HoverBoxItem
                                key={i}
                                onClick={() =>
                                  handleChildNavigation(child.path, path)
                                }
                              >
                                {/* {icon}  */}
                                <>{child.label}</>
                              </HoverBoxItem>
                            )
                        )}
                      </HoverBox>
                    )}
                  </SidebarItemContainer>
                )
              );
            }
          )}
        </Sidebar>
      )}
    </SidebarContainer>
  );
};

export default SidebarWithChildrenBox;

const IconMatching = (iconName) => {
  let iconToRender;

  switch (iconName) {
    case 'CreditScoreIcon':
      iconToRender = <CreditScoreIcon sx={{ height: 23, width: 20 }} />;
      break;

    case 'MiscellaneousServicesIcon':
      iconToRender = (
        <MiscellaneousServicesIcon sx={{ height: 23, width: 20 }} />
      );
      break;

    case 'SimCardIcon':
      iconToRender = <SimCardIcon sx={{ height: 23, width: 20 }} />;
      break;
  }

  return iconToRender;
};
