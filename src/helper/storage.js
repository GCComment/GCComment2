
export const GCC_setValue = (name, value) => {
    window.GM_setValue(name, value);
}

export const GCC_getValue = (name, default_value) => window.GM_getValue(name, default_value)

export const GCC_listValues = () => window.GM_listValues()

