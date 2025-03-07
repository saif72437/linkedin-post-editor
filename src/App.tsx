import React, { useState, useRef, useEffect } from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import profile from "./images/profile.jpg"
import { IoLogoLinkedin } from "react-icons/io5";

import { motion } from 'framer-motion';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Copy,
  Undo2,
  Redo2,
  Trash2,
  SortAsc,
  SortDesc,
  Smartphone,
  Monitor
} from 'lucide-react';

// Create a forwardRef wrapper for ReactQuill to fix findDOMNode warning
const QuillWrapper = React.forwardRef<ReactQuill, ReactQuillProps>((props, ref) => {
  return <ReactQuill ref={ref} {...props} />;
});

// Add font whitelist to Quill
const Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = [
  'Poppins',
  'Roboto',
  'Montserrat',
  'Inter',
  'Fira-Code',
  'Source-Sans-Pro',
  'Arial',
  'Times-New-Roman',
  'Georgia',
  'Courier-New'
];
ReactQuill.Quill.register(Font, true);

const modules = {
  toolbar: {
    container: [
      [{ 'font': Font.whitelist }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean'],
      ['undo', 'redo']
    ],
  }
};

function App() {
  const [editorContent, setEditorContent] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const quillRef = useRef<ReactQuill>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(editorContent);
  };

  const handleClear = () => {
    setEditorContent('');
  };

  const handleUndo = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.history.undo();
    }
  };

  const handleRedo = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.history.redo();
    }
  };

  const sortList = (ascending: boolean) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const selection = editor.getSelection();
      if (selection) {
        const [line] = editor.getLine(selection.index);
        if (line && line.parent.domNode.tagName === 'OL' || line.parent.domNode.tagName === 'UL') {
          const list = Array.from(line.parent.domNode.children)
            .map(item => item.textContent)
            .sort((a, b) => ascending ? 
              a.length - b.length : 
              b.length - a.length
            );
          
          const format = line.parent.domNode.tagName === 'OL' ? 'ordered' : 'bullet';
          editor.deleteText(line.parent.offset(), line.parent.length());
          list.forEach(item => {
            editor.insertText(editor.getLength() - 1, item + '\n', format);
          });
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 relative overflow-hidden font-poppins">

      {/* Light beams */}
      <div className="light-beam top-0 left-0 animate-pulse" />
      <div className="light-beam bottom-0 right-0 bg-blue-500/20" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl shadow-xl shadow-purple-500/5 p-6 mb-8 border border-gray-700"
        >
          <div className="flex flex-wrap gap-4 mb-6">
            <button onClick={() => handleCopy()} className="btn-tool">
              <Copy size={20} /> Copy
            </button>
            <button onClick={() => handleClear()} className="btn-tool">
              <Trash2 size={20} /> Clear
            </button>
            <button onClick={() => handleUndo()} className="btn-tool">
              <Undo2 size={20} /> Undo
            </button>
            <button onClick={() => handleRedo()} className="btn-tool">
              <Redo2 size={20} /> Redo
            </button>
            {/* <button onClick={() => sortList(true)} className="btn-tool">
              <SortAsc size={20} /> Sort Asc
            </button>
            <button onClick={() => sortList(false)} className="btn-tool">
              <SortDesc size={20} /> Sort Desc
            </button> */}
          </div>

          <QuillWrapper
            ref={quillRef}
            theme="snow"
            value={editorContent}
            onChange={setEditorContent}
            modules={modules}
            className="h-[300px] mb-12"
          />
        </motion.div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-200">Preview</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`btn-preview ${previewMode === 'desktop' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-200'}`}
            >
              <Monitor size={20} />
              Desktop
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`btn-preview ${previewMode === 'mobile' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-200'}`}
            >
              <Smartphone size={20} />
              Mobile
            </button>
          </div>
        </div>

        <motion.div
          layout
          className={`bg-gray-800 rounded-2xl shadow-xl shadow-purple-500/5 overflow-hidden border border-gray-700 ${
            previewMode === 'mobile' ? 'max-w-[420px]' : 'w-full'
          } mx-auto`}
        >
          <div className="bg-[#0a66c2] p-4">
            {/* <img
              src="https://images.unsplash.com/photo-1611944212129-29977ae1398c?auto=format&fit=crop&q=80&w=2574&ixlib=rb-4.0.3"
              alt="LinkedIn"
              className="h-8"
            /> */}
            <IoLogoLinkedin className="text-4xl" />

          </div>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <img
                src={profile}
                alt="Profile"
                className="w-12 h-12 object-cover rounded-full mr-4"
              />
              <div>
                <h3 className="font-semibold text-gray-200">Saif</h3>
                <p className="text-gray-400 text-sm">Software Engineer</p>
              </div>
            </div>
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: editorContent }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;