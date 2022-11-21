import os from 'os'

export default {
  isMac() {
    return os.platform().indexOf("darwin") != -1
  }
}
