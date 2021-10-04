import { IPermission } from "../../interfaces/permission/permission";
import useRequest from "./request";

// eslint-disable-next-line react-hooks/rules-of-hooks
const { del, get, patch, post } = useRequest({});

export default class PermissionHttpService {
    public static uri = "/v1/permissions";

    public static index() {
        return get<IPermission[]>(this.uri);
    }
}
