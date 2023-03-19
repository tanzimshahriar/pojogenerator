export const generateClasses = (json: JSON, className = "Parent") => {
    const keys = Object.keys(json);
    const values = Object.values(json);
    const classes:any = [];
    const variables = getVariables(keys, values, classes);

    classes.push({
            className: `${className.charAt(0).toUpperCase() + className.slice(1)}.java`,
            value: generateClass(className, variables),
        },
    );
    return classes;
};

const generateClass = (className: string, variables: any[]) => {
    return `package com.model;\nimport java.io.Serializable;\n\npublic class ${className} implements Serializable {
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
            return `public ${v.type} get${
                v.name.charAt(0).toUpperCase() + v.name.slice(1)
            }() {
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

const getVariables = (keys:string[], values:any[], classes:any[]) => {
    return keys.map((k:string, i) => {
        let type = getType(values[i], k);
        // if (type !== "String" && type !== "Boolean" && !type.includes("List")) {
        //     classes.push({
        //         className: `${k.charAt(0).toUpperCase() + k.slice(1)}.java`,
        //         value: generateClass(
        //             `${k.charAt(0).toUpperCase() + k.slice(1)}`,
        //             getVariables()
        //         ),
        //     });
        // }
        return {
            type,
            name: k,
        };
    });
}

const getType = (value: object, key: String): string => {
    if (value === null || typeof value === "string") {
        return "String";
    } else if (typeof value === "boolean") {
        return "Boolean";
    } else if (value instanceof Array) {
        return `List<${getType(value[0], "unknown")}>`;
    } else {
        return key.charAt(0).toUpperCase() + key.slice(1);
    }
};
