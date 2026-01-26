import { sign, verify } from 'jsonwebtoken';

export class JwtService {
  constructor(private readonly secret: string) {}

  public async sign(payload: Record<string, unknown>): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(payload, this.secret, (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token as string);
      });
    });
  }

  public async verify(token: string): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
      verify(token, this.secret, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded as Record<string, unknown>);
      });
    });
  }
}
