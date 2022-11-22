import styles from './Screenshot.module.css'
import {Modal} from 'antd'
import { useEffect, useRef } from 'react'
import Cropperjs from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import {Button} from 'antd'
import OCRService from 'services/OCRService'
import { saveAs } from 'file-saver';
import TimeUtils from 'utils/TimeUtils'

const ocrService = OCRService.newInstance()

export default function Screenshot(props: {screen: string,show: boolean, setShow: (show: boolean) => void}) {
  const cropper = useRef<Cropperjs>()
  useEffect(() => {
    if (props.show) {
      cropper.current?.destroy()
      cropper.current = new Cropperjs(document.getElementById('screenImg') as HTMLImageElement, {
        ready: () => {
          cropper.current?.clear()
        }
      })
    }
  }, [props.show])

  const ocr = async () => {
    const img = cropper.current?.getCroppedCanvas({
      maxHeight: 4096,
      maxWidth: 4096,
    }).toDataURL()!

    const text = await ocrService.ocr(img)
    fillOcrResult(text)
  }

  const fillOcrResult = (text: string) => {
    let elm = document.querySelector('.cropper-crop-box .ocr')
    if (!elm) {
      elm = document.createElement("div")
      elm.classList.add("ocr")
      document.querySelector('.cropper-crop-box')?.appendChild(elm)
    }
    elm.innerHTML = `<p contenteditable="true">${text}</p>`
  }

  const reset = () => {
    cropper.current?.clear()
    cropper.current?.setDragMode("crop")
    fillOcrResult('')
  }

  const save = () => {
    const img = cropper.current?.getCroppedCanvas({
      maxHeight: 4096,
      maxWidth: 4096,
    }).toDataURL()!
    saveAs(img, `${TimeUtils.formatTime(new Date())}.png`)
  }

  const exit = () => {
    props.setShow(false)
  }
  return (
    <div title="截图" style={{top: '4px', display: props.show? 'block': 'none', position: 'fixed', background: '#ccc'}}>
      <div className={styles.screenshot}>
        <div className={styles.opt}>
          <Button type="primary" onClick={ocr}>识别</Button>
          <Button type="primary" onClick={save}>保存</Button>
          <Button type="primary" onClick={reset}>重置</Button>
          <Button type="primary" onClick={exit}>退出</Button>
        </div>
        <div>
          <img id="screenImg" src={props.screen} style={{width: '100%', height: '100%'}}/>
        </div>
      </div>
    </div>
  )
}
