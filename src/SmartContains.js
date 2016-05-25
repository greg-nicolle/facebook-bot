require('./utils')

exports.contains = (str, keyWord) => {return (` ${str} `).nrml().match(new RegExp(`[^\w]${keyWord}[^\w]`, 'g'))[0].replace(/ /, '').replace(/ /, '') == keyWord}