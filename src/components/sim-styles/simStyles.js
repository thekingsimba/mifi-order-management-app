import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Switch,
  Tab,
  TableCell,
  TableRow,
  Tabs,
  TextField,
  Card,
  Typography,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import useWindowSize from '../../hooks/useWindowsSize';

//Sim index page component styles
export const SimIndexIconBox = styled(Box)(({ minimizetab }) => ({
  paddingLeft: `${minimizetab === 'true' ? '' : '0.5rem'}`,
  paddingRight: `${minimizetab === 'true' ? '' : '0.5rem'}`,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: `${minimizetab === 'true' ? 'center' : 'space-between'}`,
}));

export const SimIndexContainer = styled(Grid)(() => ({
  minHeight: '100vh',
  marginBottom: '50px',
}));

export const SimIndexGridItem = styled(Grid)(() => ({
  transition: 'all .2s ease-in',
}));

export const SimIndexPaper = styled(Paper)(({ minimizetab }) => ({
  position: 'relative',
  borderRadius: '0.5rem',
  paddingTop: '0.5rem',
  paddingBottom: '1rem',
  width: `${minimizetab === 'true' ? '80%' : ''}`,
  minHeight: '100vh',
}));

//table body styles
export const TableBodyRowChecked = styled(TableRow)(({ checkedrow }) => {
  const theme = useTheme();
  return {
    backgroundColor:
      checkedrow === 'true' ? `${theme.palette.primary.main}` : '',
  };
});

export const SimIndexRightPaper = styled(Paper)(() => ({
  borderRadius: '0.5rem',
  paddingBlock: '1rem',
  paddingInline: '1rem',
}));

export const OverviewIndexRightPaper = styled(Paper)(() => ({
  borderRadius: '0.5rem',
  paddingBlock: '1rem',
  paddingInline: '1rem',
  marginInline: '1rem',
  marginTop: '5rem',
}));

export const SimIndexNavType = styled(Typography)(({ minimizetab }) => ({
  width: '70%',
  textAlign: 'center',
  display: `${minimizetab === 'true' ? 'none' : 'block'}`,
}));

export const SimIndexNavIconBtn = styled(IconButton)(({ minimizetab }) => ({
  marginRight: `${minimizetab === 'true' ? '' : '1rem'}`,
}));

// Sims Left Navigation component styles
export const SimLeftNavTabs = styled(Tabs)(() => ({
  position: 'relative',
  width: '100%',
  height: '100vh',
}));

// Sim and Role Mapping component styles
export const ManageSimPageHeaderBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '2rem',
  gap: '2rem',
}));

export const InfileManagerBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '2rem',
  gap: '2rem',
  padding: '0 10px',
}));

export const OutFileManagerBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '2rem',
  gap: '2rem',
  padding: '0 10px',
}));

const offset = 220;

export const MainTableHeaderWrapper = styled(Box)(() => {
  const { width } = useWindowSize();

  const allTableRowItemSize = width - offset;

  return {
    width: `${allTableRowItemSize}px`,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
  };
});

export const MainTableRowWrapper = styled(Box)(() => {
  const { width } = useWindowSize();

  const allTableRowItemSize = width - offset;

  return {
    width: `${allTableRowItemSize}px`,
    display: 'flex',
    alignItems: 'center',
  };
});

export const TableRowDetailsWrapper = styled(Box)(() => ({
  // display: 'flex',
  border: '2px dashed #1976D2',
  borderTop: 'none',
  padding: '10px 75px 10px 125px',
  marginBottom: '75px',
}));

export const MainHeaderTableRowItem = styled(Box)(({ numberofrow }) => {
  const { width } = useWindowSize();
  const theme = useTheme();

  const allTableRowItemSize = width - offset;

  const singleTableRowItemSize = allTableRowItemSize / numberofrow;

  const rationalFontSize = 16 - ((numberofrow - 7) * 3) / 7;

  const finalFontSize = numberofrow <= 7 ? `16px` : `${rationalFontSize}px`;

  // console.log(finalFontSize)

  return {
    flex: `0 0 ${singleTableRowItemSize}px`,
    height: '70px',
    backgroundColor: '#E8E8E8',
    padding: '15px 0 0 0',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    fontWeight: 'bold',
    fontFamily: `${theme.typography.fontFamily}`,
    textAlign: 'center',
    fontSize: `${finalFontSize}`,
    // fontSize:`13px`,
    // overflow: 'hidden',
    // webkitBoxOrient: 'vertical',
    // webkitLineClamp: 3,
    // textOverflow: 'ellipsis',
    // wordWrap: 'break-word',
    // overflowWrap: 'break-word',
    // display: '-webkit-box',
  };
});

