import { Box, Button, CardContent, Typography } from '@mui/material';
import {
  ColoredFlexBoxSpaceBetween,
  RangeNumberDetailsCardBox,
  RangeNumberSummary,
  RangeSummaryCardContainer,
} from '../../../../../components/sim-styles/simStyles';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { useEffect, useState } from 'react';
import KeyValueFormatter from './KeyValueFormatter';
import { UDCHLR } from 'src/pages/appConfigPage/SimManagementTableFormUI/configTitleConstant';
import { addPrefix } from 'src/pages/sim-management-utils/sim-management-utils';

export default function RangeNumberSummaryCard({
  imsiNbRange = [],
  serialNbRange = [],
  batchNumberRange = [],
  hlrFur = '',
}) {
  const [currentTitle, setCurrentTitle] = useState('IMSI');
  const [summaryTitle, setSummaryTitle] = useState([]);
  const titleList = ['IMSI', 'Serial', 'Batch'];

  const formatDataWithPrefix = (currentConfigTitle, arrayOfObj) => {
    let formattedData = arrayOfObj;

    switch (currentConfigTitle) {
      case 'IMSI':
        // imsi number suffix is always 9 number
        formattedData = arrayOfObj.map((obj) => {
          return {
            ...obj,
            startNumber: addPrefix(obj.imsiPrefixNumber, 9, obj.startNumber),
            endNumber: addPrefix(obj.imsiPrefixNumber, 9, obj.endNumber),
            lastNumberUsed: addPrefix(
              obj.imsiPrefixNumber,
              9,
              obj.lastNumberUsed
            ),
            nextNumber: addPrefix(obj.imsiPrefixNumber, 9, obj.nextNumber),
          };
        });
        break;
      case 'Serial':
        // serial number suffix is always 10 number
        formattedData = arrayOfObj.map((obj) => {
          return {
            ...obj,
            lastSrNumberUsed: addPrefix(
              obj.serialNumberPrefix,
              10,
              obj.lastSrNumberUsed
            ),
            nextSrNumber: addPrefix(
              obj.serialNumberPrefix,
              10,
              obj.nextSrNumber
            ),
          };
        });
        break;
    }

    return formattedData;
  };

  useEffect(() => {
    const acceptedTitle = titleList.filter((title) => {
      if (hlrFur === UDCHLR) {
        return title != 'IMSI';
      }
      return title;
    });

    setSummaryTitle(acceptedTitle);
    setCurrentTitle(acceptedTitle[0]);
  }, []);

  const selectSummaryTitle = (title) => {
    setCurrentTitle(title);
  };

  return (
    <RangeNumberSummary>
      <RangeSummaryCardContainer>
        <CardContent>
          <Box>
            <Typography>
              <b>Identifier summary</b>
            </Typography>
          </Box>
          <Box sx={{ marginBottom: '10px' }}>
            <Typography variant="body2">
              Shows all HLR Identifier status before the request
            </Typography>
          </Box>
          <ColoredFlexBoxSpaceBetween sx={{}}>
            {summaryTitle.map((title, index) => (
              <Box key={title + index}>
                <Button
                  onClick={() => {
                    selectSummaryTitle(title);
                  }}
                  variant={currentTitle === title ? 'contained' : 'outlined'}
                >
                  {title}
                </Button>
              </Box>
            ))}
          </ColoredFlexBoxSpaceBetween>
          {currentTitle == 'IMSI' && (
            <Box>
              {imsiNbRange?.length > 0 &&
                formatDataWithPrefix(
                  'IMSI',
                  imsiNbRange?.filter(
                    (imsiNbRangeObject) => imsiNbRangeObject.hlrFur === hlrFur
                  )
                ).map((imsiNbRangeObject, index) => (
                  <RangeNumberDetailsCard
                    excludedKeys={[
                      '_id',
                      'hlrFur',
                      'seq_id',
                      'deleted',
                      'status',
                      'lastModifiedBy',
                      'lastModifiedDate',
                    ]}
                    key={imsiNbRangeObject.lastNumber + index}
                    detailsObject={imsiNbRangeObject}
                    title={`IMSI for ${imsiNbRangeObject.hlrFur}`}
                  />
                ))}
            </Box>
          )}
          {currentTitle == 'Serial' && (
            <Box>
              {serialNbRange?.length > 0 &&
                formatDataWithPrefix('Serial', serialNbRange).map(
                  (serialNbRangeObject, index) => (
                    <RangeNumberDetailsCard
                      excludedKeys={[
                        '_id',
                        'hlrFur',
                        'seq_id',
                        'deleted',
                        'status',
                        'lastModifiedBy',
                        'lastModifiedDate',
                      ]}
                      key={serialNbRangeObject.lastNumber + index}
                      detailsObject={serialNbRangeObject}
                      title="Serial Number Bucket"
                    />
                  )
                )}
            </Box>
          )}
          {currentTitle == 'Batch' && (
            <Box>
              {batchNumberRange?.length > 0 &&
                batchNumberRange?.map((batchNbRangeObject, index) => (
                  <RangeNumberDetailsCard
                    excludedKeys={[
                      '_id',
                      'hlrFur',
                      'seq_id',
                      'deleted',
                      'status',
                      'lastModifiedBy',
                      'lastModifiedDate',
                    ]}
                    key={batchNbRangeObject.lastNumber + index}
                    detailsObject={batchNbRangeObject}
                    title="Batch Number Bucket"
                  />
                ))}
            </Box>
          )}
        </CardContent>
      </RangeSummaryCardContainer>
    </RangeNumberSummary>
  );
}

function RangeNumberDetailsCard({
  title,
  excludedKeys = [],
  marginBottom,
  detailsObject,
}) {
  return (
    <RangeNumberDetailsCardBox marginBottom={marginBottom}>
      <Typography variant="h6">
        <FactCheckIcon
          sx={{ position: 'relative', top: '4px', marginRight: '5px' }}
        />
        {title}
      </Typography>

      <KeyValueFormatter
        keyValueObject={detailsObject}
        excludedKeys={excludedKeys}
      />
    </RangeNumberDetailsCardBox>
  );
}
