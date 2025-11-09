import { type BasePayload, getPayload } from "payload";
import type { BetterAuthReturn } from "payload-auth/better-auth";
import config, { type BetterAuthPluginsType } from "../../../payload.config";

export type Payload = BasePayload & {
  betterAuth: BetterAuthReturn<BetterAuthPluginsType>;
};

export async function getBetterAuthApi() {
  const payload = (await getPayload({ config })) as Payload;
  return payload.betterAuth.api;
}


export type Session = Awaited<ReturnType<(Awaited<ReturnType<typeof getBetterAuthApi>>)["getSession"]>>;
