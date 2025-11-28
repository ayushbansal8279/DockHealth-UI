import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

const PopoverBottomBar = styled.div`
  width: 100%;
  height: 36px;
  display: flex;
  flex-direction: row;
  justify-content: ${({ align }) =>
    align === 'left'
      ? 'flex-start'
      : // eslint-disable-next-line unicorn/no-nested-ternary
      align === 'spread'
      ? 'space-between'
      : 'flex-end'};
  align-items: center;
  padding: 0 ${spacing.regular};
  background-color: ${palette.coolGrey4};
`;

const Button = styled.button`
  width: auto;
  padding: ${spacing.tiny} 0;
  color: ${({ theme }) =>
    theme === 'light' ? palette.coolGrey1 : palette.midnightBlue};

  &:not(:first-of-type) {
    margin-left: ${spacing.small};
  }

  &:not(:last-of-type) {
    margin-right: ${spacing.small};
  }
`;

const RemoveButton = styled.button`
  width: auto;
  padding: ${spacing.tiny} 0;
  color: ${palette.midnightBlue};
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &:not(:first-of-type) {
    margin-left: ${spacing.small};
  }

  &:not(:last-of-type) {
    margin-right: ${spacing.small};
  }
`;

export const PlusButton = styled(Button)`
  &:before {
    display: inline-block;
    margin-right: ${spacing.tiny};
    content: '+';
    color: ${palette.orange};
  }
`;

PopoverBottomBar.RemoveButton = RemoveButton;
PopoverBottomBar.Button = Button;

PopoverBottomBar.PlusButton = PlusButton;

export default PopoverBottomBar;
