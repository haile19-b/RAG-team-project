export const askAIStream = async (text: string, onChunk: (chunk: string) => void, onComplete: (fullText: string) => void) => {
    return new Promise((resolve, reject) => {
        const eventSource = new EventSource(`http://localhost:5000/embedding/get-data?text=${encodeURIComponent(text)}`);
        let fullText = '';

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                if (data.error) {
                    eventSource.close();
                    reject(new Error(data.error));
                    return;
                }

                if (data.chunk && !data.done) {
                    fullText += data.chunk;
                    onChunk(data.chunk);
                }

                if (data.done) {
                    eventSource.close();
                    onComplete(fullText);
                    resolve(fullText);
                }
            } catch (error) {
                eventSource.close();
                reject(error);
            }
        };

        eventSource.onerror = (error) => {
            eventSource.close();
            reject(new Error('EventSource failed'));
        };

        // Timeout after 30 seconds
        setTimeout(() => {
            eventSource.close();
            reject(new Error('Request timeout'));
        }, 30000);
    });
};