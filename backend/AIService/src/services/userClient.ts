import axios from 'axios';
import dotenv from 'dotenv';
import { redisClient } from '../config/redis.js';
import type { UserContext } from '../interfaces/user.interface.js';

dotenv.config();

const USER_SERVICE_URL =
    process.env.USER_SERVICE_URL || 'http://localhost:4000';

interface UserServiceResponse {
    success: boolean;
    user: UserContext;
}

export const fetchUserContext = async (
    userId: string,
    role: string,
    token: string
): Promise<UserContext> => {

    const cacheKey = `user_context:${userId}:${role}`;

    try {

        // =========================================
        // CHECK REDIS CACHE
        // =========================================

        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {

            console.log("⚡ Context fetched from Redis Cache!");

            return JSON.parse(cachedData) as UserContext;
        }

        console.log("🌐 Cache miss! Fetching from User Service...");

        // =========================================
        // FETCH FROM USER SERVICE
        // =========================================

        const response = await axios.get(
            `${USER_SERVICE_URL}/api/auth/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const userData = response.data;

        // =========================================
        // SAVE TO REDIS
        // =========================================

        await redisClient.setEx(
            cacheKey,
            900,
            JSON.stringify(userData)
        );

        return userData;

    } catch (error: unknown) {

        if (error instanceof Error) {
            console.error(
                "❌ Error fetching user context:",
                error.message
            );
        }

        throw new Error(
            "Unable to fetch user data from User Service"
        );
    }
};