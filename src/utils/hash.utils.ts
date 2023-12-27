import * as bcrypt from 'bcrypt';

export async function hashData(data: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(data, salt);
}