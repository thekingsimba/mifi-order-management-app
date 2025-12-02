import Paper from '@mui/material/Paper';
import { Typography, Box, Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

import { splitArray } from '../../pages/sim-management-utils/sim-management-utils';
import { formatStringFromCamelCase } from '../../pages/sim-management-utils/sim-management-utils';

function ObjectDataCard({ cardDataObject, children }) {
  const [cardData = [], setCardData] = useState({});

  const setCardLabelAndKeys = (keyValueOject) => {
    return Object.keys(keyValueOject)
      .filter((key) => keyValueOject[key])
      .map((key) => {
        return {
          label: formatStringFromCamelCase(key),
          key,
        };
      });
  };

  const splitCardDetails = () => {
    const cardDetailsKeyLabel = setCardLabelAndKeys(cardDataObject);

    const cardData = splitArray(cardDetailsKeyLabel);
    setCardData(cardData);
  };

  useEffect(() => {
    splitCardDetails();
  }, []);

  return (
    <Paper sx={{ marginTop: '30px', width: '90%', marginInline: 'auto' }}>
      <Box
        sx={{
          padding: '10px 0 0 0',
        }}
      >
        {children}
        <Grid
          sx={{ marginBottom: 2 }}
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Grid item xs={12} sm={6} md={6}>
            <Box component="section" sx={{ p: 2 }}>
              {cardData?.firstGridData?.length &&
                cardData?.firstGridData?.map((element, index) => (
                  <Row
                    label={element.label}
                    value={cardDataObject[element.key]}
                    key={element.label + index}
                  />
                ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Box component="section" sx={{ p: 2 }}>
              {cardData?.secondGridData?.length &&
                cardData?.secondGridData?.map((element, index) => (
                  <Row
                    label={element.label}
                    value={cardDataObject[element.key]}
                    key={element.label + index}
                  />
                ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default ObjectDataCard;

function Row({ label, value = '' }) {
  return (
    <Stack
      direction="row"
      sx={{ typography: 'caption', textTransform: 'capitalize' }}
    >
      <Box
        component="span"
        sx={{
          minWidth: 200,
          mr: 2,
        }}
      >
        <Typography
          sx={{
            lineHeight: 2,
            fontWeight: 'bold',
          }}
        >
          {label}
          {' :'}
        </Typography>
      </Box>

      <Typography
        sx={{
          lineHeight: 2,
        }}
      >
        {value}{' '}
      </Typography>
    </Stack>
  );
}
