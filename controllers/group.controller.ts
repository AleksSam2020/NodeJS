import { v4 as uuidv } from 'uuid';
import {NextFunction, Request, Response} from 'express';
import {GroupService} from '../services';

const groupsService = new GroupService();
export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groups = await groupsService.getAllGroups();
    return res.json(groups);
  } catch (error) {
    next(error);
    }
}

export const getGroupById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const group = await groupsService.getGroupById(id);

    group ? res.send(group) : res.status(404).json('Not Found')
  } catch (error) {
    next(error);
  }

}

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group  = {
      ...req.body,
      id: uuidv()
    };
    await groupsService.createGroup(group);
    res.status(201).json(group)

  } catch (error) {
    next(error);
  }
}

export const updateGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const group = await groupsService.getGroupById(id);
    if(!group) return res.status(404).json('Group doesn\'t exist');

    await groupsService.updateGroup(group.id, req.body);
    res.status(200).json('Group has successfully updated')
  } catch (error ) {
    next(error);
  }
}

export const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const group = await groupsService.getGroupById(id);
    if(!group) return res.status(404).json('Group doesn\'t exist');
    await groupsService.deleteGroup(group.id);
    res.status(201).json('Group has successfully deleted')
  } catch (error) {
    next(error);
  }
}

export const addUsersToGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { groupId } = req.params;
    const { userIds } = req.body;

    if (groupId && userIds) {
      await groupsService.addUsersToGroup(groupId, userIds);

      return res.json('User(\'s\') has been added');
    }

    return res.status(404).json('Not Found')
  } catch (error) {
    next(error);
  }
};
