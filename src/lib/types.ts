import type { Conversation } from "convex/schema/conversations";
import type { Infer } from "convex/values";

export type Conversation = Infer<typeof Conversation>;
