import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { MS_AUTH_API_URL } from "../../config/api";
import { loginRoutePath } from "../../routes/config";
import history from "../history";
interface RequestParams {
    method: string;
    path: string;
    data?: any;
    config?: AxiosRequestConfig;
}

const HTTP_METHOD = {
    GET: "get",
    POST: "post",
    PUT: "put",
    PATCH: "patch",
    DEL: "delete",
};

export const HTTP_STATUS = {
    UNAUTHORIZED: 401,
    UNPROCESSABLE_ENTITY: 422,
    FORBIDDEN: 403,
};

interface IUseRequest {
    baseURL?: string;
    timeout?: number;
}

export default function useRequest({
    baseURL = MS_AUTH_API_URL,
    timeout = 15000,
}: IUseRequest) {
    const api: AxiosInstance = axios.create({
        baseURL,
        timeout,
        withCredentials: true,
        timeoutErrorMessage:
            "Houston nós temos um problema na conexão. Tente novmente mais tarde",
    });

    api.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            if (error.response.data.statusCode === HTTP_STATUS.UNAUTHORIZED) {
                history.push(loginRoutePath);
            }
            return Promise.reject(error);
        }
    );

    const CancelToken = () => axios.CancelToken;

    const isCancel = () => axios.isCancel;

    const setHeader = (name: string, value: string): void => {
        api.defaults.headers[name] = value;
    };

    function get<T = any, R = AxiosResponse<T>>(
        path: string,
        data = {},
        config?: AxiosRequestConfig
    ): Promise<R> {
        path += `?${queryString(data)}`;

        return request({ method: HTTP_METHOD.GET, path, config });
    }

    function post<T = any, R = AxiosResponse<T>>(
        path: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return request({
            method: HTTP_METHOD.POST,
            path,
            data,
            config,
        });
    }

    function put<T = any, R = AxiosResponse<T>>(
        path: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return request({ method: HTTP_METHOD.PUT, path, data, config });
    }

    function patch<T = any, R = AxiosResponse<T>>(
        path: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return request<R>({
            method: HTTP_METHOD.PATCH,
            path,
            data,
            config,
        });
    }

    async function del<T = any, R = AxiosResponse<T>>(
        path: string,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return request({ method: HTTP_METHOD.DEL, path, config });
    }

    async function request<R>({
        method,
        path,
        data = {},
        config = {},
    }: RequestParams): Promise<R> {
        try {
            const response = await httpRequest<R>({
                method,
                path,
                data,
                config,
            });

            return response;
        } catch (error: any) {
            const requestIsCanceled = !error.response;

            if (requestIsCanceled) {
                return Promise.reject(error);
            }

            const { data: errorData } = error.response;

            return Promise.reject(errorData);
        }
    }

    async function httpRequest<R>({
        method = "get",
        path,
        data,
        config,
    }: RequestParams): Promise<R> {
        // @ts-ignore
        const axiosMethod: Function = api[method];
        const reqConfig = getConfig(config || {});

        if ([HTTP_METHOD.GET, HTTP_METHOD.DEL].includes(method)) {
            return await axiosMethod(path, reqConfig);
        }

        return await axiosMethod(path, data, reqConfig);
    }

    function getConfig(config: object): object {
        return {
            responseType: "json",
            headers: {
                Authorization: `Bearer ${api.defaults.headers.Authorization}`,
                "Content-Type": "application/json",
            },
            ...config,
        };
    }

    function queryString(obj: any = {}) {
        return Object.keys(obj)
            .map(function (key) {
                if (
                    obj &&
                    obj[key] &&
                    typeof obj[key] == "object" &&
                    obj[key].length
                ) {
                    let url: any = [];

                    for (let index = 0; index < obj[key].length; index++) {
                        const objeto = obj[key][index];

                        Object.keys(objeto).forEach(function (keyObjeto) {
                            let valorObjeto = objeto[keyObjeto];

                            url.push(
                                `${key}[${index}][${keyObjeto}]=${valorObjeto}`
                            );
                        });
                    }

                    return url.join("&");
                } else {
                    let url = `${key}=${obj[key]}`;

                    return url;
                }
            })
            .join("&");
    }

    return {
        setHeader,
        del,
        get,
        put,
        patch,
        post,
        HTTP_METHOD,
        HTTP_STATUS,
        CancelToken,
        isCancel,
    };
}
