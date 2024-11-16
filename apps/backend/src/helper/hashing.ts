import bcrypt from "bcrypt";

const SALT_ROUNDS: number = 10;

export async function hashPass(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    return hashedPassword;
  } catch (e) {
    console.error("Error Hashing password :", e);
    throw new Error("Error hashing password, please try again");
  }
}

export async function comparePass(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    const result = await bcrypt.compare(password, hash);
    return result;
  } catch (e) {
    console.error("Error comparing password:", e);
    throw new Error("Error comparing password, please try again");
  }
}
