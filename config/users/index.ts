import type { EnvironmentName } from '../environments/environment.types';
import type { UserCredentials, UserRole, UsersByRole } from './user.types';

const ENV_MODULE_EXPORTS: Record<EnvironmentName, string> = {
  dev: 'devUsers',
  qa: 'qaUsers',
  ppr: 'pprUsers',
};

function envKey(env: EnvironmentName, role: UserRole, field: 'LOGIN' | 'PASSWORD' | 'NAME'): string {
  return `PICASSO_${env.toUpperCase()}_${role.toUpperCase()}_${field}`;
}

function getUserFromEnvironmentVariables(env: EnvironmentName, role: UserRole): UserCredentials | undefined {
  const login = process.env[envKey(env, role, 'LOGIN')] || process.env.PICASSO_LOGIN;
  const password = process.env[envKey(env, role, 'PASSWORD')] || process.env.PICASSO_PASSWORD;
  const name = process.env[envKey(env, role, 'NAME')] || process.env.PICASSO_USER_NAME || role;

  if (!login || !password) return undefined;

  return { role, name, login, password };
}

function getUsersFromLocalConfig(env: EnvironmentName): UsersByRole | undefined {
  try {
    const usersModule = require(`./${env}.users`) as Partial<Record<string, UsersByRole>>;
    return usersModule[ENV_MODULE_EXPORTS[env]];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'MODULE_NOT_FOUND') return undefined;
    throw error;
  }
}

/**
 * Get user credentials by role and environment.
 * Environment defaults to TEST_ENV env var, then 'dev'.
 */
export function getUser(role: UserRole, envName?: string): UserCredentials {
  const env = (envName || process.env.TEST_ENV || 'qa') as EnvironmentName;
  const envUser = getUserFromEnvironmentVariables(env, role);
  if (envUser) return envUser;

  const users = getUsersFromLocalConfig(env);
  const user = users?.[role];
  if (!user) {
    const availableRoles = users ? Object.keys(users).join(', ') : 'none';
    throw new Error(
      `No user with role "${role}" in environment "${env}". ` +
      `Provide local config/users/${env}.users.ts or set PICASSO_LOGIN/PICASSO_PASSWORD ` +
      `or ${envKey(env, role, 'LOGIN')}/${envKey(env, role, 'PASSWORD')}. ` +
      `Available local roles: ${availableRoles}`,
    );
  }
  return user;
}

/**
 * Get the default user for test execution.
 * Role is determined by TEST_ROLE env var, defaults to 'product_owner'.
 */
export function getDefaultUser(envName?: string): UserCredentials {
  const role = (process.env.TEST_ROLE || 'process_quality_leader') as UserRole;
  return getUser(role, envName);
}

export type { UserCredentials, UserRole, UsersByRole, UsersByEnvironment } from './user.types';
