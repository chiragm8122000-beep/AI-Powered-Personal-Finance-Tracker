import { Avatar, Card, CardContent, Stack, Typography, Box } from '@mui/material';
import { formatCurrency } from '../utils/constants.js';

export default function SummaryCard({ title, value, subtitle, icon }) {
  return (
    <Card className="hover-card" sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="text.secondary" gutterBottom>{title}</Typography>
            <Typography variant="h4">{formatCurrency(value)}</Typography>
            {subtitle && <Typography color="text.secondary" variant="body2">{subtitle}</Typography>}
          </Box>
          {icon && (
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              {icon}
            </Avatar>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
