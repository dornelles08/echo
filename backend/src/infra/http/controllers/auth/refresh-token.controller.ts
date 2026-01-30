import type { FastifyReply, FastifyRequest } from "fastify";

export async function refreshToken(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = request.user;

  const token = await reply.jwtSign({ sub: userId });

  const refreshToken = await reply.jwtSign({
    sign: {
      sub: userId,
      expiresIn: "7d",
    },
  });

  return reply
    .status(200)
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .send({ token });
}
