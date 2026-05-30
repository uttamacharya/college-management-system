import type { Request, Response } from 'express';
import { fetchUserContext } from '../services/userClient.js';
import { generateAIResponse } from '../services/geminiService.js';
import { getChatHistory, saveChatMessage } from '../services/chatMemory.service.js';
import { fetchStudentProfile, fetchTeacherTimetable } from '../services/collegeClient.js';

export const handleAskAI = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const { prompt } = req.body;

        // Middleware se aaya user
        const userId = req.user?.id;
        const userRole = req.user?.role;

        // Validation
        if (!prompt) {
            res.status(400).json({
                success: false,
                message: "Kripya ek sawal (prompt) bhejein."
            });
            return;
        }

        if (!userId || !userRole) {
            res.status(401).json({
                success: false,
                message: "Unauthorized user."
            });
            return;
        }

        console.log(`🤖 Processing AI request for User: ${userId}`);

        // Fetch user context
        const authHeader = req.headers.authorization;

        const token = authHeader?.split(" ")[1];
        console.log("AUTH HEADER =>", req.headers.authorization);
        console.log("TOKEN =>", token);

        const userContext = await fetchUserContext(
            userId,
            userRole,
            token!
        );

        // =========================================
        // EXTRA DATA
        // =========================================

        let studentProfile = null;

        let timetable = null;

        // =========================================
        // STUDENT PROFILE
        // =========================================

        try {

            studentProfile =
                await fetchStudentProfile(token!);

        } catch (error) {

            console.log(
                "Student profile not available"
            );
        }

        // =========================================
        // TIMETABLE
        // =========================================

        try {

            timetable =
                await fetchTeacherTimetable(token!);

        } catch (error) {

            console.log(
                "Timetable not available"
            );
        }

        // Generate AI Response
        // =========================================
        // GET PREVIOUS CHAT HISTORY
        // =========================================

        const chatHistory = await getChatHistory(userId);

        // =========================================
        // GENERATE AI RESPONSE
        // =========================================

        const aiContext = {
            profile: userContext,
            studentProfile,
            timetable
        };

        const aiAnswer = await generateAIResponse(
            prompt,
            aiContext,
            chatHistory
        );

        // =========================================
        // SAVE USER MESSAGE
        // =========================================

        await saveChatMessage(
            userId,
            "user",
            prompt
        );

        // =========================================
        // SAVE AI RESPONSE
        // =========================================

        await saveChatMessage(
            userId,
            "assistant",
            aiAnswer
        );

        // Send response
        res.status(200).json({
            success: true,
            answer: aiAnswer
        });

    } catch (error: unknown) {

        if (error instanceof Error) {
            console.error("❌ Controller Error:", error.message);
        }

        res.status(500).json({
            success: false,
            message: "AI response generate karne mein error aaya."
        });
    }
};