import clamp from 'ramda/src/clamp';

const palette = {
  // primary
  oPlusRed: '#ec4f3e',
  midnightBlue: '#213a56',
  brightBlue: '#00a2e5',
  darkBlue: '#074a86',
  // brightBlueWithAlpha: '#00a2e520',
  brightBlueWithAlpha: '#e6f7ff',
  accentYellow: '#feb52b',
  orange: '#ef8a23',
  darkOrange: '#d97e22',
  newDarkBlue: '#0e244a',
  brightOrange: '#da5a47',
  newBrightBlue: '#5a71f2',
  newBrightBlueShaded: '#5a71f2cc',
  purpleNavy: '#3a4c6a',
  cornFlowerBlue: '#778af1',
  zinc: '#afb8c4',
  whiteSmoke: '	#F8F8F9',
  aliceBlue: '#eff6fb',
  lightGrayishBlue: '#D4D9DF',
  shadowBlue: '#8492A4',
  gunmetal: '#292D34',

  // secondary
  purplePassion: '#553bbe',
  blueOcean: '#2bacfb',
  tomatoInYoFace: '#ea4739',
  orangeJulius: '#fd8914',
  keyLimePie: '#bad441',
  bananaHammock: '#fecd21',
  dirtyBanana: '#feb52b',
  creamPuff: '#f8f5ee',

  // grey
  lightGrey: '#939aa4',
  darkGrey: '#1e2e40',
  mediumGrey: '#3d4858',
  coolGrey1: '#8492a4',
  coolGrey2: '#c1ccda',
  coolGrey3: '#e5e9f2',
  coolGrey4: '#f9fafc',
  coolGrey6: '#82909D',
  coolGrey9: '#17191c',
  coolGrey7: '#C0CBD4',
  coolGrey8: '#727271',
  coolGrey10: '#6d757c',
  blueGrey: '#f5f8fa',

  // COLORS NOT EXISTING IN GLOBAL PALETTE
  error: '#e40909',
  lightGrey2: '#f3f5f6',
  offBlack: '#292d34',
  black: '#000000',
  white: '#ffffff',
  lightCyanBlue: '#009fcd',
  lighterCyanBlue: '#0ca1c7',
  cyanBlue: '#007cab',
  darkGreyBlue: '#125375',
  greyBlue: '#2e3a43',
  softCyan: '#a6dcea',
  unknownGrey1: '#303538',
  unknownGrey2: '#ddf2f7',
  unknownGrey3: '#aab8c3',
  unknownGrey4: '#ededf0',
  unknownGrey5: '#ababb2',
  unknownGrey6: '#dedee2',
  unknownGrey7: '#5e6366',
  paleBlue: '#d4f3ff',
  vividPink: '#d9036b',
  veryDarkBlue: '#2a4a70',
  memberGreen: '#00a73c',
  taskCheckboxGreen: '#20b255',
  inProgressGreen: '#BAD440',
  featureBlue1: '#011845',
  featureBlue2: '#1a2d56',
  scrollbarGrey: '#939aa4',
  red: '#e94739',
  lightBlue: '#5ccced',
  skeletonLoader: '#e5e9f2',
  selectedBlue: '#05ADEC',
  crystalBlue: '#4bb3fd',
  iron: '#D4D9DF',

  // lighter ones - 90%
  dockBlueLight: '#e0eff9',
  oPlusRedLight: '#fad3cf',
  tomatoInYoFaceLight: '#f9d4d2',
  orangeJuliusLight: '#fee6cd',
  bananaHammockLight: '#fff4cc',
  tealGreen: '#69b8b2',
};

export const typography = {
  text: `'Outfit', sans-serif`,
};

export const featurePalette = {
  globalSearchHighlight: 'rgba(254, 205, 33, .5)',
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'PLANNED': {
      return '#f6b039';
    }
    case 'ON_HOLD': {
      return '#dc143c';
    }
    case 'IN_PROGRESS': {
      return '#00a73c';
    }
    default: {
      return '#808080';
    }
  }
};

export const opacify = (color = palette.black, opacity = 1) =>
  `${color}${Math.floor(clamp(0, 1, opacity) * 255)
    .toString(16)
    .padStart(2, '0')}`;

export default palette;
