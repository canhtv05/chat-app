import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import cookieUtil from '~/utils/cookieUtils';

class SocketService {
    client = null;
    isConnected = false;
    subscriptions = new Map();

    onconnect() {
        if (this.isConnected) return;

        const sock = new SockJS('http://localhost:1710/api/ws');
        this.client = new Client({
            webSocketFactory: () => sock,
            reconnectDelay: 5000,
            connectHeaders: {
                Authorization: `Bearer ${cookieUtil.getStorage()?.accessToken}`,
            },
            onConnect: () => {
                this.isConnected = true;
            },
            onStompError: (frame) => {
                console.log('STOMP error: ', frame);
                this.isConnected = false;
            },
            onDisconnect: () => {
                this.isConnected = false;
            },
        });

        this.client.activate();
    }

    disconnect() {
        if (this.client && this.client.connected) {
            this.client.deactivate();
            this.client = null;
            this.isConnected = false;
            this.subscriptions.clear();
        }
    }

    subscribe(topic, callback) {
        if (this.subscriptions.has(topic)) return;
        if (this.client && this.client.connected) {
            this.client.subscribe(topic, callback);
        }
    }

    unsubscribe(topic) {
        const sub = this.subscriptions.get(topic);
        if (sub) {
            sub.unsubscribe();
            this.subscriptions.delete(topic);
        }
    }

    send(destination, body) {
        if (!this.client || !this.client.connected) return;

        this.client.publish({
            destination: `/app/${destination}`,
            body: JSON.stringify(body),
        });
    }

    isReady() {
        return this.client && this.client.connected;
    }
}

const socketService = new SocketService();
export default socketService;
