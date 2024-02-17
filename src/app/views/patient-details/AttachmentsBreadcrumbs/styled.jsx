import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import { Box } from '@mui/material';

const textStyles = `
	font-family: 'Outfit', sans-serif;
	font-size: ${fontSizes.regular};
	font-weight: ${fontWeights.regularPlus};
	text-transform: uppercase;
	color: ${palette.mediumGrey};
`;

export const BreadcrumbLink = styled(Link)`
  ${textStyles}

  &:hover {
    color: ${palette.brightBlue};
    text-decoration: underline;
  }
`;

export const BreadcrumbText = styled.p`
  ${textStyles}
  display: inline;
  margin-bottom: 0;
`;

export const BreadcrumbSeparator = () => (
  <Box display="inline" px={0.7}>
    <BreadcrumbText>/</BreadcrumbText>
  </Box>
);

export const BreadcrumbWrapper = styled.div`
  display: block;
  flex: 0 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
