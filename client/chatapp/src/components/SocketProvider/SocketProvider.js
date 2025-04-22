import { useCallback, useEffect } from 'react';
import socketService from '~/services/socket/socketService';

function SocketProvider({ children }) {
    const connect = useCallback(() => {
        socketService.onconnect();
    }, []);

    useEffect(() => {
        connect();
    }, [connect]);
    return children;
}

export default SocketProvider;
