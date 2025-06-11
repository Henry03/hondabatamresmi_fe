import React, { useEffect, useRef, useState } from 'react';

const TextEditor = ({setHtml, html}) => {
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);
    const [blockFormat, setBlockFormat] = useState('p');
    const [currentBlockTag, setCurrentBlockTag] = useState('P');
    const [htmlContent, setHtmlContent] = useState('');
    const [isFocused, setIsFocused] = useState(false);
  
    const handleInput = () => {
      addIdsToHeadings();
      setHtmlContent(editorRef.current.innerHTML);
      setHtml(editorRef.current.innerHTML);
    };
  
    const formatText = (command, value = null) => {
      document.execCommand(command, false, value);
      if (command === 'formatBlock' && value) {
        setCurrentBlockTag(value.replace(/[<>]/g, '').toUpperCase());
      }
      editorRef.current.focus();
      handleInput();
    };
  
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (!file || !file.type.startsWith('image/')) return;
  
      const reader = new FileReader();
      reader.onload = () => {
        insertImageAtCursor(reader.result);
      };
      reader.readAsDataURL(file);
    };
  
    const insertImageAtCursor = (imageDataUrl) => {
      const img = document.createElement('img');
      img.src = imageDataUrl;
      img.style.maxWidth = '100%';
  
      insertNodeAtCursor(img);
    };
  
    const insertNodeAtCursor = (node) => {
      const sel = window.getSelection();
      if (!sel.rangeCount) return;
  
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(node);
  
      // Move cursor after the node
      range.setStartAfter(node);
      range.setEndAfter(node);
      sel.removeAllRanges();
      sel.addRange(range);
  
      editorRef.current.focus();
      handleInput();
    };
  
    const triggerImageUpload = () => {
      fileInputRef.current.click();
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith('image/')) return;
  
      const reader = new FileReader();
      reader.onload = () => {
        insertImageAtCursor(reader.result);
      };
      reader.readAsDataURL(file);
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
    };
  
    const insertTable = () => {
      const rows = parseInt(prompt("Enter number of rows:"), 10);
      const cols = parseInt(prompt("Enter number of columns:"), 10);
      if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
        alert("Invalid table dimensions.");
        return;
      }
  
      const table = document.createElement('table');
    //   table.style.borderCollapse = 'collapse';
      table.style.width = '100%';
    //   table.style.margin = '8px 0';
  
      for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
          const td = document.createElement('td');
          td.textContent = ' ';
          td.style.border = '1px solid #ccc';
          td.style.padding = '8px';
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }
  
      insertNodeAtCursor(table);
    };

    const updateTable = () => {
        const table = getSelectedTable();
        if (!table) {
          alert("Please click inside a table to update it.");
          return;
        }
      
        const currentRows = table.rows.length;
        const currentCols = table.rows[0]?.cells.length || 0;
      
        const newRows = parseInt(prompt("New number of rows:", currentRows), 10);
        const newCols = parseInt(prompt("New number of columns:", currentCols), 10);
        if (isNaN(newRows) || isNaN(newCols) || newRows <= 0 || newCols <= 0) {
          alert("Invalid table size.");
          return;
        }
      
        // Clone current data
        const existingData = Array.from(table.rows).map(row =>
          Array.from(row.cells).map(cell => cell.textContent)
        );
      
        // Clear table
        while (table.firstChild) table.removeChild(table.firstChild);
      
        // Build new table with preserved data
        for (let i = 0; i < newRows; i++) {
          const tr = document.createElement('tr');
          for (let j = 0; j < newCols; j++) {
            const td = document.createElement('td');
            td.textContent = (existingData[i]?.[j]) || '';
            td.style.border = '1px solid #ccc';
            td.style.padding = '8px';
            tr.appendChild(td);
          }
          table.appendChild(tr);
        }
      
        editorRef.current.focus();
        handleInput();
      };

      const getSelectedTable = () => {
        const sel = window.getSelection();
        if (!sel.rangeCount) return null;
        let node = sel.getRangeAt(0).startContainer;
      
        while (node && node.nodeName !== 'TABLE') {
          node = node.parentNode;
        }
        return node?.nodeName === 'TABLE' ? node : null;
      };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        document.execCommand('insertLineBreak');
        handleInput();
      }
    };

