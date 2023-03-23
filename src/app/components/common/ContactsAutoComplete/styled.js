import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';

// eslint-disable-next-line import/prefer-default-export
export const RenderOptionStyled = styled.div`
  width: 100%;
  padding: 10px;
  height: 50px;
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

export const NoOptionTextLabel = styled.span`
  cursor: pointer;
  color: ${palette.brightBlue};
  font-weight: 600;
`;

export const NoOptionContainer = styled.div`
  padding: ${spacing.small};

  &:hover {
    background-color: #f1f1f1;
    color: black;
  }
`;

export const AddEditContactLink = styled.div`
  margin-left: auto;
`;

export const AddContactWrapper = styled.div`
  text-transform: none;
  color: ${palette.mediumGrey};

  &:before {
    position: absolute;
    top: 50%;
    left: -8px;
    display: block;
    content: '+';
    transform: translateY(-50%);
    color: ${palette.orange};
    font-size: ${fontSizes.regular};
  }
`;
