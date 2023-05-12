import express from 'express';
import { addUsersToGroup, createGroup, deleteGroup, getGroupById, getGroups, updateGroup} from '../controllers';
export const GroupRouter = express.Router();


GroupRouter.get('/groups', getGroups);
GroupRouter.get('/groups/:id', getGroupById);
GroupRouter.post('/groups', createGroup);
GroupRouter.put('/groups/:id', updateGroup);
GroupRouter.delete('/groups/:id', deleteGroup);
GroupRouter.post('/groups/:groupId/add-users', addUsersToGroup);