const addIdsToHeadings = () => {
  const editor = editorRef.current;
  if (!editor) return;

  const headings = editor.querySelectorAll('h2, h3');

  let h2Count = 0;
  let h3Count = 0;

  headings.forEach((heading) => {
    if (heading.tagName === 'H2') {
      h2Count++;
      h3Count = 0;
      heading.id = `${h2Count}`;
    } else if (heading.tagName === 'H3') {
      h3Count++;
      heading.id = `${h2Count}-${h3Count}`;
    }
  });
};

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    // Delay blur to allow toolbar button click
    setTimeout(() => {
      if (document.activeElement !== editorRef.current && !editorRef.current.contains(document.activeElement)) {
        setIsFocused(false);
      }
    }, 100);
  };

    useEffect(() => {
      const handleSelectionChange = () => {
        const sel = document.getSelection();
        if (!sel.rangeCount) return;
        const node = sel.getRangeAt(0).startContainer;
        const block = node.nodeType === 3 ? node.parentElement : node;
        const tag = block.closest('p, h2, h3')?.tagName || 'P';
        setCurrentBlockTag(tag);
      };

      document.addEventListener('selectionchange', handleSelectionChange);
      return () => {
        document.removeEventListener('selectionchange', handleSelectionChange);
      };
    }, []);

  useEffect(() => {
    if (editorRef.current && html) {
      editorRef.current.innerHTML = html;
    }
  }, [html]);
  
    return (
      <div className="w-full">
        <div className={`mb-2 space-x-2 flex editor-toolbar transition-opacity duration-200 ${isFocused ? '' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}`}>
        {/* <div className={`mb-2 space-x-2 flex editor-toolbar transition-opacity duration-200`}> */}
          <select
            onChange={(e) => formatText('formatBlock', e.target.value)}
            className="btn btn-outline"
            value={currentBlockTag}
          >
            <option value="H2">Heading 2</option>
            <option value="H3">Heading 3</option>
            <option value="P">Paragraph</option>
          </select>
          <button onClick={() => formatText('bold')} className="btn btn-outline btn-square"><span className="icon-[jam--bold] size-7 text-base"></span></button>
          <button onClick={() => formatText('italic')} className="btn btn-outline btn-square"><span className="icon-[jam--italic] size-7 text-base"></span></button>
          <button onClick={() => formatText('underline')} className="btn btn-outline btn-square"><span className="icon-[jam--underline] size-7 text-base"></span></button>
          <div className="divider divider-horizontal divider-neutral"></div>

          {/* Alignment */}
          <button onClick={() => formatText('justifyLeft')} className="btn btn-outline btn-square"><span className="icon-[jam--align-left] size-7 text-base"></span></button>
          <button onClick={() => formatText('justifyCenter')} className="btn btn-outline btn-square"><span className="icon-[jam--align-center] size-7 text-base"></span></button>
          <button onClick={() => formatText('justifyRight')} className="btn btn-outline btn-square"><span className="icon-[jam--align-right] size-7 text-base"></span></button>
          <button onClick={() => formatText('justifyFull')} className="btn btn-outline btn-square"><span className="icon-[jam--align-justify] size-7 text-base"></span></button>
          <button onClick={() => formatText('insertUnorderedList')} className="btn btn-outline btn-square"><span className="icon-[jam--unordered-list] size-7 text-base"></span></button>
          <button onClick={() => formatText('insertOrderedList')} className="btn btn-outline btn-square"><span className="icon-[jam--ordered-list] size-7 text-base"></span></button>
          
          <div className="divider divider-horizontal divider-neutral"></div>
          <button onClick={triggerImageUpload} className="btn btn-outline btn-square"><span className="icon-[eva--image-outline] size-7 text-base"></span></button>
          <button onClick={insertTable} className="btn btn-outline btn-square"><span className="icon-[jam--table-cell] size-5 text-base"></span></button>
          <button onClick={updateTable} className="btn btn-outline btn-square"><span className="icon-[jam--table-cell-merge] size-5 text-base"></span></button>

            {/* Lists */}
            <button onClick={() => formatText('insertHorizontalRule', '<hr class="my-4 border-t border-gray-300" />')} className="btn btn-outline btn-square"><span className="icon-[pepicons-pop--line-x] size-7 text-base"></span></button>


  
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>
  
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="text-editor h-[calc(100dvh-18rem)] p-2 border border-base-200 bg-white rounded list-inside list-disc overflow-y-scroll scroll-smooth"
          suppressContentEditableWarning={true}
        >
          {html}
        </div>
  
        {/* <div className="mt-4">
          <h4 className="font-bold mb-1">HTML Output:</h4>
          <pre className="bg-gray-100 p-2 overflow-auto whitespace-pre-wrap">{htmlContent}</pre>
        </div> */}
      </div>
    );
  };

export default TextEditor;