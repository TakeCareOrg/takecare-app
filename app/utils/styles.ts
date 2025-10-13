export function padding(a: number, b?: number, c?: number, d?: number) {
    return {
        paddingTop: a,
        paddingRight: b !== undefined ? b : a,
        paddingBottom: c !== undefined ? c : a,
        paddingLeft: d !== undefined ? d : b !== undefined ? b : a,
    };
}

export function margin(a: number, b?: number, c?: number, d?: number) {
    return {
        marginTop: a,
        marginRight: b !== undefined ? b : a,
        marginBottom: c !== undefined ? c : a,
        marginLeft: d !== undefined ? d : b !== undefined ? b : a,
    };
}
