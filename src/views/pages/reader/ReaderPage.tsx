import React from "react";
import { useSearchParams } from "react-router-dom";


import { Link } from "react-router-dom";
import PDFReader from "./PDFReader";

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
  return <div style={{height: '100%'}}>
      <Link to={"/"}>back</Link>
      <span>{searchParams.get("file")}</span>
      <PDFReader file={searchParams.get("file")!}/>
    </div>
}
