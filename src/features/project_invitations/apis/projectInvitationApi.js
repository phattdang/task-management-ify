import axiosClient from "../../../utils/axiosClient";

const URL = "/project-invitations/api/v1/invitations";

const projectInvitationsApi = {
  inviteMember: (projectId, request) =>
    axiosClient.post(`${URL}/${projectId}`, request),
  getAllInvitations: (projectId) => axiosClient.get(`${URL}/${projectId}`),
  answerInvitation: (request) => axiosClient.post(`${URL}/answer`, request),
  getInvitationByInvitedCode: (invitedCode) =>
    axiosClient.get(`${URL}/code/${invitedCode}`),
};

export default projectInvitationsApi;
