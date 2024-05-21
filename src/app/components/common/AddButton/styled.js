import styled from 'styled-components';
import { fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';

export const StyledAddButton = styled.button`
  // color: ${palette.coolGrey1};
  // outline: none;
  // border: none;
  // border-radius: 9px;
  // font-family: inherit;
  // font-weight: ${fontWeights.bold};
  // padding: ${spacing.tiny} 10px;
  // transition: background-color 0.3s linear;

  // & > span {
  //   color: ${palette.orange};
  // }

  // &:hover {
  //   background-color: #f9fafc;
  //   cursor: pointer;
  // }

  // font-family: 'Outfit', sans-serif;
  color: ${palette.white};
  font-weight: ${fontWeights.regular};
  // display: inline-block;
  margin-left: ${spacing.tiny};
  margin-right: ${spacing.tiny};
  text-transform: none;
  font-family: Outfit;
  font-size: 14px;
  line-height: 11.19px;
  text-align: center;
`;
