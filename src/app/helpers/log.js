export const log = (message, ...rest) => {
  // if (import.meta.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.log(message, ...rest);
  // }
};
