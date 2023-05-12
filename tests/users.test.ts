import {UserService} from '../services';
import {users} from '../users';
import { NextFunction, Request, Response } from "express";
import httpMocks, { MockRequest, MockResponse } from "node-mocks-http";
import {getUserById, getUsers } from '../controllers';
import {jest} from '@jest/globals';
import supertest from "supertest";
import {server} from '../index';
describe("users controllers", () => {
  let userService: UserService;
  let response;
  let token: string;
  beforeEach(async () => {
    userService = new UserService();

    response = await supertest(server).post('/login').send({login: 'Mila', password: 'd3'});
    token = JSON.parse(response.text)['access-token'];
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks()
  })

  it("should return 3 users with substring mi sorting by login", async () => {
    userService.getAutoSuggestUsers = jest.fn().mockReturnValue(users);
    const mockQuery = {
      loginSubstring: "mi",
      limit: 3
    };

    const mockReq: MockRequest<Request> = httpMocks.createRequest({
      method: "GET",
      url: "/users",
      query: mockQuery
    });
    const mockRes: MockResponse<Response> = httpMocks.createResponse();
    const mockNext: jest.Mocked<NextFunction> = jest.fn();
    await getUsers(mockReq, mockRes, mockNext);

    expect(mockRes._getJSONData()).toEqual([
      {
        id: '64b82c83-8110-47fe-9745-cba43a54a790',
        login: 'Mika',
        password: 'adca4sacASC',
        age: 28,
        isDeleted: false
      },
      {
        id: '5f17bae6-72b7-430c-bd5d-5f57f318251d',
        login: 'Mila',
        password: 'd3',
        age: 6,
        isDeleted: false
      },
      {
        id: '35a9a15f-6c9f-4d42-936e-586a23d5be9b',
        login: 'Misha',
        password: 'adca4sacASC',
        age: 28,
        isDeleted: false
      }
    ]);
  });

  it("should return 2 users when limit is 2 sorting by login", async () => {
    userService.getAutoSuggestUsers = jest.fn().mockReturnValue(users);
    const mockQuery = {
      limit: 2
    };

    const mockReq: MockRequest<Request> = httpMocks.createRequest({
      method: "GET",
      url: "/users",
      query: mockQuery
    });
    const mockRes: MockResponse<Response> = httpMocks.createResponse();
    const mockNext: jest.Mocked<NextFunction> = jest.fn();

    await getUsers(mockReq, mockRes, mockNext);

    expect(mockRes._getJSONData()).toEqual([
      {
        id: '8067b7b6-f95c-4677-b88c-d721345b992f',
        login: 'Dima',
        password: 'adca4',
        age: 15,
        isDeleted: false
      },
      {
        id: 'f2c88e95-933f-4655-ad68-60c4257a0df7',
        login: 'Dina',
        password: 'sacas43',
        age: 28,
        isDeleted: false
      }
    ]);
  });

  it("should return all users when there aren't login substr and limit", async () => {
    const mockReq: MockRequest<Request> = httpMocks.createRequest({
      method: "GET",
      url: "/users"
    });
    const mockRes: MockResponse<Response> = httpMocks.createResponse();
    const mockNext: jest.Mocked<NextFunction> = jest.fn();
    await getUsers(mockReq, mockRes, mockNext);

    expect(mockRes._getJSONData()).toEqual(users);
  });

  it("should return user by id", async () => {
    const user = {
      id: '5f17bae6-72b7-430c-bd5d-5f57f318251d',
      login: 'Mila',
      password: 'd3',
      age: 6,
      isDeleted: false
    };
    const userId = '5f17bae6-72b7-430c-bd5d-5f57f318251d';
    userService.getUserById = jest.fn().mockReturnValue(user);

    const mockReq: MockRequest<Request> = httpMocks.createRequest({
      method: "GET",
      url: `/users/${userId}`,
      params: {
        id: userId
      }
    });

    const mockRes: MockResponse<Response> = httpMocks.createResponse();

    await getUserById(mockReq, mockRes);

    expect(mockRes.statusCode).toBe(200);
    expect(mockRes._getData().dataValues).toEqual(user);
  });

  it('should return 404 if the user is not found', async () => {
    const userId = '123';
    const userService = new UserService();
    userService.getUserById = jest.fn().mockResolvedValue(null);

    const mockReq = httpMocks.createRequest({
      method: 'GET',
      url: `/users/${userId}`,
      params: {
        id: userId,
      },
    });

    const mockRes = httpMocks.createResponse();
    await getUserById(mockReq, mockRes);

    expect(mockRes.statusCode).toBe(404);
    expect(mockRes._getData()).toEqual("\"Not Found\"");
  });

  it("should create a user and return it with status 201", async  () => {
    const user = {
      login: "Elena",
      password: "m87",
      age: 30,
    };

    const expectedUser = {
          ...user,
          id: expect.any(String),
          isDeleted: false,
        }

    // @ts-ignore
    const {statusCode, body} = await supertest(server).post('/users').set('Authorization', `Bearer ${token}`).send(user);

    expect(statusCode).toBe(201);
    expect(body).toStrictEqual(expectedUser)
  })

  it('should return 400 if user login is missing', async () => {
    const { status } = await supertest(server)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        password: 'p87',
        age: 25,
      });

    expect(status).toBe(400);
  });

  it('should update user by id', async () => {
    const userId = '8067b7b6-f95c-4677-b88c-d721345b992f'
    const updatedUser = {
      login: 'Pasha',
      password: 'p87',
      age: 35
    };
    const response = await supertest(server).put(`/users/${userId}`).set('Authorization', `Bearer ${token}`).send(updatedUser);
    expect(response.status).toBe(200);

    const getUserResponse = await supertest(server).get(`/users/${userId}`).set('Authorization', `Bearer ${token}`);
    expect(getUserResponse.status).toBe(200);
    expect(getUserResponse.body.login).toBe(updatedUser.login);
    expect(getUserResponse.body.age).toBe(updatedUser.age);
  });

  it('should return 404 if user is not found', async () => {
    const {status} = await supertest(server).put(`/users/123`).set('Authorization', `Bearer ${token}`).send({
      login: 'Pasha',
      password: 'l24',
      age: 34,
    });
    expect(status).toBe(404);
  });

  it('should delete user by id', async () => {
    const userId = '8067b7b6-f95c-4677-b88c-d721345b992f'
    const { status } = await supertest(server).delete(`/users/${userId}`).set('Authorization', `Bearer ${token}`);
    expect(status).toBe(201);
  });
});
