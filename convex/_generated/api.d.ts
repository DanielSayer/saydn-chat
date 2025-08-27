/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as http_actions_create_chat_route from "../http-actions/create-chat/route.js";
import type * as http from "../http.js";
import type * as lib_auth_get_user from "../lib/auth/get-user.js";
import type * as schema_conversations from "../schema/conversations.js";
import type * as schema_messages from "../schema/messages.js";
import type * as schema_parts from "../schema/parts.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "http-actions/create-chat/route": typeof http_actions_create_chat_route;
  http: typeof http;
  "lib/auth/get-user": typeof lib_auth_get_user;
  "schema/conversations": typeof schema_conversations;
  "schema/messages": typeof schema_messages;
  "schema/parts": typeof schema_parts;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
