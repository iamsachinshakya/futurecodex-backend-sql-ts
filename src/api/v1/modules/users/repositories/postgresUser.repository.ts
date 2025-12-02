import { eq, and, or, like, sql, desc, asc } from "drizzle-orm";
import type { AnyColumn } from "drizzle-orm";
import { IUserEntity, UserRole } from "../models/user.entity";
import { IRegisterData, IUpdateUserData } from "../models/user.dto";
import { IUserRepository } from "./user.repository.interface";
import { getDB } from "../../../../../app/db/postgres/connectDB";
import { users } from "../models/postgresUser.model";

export class UserPostgresRepository implements IUserRepository {

    /** ------------------- CREATE ------------------- */
    async create(data: IRegisterData): Promise<IUserEntity | null> {
        const [user] = await getDB().insert(users).values(data).returning();
        return user ? this.toEntity(user) : null;
    }

    /** ---------------- FIND BY ID ------------------ */
    async findById(id: string, isRequiredSensitiveData = false): Promise<IUserEntity | null> {
        const [user] = await getDB()
            .select()
            .from(users)
            .where(eq(users.id, parseInt(id)));

        return user ? this.toEntity(user, isRequiredSensitiveData) : null;
    }

    /** ---------------- FIND BY EMAIL ---------------- */
    async findByEmail(email: string, isRequiredSensitiveData = false): Promise<IUserEntity | null> {
        const [user] = await getDB()
            .select()
            .from(users)
            .where(eq(users.email, email));

        return user ? this.toEntity(user, isRequiredSensitiveData) : null;
    }

    /** ---------------- FIND BY USERNAME ----------- */
    async findByUsername(username: string): Promise<IUserEntity | null> {
        const normalized = username.toLowerCase();
        const [user] = await getDB()
            .select()
            .from(users)
            .where(eq(users.username, normalized));

        return user ? this.toEntity(user) : null;
    }

    /** -------- FIND BY EMAIL OR USERNAME -------- */
    async findByEmailOrUsername({ email, username }: { email?: string; username?: string }) {
        const conditions = [];

        if (email) conditions.push(eq(users.email, email));
        if (username) conditions.push(eq(users.username, username.toLowerCase()));

        if (conditions.length === 0) return null;

        const [user] = await getDB()
            .select()
            .from(users)
            .where(or(...conditions));

        return user ? this.toEntity(user) : null;
    }

    /** ---------------- FIND ALL (Search, Sort, Paginate) ----------- */
    async findAll(
        filter: { search?: string; role?: string } = {},
        options: { page?: number; limit?: number; sort?: Record<string, any> } = {}
    ): Promise<{ data: IUserEntity[]; total: number }> {

        const { search, role } = filter;
        const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;

        const whereConditions: any[] = [];

        if (search) {
            whereConditions.push(
                or(
                    like(users.fullName, `%${search}%`),
                    like(users.email, `%${search}%`),
                    like(users.username, `%${search}%`)
                )
            );
        }

        if (role && role !== "all") {
            whereConditions.push(eq(users.role, role as UserRole));
        }

        const finalWhere = whereConditions.length > 0 ? and(...whereConditions) : undefined;

        // Count total
        const [{ count }] = await getDB()
            .select({ count: sql<number>`count(*)` })
            .from(users)
            .where(finalWhere);

        // Column mapping for dynamic sorting
        const columnMap: Record<string, AnyColumn> = {
            id: users.id,
            email: users.email,
            username: users.username,
            fullName: users.fullName,
            role: users.role,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
        };

        const orderByArray = Object.entries(sort).map(([column, order]) => {
            const col = columnMap[column] || users.createdAt;
            return order === -1 ? desc(col) : asc(col);
        });

        const rows = await getDB()
            .select()
            .from(users)
            .where(finalWhere)
            .orderBy(...orderByArray)
            .limit(limit)
            .offset((page - 1) * limit);

        return {
            data: rows.map((r) => this.toEntity(r)).filter((u): u is IUserEntity => u !== null),
            total: Number(count),
        };
    }

    /** ---------------- UPDATE BY ID ------------------ */
    async updateById(id: string, data: Partial<IUserEntity>): Promise<IUserEntity | null> {
        const { id: _ignore, ...safeData } = data;

        const [updated] = await getDB()
            .update(users)
            .set(safeData)
            .where(eq(users.id, Number(id)))
            .returning();

        return updated ? this.toEntity(updated) : null;
    }


