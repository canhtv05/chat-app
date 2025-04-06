import { useCallback } from 'react';

function useKeyValue(obj, defaultValue = null) {
    const getValueByKey = useCallback((key) => obj?.[key] ?? defaultValue, [obj, defaultValue]);

    return getValueByKey;
}

export default useKeyValue;
