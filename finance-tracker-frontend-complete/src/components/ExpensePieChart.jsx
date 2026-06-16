import { Card, CardContent, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpensePieChart({ expenseByCategory = {} }) {
  const labels = Object.keys(expenseByCategory);
  const values = Object.values(expenseByCategory).map(Number);

  const data = {
    labels,
    datasets: [{ label: 'Expense', data: values }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  return (
    <Card className="hover-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>Expense Breakdown</Typography>
        <div className="responsive-chart">
          {labels.length === 0 ? (
            <Typography color="text.secondary">No expense data available.</Typography>
          ) : (
            <Pie data={data} options={options} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
