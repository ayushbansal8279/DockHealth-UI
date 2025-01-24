import styled from 'styled-components';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';

export const ClickablePatient = styled.span`
  align-self: center;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const PatientLabel = styled.span`
  color: ${palette.mediumGrey};
  font-weight: ${fontWeights.light};

  &:hover {
    color: ${palette.brightBlue};
    text-decoration: underline;
  }
`;

export const Placeholder = styled.div`
  width: 100%;
  color: ${palette.mediumGrey};
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 400;

  &:hover {
    opacity: 1;
    color: ${palette.brightBlue};
  }
`;

export const AddPlaceholder = styled(Placeholder)`
  color: ${palette.lightGrey};
  opacity: 0;

  &::first-letter {
    color: ${palette.orange};
    font-size: 16px;
  }
`;

export const PatientLableContainer = styled.div`
  display: flex;
  items-align: center;
`;

export const AISummaryWrapper = styled.div`
  margin: 0 5px 0 2px;
`;

export const DisabledLink = styled.span``;
