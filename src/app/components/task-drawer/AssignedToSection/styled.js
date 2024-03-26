import React from 'react';
import styled from 'styled-components';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const AssignMemberContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const Title = styled.div`
  margin-right: 24px;
  color: ${palette.coolGrey1};
  font-family: Outfit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  display: flex;
  min-width: 70px;
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
  height: 40px;
  padding: 0 8px;
  border-radius: 8px;
  background: #f8f8f9;
`;
export const AssigneeTitle = styled.div`
  font-family: Outfit;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  white-space: nowrap;
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
  position: absolute;
  background-color: ${palette.white};
  overflow: auto;
  max-height: 350px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
}`;

export const HelperText = styled.div`
  color: #8f9cac;
  font-family: Outfit;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%;
  margin-left: 9px;
  text-transform: none;
`;
