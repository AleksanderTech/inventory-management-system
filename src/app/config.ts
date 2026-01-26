export const Config = {
  port: envAsNumberOrThrow("PORT"),
  env: envAsStringOrThrow("ENV"),
};

function requireEnv<T>(
  key: string,
  parser: (value: string, key: string) => T
): T {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`${key} env variable is required, but is undefined`);
  }

  return parser(value, key);
}

function envAsNumberOrThrow(key: string): number {
  return requireEnv(key, parseNumberOrThrow);
}

function envAsStringOrThrow(key: string): string {
  return requireEnv(key, parseStringOrThrow);
}

function parseStringOrThrow(value: string, key: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error(`${key} env variable is required, but is empty`);
  }

  return trimmed;
}

function parseNumberOrThrow(value: string, key: string): number {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error(`${key} env variable is required, but is empty`);
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Can't parse ${key} to number`);
  }

  return parsed;
}
