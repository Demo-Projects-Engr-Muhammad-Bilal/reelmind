// app/lib/types/custom.ts

export type UsageLogForOverview = {
          id: string;
          cost: number;
          provider: string;
          createdAt: Date;
          userId: string;
};

export type UserForLog = {
          id: string;
          name: string | null;
          email: string;
};

export type ReelWithUser = {
          id: string;
          style: string;
          status: string;
          createdAt: Date;
          user: { name: string | null } | null;
};

export type NicheInfo = {
          key: string;
          name: string;
};



// Admin
export interface UpdateAdminProfilePayload {
          name: string;
          email: string;
          currentPassword?: string;
          newPassword?: string;
}

// Auth
export interface LoginPayload {
          email: string;
          password: string;
}

export interface Verify2FAPayload {
          email: string;
          code: string;
          isFirstTimeSetup?: boolean;
}

//Reels
export interface ReelRecord {
          id: string;
          topic: string;
          style: string;
          status: string;
          videoUrl?: string | null;          // <-- FIX: allow null
          localFallbackPath?: string | null; // <-- FIX: allow null
          isPublic: boolean;
          createdAt: Date;
          updatedAt?: Date | null;           // <-- FIX: allow null
          user?: { name: string | null; email: string } | null;
          scenes?: {
                    id: string;
                    order: number;
                    visualPrompt: string;
                    videoPrompt?: string | null;
                    audioText: string;
                    voiceoverUrl?: string | null;
                    imagePath?: string | null;
                    videoPath?: string | null;
                    audioDuration?: number | null;
                    createdAt: Date;
                    creditsSpent: number;
          }[];
}


export interface UsageLogRecord {
          id: string;
          userId: string;
          reelId: string;
          stage: string;
          provider: string;
          cost: number;
          createdAt: Date;
          user?: { id: string; name: string | null; email: string } | null;
}


export interface UserRecord {
          id: string;
          email: string;
          name?: string | null;
          password: string;
          credits: number;
          isVerified: boolean;
          verifyToken?: string | null;
          verifyTokenExpiry?: Date | null;
          resetToken?: string | null;
          resetTokenExpiry?: Date | null;
          currentSessionId?: string | null;
          createdAt: Date;
          updatedAt: Date;
          telegramId?: string | null;
          telegramCreds?: {
                    id: string;
                    telegramChatId: string;
                    username?: string | null;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
          } | null;
          _count?: { reels: number };
}
