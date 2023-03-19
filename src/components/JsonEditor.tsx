"useClient";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });

const JsonEditor = ({
    jsonInput,
    setJsonInput,
}: {
    jsonInput: string;
    setJsonInput: (v: string) => void;
}) => {
    function formatJSON(jsonInput: string): string | null | undefined {
        try {
            const res = JSON.parse(jsonInput);
            return JSON.stringify(res, null, 2);
        } catch {
            const errorJson = {
                error: `failed to format ${jsonInput}`,
            };
            return jsonInput;
        }
    }

    return (
        <MonacoEditor
            language="json"
            value={formatJSON(jsonInput)}
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
            onChange={(v) => setJsonInput(v)}
        />
    );
};

export default JsonEditor;
