

import { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../utility/constants";
import Output from "./Output";
import Client from "./Client";
import { initSocket } from "../../utility/socket";
import { ACTIONS } from "../../utility/Actions";
import { useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import { toast } from "react-toastify";

const CodeEditor = () => {
  const socketRef = useRef(null);
  const editorRef = useRef();
  const location = useLocation();
  const reactNavigate = useNavigate();
  const { id } = useParams();
  const [clients, setClients] = useState([]);
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("Select Language");

  useEffect(() => {
    const initSocketConnection = async () => {
      try {
        socketRef.current = await initSocket();
        socketRef.current.on('connect_error', handleErrors);
        socketRef.current.on('connect_failed', handleErrors);
        socketRef.current.emit(ACTIONS.JOIN, { id, username: location.state?.user });

        function handleErrors(e) {
          toast.error(`Error in socket ${e.message}`);
          reactNavigate('/');
        }

        socketRef.current.on(ACTIONS.JOINED, ({ clients, username, code }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room`);
          }
          setClients(clients);
          if (editorRef.current && typeof code === 'string') {
            editorRef.current.setValue(code);
          }
        });

       

        socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code, socketId }) => {
          if (editorRef.current && socketId !== socketRef.current.id) {
            const cursorPosition = editorRef.current.getPosition();
            editorRef.current.setValue(code);
            editorRef.current.setPosition(cursorPosition);
          }
        });

        socketRef.current.on(ACTIONS.DISCONNECTED, ({ username, socketId }) => {
          toast.success(`${username} left the room`);
          setClients(prev => prev.filter(client => client.socketId !== socketId));
        });

      } catch (error) {
        console.error('Socket initialization error:', error);
        reactNavigate('/');
      }
    };

    initSocketConnection();

    return () => {

        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.CODE_CHANGE); 
        socketRef.current.off(ACTIONS.JOINED); 
      
    };
  }, [id, location.state?.user, reactNavigate]);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    // setValue(CODE_SNIPPETS[language]);
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success('Room Id has been copied');
    } catch (err) {
      console.log(err);
      toast.error('Could not copy the Room Id');
    }
  };

  const leaveRoom = () => {
    reactNavigate('/');
  };

  return (
    <div className="grid grid-cols-12 space-x-4 mt-5">
      <div className="col-span-2">
        <div className="border-b-2 m-5 mt-2 text-center">
          <img
            className="border-2 rounded-xl flex justify-center mx-1 animate-bounce"
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flookaside.fbsbx.com%2Flookaside%2Fcrawler%2Fmedia%2F%3Fmedia_id%3D100040650386267&f=1&nofb=1&ipt=063784562cb59506618b7b60ed2683e5f7f70685e876dbaddd7f9c0536f74f49&ipo=images"
            width={60}
            alt="logo"
          />
        </div>
        <p className="text-white text-center">Connected:</p>
        <div className="mt-4 flex flex-wrap space-x-3">
          {clients.map(client => (
            <Client key={client.socketId} username={client.username} />
          ))}
        </div>
        <div className="text-white flex space-x-2 py-4 absolute bottom-0">
          <button className='text-sm bg-purple-800 rounded-2xl p-2 hover:bg-purple-900' onClick={copyRoomId}>Copy ROOM ID</button>
          <button className='text-sm bg-purple-800 hover:bg-purple-900 rounded-2xl p-2' onClick={leaveRoom}>Leave</button>
        </div>
      </div>
      <div className="col-span-5">

        <LanguageSelector language={language} onSelect={onSelect} />
        <Editor
          options={{ minimap: { enabled: false } }}
          height="75vh"
          theme="vs-dark"
          language={language}
          defaultValue={CODE_SNIPPETS[language]}
          onMount={onMount}
          value={value}
          onChange={(value) => {
            setValue(value);
            if (socketRef.current) {
              socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                roomId: id,
                code: value,
                socketId: socketRef.current.id
              });
            }
          }}
        />
      </div>
      <div className="col-span-5 border-b-1">
        <Output editorRef={editorRef} socketRef={socketRef} language={language} roomId={id} onCodeChange={(code) => {
          if (socketRef.current) {
            socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId: id, code, socketId: socketRef.current.id });
          }
        }} />
      </div>
    </div>
  );
};

export default CodeEditor;


