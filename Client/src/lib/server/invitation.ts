import { eq, gt, and } from "drizzle-orm";
import { db } from "./db";
import { invitationCodes } from "./db/schema";


function generateId(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function generateInviteCode(): Promise<string> {
  const code = generateId(8).toUpperCase();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db.insert(invitationCodes).values({
    code,
    expiresAt
  });

  return code;
}

export async function validateInviteCode(code: string): Promise<boolean> {
  const invitation = await db.select()
    .from(invitationCodes)
    .where(and(
      eq(invitationCodes.code, code.toUpperCase()),
      eq(invitationCodes.used, false),
      gt(invitationCodes.expiresAt, new Date())))
    .limit(1);

  return invitation.length > 0
}

export async function useInviteCode(code: string, userId: string): Promise<boolean> {
  const invitation = await db.select()
    .from(invitationCodes)
    .where(and(
      eq(invitationCodes.code, code.toUpperCase()),
      eq(invitationCodes.used, false),
      gt(invitationCodes.expiresAt, new Date())))
    .limit(1);

  if (!invitation.length) return false;

  await db.update(invitationCodes)
    .set({
      used: true,
      usedBy: userId,
      usedAt: new Date()
    })
    .where(eq(invitationCodes.id, invitation[0].id));

  return true;
}

export async function getAllInviteCodes() {
  return await db.select().from(invitationCodes).orderBy(invitationCodes.createdAt);
}
