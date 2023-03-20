import { settings } from "@/components/Settings";

const KNOWN_TYPES = [
    "string",
    "boolean",
    "long",
    "object",
    "double",
    "list<string>",
    "list<boolean>",
    "list<double>",
    "list<long>",
];

export const generateClasses = (json: JSON, settings:settings) => {
    const keys =
        json instanceof Array
            ? json[0] &&
              typeof json[0] !== "string" &&
              typeof json[0] !== "boolean" &&
              typeof json[0] !== "number"
                ? Object.keys(json[0])
                : []
            : Object.keys(json);
    const values = Object.values(
        json instanceof Array
            ? json[0] &&
              typeof json[0] !== "string" &&
              typeof json[0] !== "boolean" &&
              typeof json[0] !== "number"
                ? json[0]
                : {}
            : json
    );
    const classes: any = [];
    const variables = getVariables(keys, values, classes, settings);

    classes.push({
        className: `${
            settings.parentClass.charAt(0).toUpperCase() + settings.parentClass.slice(1)
        }.java`,
        value: generateClass(settings.parentClass, variables, settings),
    });
    return classes;
};

const generateClass = (className: string, variables: any[], settings:settings) => {
    return `${settings.classHeader !== ""? settings.classHeader + '\n': ""}${settings.packageName}\n\nimport java.io.Serializable;\nimport com.google.common.base.MoreObjects;\n${
        variables.filter((v) => v.type.includes("List<")).length > 0
            ? "import java.util.List;\n"
            : ""
    }\npublic class ${className} implements Serializable {
    ${variables.length > 0 ? generateGetterSetter(variables) : ""}
    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)${
            variables.length > 0
                ? `\n${variables
                      .map((v: { name: any }) => {
                          return `            .add("${v.name}", ${v.name})`;
                      })
                      .join("\n")}`
                : ""
        }
            .toString();
    }
}`;
};

const generateGetterSetter = (variables: any[]) => {
    return `${variables
        .map((v: { type: any; name: string }) => {
            return `private ${v.type} ${v.name};`;
        })
        .join("\n    ")}

    ${variables
        .map((v: { type: any; name: string }) => {
            const getterMethodName =
                (v.type === "boolean"
                    ? "is"
                    : "get") + v.name.charAt(0).toUpperCase() + v.name.slice(1);
            return `public ${v.type} ${getterMethodName}() {
        return ${v.name};
    }

    public ${v.type} set${v.name.charAt(0).toUpperCase() + v.name.slice(1)}(${
                v.type
            } ${v.name}) {
        this.${v.name} = ${v.name};
    }
    `;
        })
        .join("\n    ")}`;
};

const getVariables = (keys: string[], values: any[], classes: any[], settings:settings) => {
    return keys.map((k: string, i) => {
        let type = getType(values[i], k);
        if (!KNOWN_TYPES.includes(type.toLowerCase())) {
            let childJson = values[i];
            const childKeys =
                childJson instanceof Array
                    ? childJson[0] &&
                      typeof childJson[0] !== "string" &&
                      typeof childJson[0] !== "boolean" &&
                      typeof childJson[0] !== "number"
                        ? Object.keys(childJson[0])
                        : []
                    : Object.keys(childJson);
            const childValues = Object.values(
                childJson instanceof Array
                    ? childJson[0] &&
                      typeof childJson[0] !== "string" &&
                      typeof childJson[0] !== "boolean" &&
                      typeof childJson[0] !== "number"
                        ? childJson[0]
                        : {}
                    : childJson
            );

            if (!KNOWN_TYPES.includes(type.toLowerCase())) {
                classes.push({
                    className: `${k.charAt(0).toUpperCase() + k.slice(1)}.java`,
                    value: generateClass(
                        `${k.charAt(0).toUpperCase() + k.slice(1)}`,
                        getVariables(childKeys, childValues, classes, settings),
                        settings
                    ),
                });
            }
        }
        return {
            type,
            name: k,
        };
    });
};

const getType = (value: any, key: String): string => {
    if (value == null) {
        return "Object";
    } else if (typeof value === "string") {
        return "String";
    } else if (typeof value === "boolean") {
        return "boolean";
    } else if (value instanceof Array) {
        if (
            typeof value[0] === "string" ||
            typeof value[0] === "boolean" ||
            typeof value[0] === "number"
        ) {
            if (typeof value[0] === "number") {
                const numberType = getNumberType(value[0]);
                return `List<${
                    numberType.charAt(0).toUpperCase() + numberType.slice(1)
                }>`;
            } else if (typeof value[0] === "boolean") {
                return `List<Boolean>`;
            } else {
                return `List<${getType(value[0], typeof value[0])}>`;
            }
        } else return `List<${getType(value[0], key)}>`;
    } else if (typeof value === "number") {
        return getNumberType(value);
    } else {
        return key.charAt(0).toUpperCase() + key.slice(1);
    }
};

const getNumberType = (value: any) => {
    if (parseInt(value.toString()) === value) {
        return "long";
    } else {
        return "double";
    }
};
