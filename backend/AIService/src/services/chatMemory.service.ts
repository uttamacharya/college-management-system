import { redisClient } from "../config/redis.js";

// CHAT MESSAGE INTERFACE

export interface ChatMessage {
    role: "user" | "assistant";
    message: string;
}

// GET CHAT HISTORY

export const getChatHistory = async (
    userId: string
): Promise<ChatMessage[]> => {

    try {

        const chatKey = `chat:${userId}`;

        const history = await redisClient.get(chatKey);

        if (!history) {
            return [];
        }

        return JSON.parse(history);

    } catch (error) {

        console.error(
            "❌ Error getting chat history:",
            error
        );

        return [];
    }
};

// SAVE CHAT MESSAGE

export const saveChatMessage = async (
    userId: string,
    role: "user" | "assistant",
    message: string
): Promise<void> => {

    try {

        const chatKey = `chat:${userId}`;

        // Existing history
        const existingHistory = await getChatHistory(userId);

        // Add new message
        existingHistory.push({
            role,
            message
        });

        // Keep only last 10 messages
        const limitedHistory = existingHistory.slice(-10);

        // Save to Redis
        await redisClient.set(
            chatKey,
            JSON.stringify(limitedHistory)
        );

        // Expire after 5 minutes
        await redisClient.expire(chatKey, 300);

    } catch (error) {

        console.error(
            "❌ Error saving chat message:",
            error
        );
    }
};