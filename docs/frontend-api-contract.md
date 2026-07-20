# Frontend API Contract - Sprint 3 Backend Changes

Base URL examples below assume the backend is mounted at the application root.

All protected APIs require:

```http
Authorization: Bearer <accessToken>
```

Standard response wrapper:

```json
{
  "code": 200,
  "message": "Successfully",
  "body": {}
}
```

## Project Members

Frontend page/component:

- `ProjectSettingsPage`
- `ProjectMembersPanel`
- `MemberAccessTable`

### List Project Members

Method:

```http
GET
```

URL:

```http
/api/v1/projects/{projectId}/members
```

Auth header:

```http
Authorization: Bearer <accessToken>
```

Request body:

```json
null
```

Response body:

```json
{
  "code": 200,
  "message": "Successfully",
  "body": [
    {
      "id": "manager-user-id",
      "fullName": "Jane Manager",
      "email": "jane@example.com",
      "roleInProject": "MANAGER"
    },
    {
      "id": "member-user-id",
      "fullName": "John Member",
      "email": "john@example.com",
      "roleInProject": "MEMBER"
    }
  ]
}
```

Error cases:

```json
{
  "code": 401,
  "message": "Unauthenticated!"
}
```

```json
{
  "code": 404,
  "message": "Project not existed!!!"
}
```

```json
{
  "code": 400,
  "message": "You do not have permission to do anything with this project!"
}
```

Frontend behavior:

- Use this endpoint for the project settings member list.
- Use `roleInProject` to label manager/member rows.
- Only show destructive member actions when the current user is the project manager.
- Do not rely on the older `GET /api/v1/projects/{projectId}` member endpoint for settings UI because it does not include `roleInProject`.

### Remove Project Member

Method:

```http
DELETE
```

URL:

```http
/api/v1/projects/{projectId}/members/{memberId}
```

Auth header:

```http
Authorization: Bearer <accessToken>
```

Request body:

```json
null
```

Response body:

```json
{
  "code": 200,
  "message": "Successfully",
  "body": {
    "id": "member-user-id",
    "fullName": "John Member",
    "email": "john@example.com",
    "roleInProject": "MEMBER"
  }
}
```

Error cases:

```json
{
  "code": 401,
  "message": "Unauthenticated!"
}
```

```json
{
  "code": 404,
  "message": "Project not existed!!!"
}
```

```json
{
  "code": 404,
  "message": "User not found!"
}
```

```json
{
  "code": 400,
  "message": "Validation failed!"
}
```

Frontend behavior:

- Only project manager should see the remove action.
- Never show remove action on the manager's own row.
- On success, remove the returned member from local UI state or refetch the member list.
- Treat `400 Validation failed!` as a blocked operation such as trying to remove the manager.

## Attachment Delete

Frontend page/component:

- `TaskDetailDrawer`
- `TaskAttachmentsPanel`
- `AttachmentList`

### Delete Attachment

Method:

```http
DELETE
```

URL:

```http
/api/v1/tasks/{taskId}/attachments/{attachmentId}
```

Auth header:

```http
Authorization: Bearer <accessToken>
```

Request body:

```json
null
```

Response body:

```json
{
  "code": 200,
  "message": "Successfully"
}
```

Error cases:

```json
{
  "code": 401,
  "message": "Unauthenticated!"
}
```

```json
{
  "code": 404,
  "message": "Task not existed!!!"
}
```

```json
{
  "code": 404,
  "message": "Attachment not existed!!!"
}
```

Frontend behavior:

- Show this action to project members who can access the task.
- On success, remove the attachment from the task attachment list.
- If the request fails, keep the attachment visible and show the backend error message.
- Backend deletes both the MinIO object and database metadata.
- Backend emits `DELETE_TASK_ATTACHMENT` activity log after successful deletion.

## Activity Logs With Access Control

Frontend page/component:

- `ProjectActivityPage`
- `ProjectActivityPanel`
- `TaskActivityTimeline`

### Query Activity Logs

Method:

```http
GET
```

URL:

```http
/api/v1/activity-logs?projectId={projectId}&entityType={entityType}&entityId={entityId}&actionType={actionType}&page=0&size=20
```

Auth header:

