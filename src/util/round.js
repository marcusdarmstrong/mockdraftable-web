// @flow

export default (number: number, places: number) => {
  const factor = 10 ** places;
  return Math.round(number * factor) / factor;
};
