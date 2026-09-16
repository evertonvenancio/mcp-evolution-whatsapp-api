import { z } from "zod";

export const findMessagesSchema = z.object({
  instanceName: z.string().describe("Name of the Evolution API instance"),
  remoteJid: z.string().describe("Chat ID to fetch messages from (e.g. 5511999999999@s.whatsapp.net or a group ...@g.us)"),
  page: z.number().optional().describe("Page number for pagination (default 1)")
});

export type FindMessagesSchema = z.infer<typeof findMessagesSchema>;
