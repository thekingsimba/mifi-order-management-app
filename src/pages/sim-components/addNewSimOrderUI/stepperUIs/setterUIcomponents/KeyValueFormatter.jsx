import { Box, Typography } from '@mui/material';
import { formatStringFromCamelCase } from '../../../../sim-management-utils/sim-management-utils';
import { FlexBox } from '../../../../../components/sim-styles/simStyles';

const KeyValueFormatter = ({
  keyValueObject,
  excludedKeys,
  minWidth = '150px',
}) => {
  return Object.keys(keyValueObject)
    .filter((key) => !excludedKeys.includes(key))
    .map((objectKey, index) => (
      <FlexBox sx={{ marginBottom: '5px' }} key={objectKey + index}>
        <Box>
          <Typography
            variant="body2"
            sx={{
              display: 'inline-block',
              minWidth: `${minWidth}`,
              mr: 2,
              color: 'text.secondary',
            }}
          >
            <b>
              {formatStringFromCamelCase(objectKey)} {' :'}
            </b>
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ display: 'inline-block' }}>
            {keyValueObject[objectKey]}
          </Typography>
        </Box>
      </FlexBox>
    ));
};

export default KeyValueFormatter;
