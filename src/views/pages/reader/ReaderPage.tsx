import React from "react";
import { useSearchParams } from "react-router-dom";


import { Link } from "react-router-dom";
import PDFReader from "./PDFReader";
import EPUBReader from './EPUBReader'

// export default class ReaderPage extends React.Component<{}, {}> {

//   render() {
//     const [searchParams, setSearchParams] = useSearchParams();
//     console.log()
//     return <div style={{height: '100%'}}>
//       <Link to={"/"}>back</Link>
//       {/* <span>{searchParams.get("file")}</span> */}
//       {/* <PDFReader file=""/> */}
//     </div>
//   }
// }

export default function ReaderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  let reader: React.ReactNode = <div>unknow</div>
  const filename = searchParams.get("file")
  if (filename?.endsWith('pdf')) {
    reader = <PDFReader file={searchParams.get("file")!}/>
  }
  if (filename?.endsWith('epub')) {
    reader = <EPUBReader file={searchParams.get("file")!}/>
  }
  return <div style={{height: '100%'}}>
      <Link to={"/"}>back</Link>
      <span>{searchParams.get("file")}</span>
      {reader}
    </div>
}
