/**
 * JWT configuration for authentication.
 * @property {string} secret - The secret key used to sign the JWT.
 * @property {object} signOptions - Options for JWT signing.
 * @property {string} signOptions.expiresIn - Token expiration time.
 */
export const JWT_CONFIG = {
  secret: 'secret',
  signOptions: { expiresIn: '1y' },
} as const;
