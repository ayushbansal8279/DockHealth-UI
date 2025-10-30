import spacing from "@/app/styles/spacing";
import { Box, Button, Paper, Typography } from "@mui/material";
import styled from "styled-components";

export const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 600px;
  margin: ${spacing.giga};
`;

export const Section = styled(Paper)`
  padding: 24px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: none;
`;

export const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const Title = styled(Typography)`
  font-family: Outfit;
  font-weight: 600;
  font-size: 18px;
  color: #3d4858;
`;

export const Description = styled(Typography)`
  font-size: 16px;
  color: #3d4858;
`;

export const InputRow = styled(Box)`
  display: flex;
  align-items: center;
  margin-top: 16px;
  gap: 12px;
`;

export const UpdateButton = styled(Button)`
  background-color: #5a71f2;
  height: 40px;
  width: 200px;
`;