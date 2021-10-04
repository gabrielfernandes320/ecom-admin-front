import { IUser } from "../../interfaces/user/user";
import useRequest from "./request";

// eslint-disable-next-line react-hooks/rules-of-hooks
const { del, get, patch, post } = useRequest({});

export default class UserHttpService {
    public static uri = "/v1/users";

    public static index() {
        return get<IUser[]>(this.uri);
    }

    public static async destroy(id: number) {
        return await del(`${this.uri}/${id}`);
    }

    public static show(id: string) {
        return get<IUser>(`${this.uri}/${id}`);
    }

    public static async store(data: IUser) {
        if (data.id) {
            return this.update(data);
        }

        return post<IUser>(this.uri, data);
    }

    public static update(data: IUser) {
        return patch<IUser>(`${this.uri}/${data.id}`, data);
    }
}
