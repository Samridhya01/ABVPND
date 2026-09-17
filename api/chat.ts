import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

function getFallbackAnswer(userQuery: string): string {
  const query = userQuery.toLowerCase();

  if (query.includes('membership') || query.includes('join') || query.includes('5') || query.includes('fee')) {
    return `**ABVP Narasimha Datta College Unit Membership Drive (2026–27)**

- **Nominal Fee:** Just **₹5** per academic year.
- **How to Enroll:**
  1. Click on the **Membership** tab on this website.
  2. Scan the official unit UPI QR code or pay ₹5 to \`abvpndc.howrah@upi\`.
  3. Enter your Name, Phone Number, Semester, Stream, and Address.
  4. Upload the payment screenshot (SS) and click submit.
  5. Your digital **ABVP Student Membership Card** is generated immediately!
- You can also visit our **Campus Help Desk** near the college entrance gate for physical form submission and badge collection.`;
  }

  if (query.includes('scholarship') || query.includes('svmcm') || query.includes('kanyashree') || query.includes('aikyashree')) {
    return `**Major Scholarships for Narasimha Datta College Students:**

1. **SVMCM (Swami Vivekananda Merit-cum-Means):**
   - Eligibility: Minimum 60% marks in previous qualifying examination. Family annual income under ₹2,50,000.
   - Benefit: ₹1,000 to ₹1,500/month for undergraduate students (General/Honours).
2. **Kanyashree Prakalpa (K3):**
   - For unmarried female students pursuing Post-Graduate studies (M.A./M.Sc.) at NDC/CU.
3. **Aikyashree:**
   - Pre-matric, Post-matric, and Merit-cum-Means for minority community students.
4. **OASIS Scholarship:**
   - For SC, ST, and OBC students administered by the Backward Classes Welfare Department, WB.

*Our ABVP Help Desk assists students free of cost with document attestation and online portal application!*`;
  }

  if (query.includes('address') || query.includes('where') || query.includes('location') || query.includes('contact')) {
    return `**Narasimha Datta College Campus & Contact Info:**

- **Address:** 129, Belilious Road, Kadamtala, Howrah – 711101, West Bengal.
- **Affiliated To:** University of Calcutta (CU).
- **Nearest Railway Stations:** Howrah Railway Station (~3.5 km) and Santragachi Junction (~3 km).
- **ABVP Unit Contact:** Connect via the Student Help Desk tab on this site or message our WhatsApp helpline.`;
  }

  if (query.includes('exam') || query.includes('cu') || query.includes('syllabus') || query.includes('semester')) {
    return `**Calcutta University (CU) Academic & Examination Information:**

- Narasimha Datta College operates under the **Curriculum & Credit Framework (CCF / NEP)** and CBCS semester pattern of the University of Calcutta.
- Semester examinations are held twice a year (Odd Semester in Dec–Jan, Even Semester in June–July).
- Exam forms, admit card issuance, and marksheet distribution are coordinated via the college central office.
- Need guidance with previous years' CU question papers? Connect with our unit volunteers through the Help Desk tab!`;
  }

  return `**Namaskar! Welcome to Vidyarthi Mitra – ABVP NDC Unit Assistant**

I am here to help all students of Narasimha Datta College with:
- **₹5 Annual Student Membership** (apply directly on the Membership tab)
- **Calcutta University Academic Updates & Syllabus**
- **Scholarship Guidance (SVMCM, Kanyashree, Aikyashree, OASIS)**
- **Free Student Help Desk & Grievance Assistance**
- **College Department & Facility Details**

Feel free to ask your question in English, Bengali (বাংলা), or Hindi!`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const messages = body?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const ai = getGenAI();

    const contents = messages.map((m: { role: 'user' | 'model' | 'assistant'; text: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const systemInstruction = `You are 'Vidyarthi Mitra' (Student Friend), the helpful, knowledgeable, and polite campus student AI assistant for Akhil Bharatiya Vidyarthi Parishad (ABVP) – Narasimha Datta College Unit, Howrah, West Bengal (affiliated with Calcutta University).

College Profile & Context:
- Institution: Narasimha Datta College, 129 Belilious Road, Howrah - 711101, West Bengal.
- Affiliation: University of Calcutta (CU).
- Streams: B.A. (Honours & General), B.Sc. (Honours & General), B.Com. (Honours & General), and Post-Graduate courses (M.A., M.Sc.).
- ABVP NDC Unit Activities: Annual Membership Drive (₹5 fee), Student Help Desk (free guidance during admissions, examination form fill-up, document verification), Book Bank, Blood Donation Camps, Mission Sahasi (self-defense for girls), Anti-ragging student helpline, and cultural competitions.
- Government Scholarships: Guide students accurately on Swami Vivekananda Merit-cum-Means Scholarship (SVMCM, 60%+ in previous exam), Kanyashree (K3 for PG girl students), Aikyashree (Minority scholarships), Oasis (SC/ST/OBC), and NSP.
- Membership Info: Explain that students can join ABVP NDC Unit directly on this website for ₹5 by filling the form and uploading payment screenshot, or visiting the campus Help Desk.

Search Grounding Instructions:
- Always utilize Google Search grounding when asked about current academic schedules, university exam routine, latest circulars, or West Bengal higher education announcements.
- Always provide verified, encouraging, and respectful information.
- You can converse fluently in English, Bengali (বাংলা), or Hindi depending on the student's language preference.
- Format responses cleanly using markdown bullet points and short paragraphs for effortless mobile reading.`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents,
          config: {
            systemInstruction,
            tools: [{ googleSearch: {} }],
          },
        });

        const replyText = response.text || 'I am here to assist you with Narasimha Datta College and ABVP student initiatives. How can I help you today?';
        
        const candidate = response.candidates?.[0];
        const groundingMetadata = candidate?.groundingMetadata;
        const searchQueries = groundingMetadata?.webSearchQueries || [];
        const searchSources: Array<{ title: string; url: string }> = [];

        if (groundingMetadata?.groundingChunks) {
          groundingMetadata.groundingChunks.forEach((chunk: any) => {
            if (chunk.web?.uri && chunk.web?.title) {
              searchSources.push({
                title: chunk.web.title,
                url: chunk.web.uri,
              });
            }
          });
        }

        return res.status(200).json({
          reply: replyText,
          searchQueries,
          sources: searchSources.slice(0, 4),
          grounded: searchSources.length > 0 || searchQueries.length > 0,
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call warning:', geminiError?.message || geminiError);
        return res.status(200).json({
          reply: getFallbackAnswer(messages[messages.length - 1]?.text || ''),
          grounded: false,
          note: 'Offline student knowledge base response',
        });
      }
    } else {
      return res.status(200).json({
        reply: getFallbackAnswer(messages[messages.length - 1]?.text || ''),
        grounded: false,
        note: 'Offline student knowledge base response (Configure GEMINI_API_KEY for live Google Search)',
      });
    }
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      error: 'An error occurred while processing your request.',
      reply: 'Namaskar! I am your Vidyarthi Mitra for ABVP Narasimha Datta College Unit. Please ask any question about college admissions, syllabus, exams, or ₹5 membership!',
    });
  }
}
