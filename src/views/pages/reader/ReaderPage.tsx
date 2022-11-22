import React, {useRef, useState} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import PDFReader from "./PDFReader";
import EPUBReader from './EPUBReader'
import Screenshot from "./component/Screenshot";
import ReaderHeader from "./component/ReaderHeader";
const {ipcRenderer} = require('electron')

export default function ReaderPage() {
  const [showScreenshot, setShowScreenshot] = useState(false)
  const [screen, setScreen] = useState('')
  const navigate = useNavigate()

  ipcRenderer.removeAllListeners('screenshot-action')
  ipcRenderer.removeAllListeners('back-action')
  ipcRenderer.removeAllListeners('eyes-mode-action')
  ipcRenderer.removeAllListeners('category-action')

  ipcRenderer.on('screenshot-action', () => {
    screenshot()
  })

  ipcRenderer.on('back-action', () => {
    navigate("/")
  })

  ipcRenderer.on('eyes-mode-action', () => {
    enterEyeMode()
  })

  ipcRenderer.on('category-action', () => {
    openCategory()
  })


  const [searchParams, setSearchParams] = useSearchParams();
  const filename = searchParams.get("file") || ''
  const pdfRef = React.createRef<PDFReader>()
  const epubRef = React.createRef<EPUBReader>()
  const readerTemplate = () => {
    if (filename?.endsWith('pdf')) {
      return <PDFReader file={filename} ref={pdfRef}/>
    }
    return <EPUBReader file={filename} ref={epubRef}/>
  }


  const enterEyeMode = () => {
    pdfRef.current?.eyesMode()
    epubRef.current?.eyesMode()
  }

  const openCategory = () => {
    (pdfRef.current || epubRef.current)?.openCategory()
  }

  const screenshot = () => {
    const img = ipcRenderer.sendSync("screenshot")
    setScreen(img)
    setShowScreenshot(true)
  }
  return <div style={{height: '100%'}}>
      {/* <ReaderHeader screenshot={screenshot} clearScreenshot={() => setShowScreenshot(false)} file={filename} enterEyeMode={enterEyeMode} openCategory={openCategory}/> */}
      <Screenshot show={showScreenshot} setShow={setShowScreenshot} screen={screen}/>
      {readerTemplate()}
    </div>
}
