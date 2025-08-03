import { useMutation } from "@tanstack/react-query";
import { GoogleGenAI } from "@google/genai";

type inputTypes = {
    idioms: string[],
    information: string
}

type serverRSP = {
    story: string,
    storyFa: string,
    storyEn: string,
    status: boolean
}

function removeAsterisks(text: string): string {
    // حذف ** از دور اصطلاحات
    return text.replace(/\*\*([^*]+)\*\*/g, '$1');
}

export function useGeminiStory () {
    return useMutation<serverRSP,Error, inputTypes>({
        mutationFn: async (variables) => {
            const apiKey = 'AIzaSyCDXMKBUSPiT5eL13KBgAdP4GMX_Q9S_PY';
            const theWords = variables.idioms.join(' - ');
            const prompt = `Write a story using these idioms for a language learner. First, provide the story in Persian (Farsi) and then its English translation, each clearly labeled.\nIn both the Persian and English stories, put the exact translation or equivalent of each idiom in [brackets] so it can be highlighted.\nIdioms: ${theWords}.${variables.information ? '\nAdditional information: ' + variables.information : ''}\nOutput format:\nPersian:\n[FA]\nEnglish:\n[EN]`;
            try {
                const ai = new GoogleGenAI({ apiKey: apiKey });
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt,
                });
                let text = response.text || "No story generated.";
                text = removeAsterisks(text);
                // Parse FA and EN parts
                let fa = "", en = "";
                let faMatch = text.match(/Persian:?\s*\[FA\]([\s\S]*?)English:?/i);
                let enMatch = text.match(/English:?\s*\[EN\]([\s\S]*)/i);
                if (!faMatch || !enMatch) {
                    faMatch = text.match(/\[FA\]([\s\S]*?)\[EN\]/i);
                    enMatch = text.match(/\[EN\]([\s\S]*)/i);
                }
                if (!faMatch || !enMatch) {
                    const faIdx = text.indexOf('[FA]');
                    const enIdx = text.indexOf('[EN]');
                    if (faIdx !== -1 && enIdx !== -1) {
                        fa = text.substring(faIdx + 4, enIdx).trim();
                        en = text.substring(enIdx + 4).trim();
                    }
                } else {
                    fa = faMatch[1]?.trim() || "";
                    en = enMatch[1]?.trim() || "";
                }
                fa = removeAsterisks(fa);
                en = removeAsterisks(en);
                return {
                    story: text,
                    storyFa: fa,
                    storyEn: en,
                    status: true
                };
            } catch (err: any) {
                return {
                    story: "Error generating story: " + (err?.message || "Unknown error"),
                    storyFa: "",
                    storyEn: "",
                    status: false
                };
            }
        }
    })
}