// flex: `0 0 ${singleTableRowItemSize}px`,
// height: '70px',
// display: 'flex',
// justifyContent: 'center',
// alignItems: 'center',
// border: '1px solid #ccc',
// boxSizing: 'border-box',
// overflow: 'hidden',
// textOverflow: 'ellipsis',
// whiteSpace: 'nowrap',
// fontFamily: `${theme.typography.fontFamily}`,

export const TableRowItem = styled(Box)(({ numberofrow }) => {
  const { width } = useWindowSize();
  const theme = useTheme();

  const allTableRowItemSize = width - offset;

  const singleTableRowItemSize = allTableRowItemSize / numberofrow;

  return {
    flex: `0 0 ${singleTableRowItemSize}px`,
    height: '70px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontFamily: `${theme.typography.fontFamily}`,
  };
});

export const HeaderExpenderCell = styled(Box)(() => {
  const theme = useTheme();
  return {
    flex: '0 0 70px',
    height: '70px',
    backgroundColor: '#E8E8E8',
    paddingTop: '12px',
    display: 'flex',
    fontWeight: 'bold',
    justifyContent: 'center',
    //alignItems: 'center',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    fontFamily: `${theme.typography.fontFamily}`,
  };
});

export const ExpenderCell = styled(Box)(() => ({
  flex: '0 0 70px',
  height: '70px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid #ccc',
  boxSizing: 'border-box',
}));

