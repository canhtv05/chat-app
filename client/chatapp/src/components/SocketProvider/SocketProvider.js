import { useEffect } from 'react';
import socketService from '~/services/socket/socketService';

function SocketProvider({ children }) {
    useEffect(() => {
        socketService.onconnect();
    }, []);
    return children;
}

export default SocketProvider;
