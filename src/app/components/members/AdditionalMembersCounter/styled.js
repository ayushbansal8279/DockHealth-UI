import styled from 'styled-components';
import { fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const Container = styled.div`
  position: relative;
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  border: 2px solid ${({ color }) => color};
  border-radius: 50%;
`;

export const Text = styled.p`
  position: absolute;
  top: 51%;
  left: 50%;
  margin: 0;
  transform: translate(-50%, -50%);
  color: ${({ color }) => color};
  font-family: 'Montserrat', sans-serif;
  font-size: ${({ size }) => size / 2.5}px;
  font-weight: ${fontWeights.bold};
`;

export const HiddenMembersTooltipContainer = styled.div`
  min-width: 230px;
  display: flex;
  justify-content: space-between;
`;

export const HiddenMemberName = styled.p`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: ${spacing.tiny};
  margin-bottom: 0;
  font-weight: ${fontWeights.bold};
`;
