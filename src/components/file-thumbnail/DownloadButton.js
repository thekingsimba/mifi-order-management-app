
import { useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import CustomSvgIcon from 'components/CustomSvgIcon';

export default function DownloadButton({ onDownload }) {
  const theme = useTheme();

  return (
    <IconButton
      // color="inherit"
      onClick={onDownload}
      sx={{
        p: 0,
        top: 0,
        right: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        opacity: 0,
        position: 'absolute',
        borderRadius: 'unset',
        // color: 'common.white',
        justifyContent: 'center',
        bgcolor: 'grey.800',
        color: 'common.white',
        transition: theme.transitions.create('opacity'),

        '&:hover': {
          opacity: 0.64,
        },
      }}
    >
      <CustomSvgIcon icon="download" width={20} />
    </IconButton>
  );
}