```http
Authorization: Bearer <accessToken>
```

Request body:

```json
null
```

Query parameters:

```text
projectId   required
entityType  optional
entityId    optional
actionType  optional
page        optional, default 0
size        optional, default 20, max 100
```

Response body:

```json
{
  "code": 200,
  "message": "Successfully",
  "body": {
    "currentPage": 0,
    "totalPages": 1,
    "pageSize": 20,
    "totalElements": 2,
    "data": [
      {
        "id": "activity-log-id",
        "projectId": "project-id",
        "actorEmail": "jane@example.com",
        "actionType": "UPDATE_PROJECT",
        "entityType": "PROJECT",
        "entityId": "project-id",
        "payload": {
          "projectId": "project-id",
          "name": "New Project Name",
          "managerId": "manager-user-id",
          "memberIds": ["manager-user-id", "member-user-id"]
        },
        "timestamp": "2026-07-07T10:30:00"
      }
    ]
  }
}
```

Error cases:

```json
{
  "code": 401,
  "message": "Unauthenticated!"
}
```

```json
{
  "code": 404,
  "message": "Project not existed!!!"
}
```

```json
{
  "code": 400,
  "message": "You do not have permission to do anything with this project!"
}
```

Frontend behavior:

- Always provide `projectId`.
- Backend verifies the current user is the project manager or a project member before returning logs.
- Use `entityType` and `entityId` for scoped timelines, such as task detail activity.
- Use `actionType` for event-type filters.
- Page size should stay at or below `100`.

## New Audit Events

Frontend page/component:

- `ProjectActivityPage`
- `TaskActivityTimeline`
- `AttachmentActivityRows`
- `InvitationActivityRows`

These are not separate APIs. They are new `actionType` values returned by `GET /api/v1/activity-logs`.

Supported Sprint 3 action types:

```text
CREATE_PROJECT
UPDATE_PROJECT
DELETE_PROJECT
DELETE_TASK
ACCEPT_PROJECT_INVITATION
REJECT_PROJECT_INVITATION
DELETE_TASK_ATTACHMENT
```

Already existing action types still returned by the same API:

```text
CREATE_TASK
UPDATE_TASK
UPLOAD_TASK_ATTACHMENT
```

Expected entity types:

```text
PROJECT
TASK
TASK_ATTACHMENT
PROJECT_INVITATION
```

Frontend behavior:

- Render unknown `actionType` values with a generic activity row instead of failing.
- For `PROJECT` events, use `payload.name`, `payload.managerId`, and `payload.memberIds` when present.
- For `TASK_ATTACHMENT` events, use `payload.fileName`, `payload.fileType`, `payload.fileSize`, `payload.uploadedBy`, and `payload.deletedBy` when present.
- For invitation events, use `payload.status`, `payload.inviterId`, and `payload.invitedMemberId`.

## Timeline Support

Frontend page/component:

- `ProjectTimelinePage`
- `TaskTimeline`
- `TaskGanttView`

Current backend task fields available for timeline rendering:

```json
{
  "id": "task-id",
  "taskName": "Design settings page",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "createdAt": "2026-07-07T10:00:00",
  "updatedAt": "2026-07-08T11:00:00",
  "dueDate": "2026-07-20T18:00:00",
  "assignor": {},
  "assignee": {}
}
```

Available APIs to fetch timeline data:

```http
GET /api/v1/tasks/projects/{projectId}
GET /api/v1/tasks/projects/{projectId}/filter
GET /api/v1/tasks/{taskId}
```

Auth header:

```http
Authorization: Bearer <accessToken>
```

Request body:

```json
null
```

Frontend behavior:

- Backend has `dueDate`, `createdAt`, and `updatedAt`.
- Backend does not currently have `startDate`.
- For now, timeline can use `createdAt` as a temporary start and `dueDate` as end.
- If `dueDate` is null, place the task in an unscheduled/no-due-date group.
- Do not build committed Gantt-style planning UX that requires editable `startDate` until backend adds that field.

Minimal future backend change needed for full timeline support:

```text
Task.startDate
TaskCreationRequest.startDate
TaskUpdateRequest.startDate
TaskResponse.startDate
TaskCreationResponse.startDate
TaskUpdateResponse.startDate
```
