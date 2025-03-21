import config from '~/configs';

const key = config.storage.key;

function useLocalStorage() {
    const getItem = () => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : {};
    };

    const setItem = (objectSet) => {
        const data = getItem();
        Object.assign(data, objectSet);

        const jsonData = JSON.stringify(data);

        return localStorage.setItem(key, jsonData);
    };

    const deleteItem = (item) => {
        const data = getItem();
        delete data[item];

        const jsonData = JSON.stringify(data);

        return localStorage.setItem(key, jsonData);
    };

    return {
        dataStorage: getItem(),
        setStorage: setItem,
        deleteStorage: deleteItem,
    };
}

export default useLocalStorage;
