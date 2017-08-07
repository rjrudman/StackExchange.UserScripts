const hasStorage = typeof (Storage) !== undefined;

export function GetAndCache<T>(cacheKey: string, getterPromise: Promise<T>): Promise<T> {
    let cachedItem = GetFromCache(cacheKey);
    if (cachedItem) {
        return Promise.resolve(cachedItem);
    }

    getterPromise.then(result => { StoreInCache(cacheKey, result); });
    return getterPromise;
}

export function GetFromCache<T>(cacheKey: string) {
    if (hasStorage) {
        const cachedItem = localStorage.getItem(cacheKey);
        if (cachedItem) {
            try {
                const actualItem = JSON.parse(cachedItem);
                return actualItem;
            } catch (error) { }
        }
    }
}

export function StoreInCache<T>(cacheKey: string, item: T) {
    if (hasStorage) {
        const jsonStr = JSON.stringify(item);
        localStorage.setItem(cacheKey, jsonStr);
    }
}

export function GroupBy<T>(collection: T[], propertyGetter: (item: T) => any) {
    return collection.reduce(function (previousValue: any, currentItem: T) {
        (previousValue[propertyGetter(currentItem)] = previousValue[propertyGetter(currentItem)] || []).push(currentItem);
        return previousValue;
    }, {});
};