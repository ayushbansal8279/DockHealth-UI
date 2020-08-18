const removeUnderscores = date => date.replace(/_/g, '');

export default () => {
  return conformedValue => {
    const [month, day, year] = conformedValue.split('/');

    let newMonth = month;
    let newDay = day;

    const indexesOfPipedChars = [];

    if (/^[^01]/.test(removeUnderscores(month))) {
      newMonth = `0${removeUnderscores(month)}`;
      indexesOfPipedChars.push(0);
    }

    if (/^[^0-3]/.test(removeUnderscores(day))) {
      newDay = `0${removeUnderscores(day)}`;
      indexesOfPipedChars.push(3);
    }

    return {
      value: [newMonth, newDay, year].join('/'),
      indexesOfPipedChars,
    };
  };
};
