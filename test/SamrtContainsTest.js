var contains = require('../src/SmartContains').contains;

//TODO WTF??! Do real tests!

console.log(contains('test', 'test') == true);
console.log(contains('test ', 'test') == true);
console.log(contains(' test', 'test') == true);
console.log(contains(' test ', 'test') == true);
console.log(contains('test qsdf', 'test') == true);
console.log(contains('qsdf test', 'test') == true);
console.log(contains('qsdf test qsdf', 'test') == true);


console.log(contains('atest', 'test') == false);
console.log(contains('testa', 'test') == false);
console.log(contains('atesta', 'test') == false);