export const ManageSimTableSettingIconBox = styled(Box)(() => ({
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

//Sim and role file component styles
export const DrawerInnerBox = styled(Box)(() => ({
  width: '100%',
  height: '95vh',
  overflowY: 'auto',
  position: 'relative',
}));

export const DrawerCloseBtnBox = styled(Box)(() => ({
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  zIndex: 2,
}));

export const DrawerFormWrapper = styled(Box)(() => ({
  width: '100%',
  height: '100%',
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

//manage Sim and role mapping styles
export const PaperBoxSimAndRole = styled(Paper)(() => ({
  borderRadius: '0.5rem',
  paddingBlock: '1rem',
  paddingInline: '1rem',
  width: '100%',
  marginInline: 'auto',
}));

//manage Sim and role handler style
export const RemoveBtn = styled(IconButton)(() => ({
  position: 'absolute',
  top: '1rem',
  right: '-1rem',
}));

//settings view components styles

export const PaperContainer = styled(Paper)(() => ({
  width: '60%',
  marginTop: '1rem',
  marginInline: 'auto',
  padding: '1rem',
  borderRadius: '.5rem',
}));

export const SidebarContainer = styled('div')(() => ({
  display: 'flex',
  position: 'relative',
}));

export const Sidebar = styled('div')(() => ({
  listStyleType: 'none',
  margin: 0,
  padding: 0,
  width: '86px',
  backgroundColor: '#fff',
  height: 'calc(100vh - 80px)',
}));

export const SidebarButtonContainer = styled(Button)(({ active }) => ({
  background: active.toString() == 'true' ? '#FFCC00' : null,
  color: '#161237',
  borderRadius: '0px',
  paddingBlock: '8px',
  width: '86px',
  '&:hover': {
    background: '#E1BB3F',
    color: 'white',
  },
}));

export const SidebarLabel = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: '13px',
}));

export const SidebarItemContainer = styled('div')(() => ({
  position: 'relative',
}));

export const HoverBox = styled('div')(({ hoveredItemTop }) => ({
  zIndex: 10,
  position: 'absolute',
  top: `${hoveredItemTop}px!important`,
  left: '86px',
  width: '200px',
  backgroundColor: '#f8f8f8',
  border: '1px solid #ccc',
  padding: '5px',
  transition: 'border-color 0.3s ease',
}));

export const HoverBoxItem = styled('div')(({ theme }) => ({
  padding: '10px',
  backgroundColor: '#fff',
  fontFamily: `${theme.typography.fontFamily}`,
  borderBottom: '1px solid #eee',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const MainSpaceContainer = styled('div')(() => ({
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  height: 'calc(100vh - 80px)',
  overflow: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

export const AllSimOrderContainer = styled('div')(() => ({
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  overflow: 'scroll',
  // '&::-webkit-scrollbar': {
  //   display: 'none',
  // },
}));

export const OtaOutFileContainer = styled('div')(() => ({
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  overflow: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

export const SimConfigContainer = styled(Grid)(() => ({
  minHeight: '100vh',
  width: 'calc(100vw - 80px)',
  marginBottom: '50px',
}));

export const SimConfigPaper = styled(Paper)(() => ({
  borderRadius: '0.5rem',
  paddingBlock: '1rem',
  paddingInline: '1rem',
}));

export const RangeNumberSummary = styled(Box)(() => ({
  width: '385px',
}));

export const AddHlrCard = styled(Box)(() => ({
  width: '100%',
}));

export const HlrRequestPaper = styled(Paper)(() => ({
  borderRadius: '0.5rem',
  paddingBlock: '1.5rem',
  paddingInline: '1rem',
}));

export const SimConfigGridItem = styled(Grid)(() => ({
  transition: 'all .2s ease-in',
}));

export const ConfigMenuBox = styled(Box)(() => {
  const theme = useTheme();
  return {
    backgroundColor: `${theme.palette.primary.contrastText}`,
    marginTop: '20px',
    marginBottom: '10px',
    borderRadius: '8px',
    padding: '15px',
  };
});
export const RangeMappingTabs = styled(Tab)(() => {
  const theme = useTheme();
  return {
    '&.Mui-selected': {
      backgroundColor: `${theme.palette.primary.contrastText}`,
    },
  };
});

export const HlrRequestCardContainer = styled(Card)(() => {
  const theme = useTheme();
  return {
    backgroundColor: `${theme.palette.grey[200]}`,
  };
});

export const RangeSummaryCardContainer = styled(Card)(() => {
  const theme = useTheme();
  return {
    backgroundColor: `${theme.palette.info.contrastText}`,
    minHeight: '370px',
  };
});

export const DataSavingCardContainer = styled(Card)(() => {
  return {
    width: '30%',
    minHeight: '200px',
  };
});

export const InfileDownloadCardContainer = styled(Box)(() => {
  return {
    minHeight: '200px',
    width: '70%',
    padding: '10px',
  };
});

export const AddHlrCardContainer = styled(Card)(() => {
  const theme = useTheme();
  return {
    minHeight: '285px',
    backgroundColor: `${theme.palette.info.contrastText}`,
  };
});

export const StepperContent = styled(Box)(() => {
  return {
    height: 'calc(100vh - 180px)',
  };
});

export const StepperNavigation = styled(Box)(() => {
  return {
    marginTop: '15px',
    width: '100%',
    height: '50px',
  };
});
export const FlexBoxSpaceBetween = styled(Box)(() => {
  return {
    display: 'flex',
    justifyContent: 'space-between',
  };
});

export const ValidInfoBox = styled(Box)(() => {
  return {
    padding: '2px 4px',
    marginRight: '10px',
    border: '1px solid transparent',
    borderRadius: '5px',
  };
});

export const ColoredFlexBoxSpaceBetween = styled(Box)(({ theme }) => {
  return {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.primary.contrastText,
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
  };
});

export const FlexBox = styled(Box)(() => {
  return {
    display: 'flex',
  };
});

export const CancelText = styled(Typography)(({ theme }) => {
  return {
    color: `${theme.palette.error.main}`,
    cursor: 'pointer',
  };
});
export const RangeNumberDetailsCardBox = styled(Box)(({ theme }) => {
  return {
    marginBottom: '10px',
    borderRadius: '5px',
    padding: '5px',
  };
});