import { Typography } from "@mui/material";

const ModalNote = ({ children }) => (
  <Typography variant="body2" sx={{ mb: 2 }}>
    <strong>Note:</strong> {children}
  </Typography>
);

export default ModalNote;