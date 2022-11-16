// import BookService from "services/BookService";

import fs from 'fs'
async function test() {
  // BookService.newInstance().generateThumbnail("C:/Users/Lenovo/Downloads/spring微服务实战.epub")
}

// test()
const dir = "C:/Users/Lenovo/iCloudDrive/ebook"
const files = fs.readdirSync(dir).map(v => dir + '/' + v)

for(let file of files) {
  if (file.indexOf(" ") != -1) {
    fs.renameSync(file, file.replaceAll(" ", "_"))
    console.log(file, file.replaceAll(" ", "_"))
  }
}
