import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import Logger from "./logger";

const logger = new Logger('jwt');
let privateKey: string = process.env.jwt_key;

if (!privateKey) {
  fs.readFile(
    path.join(process.env.APPROOT, ".keys", "jwtRS256.key"),
    { encoding: "utf8" },
    (err, data) => {
      if (err) throw err;
      privateKey = data;
    }
  );
}

function sign(payload: string | object | Buffer) {
  return jwt.sign(payload, privateKey, {
    issuer: process.env.jwt_issuer
  });
}

function verify(token: string) {
  try {
    const payload = jwt.verify(token, privateKey, {
      issuer: process.env.jwt_issuer
    });
    return {
      valid: true,
      payload
    };
  } catch (e) {
    logger.error(e);
    return {
      valid: false,
      payload: undefined
    };
  }
}

export default { sign, verify };
