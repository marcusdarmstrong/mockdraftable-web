// @flow

export default function onError<T>(
  func: (...args: any[]) => Promise<T>,
  value: T | (...args: any[]) => T,
): (...args: any[]) => Promise<T> {
  return async (...args: any[]) => {
    try {
      return await func.apply(func, args);
    } catch (e) {
      if (e.stack) {
        console.error(e.stack);
      } else {
        console.error(e.toString());
      }
    }
    if ((typeof value) === 'function') {
      return value.apply(value, args);
    }
    return value;
  };
}
