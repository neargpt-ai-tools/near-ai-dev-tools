// app/components/CodeEditor.js
"use client";


export const CodeEditor = ({ code }) => {
    return (
        <div>
            <h3>Generated Smart Contract Code:</h3>
            <pre>{code}</pre>
        </div>
    );
};

