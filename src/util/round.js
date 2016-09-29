// @flow

export default (number: number, places: number) => {
  const factor = Math.pow(10, places);
  return Math.round(number * factor) / factor;
};
