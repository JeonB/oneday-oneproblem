import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useCode } from "./context/CodeContext";
export default function CodeEditor() {
  const codeContext = useCode();
  const { code, setCode } = codeContext;
  const onChange = (e: React.SetStateAction<string>) => {
    setCode(e); // CodeMirror의 값이 변할 때마다 호출되어서 값이 저장된다.
  };

  return (
    <CodeMirror
      value={code}
      onChange={onChange}
      height="70vh"
      theme="dark"
      extensions={[javascript({ jsx: true })]}
    />
  );
}
