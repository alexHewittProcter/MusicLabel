export const getObjectFromLocal = name => {
    const objectString = localStorage.getItem(name);
    if (objectString === null) {
        return {};
    } else {
        return JSON.parse(objectString);
    }
}