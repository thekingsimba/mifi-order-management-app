import { Divider, Box, Skeleton, Avatar, Stack } from '@mui/material'
import { UserIndexContainer, UserIndexGridItem, UserIndexPaper, UserIndexRightPaper } from './simStyles'

export const SimRightSkeleton = () => {
  return (
    <>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Skeleton variant="text" width={'10%'} />
        <Stack direction={'row'} spacing={1}>
          <Skeleton variant="rectangular" width={20} height={20} />
          <Skeleton variant="circular" width={20} height={20} />
        </Stack>
      </Stack>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        spacing={2}
        mt={4}
      >
        <Skeleton variant="rounded" width={'33.3%'} height={'2rem'} />
        <Skeleton variant="rounded" width={'33.3%'} height={'2rem'} />
        <Skeleton variant="rounded" width={'33.3%'} height={'2rem'} />
      </Stack>

      <Box mt={8}>
        <Skeleton width={'100%'} height={'8rem'} variant="rounded" />
      </Box>
    </>
  );
};

const SimSkeleton = () => {
  return (
    <UserIndexContainer container spacing={{ xs: 2 }}>
      <UserIndexGridItem item xs={12} sm={2}>
        <UserIndexPaper elevation={0}>
          <Box sx={{ height: '2rem', padding: '0.5rem 1rem' }}>
            <Skeleton variant="rectangle" />
          </Box>
          <Divider />
          <Stack direction={'column'} gap={2} padding={2}>
            <Stack direction={'row'} gap={2}>
              <Skeleton variant="circular">
                <Avatar />
              </Skeleton>
              <Skeleton variant="text" width={'100%'} />
            </Stack>
            <Stack direction={'row'} gap={2}>
              <Skeleton variant="circular">
                <Avatar />
              </Skeleton>
              <Skeleton variant="text" width={'100%'} />
            </Stack>
            <Stack direction={'row'} gap={2}>
              <Skeleton variant="circular">
                <Avatar />
              </Skeleton>
              <Skeleton variant="text" width={'100%'} />
            </Stack>
            <Stack direction={'row'} gap={2}>
              <Skeleton variant="circular">
                <Avatar />
              </Skeleton>
              <Skeleton variant="text" width={'100%'} />
            </Stack>
            <Stack direction={'row'} gap={2}>
              <Skeleton variant="circular">
                <Avatar />
              </Skeleton>
              <Skeleton variant="text" width={'100%'} />
            </Stack>
            <Stack direction={'row'} gap={2}>
              <Skeleton variant="circular">
                <Avatar />
              </Skeleton>
              <Skeleton variant="text" width={'100%'} />
            </Stack>
          </Stack>
        </UserIndexPaper>
      </UserIndexGridItem>

      <UserIndexGridItem item xs={12} sm={10}>
        <UserIndexRightPaper elevation={1}>
          <SimRightSkeleton />
        </UserIndexRightPaper>
      </UserIndexGridItem>
    </UserIndexContainer>
  );
};
export default SimSkeleton;