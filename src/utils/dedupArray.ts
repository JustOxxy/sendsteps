export const dedupArray = (arr: string[]) => {
  return arr.filter((item, idx) => arr.findIndex((value) => value === item) === idx);
};
