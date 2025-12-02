import { Button, Stack, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SideMenu = ({ menus = [] }) => {
  const [parentPath, setParentPath] = useState('/');
  const navigate = useNavigate();
  const navigateTo = (e, path) => {
    e.preventDefault();
    navigate(`${path}`);
  };
  const handleClick = (e, path, children = []) => {
    if (children.length) {
      return;
    }
    navigateTo(e, path);
    setParentPath(path);
  };
  return (
    <StackContainer direction="column" textAlign="center">
      {menus.map(({ path = '', icon = '', label = '', children = [] }) => (
        <ButtonContainer
          onClick={(e) => handleClick(e, path, children)}
          key={path}
          isactive={parentPath == path ? 'true' : 'false'}
        >
          <Stack alignItems="center">
            {icon}
            <Label variant="body2">{label}</Label>
          </Stack>
        </ButtonContainer>
      ))}
    </StackContainer>
  );
};

export default SideMenu;

SideMenu.propTypes = {
  menus: PropTypes.array.isRequired,
};

const ButtonContainer = styled(Button)(({ isactive }) => ({
  background: isactive.toString() == 'true' ? '#FFCC00' : null,
  color: '#161237',
  borderRadius: '0px',
  paddingBlock: '8px',
  '&:hover': {
    background: '#E1BB3F',
    color: 'white',
  },
}));
const Label = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: '13px',
}));
const StackContainer = styled(Stack)(() => ({
  width: '86px',
  background: 'white',
  height: '100%',
}));
