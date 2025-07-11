// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
// } from "@mui/material";

// const ConfirmDialog = ({
//   open,
//   handleClose,
//   handleConfirm,
//   title,
//   message,
// }) => {
//   return (
//     <Dialog open={open} onClose={handleClose}>
//       <DialogTitle className="font-semibold">{title}</DialogTitle>
//       <DialogContent className="py-4">{message}</DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose} color="error" variant="outlined">
//           Cancel
//         </Button>
//         <Button onClick={handleConfirm} color="primary" variant="contained">
//           Confirm
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ConfirmDialog;
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  Box,
  Typography,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import { Close, Warning, CheckCircle } from "@mui/icons-material";

const ConfirmDialog = ({
  open,
  handleClose,
  handleConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  severity = "warning", // 'warning' or 'success'
}) => {
  const theme = useTheme();

  const getSeverityStyles = () => {
    switch (severity) {
      case "success":
        return {
          icon: <CheckCircle fontSize="large" color="success" />,
          color: theme.palette.success.main,
        };
      default: // warning
        return {
          icon: <Warning fontSize="large" color="warning" />,
          color: theme.palette.warning.main,
        };
    }
  };

  const severityStyles = getSeverityStyles();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: 400,
          maxWidth: 500,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: theme.spacing(2, 3),
          backgroundColor: theme.palette.grey[50],
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ padding: theme.spacing(3) }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box sx={{ color: severityStyles.color, mt: 0.5 }}>
            {severityStyles.icon}
          </Box>
          <Typography variant="body1" color="text.primary">
            {message}
          </Typography>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ padding: theme.spacing(2, 3) }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            "&:hover": {
              backgroundColor: theme.palette.grey[100],
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            backgroundColor: severityStyles.color,
            "&:hover": {
              backgroundColor: severityStyles.color,
              opacity: 0.9,
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
