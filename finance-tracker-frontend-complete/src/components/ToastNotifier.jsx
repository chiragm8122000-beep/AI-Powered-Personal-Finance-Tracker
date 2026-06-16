import { Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '../features/ui/toastSlice.js';

export default function ToastNotifier() {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.toast);

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={() => dispatch(hideToast())}>
      <Alert onClose={() => dispatch(hideToast())} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
