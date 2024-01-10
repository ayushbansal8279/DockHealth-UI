import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';
import { Popover } from '@mui/material';

export const DueDateLabel = styled.label`
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.small};
  text-transform: uppercase;
`;

export const DueDateContentWrapper = styled.div`
  width: 100%;
  padding: ${spacing.tiny} 0;
  text-align: left;
  border-bottom: 1px solid ${palette.coolGrey1};
  padding: 25px 10px 6px 10px;
`;

export const DueDateContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  color: ${({ error }) => (error ? palette.error : palette.mediumGrey)};
  font-weight: ${fontWeights.bold};
`;

export const DueDateText = styled.p`
  margin-bottom: 0;
`;

export const Placeholder = styled.p`
  color: ${palette.coolGrey1};
  margin-bottom: 0;
`;

export const DueDateSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 54px;
  font-family: inherit;

  ${({ disabled }) =>
    disabled &&
    `
    pointer-events: none;
    
    & ${Placeholder}, & ${DueDateLabel} {
      color: ${palette.coolGrey2};
    }

    & ${DueDateContent} {
      border-color: ${palette.coolGrey2};
    }
  `}
`;

export const StyledButton = styled.button`
  width: 100%;
`;

export const StyledPopover = styled(Popover)`
  .MuiPopover-paper {
    border: none;
    box-shadow: none;
    width: ${({ width }) => width};
    overflow: visible;
  }
`;
