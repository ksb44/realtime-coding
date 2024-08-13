



import { useState, useEffect } from "react";
import { executeCode } from "../utility/api";
import { useDispatch, useSelector } from "react-redux";
import { setCode } from "../utility/codeSlice";
import { ACTIONS } from "../../utility/Actions";
const Output = ({ editorRef, socketRef, language, roomId, onCodeChange }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const code = useSelector((state) => state.code.initCode);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editorRef.current) {
      const sourceCode = editorRef.current.getValue();
      if (sourceCode) {
        dispatch(setCode(sourceCode));
        if (onCodeChange && typeof onCodeChange === 'function') {
          onCodeChange(sourceCode);
        }
      }
    }
  }, [editorRef.current?.getValue()]);

  useEffect(() => {
    const handleCodeChange = ({ code, socketId }) => {
      try {
        if (editorRef.current && code !== '' && typeof code === 'string' && socketId !== socketRef.current.id) {
          const cursorPosition = editorRef.current.getPosition();
          editorRef.current.setValue(code);
          editorRef.current.setPosition(cursorPosition);
        }
      } catch (error) {
        console.error("Error handling code change:", error);
      }
    };

    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);
      socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
      };
    }
  }, [socketRef.current, code, roomId]);

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      setIsError(!!result.stderr);
    } catch (error) {
      console.error("Error executing code:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

   return (
    <div className="w-1/2">
      <div className="mb-2 text-lg font-semibold text-white">Output</div>
      <button
        className={`mb-4 px-4 py-2 border rounded ${isLoading ? "bg-gray-400" : "bg-green-500 text-white"} border-green-500`}
        onClick={runCode}
        disabled={isLoading}
      >
        {isLoading ? "Running..." : "Run Code"}
      </button>
      <div
        className={`w-[80vh] h-[75vh] p-2 border rounded ${isError ? "border-red-500 text-red-400" : "border-gray-700"} ${isError ? "text-red-400" : "text-gray-200"}`}
      >
        {output
          ? output.map((line, i) => <div key={i}>{line}</div>)
          : 'Click "Run Code" to see the output here'}
      </div>
    </div>
  );
};

export default Output;
