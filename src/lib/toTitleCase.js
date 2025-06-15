export default function toTitleCase(str) {
  if (str === null || str === "") return false;
  else str = str.toString();

  // Regex expression. \w matches any "word" character. \S* matches zero or more non-whitespace characters. g is the "global" flag => extracts "words" from a strinig, where each word starts with a word character.
  return str.replace(/\w\S*/g, (text) => {
    return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
  });
}
