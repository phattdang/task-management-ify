import axiosClient from "../../../utils/axiosClient";

const URL = "/project-invitations/api/v1/invitations";

const projectInvitationsApi = {
  inviteMember: (projectId, request) =>
    axiosClient.post(`${URL}/${projectId}`, request),
  getAllInvitations: (projectId) => axiosClient.get(`${URL}/${projectId}`),
};

export default projectInvitationsApi;
