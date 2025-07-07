import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';

import { useParams } from 'react-router-dom';
import {
  emitCodeChange,
  joinEditor,
  subscribeToCodeChange,
  subscribeToJoinedEditor,
  unsubscribeFromCodeChange,
  unsubscribeFromJoinedEditor,
} from '../../socketConn/socketConn';

const Editor = () => {
  const editorRef = useRef(null);
  const codeRef = useRef('');
  const { roomId } = useParams();

  useEffect(() => {
    // Prevent multiple editors
    if (editorRef.current) return;

    const textarea = document.getElementById('realtimeEditor');
    if (!textarea) return;

    // Initialize CodeMirror
    editorRef.current = Codemirror.fromTextArea(textarea, {
      mode: { name: 'javascript', json: true },
      theme: 'dracula',
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
    });

    joinEditor(localStorage.getItem("username"), roomId);
    // Local change handler
    editorRef.current.on('change', (instance, changes) => {
      const { origin } = changes;
      const code = instance.getValue();
      codeRef.current = code;
      
      if (origin !== 'setValue') {
        emitCodeChange(roomId, code);
      }
    });
    
    // Setup socket sync after CodeMirror is initialized
    const codeChangeHandler = (code) => {
      if (
        code !== null &&
        editorRef.current &&
        code !== editorRef.current.getValue()
      ) {
        editorRef.current.setValue(code);
      }
    };

    subscribeToJoinedEditor(codeChangeHandler,roomId);
    subscribeToCodeChange(codeChangeHandler);

    // Cleanup on unmount
    return () => {
      unsubscribeFromCodeChange();
      unsubscribeFromJoinedEditor();

      if (editorRef.current) {
        editorRef.current.toTextArea(); // remove CodeMirror
        editorRef.current = null;
      }
    };
  }, [roomId]);

  return (
    <div style={{ height: '100vh', width: '100%' , paddingTop:'60px'}}>
      <textarea id="realtimeEditor" />
    </div>
  );
};

export default Editor;
