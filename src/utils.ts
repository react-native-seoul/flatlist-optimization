let counts: Record<string, number> = {};
export const consoleCount = function (key: string) {
  if (counts[key] === undefined) {
    counts[key] = 1;
  } else {
    counts[key]++;
  }
  console.log(`count ${counts[key]} :: ${key}`);
};
