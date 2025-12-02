import { styled } from '@mui/material/styles';
import {
  Switch,
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Tabs,
  Tab,
  TextField,
  Stack,
  Autocomplete,
  TableRow,
  TableCell,
} from '@mui/material';

//User index page component styles
export const UserIndexIconBox = styled(Box)(({ minimizetab }) => ({
  paddingLeft: `${minimizetab === 'true' ? '' : '0.5rem'}`,
  paddingRight: `${minimizetab === 'true' ? '' : '0.5rem'}`,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: `${minimizetab === 'true' ? 'center' : 'space-between'}`,
}));

export const UserIndexContainer = styled(Grid)(() => ({
  minHeight: '100vh',
}));

export const UserIndexGridItem = styled(Grid)(() => ({
  transition: 'all .2s ease-in',
}));

export const UserIndexPaper = styled(Paper)(({ minimizetab }) => ({
  position: 'relative',
  borderRadius: '0.5rem',
  paddingTop: '0.5rem',
  paddingBottom: '1rem',
  width: `${minimizetab === 'true' ? '80%' : ''}`,
  minHeight: '100vh',
}));

//table body styles
export const TableBodyRowChecked = styled(TableRow)(
  ({ theme, checkedrow }) => ({
    backgroundColor:
      checkedrow === 'true' ? `${theme.palette.primary.main}` : '',
  })
);

export const UserIndexRightPaper = styled(Paper)(() => ({
  borderRadius: '0.5rem',
  paddingBlock: '1rem',
  paddingInline: '1rem',
}));

export const UserIndexNavType = styled(Typography)(({ minimizetab }) => ({
  width: '70%',
  textAlign: 'center',
  display: `${minimizetab === 'true' ? 'none' : 'block'}`,
}));

export const UserIndexNavIconBtn = styled(IconButton)(({ minimizetab }) => ({
  marginRight: `${minimizetab === 'true' ? '' : '1rem'}`,
}));

// Users Left Navigation component styles
export const UserLeftNavTabs = styled(Tabs)(() => ({
  position: 'relative',
  width: '100%',
  height: '100vh',
}));

export const UserLeftNavTab = styled(Tab)(({ istabmini }) => ({
  display: `${istabmini === 'true' ? 'flex' : ''}`,
  flexDirection: `${istabmini === 'true' ? 'column' : ''}`,
}));

export const UserLeftNavTabText = styled(Typography)(({ istabmini }) => ({
  width: '100%',
  textAlign: `${istabmini === 'true' ? 'center' : 'left'}`,
}));

export const UserLeftNavSettingsTab = styled(Tab)(({ theme, istabmini }) => ({
  position: 'absolute',
  width: '100%',
  left: 0,
  bottom: 0,
  display: `${istabmini === 'true' ? 'flex' : ''}`,
  flexDirection: `${istabmini === 'true' ? 'column' : ''}`,
}));

// User and Role Mapping component styles
export const ManageUserAndRolesHeaderBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '2rem',
  gap: '2rem',
}));

export const ManageUserAndRolesHeaderIconBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
}));

export const FilterHeaderSelectField = styled(TextField)(() => ({
  width: '33.3%',
  marginTop: '-0.5rem',
}));

export const SearchSelectFieldBox = styled(Box)(() => ({
  width: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2rem',
}));

//user and role file component styles
export const DrawerInnerBox = styled(Box)(() => ({
  width: '100%',
  height: '95vh',
  overflowY: 'auto',
  position: 'relative',
}));

export const ManufacturerDrawerInnerBox = styled(Box)(() => ({
  width: '95vw',
  height: '95vh',
  margin: 'auto',
  overflowY: 'auto',
  position: 'relative',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

export const DrawerCloseBtnBox = styled(Box)(() => ({
  position: 'absolute',
  top: '1rem',
  right: '1rem',
}));

export const DrawerFormWrapper = styled(Box)(() => ({
  width: '100%',
  height: '100%',
}));

export const DrawerFilesDetailsWrapper = styled(Box)(() => ({
  width: '100%',
  height: '100%',
  // padding: '20px',
}));

export const DrawerForm = styled('form')(() => ({
  width: '60%',
  marginTop: '2rem',
  marginInline: 'auto',
  padding: '1rem',
  borderRadius: '1rem',
  backgroundColor: '#F7FCFE',
  paddingBottom: '4rem',
}));

export const DrawerFormPaperImage = styled(Paper)(() => ({
  padding: '1.5rem',
  borderRadius: '1rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'auto',
}));

export const DrawerFormPaper = styled(Paper)(() => ({
  padding: '1.5rem',
  borderRadius: '1rem',
  height: 'auto',
}));

export const DrawerFormBtnWrapper = styled(Stack)(() => ({
  justifyContent: 'space-between',
  paddingTop: '1.5rem',
}));

export const DrawerFormImageBoxWrapper = styled(Box)(() => ({
  position: 'relative',
  width: '12rem',
  height: '12rem',
  padding: '1rem',
  display: 'grid',
  placeItems: 'center',
  border: '1px dashed #e8e8e8',
  borderRadius: '50%',
}));

export const DrawerFileInput = styled('input')(() => ({
  width: '0.1px',
  height: '0.1px',
  opacity: '0',
  overflow: 'hidden',
  position: 'absolute',
  zIndex: '-1',
}));

export const ImageInputBox = styled('div')(() => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
}));

export const ImageErrorMessage = styled('div')(() => ({
  color: 'red',
  marginBottom: '1rem',
}));

export const InfoBox = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: '0.5rem',
}));

export const LabelIcon = styled('label')(() => ({
  width: 'auto',
  height: 'auto',
  borderRadius: '50%',
  cursor: 'pointer',
}));

export const DisplayImage = styled('img')(() => ({
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  objectFit: 'cover',
  objectPosition: 'center',
  cursor: 'pointer',
}));

export const PermissionsList = styled(Autocomplete)(() => ({
  margin: '0',
  width: '100%',
  height: 'auto',
  maxHeight: '10rem',
  overflowY: 'auto',
  padding: '0',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  backgroundColor: '#F7FCFE',
}));

export const PermissionsListItem = styled('div')(() => ({
  margin: '0',
  padding: '0',
}));

export const PaperBox = styled(Paper)(() => ({
  borderRadius: '0.5rem',
  paddingBlock: '1rem',
  paddingInline: '1rem',
  width: '90%',
  marginTop: '2rem',
  marginInline: 'auto',
}));

export const MaterialUISwitch = styled(Switch)(() => ({
  width: 55,
  height: 28,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundColor: 'green',
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: 'red',
    width: 24,
    height: 24,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundColor: 'red',
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
  },
}));

export const TableBodyCellWithAvatar = styled(TableCell)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  backgroundColor: 'transparent',
  gap: '0.5rem',
}));

//manage user and role mapping styles
export const PaperBoxUserAndRole = styled(Paper)(() => ({
  borderRadius: '0.5rem',
  paddingBlock: '1rem',
  paddingInline: '1rem',
  width: '100%',
  marginInline: 'auto',
}));

//manage user and role handler style
export const RemoveBtn = styled(IconButton)(() => ({
  position: 'absolute',
  top: '1rem',
  right: '-1rem',
}));

//settings view components styles

export const PaperContainer = styled(Paper)(({ theme }) => ({
  width: '60%',
  marginTop: '1rem',
  marginInline: 'auto',
  padding: '1rem',
  borderRadius: '.5rem',
}));
