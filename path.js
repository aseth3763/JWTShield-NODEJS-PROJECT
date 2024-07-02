const path = require("path")

// console.log(path)
console.log(__filename);
console.log(path.dirname(__filename))
console.log(path.basename(__filename))
console.log(path.basename(__filename,"js"));
console.log(path.extname(__filename));

console.log(path.join("/search","label", "course/python" , "oop"));
console.log(path.join("/search","label", "course/python" , "oop",".."));
console.log(path.join("/search","label", "course/python" , "oop","..",".."));
console.log(path.join(__dirname,"code","allcode.js"));


console.log(path.normalize("C:\\temp\\\\\\foo\\bar"));
console.log(path.normalize("C:\\temp\\\\\\foo\\bar\\..\\"));
console.log(path.win32.normalize("C:\\temp\\\\\\foo\\bar"));


console.log(path.parse(__filename));
console.log(path.parse(__filename).ext);