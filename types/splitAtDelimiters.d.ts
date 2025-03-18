type Delimiter = {
    left: string;
    right: string;
    display: boolean;
};

type Result = {
    type: string;
    data: string;
    rawData: string;
    display: boolean;
};

declare module 'katex/contrib/auto-render/splitAtDelimiters.js' {
    const splitAtDelimiters: (content: string, delimiters: Delimiter[]) => Result[];
    export default splitAtDelimiters;
}

export {};
