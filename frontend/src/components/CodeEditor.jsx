import { useRef, useEffect, useState } from 'react';

const CodeEditor = ({ value, onChange, language = 'javascript' }) => {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const lines = (value || '').split('\n').length;
    setLineCount(Math.max(lines, 13)); // At least 13 lines to match screenshot height roughly
  }, [value]);

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[#1f2937] bg-[#0b0f19]">
      <div className="flex relative" style={{ minHeight: '320px', maxHeight: '500px' }}>
        {/* Line Numbers */}
        <div
          ref={lineNumbersRef}
          className="py-4 pl-3 pr-4 select-none overflow-hidden bg-transparent border-r border-[#1f2937]"
          style={{ minWidth: '40px' }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i}
              className="text-right text-sm leading-[1.6] font-mono text-gray-500"
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 bg-transparent text-gray-300 p-4 outline-none resize-none overflow-auto whitespace-pre font-mono text-sm leading-[1.6]"
          style={{ tabSize: 2, caretColor: '#a855f7' }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
