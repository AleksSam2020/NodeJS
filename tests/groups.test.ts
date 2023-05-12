import {GroupService } from '../services';
import { NextFunction, Request, Response } from "express";
import httpMocks, { MockRequest, MockResponse } from "node-mocks-http";
import { getGroupById, getGroups, getUserById } from '../controllers';
import {jest} from '@jest/globals';
import {groups} from '../groups';
import supertest from 'supertest';
import {server} from '../index';
describe("users controllers", () => {
  let groupService: GroupService;
  let response;
  let token: string;
  beforeEach(async () => {
    groupService = new GroupService();
    response = await supertest(server).post('/login').send({login: 'Mila', password: 'd3'});
    token = JSON.parse(response.text)['access-token'];
  });

  afterEach(() => {
    jest.restoreAllMocks();
  })

  it("should return all groups", async () => {
    groupService.getAllGroups = jest.fn().mockReturnValue(groups);
    const mockReq: MockRequest<Request> = httpMocks.createRequest({
      method: "GET",
      url: "/groups"
    });
    const mockRes: MockResponse<Response> = httpMocks.createResponse();
    const mockNext: jest.Mocked<NextFunction> = jest.fn();
    await getGroups(mockReq, mockRes, mockNext);

    expect(mockRes._getJSONData()).toEqual(groups);
  });

  it("should return group by id", async () => {
    const group =  {
      id: "f2c88e95-933f-4677-ad68-60c4257a0df7",
      name: "Group",
      permissions: ['READ']
    };

    groupService.getGroupById = jest.fn().mockReturnValue(group);

    const mockReq: MockRequest<Request> = httpMocks.createRequest({
      method: "GET",
      url: `/groups/${group.id}`,
      params: {
        id: group.id
      }
    });

    const mockRes: MockResponse<Response> = httpMocks.createResponse();

    await getGroupById(mockReq, mockRes);

    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._getData().dataValues).toEqual(group);
  });

  it('should return 404 if the group is not found', async () => {
    const groupId = "123";
    groupService.getGroupById = jest.fn().mockResolvedValue(null);

    const mockReq = httpMocks.createRequest({
      method: 'GET',
      url: `/groups/${groupId}`,
      params: {
        id: groupId,
      },
    });

    const mockRes = httpMocks.createResponse();
    await getUserById(mockReq, mockRes);

    expect(mockRes.statusCode).toBe(404);
    expect(mockRes._getData()).toEqual("\"Not Found\"");
  });

  it("should create a group and return it with status 201", async  () => {
    const group = {
      name: "Group7",
      permissions: ['READ', 'DELETE']
    };

    const expectedGroup = {
      ...group,
      id: expect.any(String),
    }

    // @ts-ignore
    const {statusCode, body} = await supertest(server).post('/groups').set('Authorization', `Bearer ${token}`).send(group);

    expect(statusCode).toBe(201);
    expect(body).toStrictEqual(expectedGroup)
  })

  it('should update group by id return it with status 200', async () => {
    const groupId = 'f2c88e95-944f-4655-ad68-60c4257a0df7'
    const updatedGroup= {
      name: "Group4",
      permissions: ['WRITE']
    };
    const response = await supertest(server).put(`/groups/${groupId}`).set('Authorization', `Bearer ${token}`).send(updatedGroup);
    expect(response.status).toBe(200);

    const getGroupResponse = await supertest(server).get(`/groups/${groupId}`).set('Authorization', `Bearer ${token}`);
    expect(getGroupResponse.status).toBe(200);
    expect(getGroupResponse.body.name).toBe(updatedGroup.name);
    expect(getGroupResponse.body.permissions).toEqual(updatedGroup.permissions);
  });

  it('should return 404 if user is not found', async () => {
    const {status} = await supertest(server).put(`/groups/123`).set('Authorization', `Bearer ${token}`).send({
      name: "Group4",
      permissions: ['WRITE']
    });
    expect(status).toBe(404);
  });

  it('should delete group by id', async () => {
    const groupId = '64b82c83-8220-27fe-9745-cba43a54a790'
    const { status } = await supertest(server).delete(`/groups/${groupId}`).set('Authorization', `Bearer ${token}`);
    expect(status).toBe(201);

    const deletedGroup = await groupService.getGroupById(groupId)
    expect(deletedGroup).toBeNull();
  });

  it('should return 404 if group is not found', async () => {
    const { status }= await supertest(server).delete(`/groups/123`).set('Authorization', `Bearer ${token}`);
    expect(status).toBe(404);
  });
});
