const fs = require("fs")
// fs.writeFileSync("test.txt","Hii Akshay")
// fs.writeFile("test.txt",`\n Hey there`,(err)=>{})
// console.log(fs.readFileSync("test.txt","utf-8"))
fs.readFile("test.txt","utf-8",(error,result)=>{
    if(error){
        console.log("Error" , error);
    }
    else{
        console.log(result)
    }
})


// fs.appendFileSync("test.txt",`\n${Date.now().valueOf().toLocaleString()}`)
// fs.copyFileSync("test.txt","copy.txt")
// fs.unlinkSync("copy.txt") //for delete the file
console.log(fs.statSync("test.txt"))
fs.mkdirSync("newFolder")