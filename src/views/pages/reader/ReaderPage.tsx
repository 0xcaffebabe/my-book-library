import React, {useState} from "react";
import { useSearchParams } from "react-router-dom";


import { Link } from "react-router-dom";
import PDFReader from "./PDFReader";
import EPUBReader from './EPUBReader'
import { Button } from "antd";
import Screenshot from "./component/Screenshot";
const {ipcRenderer} = require('electron')

export default function ReaderPage() {
  const [showScreenshot, setShowScreenshot] = useState(false)
  const [screen, setScreen] = useState('')

  ipcRenderer.on('screenshot', (event, image) => {
    setScreen(image)
    setShowScreenshot(true)
  });

  const [searchParams, setSearchParams] = useSearchParams();
  let reader: React.ReactNode = <div>unknow</div>
  const filename = searchParams.get("file")
  if (filename?.endsWith('pdf')) {
    reader = <PDFReader file={searchParams.get("file")!}/>
  }
  if (filename?.endsWith('epub')) {
    reader = <EPUBReader file={searchParams.get("file")!}/>
  }

  const screenshot = () => {
    ipcRenderer.send("screenshot")
  }
  return <div style={{height: '100%'}}>
      <Link to={"/"}>back</Link>
      <Button type="primary" onClick={screenshot}>截屏</Button>
      <Button type="primary" onClick={() => setShowScreenshot(false)}>清除截屏</Button>
      <span>{searchParams.get("file")}</span>
      <Screenshot show={showScreenshot} setShow={setShowScreenshot} screen={screen}/>
      {reader}
    </div>
}
