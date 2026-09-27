function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function newUuidV4() {
  const value: string[] = [];
  const lookup = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
  for (let i = 0; i < 8; i++) {
    value.push(lookup[getRandomInt(lookup.length)]);
  }
  value.push("-");
  for (let i = 0; i < 4; i++) {
    value.push(lookup[getRandomInt(lookup.length)]);
  }
  value.push("-4");
  for (let i = 0; i < 3; i++) {
    value.push(lookup[getRandomInt(lookup.length)]);
  }
  value.push("-a");
  for (let i = 0; i < 3; i++) {
    value.push(lookup[getRandomInt(lookup.length)]);
  }
  value.push("-");
  for (let i = 0; i < 12; i++) {
    value.push(lookup[getRandomInt(lookup.length)]);
  }
  return value.join("");
}
