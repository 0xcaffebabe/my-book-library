
export default {
  url2name(url: string) {
    const arr = url.split("/")
    return arr[arr.length - 1];
  }
}
