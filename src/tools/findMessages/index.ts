import type { ToolRegistration } from "../../types";
import { makeJsonSchema } from "../../utils/makeJsonSchema";
import { evolutionApi } from "../../utils/evolutionApi";
import { findMessagesSchema, type FindMessagesSchema } from "./schema";

export const findMessages = async (params: FindMessagesSchema) => {
  try {
    const result = await evolutionApi.findMessages(
      params.instanceName,
      params.remoteJid,
      params.page
    );

    return result;
  } catch (error) {
    console.error("Error in findMessages:", error);
    throw new Error(`Failed to find messages: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const findMessagesTool: ToolRegistration<FindMessagesSchema> = {
  name: "find_messages",
  description: "Find WhatsApp messages from a specific chat (by remoteJid), with pagination",
  inputSchema: makeJsonSchema(findMessagesSchema),
  handler: async (args: FindMessagesSchema) => {
    try {
      const parsedArgs = findMessagesSchema.parse(args);
      const result = await findMessages(parsedArgs);

      const resultJson = JSON.stringify(result, null, 2);

      return {
        content: [
          {
            type: "text",
            text: `Messages for chat ${parsedArgs.remoteJid} on instance ${parsedArgs.instanceName}\n\n${resultJson}`,
          },
        ],
      };
    } catch (error) {
      console.error("Error in findMessagesTool handler:", error);
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
