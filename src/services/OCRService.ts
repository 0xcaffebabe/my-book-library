
const clientId = 'h4eoCwxHFsFerRvGWtGiMW4D'
const clientSecret = 'RPSQdIC5fL7y7c0BiCF9GLOeqngbKobG'
import axios from 'axios'

interface Words {
  words: string
}

interface WordsResult {
  words_result: Words[]
  words_result_num: number
}

export default class OCRService {
  private static instance: OCRService

  private accessToken = ''

  private constructor() {}

  public static newInstance() {
    return this.instance || (this.instance = new OCRService())
  }

  public async ocr(imgData: string): Promise<string> {
    await this.createOrUpdateAccessToken()
    const url = `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${this.accessToken}`
    const data = await axios.post(url,{
      image: imgData
    } , {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    if (data.data.error_msg) {
      throw new Error(data.data.error_msg);
    }
    return (data.data as WordsResult).words_result.map(v => v.words).join("\n")
  }

  public async createOrUpdateAccessToken() {
    if (this.accessToken) {
      return
    }
    const data = await axios.post(`https://aip.baidubce.com/oauth/2.0/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`)
    this.accessToken = data.data.access_token.trim()
    console.log(this.accessToken)
  }
}
