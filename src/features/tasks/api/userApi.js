import axiosClient from "../../../utils/axiosClient";

const userApi = {
  findAllUser: () => axiosClient.get("/api/v1/users"),
};

export default userApi;
