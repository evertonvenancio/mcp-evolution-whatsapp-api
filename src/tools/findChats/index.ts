import type { ToolRegistration } from "../../types";
import { makeJsonSchema } from "../../utils/makeJsonSchema";
import { evolutionApi } from "../../utils/evolutionApi";
import { findChatsSchema, type FindChatsSchema } from "./schema";

export const findChats = async (params: FindChatsSchema) => {
  try {
    const result = await evolutionApi.findChats(
      params.instanceName,
      { where: params.where, page: params.page, offset: params.offset }
    );

    return result;
  } catch (error) {
    console.error("Error in findChats:", error);
    throw new Error(`Failed to find chats: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const findChatsTool: ToolRegistration<FindChatsSchema> = {
  name: "find_chats",
  description: "Find WhatsApp chats with optional filtering by ID, name, or archive status. Supports pagination via page/offset — the API may not return all chats in a single call, so call repeatedly with increasing page numbers until an empty result is returned to get the full list.",
  inputSchema: makeJsonSchema(findChatsSchema),
  handler: async (args: FindChatsSchema) => {
    try {
      const parsedArgs = findChatsSchema.parse(args);
      const result = await findChats(parsedArgs);

      const chatCount = result.chats?.length || 0;
      const filterDescription = parsedArgs.where ?
        Object.entries(parsedArgs.where)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ") :
        "no filters";

      const resultJson = JSON.stringify(result, null, 2);

      return {
        content: [
          {
            type: "text",
            text: `Found ${chatCount} chats${filterDescription ? ` with ${filterDescription}` : ""} for instance ${parsedArgs.instanceName} (page ${parsedArgs.page || 1})\n\n${resultJson}`,
          },
        ],
      };
    } catch (error) {
      console.error("Error in findChatsTool handler:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
};
