import chai, { expect } from "chai";
import { stub, spy } from "sinon";
import sinonChai from "sinon-chai";
import jwt from "jsonwebtoken";

import auth_middleware from "../../middlewares/auth.middleware";

chai.use(sinonChai);

const requestMock = (headers = {}) => {
  let req: any = { headers };
  return req;
};

const responseMock = () => {
  let res: any = {};
  res.status = stub().returns(res);
  res.json = stub().returns(res);
  return res;
};

describe("AUTH_MIDDLEWARE", () => {
  let req, res;

  beforeEach(() => {
    req = requestMock();
    res = responseMock();
  });

  it("Returns access denied if there is no token", async () => {
    auth_middleware(req, res, () => {});

    expect(res.status).to.have.been.calledOnceWith(401);
    expect(res.json).to.have.been.calledOnceWith({
      message: "Missing authentication token.",
    });
  });

  describe("Invalid token", async () => {
    it("Token has bad formatting", async () => {
      req = requestMock({ authorization: `just-a-hash` });
      auth_middleware(req, res, () => {});

      expect(res.status).to.have.been.calledOnceWith(400);
      expect(res.json).to.have.been.calledOnceWith({
        message: "Invalid token.",
      });
    });

    it("Token can't be verified", async () => {
      req = requestMock({ authorization: `Bearer invalid` });
      const verify = spy(jwt, "verify");

      auth_middleware(req, res, () => {});

      expect(verify).to.have.been.calledOnceWith(
        "invalid",
        process.env.PRIVATE_KEY
      );
      expect(res.status).to.have.been.calledOnceWith(400);
      expect(res.json).to.have.been.calledOnceWith({
        message: "Invalid token.",
      });

      verify.restore();
    });
  });
});
