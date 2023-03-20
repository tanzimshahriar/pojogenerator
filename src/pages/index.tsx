import Head from "next/head";
import { Inter } from "next/font/google";
import { useState } from "react";
import { generateClasses } from "@/utils/generatePojo";
import JsonEditor from "@/components/JsonEditor";
import JavaEditor from "@/components/JavaEditor";
import Settings from "@/components/Settings";
import Image from "next/image";

const DEFAULT_SETTINGS = {
    parentClass: "Parent",
    packageName: "package com.model;",
    classHeader: "",
};

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const [jsonInput, setJsonInput] = useState("{}");
    const [page, setPage] = useState(-1);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [pojoClasses, setPojoClasses] = useState<
        Array<{ className: string; value: any }>
    >([]);
    const [error, setError] = useState(false);

    const generatePojo = () => {
        try {
            setPojoClasses(generateClasses(JSON.parse(jsonInput), settings));
            setPage(0);
            setError(false);
        } catch(e) {
            setError(true);
        }
    };

    return (
        <>
            <Head>
                <title>POJO Generator</title>
                <meta
                    name="description"
                    content="Generate Java POJO classes without any stress from json object"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main
                className={`${inter.className} text-sm bg-gray-900 min-h-screen flex flex-col text-white px-4`}
            >
                <header className="py-4 font-bold uppercase container mx-auto border-gray-800 border-b flex justify-between">
                    <Image
                        className="-ml-3"
                        src="/logo_transparent.png"
                        alt="logo"
                        width={220}
                        height={25}
                    />
                    <div className="flex flex-col justify-center">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 transition duration-300 rounded-full"
                        >
                            Settings
                        </button>
                    </div>
                </header>
                <nav className="container mx-auto flex flex-wrap gap-1 pt-4">
                    <button
                        className={`shadow-md py-2 px-4 rounded-sm ${
                            page === -1 ? "bg-gray-600" : "bg-gray-800"
                        }`}
                        onClick={() => setPage(-1)}
                    >
                        Json Editor
                    </button>
                    {pojoClasses.map((pojoTab, i) => (
                        <button
                            key={i}
                            className={`shadow-md py-2 px-4 rounded-sm ${
                                page === i ? "bg-gray-600" : "bg-gray-800"
                            }`}
                            onClick={() => setPage(i)}
                        >
                            {pojoTab.className}
                        </button>
                    ))}
                </nav>
                {showSettings && (
                    <Settings close={() => setShowSettings(false)} settings={settings} setSettings={setSettings} />
                )}
                <div className="container mx-auto py-4 lg:pb-8 flex flex-1">
                    <div className="flex flex-col w-full gap-2">
                        {error && <div className="text-red-500">Error! Your JSON object is invalid</div>}
                        <div className="flex-1">
                            {page === -1 ? (
                                <JsonEditor
                                    jsonInput={jsonInput}
                                    setJsonInput={setJsonInput}
                                />
                            ) : (
                                <JavaEditor value={pojoClasses[page].value} />
                            )}
                        </div>
                        <button
                            onClick={generatePojo}
                            className="bg-indigo-600 hover:bg-indigo-500 transition duration-300 p-4 font-bold lg:text-xl rounded-sm"
                        >
                            Generate
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
