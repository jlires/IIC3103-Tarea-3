
// https://dev.to/afewminutesofcode/how-to-convert-an-array-into-an-object-in-javascript-25a4
export const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};
