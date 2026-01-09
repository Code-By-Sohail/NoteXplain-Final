import axios from 'axios';

const API_URL = 'https://emkc.org/api/v2/piston';

export const LANGUAGE_VERSIONS = {
    python: '3.10.0',
    c: '10.2.0',
    cpp: '10.2.0',
    java: '15.0.2',
    javascript: '18.15.0'
};

export const executeCode = async (language, sourceCode) => {
    try {
        const response = await axios.post(`${API_URL}/execute`, {
            language: language,
            version: LANGUAGE_VERSIONS[language],
            files: [
                {
                    content: sourceCode,
                },
            ],
        });
        return response.data;
    } catch (error) {
        console.error('Error executing code:', error);
        throw error;
    }
};
