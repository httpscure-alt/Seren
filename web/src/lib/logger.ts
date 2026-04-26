export function log(event: string, meta: Record<string, unknown> = {}) {
  const line = {
    ts: new Date().toISOString(),
    event,
    ...meta,
  };
  // Keep JSON logs for easy parsing in production.
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(line));
}

