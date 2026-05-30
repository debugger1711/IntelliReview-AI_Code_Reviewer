import { useRef, useEffect, useState } from 'react';
import { cn } from '../lib/utils';

const CodeEditor = ({ value, onChange, language = 'javascript', className }) => {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const lines = (value || '').split('\n').length;
    setLineCount(Math.max(lines, 13)); 
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
    <div className={cn("relative flex w-full font-mono text-sm", className)} style={{ minHeight: '320px', maxHeight: '500px' }}>
      {/* Line Numbers */}
      <div
        ref={lineNumbersRef}
        className="flex select-none flex-col border-r border-[#333333] bg-[#1E1E1E] py-4 pl-4 pr-3 text-right text-[#858585] overflow-hidden"
        style={{ minWidth: '48px' }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="leading-relaxed">
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
        className="flex-1 resize-none overflow-auto whitespace-pre bg-[#1E1E1E] p-4 text-[#D4D4D4] outline-none leading-relaxed"
        style={{ tabSize: 2 }}
        placeholder={`// Paste your ${language} code here...`}
      />
    </div>
  );
};

export default CodeEditor;
