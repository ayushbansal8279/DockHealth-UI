import React from 'react';
import styled from 'styled-components';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const AssignMemberContainer = styled.div`
  display: flex;
`;

export const Title = styled.div`
  margin-right: 20px;
  color: ${palette.coolGrey1};
  font-family: Outfit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  display: flex;
  align-items: center;
`;

export const SubTitle = styled.div`
  margin-left: 10px;
  color: ${palette.coolGrey1};
  font-family: Outfit;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
`;

export const AddAssigneeButton = styled.button`
  color: black;
  margin-left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AssigneeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0 8px;
  border-radius: 8px;
  background: #F8F8F9;
  margin-left: 20px;
`;
export const AssigneeTitle = styled.div`
  font-family: Outfit;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
`;

export const StyledYouBadge = styled.div`
  font-family: inherit;
  font-size: 10px;
  display: inline-block;
  padding: 2px 4px;
  color: ${palette.white};
  background-color: #48bbb3;
  border-radius: 4px;
`;

export const PopupContainer = styled.div`
  width: ${({ width }) => width}px;
  padding: 0;
  left: 135px;
  margin-top: 2px;
  position: absolute;
  background-color: ${palette.white};
  overflow: auto;
  max-height: 350px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
}`;