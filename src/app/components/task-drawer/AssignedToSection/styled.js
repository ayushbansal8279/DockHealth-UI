import React from 'react';
import styled from 'styled-components';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const AssignMemberContainer = styled.div`
  display: flex;
  // padding: 5px 0;
`;

export const Title = styled.div`
  margin-right: 40px;
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