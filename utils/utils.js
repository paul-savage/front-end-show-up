export const reformatTime = (str) => {
  let index = str.indexOf("T");
  if (index !== -1) {
    str = str.slice(0, index) + " " + str.slice(index + 1);
    index = str.indexOf(".");
    str = str.slice(0, index);
  }
  return str;
};
