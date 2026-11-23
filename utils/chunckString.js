function chunkStringWithStar(str, size, replaceIndexes) {
  /**
   * chunk a string according to given size and add stars to given indexes
   * @param {String} str
   * @param {Number} size
   * @param {Array} replaceIndexes
   * @return {String}
   */
  const chunks = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));

    for (const index of replaceIndexes) {
      if (index < chunks.length) {
        chunks[index] = "*".repeat(size);
      }
    }
  }
  return chunks;
}

function chunkString(value) {
  /**
   * chunk a string by size of 4
   * @param {String} value
   * @return {String}
   */
  const formattedValue = value.replace(/ /g, "");
  return formattedValue
    .split("")
    .map((char, index) => {
      if (index % 4 === 0 && index !== 0) {
        return " " + char;
      } else {
        return char;
      }
    })
    .join("");
}

export { chunkStringWithStar, chunkString };
