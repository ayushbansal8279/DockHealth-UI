import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';


export const StatusFieldContainer = styled.div`
  margin-left: 10px;
  width: 200px;
  display: flex;
`;

export const StatusContainer = styled.div`
  display: flex;
  align-items: center;
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

export const StatusWrapper = styled.div`
  display: flex;
  border-radius: 2px;
  border: 1px solid ${(property) => property.color || '#7F4334'};
  background: ${(property) => `${property.color}1A` || '#7F43341A'};
  min-width: 100px;
  padding: 2.5px 2px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  color: ${(property) => property.color || '#7F4334'};
`;