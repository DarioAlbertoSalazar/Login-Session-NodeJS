import supertest from "supertest";
import sinon from "sinon";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = require("./server.js");
const Task = require("./Task.js");
const User = require("./User.js");

const chai = await import("chai");
const { expect } = chai;

describe("POST /signup", () => {
  let findOneStub, createStub, hashStub;

  before(() => {
    findOneStub = sinon.stub(User, "findOne");
    createStub = sinon.stub(User, "create");
    hashStub = sinon.stub(bycrypt, "hash");
  });

  after(() => {
    findOneStub.restore();
    createStub.restore();
    hashStub.restore();
  });

   it("should create a new user when provided with valid credentials", async () => {
    const username = "newuser";
    const password = "newpassword";
    const hashedPassword = "hashedpassword";

    findOneStub.resolves(null);
    hashStub.resolves(hashedPassword);
    createStub.resolves({ username, password: hashedPassword });

    const res = await supertest(app)
      .post("/signup")
      .send({ username, password });

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({
      success: true,
      message: "Usuario se creó de manera exitosa",
      newUser: { username, password: hashedPassword }
    });

    sinon.assert.calledOnceWithExactly(User.create, {
      username,
      password: hashedPassword,
    });
  });
});


describe("POST /login", () => {
  let findOneStub, compareStub, signStub;

  before(() => {
    findOneStub = sinon.stub(User, "findOne");

    compareStub = sinon.stub(bycrypt, "compare");

    signStub = sinon.stub(jwt, "sign");
  });

  after(() => {
    findOneStub.restore();
    compareStub.restore();
    signStub.restore();
  });

  it("should return success response with token for valid credentials", async () => {
    const username = "testuser";
    const password = "testpassword";
    const user = { id: 1, username: "testuser", password: "hashedpassword" };
    const token = "generatedtoken";

    findOneStub.resolves(user);

    compareStub.resolves(true);

    signStub.returns(token);

    const res = await supertest(app)
      .post("/login")
      .send({ username, password });

    expect(res.status).to.equal(200);

    expect(res.body).to.deep.equal({
      success: true,
      token,
      message: "Login correcto",
    });
  });

  it("should return error response for invalid credentials", async () => {
    const username = "invaliduser";
    const password = "invalidpassword";

    findOneStub.resolves(null);

    const res = await supertest(app)
      .post("/login")
      .send({ username, password });

    expect(res.status).to.equal(404);
    expect(res.text).to.equal("Credenciales incorrectas");
  });
});

describe("TEST TODO API", () => {
  let findAllStub, updateStub, createStub, destroyStub;

  before(() => {
    findAllStub = sinon
      .stub(Task, "findAll")
      .resolves([{ id: 1, title: "Compras", description: "Compras comida" }]);

    updateStub = sinon.stub(Task, "update").resolves(1);

    createStub = sinon
      .stub(Task, "create")
      .resolves({ id: 1, title: "Compras", description: "Compras comida" });

    destroyStub = sinon.stub(Task, "destroy").resolves(1);
  });
  after(() => {
    findAllStub.restore();
    updateStub.restore();
    createStub.restore();
    destroyStub.restore();
  });

  it("should get all tasks for a user", async () => {
    const res = await supertest(app).get("/tasks/1");
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([
      { id: 1, title: "Compras", description: "Compras comida" },
    ]);
  });

  it("should update a task", async () => {
    const res = await supertest(app)
      .put("/task/1")
      .send({ title: "Nueva tarea" });

    expect(res.status).to.equal(200);
  });

  it("should create a new task", async () => {
    const res = await supertest(app).post("/task").send({
      title: "Nueva tarea",
      description: "Descripción de la nueva tarea",
    });
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({
      id: 1,
      title: "Compras",
      description: "Compras comida",
    });
  });

  it("should delete a task", async () => {
    const res = await supertest(app).delete("/task/1");
    expect(res.status).to.equal(200);
  });
});
