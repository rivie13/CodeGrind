export async function sendChatMessage(message) {
    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get AI response');
        }

        return response.json();
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            throw new Error('Unable to connect to AI server');
        }
        throw error;
    }
}
