import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_URL, WS_URL } from '@env';
import { ApiError } from '../errors/ApiError';

const API_TIMEOUT = 10000;

class ApiClient {
    private client: AxiosInstance;
    private socket?: WebSocket;

    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL,
            timeout: API_TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.client.interceptors.request.use(
            config => {
                // Ovdje bi se doo interceptor za auth tokene
                // if (token) {
                //   config.headers.Authorization = `Bearer ${token}`;
                // }

                return config;
            },
            error => Promise.reject(error)
        );

        this.client.interceptors.response.use(
            response => response,
            error => {
                console.error('[API ERROR]', error?.response || error);
                const status = error?.response?.status as number | undefined;
                const message = error?.message ?? 'Unknown API error';
                const apiError = new ApiError(status, message);
                return Promise.reject(apiError);
            }
        );
    }

    async connect(onMessage: (data: any) => void) {
        this.socket = new WebSocket(WS_URL);

        this.socket.onerror = error => {
            console.warn('Socket error', error);
        };

        this.socket.onopen = () => {
            console.log('Socket connected');
            // Ovdje ide logika gdje pocinje primati poruke
            // Subscribe na neki channel i slicno
            // this.socket?.send('start');
        };

        this.socket.onmessage = event => {
            // Ovdje ide logika gdje se obrađuju primljene poruke

            // if (event.data === 'ping') return;
            // const message = JSON.parse(event.data);
            // if (message.type !== 'newMessage') return;

            // console.log('Received message:', message);
            // onMessage(message);
        };
    }

    async disconnect() {
        this.socket?.close();
        this.socket = undefined;
    }

    async get<T>(url: string, config?: AxiosRequestConfig) {
        const res = await this.client.get<T>(url, config);
        return res.data;
    }

    async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
        const res = await this.client.post<T>(url, data, config);
        return res.data;
    }

    async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
        const res = await this.client.put<T>(url, data, config);
        return res.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig) {
        const res = await this.client.delete<T>(url, config);
        return res.data;
    }
}

export const apiClient = new ApiClient(API_URL);