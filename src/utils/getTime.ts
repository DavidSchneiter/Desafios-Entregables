export const getTime = (): string => {
    const date = new Date();
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}