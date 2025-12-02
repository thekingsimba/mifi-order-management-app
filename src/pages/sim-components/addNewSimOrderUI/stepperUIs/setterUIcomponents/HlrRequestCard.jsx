import { Box, CardContent, Typography } from '@mui/material';
import {
  FlexBoxSpaceBetween,
  HlrRequestCardContainer,
} from '../../../../../components/sim-styles/simStyles';
import EditIcon from '@mui/icons-material/Edit';
import KeyValueFormatter from './KeyValueFormatter';

function HlrRequestCard({
  title,
  titleIcon,
  allowAction,
  hlrRequested,
  editHlrRequestFn = () => {},
  excludedKeys = [],
  cardWidth = '48%',
  keyWidth = '150px',
}) {
  return (
    <HlrRequestCardContainer sx={{ width: cardWidth }}>
      <CardContent>
        <FlexBoxSpaceBetween>
          <Box>
            <Typography
              gutterBottom
              sx={{ fontSize: '20px' }}
              variant="h5"
              component="div"
            >
              {titleIcon}
              {title}
            </Typography>
          </Box>
          {allowAction && (
            <Box>
              <EditIcon
                sx={{ cursor: 'pointer', position: 'relative', right: '10px' }}
                onClick={() => editHlrRequestFn(hlrRequested)}
              />
            </Box>
          )}
        </FlexBoxSpaceBetween>
        <Box>
          <KeyValueFormatter
            minWidth={keyWidth}
            keyValueObject={hlrRequested}
            excludedKeys={excludedKeys}
          />
        </Box>
      </CardContent>
    </HlrRequestCardContainer>
  );
}

export default HlrRequestCard;
