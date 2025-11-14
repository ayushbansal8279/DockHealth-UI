import palette from '@/app/styles/palette';
import spacing from '@/app/styles/spacing';
import { fontWeights } from '@/app/styles/font';

export const getButtonStyles = () => {
  const baseStyles = {
    display: 'flex',
    height: '40px',
    padding: '22px 24px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    borderRadius: '8px',
    fontFamily: 'Outfit',
    fontStyle: 'normal',
    fontWeight: fontWeights.regular,
    lineHeight: '11.189px',
    textTransform: 'none',
    width: '180px',
    border: 'none',
    cursor: 'pointer',
  };

  return {
    confirm: {
      ...baseStyles,
      backgroundColor: palette.oPlusRed,
      color: palette.white,
      textAlign: 'center',
    },
    deny: {
      ...baseStyles,
      padding: `22px ${spacing.large}`,
      border: `1px solid ${palette.oPlusRed}`,
      color: palette.oPlusRed,
      backgroundColor: 'transparent',
      textAlign: 'center',
    },
  };
};

export const applyButtonStyles = (button, type = 'confirm') => {
  const styles = getButtonStyles();
  const buttonStyles = type === 'deny' ? styles.deny : styles.confirm;

  Object.assign(button.style, buttonStyles);
};