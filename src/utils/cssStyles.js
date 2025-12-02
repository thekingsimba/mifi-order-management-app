// @mui
import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function bgBlur(props) {
    const color = props?.color || '#000000';
    const blur = props?.blur || 6;
    const opacity = props?.opacity || 0.8;


    return {
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: alpha(color, opacity),
    };
}

// ----------------------------------------------------------------------

export function bgGradient(props) {
    const direction = props?.direction || 'to bottom';
    const startColor = props?.startColor;
    const endColor = props?.endColor;
    return {
        background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
    };
}

// ----------------------------------------------------------------------

export function textGradient(value) {
    return {
        background: `-webkit-linear-gradient(${value})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    };
}

// ----------------------------------------------------------------------

export function filterStyles(value) {
    return {
        filter: value,
        WebkitFilter: value,
        MozFilter: value,
    };
}

// ----------------------------------------------------------------------

export const hideScrollbarY = {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
        display: 'none',
    },
};

// ----------------------------------------------------------------------

export const hideScrollbarX = {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowX: 'scroll',
    '&::-webkit-scrollbar': {
        display: 'none',
    },
};
