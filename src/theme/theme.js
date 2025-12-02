import { createTheme } from '@mui/material';

const primaryColor = '#FFCC00';
const mode = 'light';
const lightColor = '58, 53, 65'
const darkColor = '231, 227, 252'
const mainColor = mode === 'light' ? lightColor : darkColor
const theme = createTheme({
    palette: {
        common: {
            black: '#000',
            white: '#FFF'
        },
        customColors: {
            main: mainColor,
            primaryGradient: '#6ACDFF',
            tableHeaderBg: mode === 'light' ? '#F9FAFC' : '#3D3759'
        },
        warning: {
            main: primaryColor,
        },
        primary: {
            main: primaryColor,
        },
        inherit: {
            main: '#000000'
        },
        secondary: {
            main: '#ff000080',
        },
        Success: {
            main: '#4caf5080',
        },
        ResponseAwaited: {
            main: '#FFCC00',
        },
        Failure: {
            main: '#ff000080',
        },
        text: {
            main: '#000000',

        },
        background: {
            neutral: '#EDEDF5'
        },
        mode: 'light'
    },
    typography: {
        fontFamily: 'BrighterSansRegular, Roboto, sans-serif', // Customize the font family
        color: '#000000',
        // fontSize: 12,
        // lineHeight: 1.5 // Customize the base font size
        
    },
    overrides: {
        MuiIconButton: {
            root: {
                '&:hover': {
                    backgroundColor: '#FFCC00', // Replace with the desired hover color
                },
            },
        },
    },
    MuiPopover: {
        styleOverrides: {
            paper: {
                boxShadow: 'rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px',
                borderRadius: '10px',
                padding: '20px',
                transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                outline: '0px',
            },
        },
    },
    components: {
        MuiFormLabel: {
            styleOverrides: {
                asterisk: {
                    color: "#db3131",
                    "&$error": {
                        color: "#db3131",
                    },
                },
            },
        },
    },
    MuiTabs: {
        defaultProps: {
            textColor: 'inherit',
            allowScrollButtonsMobile: true,
            variant: 'scrollable',
        },
        styleOverrides: {
            scrollButtons: {
                width: 48,
                borderRadius: '50%',
            },
        },
    },
    MuiTab: {
        defaultProps: {
            disableRipple: true,
            iconPosition: 'start',
        },
        styleOverrides: {
            root: ({ ownerState }) => ({
                padding: 0,
                opacity: 1,
                minWidth: 48,
                fontWeight: theme.typography.fontWeightMedium,
                '&:not(:last-of-type)': {
                    marginRight: theme.spacing(3),
                    [theme.breakpoints.up('sm')]: {
                        marginRight: theme.spacing(5),
                    },
                },
                '&:not(.Mui-selected)': {
                    color: theme.palette.text.secondary,
                },
                ...((ownerState.iconPosition === 'start' || ownerState.iconPosition === 'end') && {
                    minHeight: 48,
                }),
            }),
        },
    },
});

export default theme;