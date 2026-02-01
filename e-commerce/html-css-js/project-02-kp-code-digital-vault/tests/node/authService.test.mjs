import assert from "node:assert/strict";

import { authService } from "../../js/services/auth.js";

const sessionKey = "kp_session";

const baseUser = {
  id: "user-1",
  email: "user@example.com",
  name: "User",
  createdAt: new Date(0).toISOString(),
};

const setSession = (session) => {
  localStorage.setItem(sessionKey, JSON.stringify(session));
};

export const tests = [
  {
    name: "auth.getSession returns null for expired sessions",
    run() {
      setSession({
        token: "expired-token",
        user: baseUser,
        expiresAt: Date.now() - 1_000,
      });

      const session = authService.getSession();

      assert.equal(session, null);
      assert.equal(localStorage.getItem(sessionKey), null);
    },
  },
  {
    name: "auth returnTo can be stored and consumed exactly once",
    run() {
      const returnTo = "#/checkout?next=%2Fthank-you";
      authService.setReturnTo(returnTo);

      const first = authService.consumeReturnTo();
      const second = authService.consumeReturnTo();

      assert.equal(first, returnTo);
      assert.equal(second, null);
    },
  },
  {
    name: "auth returnTo flow stays clear after signIn + consume",
    run() {
      const returnTo = "#/account";
      authService.setReturnTo(returnTo);

      const { user } = authService.signIn(baseUser);
      const consumed = authService.consumeReturnTo();
      const afterConsume = authService.consumeReturnTo();

      assert.equal(user.id, baseUser.id);
      assert.equal(consumed, returnTo);
      assert.equal(afterConsume, null);
    },
  },
];
