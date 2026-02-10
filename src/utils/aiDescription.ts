/**
 * AI Property Description Generator using Groq API (Llama 3.1)
 * 
 * Groq offers free tier with 30 RPM and is extremely fast.
 * Get your free API key at: https://console.groq.com/keys
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function generatePropertyDescription(
  category: string,
  title: string
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('Groq API key not configured. Get a free key at https://console.groq.com/keys');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional real estate copywriter for Rentals.ph, a Philippine rental property platform. Write compelling, concise property descriptions for rental listings. Keep it to 3-4 sentences. Be specific and professional. Do not use markdown formatting. Write in plain text only.',
        },
        {
          role: 'user',
          content: `Write a rental property listing description for:\nCategory: ${category}\nTitle: ${title}\n\nThe description should highlight the property's appeal, mention potential amenities typical for this category, and encourage prospective tenants to schedule a viewing.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Groq API error: ${response.status} — ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error('Groq API returned an empty response');
  }

  return content;
}

export function getFallbackDescription(
  category: string,
  title: string
): string {
  return `Welcome to ${title}! This beautifully maintained ${category.toLowerCase()} offers a perfect blend of comfort and convenience. Featuring modern finishes, quality appliances, and a well-thought-out layout, this property is ideal for anyone looking for a premium rental experience. Conveniently located near key establishments, public transport, and lifestyle hubs. Schedule a viewing today and make this your next home!`;
}
