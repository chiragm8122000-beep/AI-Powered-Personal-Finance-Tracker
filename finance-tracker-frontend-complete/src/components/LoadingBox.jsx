import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingBox({ text = 'Loading...' }) {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 180 }}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }} color="text.secondary">{text}</Typography>
    </Box>
  );
}
