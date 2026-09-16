import { z } from "zod";

export const findChatsSchema = z.object({
  instanceName: z.string().describe("Name of the Evolution API instance"),
  where: z
    .object({
      id: z.string().optional().describe("Filter by chat ID/phone number"),
      name: z.string().optional().describe("Filter by chat name"),
      archived: z.boolean().optional().describe("Filter by archived status")
    })
    .optional()
    .describe("Filter criteria for chats"),
  page: z.number().optional().describe("Page number for pagination (starts at 1). Use this to fetch all chats beyond the first page."),
  offset: z.number().optional().describe("Number of results per page (e.g. 50 or 100)")
});

export type FindChatsSchema = z.infer<typeof findChatsSchema>;
