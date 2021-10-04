import { IProduct } from "../../interfaces/product/product";
import useRequest from "./request";

// eslint-disable-next-line react-hooks/rules-of-hooks
const { del, get, patch, post } = useRequest({});

export default class ProductHttpService {
    public static uri = "/v1/products";

    public static index() {
        return get<IProduct[]>(this.uri);
    }

    public static async destroy(id: number) {
        return await del(`${this.uri}/${id}`);
    }

    public static show(id: string) {
        return get(`${this.uri}/${id}`);
    }

    public static store(data: IProduct) {
        return post(this.uri, data);
    }

    public static update(data: IProduct) {
        return patch(`${this.uri}/${data.id}`, data);
    }
}

export function useProductHttpService() {
    const uri = "/v1/products";

    const index = async () => {
        return await get<IProduct[]>(uri);
    };

    const destroy = async (id: number) => {
        return await del(`${uri}/${id}`);
    };

    const show = async (id: string) => {
        return await get(`${uri}/${id}`);
    };

    const store = async (data: IProduct) => {
        return await post(uri, data);
    };

    const update = async (data: IProduct) => {
        return await patch(`${uri}/${data.id}`, data);
    };

    return {
        index,
        destroy,
        show,
        store,
        update,
    };
}
