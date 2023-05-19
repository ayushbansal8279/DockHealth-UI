import { styled } from '@mui/material/styles';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import Box from '../../Primitive/Box/Box';

export const Container = styled(Box)`
  overflow: hidden;
  position: relative;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 15px;
  width: 100%;
  min-height: ${(props) => (props.type === 'textarea' ? '75px' : '100%')};
  padding-bottom: ${(props) => (props.type === 'textarea' ? '5px' : '0')};
`;

export const Content = styled(Box)`
  position: relative;
`;

export const Toolbar = styled(Box)`
  position: relative;
  display: flex;
  height: ${props => props.$open ? "50px" : "0"};
  margin: -5px -5px;
  padding: 4px;
  vertical-align: middle;
  justify-content: space-between;
  transform: translate(0%, ${props => props.$open ? "0%" : "-100%"});
  opacity: ${props => props.$open ? "1" : "0"};
  transition: transform 175ms cubic-bezier(0.85, 0, 0.15, 1),
              opacity 125ms cubic-bezier(0.45, 0, 0.55, 1),
              height 175ms cubic-bezier(0.85, 0, 0.15, 1);

  svg {
    fill: #888;
    max-width: 20px;
  }

  button.toolbar-item {
    border: 0;
    display: flex;
    background: none;
    border-radius: 4px;
    padding: 8px;
    cursor: pointer;
    vertical-align: middle;
    color: #888;

    .MuiTypography-root {
      font-size: 15px !important;
    }

    &:disabled {
      cursor: not-allowed;
      color: #CCC;

      svg {
        fill: #CCC;
      }
    }

    &.spaced {
      margin-right: 2px;
    }

    i.format {
      background-size: contain;
      display: inline-block;
      height: 18px;
      width: 18px;
      margin-top: 2px;
      vertical-align: -0.25em;
      display: flex;
      opacity: 0.6;
    }

    &:disabled i.format {
      opacity: 0.2;
    }

    &.active {
      background-color: rgba(223, 232, 250, 0.3);

      i {
        opacity: 1;
      }
    }
  }

  .toolbar-item:hover:not([disabled]) {
    background-color: #eee;
  }

  .divider {
    width: 1px;
    background-color: #eee;
    margin: 0 4px;
  }

  select {
    &.toolbar-item {
      border: 0;
      display: flex;
      background: none;
      border-radius: 10px;
      padding: 8px;
      vertical-align: middle;
      -webkit-appearance: none;
      -moz-appearance: none;
      width: 70px;
      font-size: 14px;
      color: #777;
      text-overflow: ellipsis;
    }

    &.code-language {
      text-transform: capitalize;
      width: 130px;
    }
  }

  .toolbar-item {
    .text {
      display: flex;
      line-height: 20px;
      width: 200px;
      vertical-align: middle;
      font-size: 14px;
      color: #777;
      text-overflow: ellipsis;
      width: 70px;
      overflow: hidden;
      height: 20px;
      text-align: left;
    }

    .icon {
      display: flex;
      width: 20px;
      height: 20px;
      user-select: none;
      margin-right: 8px;
      line-height: 16px;
      background-size: contain;
    }
  }

  i.chevron-down {
    margin-top: 3px;
    width: 16px;
    height: 16px;
    display: flex;
    user-select: none;

    &.inside {
      width: 16px;
      height: 16px;
      display: flex;
      margin-left: -25px;
      margin-top: 11px;
      margin-right: 10px;
      pointer-events: none;
    }
  }
`

export const Input = styled(ContentEditable)`
  font: inherit;
  outline: none;

  p {
    margin-bottom: 0;
  }
  
  ul li {
    list-style: disc;
  }

  ol li {
    list-style: decimal;
  }
`;

export const Placeholder = styled(Box)`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  font: inherit;
  color: rgb(132, 146, 164);
`;

export const Avatar = styled(Box)`
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  line-height: 30px;
  max-width: 32px;
  max-height: 32px;
  min-width: 32px;
  min-height: 32px;
  margin: 4px;
  color: white;
  background-color: ${({ $color }) => $color};
  border: 1px solid white;
  outline: 1px solid ${({ $color }) => $color};
  border-radius: 100%;

  img {
    border-radius: 100%;
  }
`;
