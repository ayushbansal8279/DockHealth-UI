import { Typography } from "@mui/material";

const ModalMessage = ({ type = 'note', children }) => {
  const label = {
    warning: 'Warning:',
  }[type];

  return (
    <Typography variant="body2" sx={{ mb: 2 }}>
      <strong>{label}</strong> {children}
    </Typography>
  );
};

export default ModalMessage;