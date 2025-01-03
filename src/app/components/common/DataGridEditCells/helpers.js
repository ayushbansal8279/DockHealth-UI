import palette from '@/app/styles/palette';

export const selectStyles = {
    marginInline: '8px',
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        outline: 'none',
    },
    '&.Mui-focused': {
        backgroundColor: 'transparent',
    },
    '& .MuiSelect-displayEmpty': {
        color: palette.lightGrey,
    },
};

export const phoneLabelStyles = (isPlaceholder) => ({
    color: isPlaceholder ? palette.coolGrey10 : 'inherit',
    cursor: 'pointer',
});