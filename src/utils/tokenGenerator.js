const generateToken = () => {
  const characters = '1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM';
  let token = '';
  for (let index = 0; index < 16; index += 1) {
    const random = Math.floor(Math.random() * ((characters.length - 1) - 0));
    token = token.concat('', characters[random]);
  }
  return token;
};

module.exports = generateToken;