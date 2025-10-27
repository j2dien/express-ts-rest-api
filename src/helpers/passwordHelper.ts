import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const hashPassword = (plain: string): string => {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  return bcrypt.hashSync(plain, salt);
};

export const comparePassword = (plain: string, hashed: string): boolean => {
  return bcrypt.compareSync(plain, hashed);
};
