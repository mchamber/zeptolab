
export default {
  NodeEnv: (process.env.NODE_ENV ?? ''),
  Port: (process.env.PORT ?? 0),
} as const;