    /** ---------------- DELETE BY ID ------------------ */
    async deleteById(id: string): Promise<IUserEntity | null> {
        const [deleted] = await getDB()
            .delete(users)
            .where(eq(users.id, parseInt(id)))
            .returning();

        return deleted ? this.toEntity(deleted) : null;
    }

    /** -------- REMOVE REFRESH TOKEN -------- */
    async removeRefreshTokenById(userId: string): Promise<IUserEntity | null> {
        const [updated] = await getDB()
            .update(users)
            .set({ refreshToken: null })
            .where(eq(users.id, parseInt(userId)))
            .returning();

        return updated ? this.toEntity(updated) : null;
    }

    /** -------- UPDATE ACCOUNT DETAILS -------- */
    async updateAccountDetails(userId: string, updates: Partial<IUpdateUserData>) {
        return this.updateById(userId, updates);
    }

    /** -------- CHECK USERNAME TAKEN -------- */
    async isUsernameTaken(username: string): Promise<boolean> {
        const normalized = username.toLowerCase();
        const [exists] = await getDB()
            .select({ id: users.id })
            .from(users)
            .where(eq(users.username, normalized));

        return !!exists;
    }

    // -------------------------------------------------------
    //                FOLLOWERS / FOLLOWING (JSONB Arrays)
    // -------------------------------------------------------

    async addFollower(targetUserId: string, followerId: string): Promise<void> {
        await getDB()
            .update(users)
            .set({
                followers: sql`COALESCE(${users.followers}, '[]'::jsonb) || ${JSON.stringify([followerId])}::jsonb`
            })
            .where(
                and(
                    eq(users.id, parseInt(targetUserId)),
                    sql`NOT (COALESCE(${users.followers}, '[]'::jsonb) @> ${JSON.stringify([followerId])}::jsonb)`
                )
            );
    }

    async removeFollower(targetUserId: string, followerId: string): Promise<void> {
        await getDB()
            .update(users)
            .set({
                followers: sql`COALESCE(${users.followers}, '[]'::jsonb) - ${followerId}`
            })
            .where(eq(users.id, parseInt(targetUserId)));
    }

    async addFollowing(userId: string, targetUserId: string): Promise<void> {
        await getDB()
            .update(users)
            .set({
                following: sql`COALESCE(${users.following}, '[]'::jsonb) || ${JSON.stringify([targetUserId])}::jsonb`
            })
            .where(
                and(
                    eq(users.id, parseInt(userId)),
                    sql`NOT (COALESCE(${users.following}, '[]'::jsonb) @> ${JSON.stringify([targetUserId])}::jsonb)`
                )
            );
    }

    async removeFollowing(userId: string, targetUserId: string): Promise<void> {
        await getDB()
            .update(users)
            .set({
                following: sql`COALESCE(${users.following}, '[]'::jsonb) - ${targetUserId}`
            })
            .where(eq(users.id, parseInt(userId)));
    }

    async findFollowers(userId: string): Promise<IUserEntity[]> {
        const [user] = await getDB()
            .select({ followers: users.followers })
            .from(users)
            .where(eq(users.id, parseInt(userId)));

        if (!user || !user.followers) return [];

        const followerIds = user.followers as string[];
        if (followerIds.length === 0) return [];

        const followers = await getDB()
            .select()
            .from(users)
            .where(sql`${users.id}::text = ANY(${followerIds})`);

        return followers
            .map(f => this.toEntity(f))
            .filter((u): u is IUserEntity => u !== null);
    }

    async findFollowing(userId: string): Promise<IUserEntity[]> {
        const [user] = await getDB()
            .select({ following: users.following })
            .from(users)
            .where(eq(users.id, parseInt(userId)));

        if (!user || !user.following) return [];

        const followingIds = user.following as string[];
        if (followingIds.length === 0) return [];

        const following = await getDB()
            .select()
            .from(users)
            .where(sql`${users.id}::text = ANY(${followingIds})`);

        return following
            .map(f => this.toEntity(f))
            .filter((u): u is IUserEntity => u !== null);
    }

    /** ---------------- ENTITY TRANSFORMER ---------------- */
    private toEntity(record: any, isRequiredSensitiveData = false): IUserEntity | null {
        if (!record) return null;

        const { password, refreshToken, ...safeData } = record;

        const base: IUserEntity = {
            ...safeData,
            id: record.id.toString(),
        };

        if (isRequiredSensitiveData) {
            base.password = password;
            base.refreshToken = refreshToken;
        }

        return base;
    }
}
