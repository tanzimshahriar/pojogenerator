"useClient";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });

const JavaEditor = ({ value }: { value: string }) => {
    return (
        <MonacoEditor
            language="java"
            value={value}
            theme="vs-dark"
            options={{
                minimap: {
                    enabled: false,
                },
                autoIndent: "full",
                contextmenu: false,
                formatOnPaste: true,
                formatOnType: true,
            }}
        />
    );
};

export default JavaEditor;
