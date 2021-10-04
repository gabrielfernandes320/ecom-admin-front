import { ILogin } from "../../interfaces/auth/login";
import useRequest from "./request";

// eslint-disable-next-line react-hooks/rules-of-hooks
const { del, get, patch, post } = useRequest({});
export default class AuthHttpService {
    public static uri = "/v1/auth";

    public static login(login: ILogin) {
        return post(`${this.uri}/login`, login);
    }

    public static accountRecovery(email: string) {
        return post(`${this.uri}/password/forgot`, {
            email,
        });
    }

    public static resetPassword(data: Object) {
        return post(`${this.uri}/password/reset`, data);
    }

    public static getAuthenticatedUser() {
        return get(`${this.uri}/user`);
    }

    public static logout() {
        return post(`${this.uri}/logout`);
    }
}
