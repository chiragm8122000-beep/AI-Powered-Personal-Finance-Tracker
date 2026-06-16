import {
  Card, CardContent, Chip, LinearProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography
} from '@mui/material';
import { formatCurrency } from '../utils/constants.js';

function colorForStatus(status) {
  if (status === 'RED') return 'error';
  if (status === 'YELLOW') return 'warning';
  return 'success';
}

export default function BudgetActualTable({ rows = [] }) {
  return (
    <Card className="hover-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>Budget vs Actual</Typography>

        <TableContainer className="mobile-table">
          <Table size="small" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Spent</TableCell>
                <TableCell>Remaining</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.category}>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{formatCurrency(row.budgetAmount)}</TableCell>
                  <TableCell>
                    {formatCurrency(row.spentAmount)}
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(Number(row.usedPercentage || 0), 100)}
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                      color={colorForStatus(row.status)}
                    />
                  </TableCell>
                  <TableCell>{formatCurrency(row.remainingAmount)}</TableCell>
                  <TableCell>
                    <Chip size="small" label={row.status} color={colorForStatus(row.status)} />
                  </TableCell>
                </TableRow>
              ))}

              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>No budgets added for this month.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
