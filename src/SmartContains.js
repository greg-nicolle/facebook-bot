require('./utils');

exports.contains = function (str, keyWord) {
  var result = (` ${str} `).nrml().match(new RegExp(`[^\w]${keyWord}[^\w]`, 'g'));
  return result !== null? result[0].replace(/ /, '').replace(/ /, '') == keyWord : false;
};