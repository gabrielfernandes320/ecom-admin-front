import { IRole } from "../../interfaces/role/role";
import useRequest from "./request";

// eslint-disable-next-line react-hooks/rules-of-hooks
const { del, get, patch, post } = useRequest({});

export default class RoleHttpService {
    public static uri = "/v1/roles";

    public static index() {
        return get<IRole[]>(this.uri);
    }

    public static async destroy(id: number) {
        return await del(`${this.uri}/${id}`);
    }

    public static show(id: string) {
        return get(`${this.uri}/${id}`);
    }

    public static store(data: IRole) {
        return post(this.uri, data);
    }

    public static update(data: IRole) {
        return patch(`${this.uri}/${data.id}`, data);
    }
}
