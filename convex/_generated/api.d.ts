/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics from "../analytics.js";
import type * as auth from "../auth.js";
import type * as conversations_create from "../conversations/create.js";
import type * as conversations from "../conversations.js";
import type * as http from "../http.js";
import type * as http_actions_create_chat_generate_title from "../http_actions/create_chat/generate_title.js";
import type * as http_actions_create_chat_route from "../http_actions/create_chat/route.js";
import type * as http_actions_create_chat_stream_transform from "../http_actions/create_chat/stream_transform.js";
import type * as lib_prompts from "../lib/prompts.js";
import type * as lib_transformers_convert_stream_output_to_message_parts from "../lib/transformers/convert_stream_output_to_message_parts.js";
import type * as lib_transformers_convert_ui_message_to_db_message from "../lib/transformers/convert_ui_message_to_db_message.js";
import type * as me from "../me.js";
import type * as messages from "../messages.js";
import type * as schema_conversations from "../schema/conversations.js";
import type * as schema_messages from "../schema/messages.js";
import type * as schema_parts from "../schema/parts.js";
import type * as schema_usage from "../schema/usage.js";
import type * as schema_users from "../schema/users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  auth: typeof auth;
  "conversations/create": typeof conversations_create;
  conversations: typeof conversations;
  http: typeof http;
  "http_actions/create_chat/generate_title": typeof http_actions_create_chat_generate_title;
  "http_actions/create_chat/route": typeof http_actions_create_chat_route;
  "http_actions/create_chat/stream_transform": typeof http_actions_create_chat_stream_transform;
  "lib/prompts": typeof lib_prompts;
  "lib/transformers/convert_stream_output_to_message_parts": typeof lib_transformers_convert_stream_output_to_message_parts;
  "lib/transformers/convert_ui_message_to_db_message": typeof lib_transformers_convert_ui_message_to_db_message;
  me: typeof me;
  messages: typeof messages;
  "schema/conversations": typeof schema_conversations;
  "schema/messages": typeof schema_messages;
  "schema/parts": typeof schema_parts;
  "schema/usage": typeof schema_usage;
  "schema/users": typeof schema_users;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
