const API_URL = process.env.API_URL!;


interface CompletionResponse {
    completion: string;
    success: boolean;
    error?: string;
}

export async function getCompletion(prefix: string, suffix: string): Promise<string | null> {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prefix, suffix }),
        });
        
        const data = await response.json() as CompletionResponse;
        console.log('API Response:', data);
        
        if (data.success) {
            return data.completion;
        }
        
        return null;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}