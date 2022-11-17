import OCRService from "../services/OCRService"
import fs from 'fs'

async function test() {
  const data = await OCRService.newInstance().ocr(await (await fs.promises.readFile('C:/Users/Lenovo/Desktop/屏幕截图 2022-11-16 152231.png')).toString("base64"))
  console.log(data)
}
test()
