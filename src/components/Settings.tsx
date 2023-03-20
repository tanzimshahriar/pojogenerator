import Image from "next/image";
import { useState } from "react";
import { ZodError, ZodIssue, z } from "zod";

export interface settings {
    parentClass: string; 
    packageName: string; 
    classHeader: string;
}

const parentClassRegex = /^$|[A-Z]{1}[A-Za-z]*$/;
const packageNameRegex = /^$|package [a-z][a-z0-9_]*(.[a-z0-9_]+)+[0-9a-z_];$/;
const classHeaderRegex =
    /^$|(\/\*[\w\'\s\r\n\*]*\*\/)|(\/\/[\w\s\']*)|(\<![\-\-\s\w\>\/]*\>)/;

const settingsSchema = z.object({
    parentClass: z.string().regex(parentClassRegex),
    packageName: z.string().regex(packageNameRegex),
    classHeader: z.string().regex(classHeaderRegex),
});

const Settings = ({
    close,
    settings,
    setSettings,
}: {
    close: () => void;
    settings: settings;
    setSettings: (settings: settings) => void;
}) => {
    const [validationErrors, setValidationErrors] = useState<
        Array<{ type: string; message: string }>
    >([]);
    const [settingsInput, setSettingsInput] = useState(settings);

    const save = () => {
        try {
            settingsSchema.parse(settingsInput);
            setZodErrors([]);
            setSettings(settingsInput);
            close();
        } catch (e) {
            console.log(e)
            if (e instanceof ZodError) {
                setZodErrors(e.errors);
            }
        }
    }

    const setZodErrors = (errors: ZodIssue[]) => {
        setValidationErrors(
            errors.map((e) => {
                return {
                    type: e.path[0].toString(),
                    message: e.message,
                };
            })
        );
    };

    return (
        <div
            onClick={close}
            className="fixed bg-gray-800 bg-opacity-50 backdrop-blur-sm left-0 w-screen min-h-screen z-10 flex items-center md:pb-12 lg:pb-24"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="mx-auto lg:w-3/4 px-4 bg-black rounded-md"
            >
                <div className="flex justify-between items-center border-b border-gray-700 py-1 lg:py-2">
                    <div>Settings</div>
                    <button className="p-3 lg:p-4" onClick={close}>
                        <Image
                            src="/close.png"
                            alt="close-btn"
                            width={10}
                            height={10}
                        />
                    </button>
                </div>
                <div className="py-4 grid lg:grid-cols-4 gap-y-3 md:gap-y-4 lg:gap-y-6">
                    <div>
                        <div>Parent class</div>
                        {validationErrors.find(
                            (e) => e.type === "parentClass"
                        ) && (
                            <div className="text-[10px] text-red-500 pt-1 lg:text-xs">
                                Error! Invalid parent class
                            </div>
                        )}
                    </div>
                    <input
                        className="col-span-3 p-2 rounded-sm md:p-3 bg-[#1E1E1E] outline-none"
                        placeholder="Enter parent class name"
                        defaultValue={settingsInput.parentClass}
                        onChange={(e) =>
                            setSettingsInput({
                                ...settingsInput,
                                parentClass: e.target.value,
                            })
                        }
                    />
                    <div>
                        <div>Package name</div>
                        {validationErrors.find(
                            (e) => e.type === "packageName"
                        ) && (
                            <div className="text-[10px] text-red-500 pt-1 lg:text-xs">
                                Error! Invalid package name
                            </div>
                        )}
                    </div>
                    <input
                        className="col-span-3 p-2 rounded-sm md:p-3 bg-[#1E1E1E] outline-none"
                        placeholder="package com.model;"
                        defaultValue={settingsInput.packageName}
                        onChange={(e) =>
                            setSettingsInput({
                                ...settingsInput,
                                packageName: e.target.value,
                            })
                        }
                    />
                    <div>
                        <div>Class header comment</div>
                        {validationErrors.find(
                            (e) => e.type === "classHeader"
                        ) && (
                            <div className="text-[10px] text-red-500 pt-1 lg:text-xs">
                                Error! Invalid header, must be comment
                            </div>
                        )}
                    </div>
                    <textarea
                        className="col-span-3 p-2 rounded-sm md:p-3 bg-[#1E1E1E] outline-none h-24 lg:h-32"
                        placeholder="// Copyright @Your company 2023"
                        defaultValue={settingsInput.classHeader}
                        onChange={(e) =>
                            setSettingsInput({
                                ...settingsInput,
                                classHeader: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="flex justify-end pb-4">
                    <button
                        onClick={save}
                        className="py-2 px-4 font-bold bg-indigo-600 hover:bg-indigo-500 transition duration-300 rounded-sm"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
