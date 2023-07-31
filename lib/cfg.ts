import { z } from "zod";

const rawEnvCfg = {
  admin: {
    tgChatId: process.env.TG_ADMIN_CHAT_ID
  },
  api: {
    azure: {
      common: {
        url: process.env.API_URL,
        authCode: process.env.API_AUTH_CODE
      },
      admin: {
        url: process.env.ADMIN_API_URL,
        authCode: process.env.ADMIN_API_AUTH_CODE
      }
    }
  }
};

const CfgSchema = z.object({
  admin: z
    .object({
      tgChatId: z.string().optional()
    })
    .default({}),
  api: z.object({
    azure: z.object({
      common: z.object({
        url: z.string().url(),
        authCode: z.string()
      }),
      admin: z.object({
        url: z.string().url(),
        authCode: z.string()
      })
    })
  })
});

type Cfg = z.infer<typeof CfgSchema>;

export const cfg: Cfg = CfgSchema.parse(rawEnvCfg);
