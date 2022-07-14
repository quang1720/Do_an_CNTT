export const flatten = (arr) => {
  return arr.reduce(
    (acc, cur) => acc.concat(Array.isArray(cur) ? flatten(cur) : cur),
    []
  );
};
