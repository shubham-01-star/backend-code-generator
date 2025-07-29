import { useState } from 'react'
import axios from 'axios'

export default function AgentUI() {
    const [techStack, setTechStack] = useState('')
    const [dbSchema, setDbSchema] = useState('')
    const [apiDesc, setApiDesc] = useState('')
    const [response, setResponse] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async () => {
        setLoading(true)
        setError('')
        setResponse('')
        const prompt = `
You are a senior backend engineer using TypeScript.
TECH STACK:
${techStack}
DB SCHEMA:
${dbSchema}
API DESCRIPTION:
${apiDesc}
Output rules:
- Only output code, no explanation.
- Output code file-wise.
- Use this format exactly:
File: path/to/file.ts
\`\`\`ts
// code
\`\`\`
`
        try {
            const res = await axios.post('http://localhost:1234/v1/chat/completions', {
                model: 'phi-3.1-mini-4k-instruct',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
            }, {
                headers: {
                    'Authorization': 'Bearer local-key',
                    'Content-Type': 'application/json'
                }
            })
            const output = res.data?.choices?.[0]?.message?.content ?? 'No response generated'
            setResponse(output)
        } catch (error) {
            setError('Failed to generate code. Please check your inputs and try again.')
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            {/* Left Panel - Input Section */}
            <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-300 overflow-y-auto">
                <div className="p-4">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-3 text-white rounded-lg mb-4">
                        <h1 className="text-xl font-bold text-center">Backend Code Generator</h1>
                    </div>

                    <div className="space-y-4">
                        {/* Tech Stack */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Tech Stack</label>
                            <textarea
                                value={techStack}
                                onChange={(e) => setTechStack(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 min-h-[100px] resize-y"
                                placeholder="e.g., Node.js, Express, TypeScript, PostgreSQL"
                            />
                        </div>

                        {/* Database Schema */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Database Schema</label>
                            <textarea
                                value={dbSchema}
                                onChange={(e) => setDbSchema(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 min-h-[120px] resize-y"
                                placeholder="Describe your database schema"
                            />
                        </div>

                        {/* API Description */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">API Description</label>
                            <textarea
                                value={apiDesc}
                                onChange={(e) => setApiDesc(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 min-h-[150px] resize-y"
                                placeholder="Describe your API requirements"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm rounded-md">
                                <p className="font-medium">Error: {error}</p>
                            </div>
                        )}

                        {/* Generate Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !techStack || !dbSchema || !apiDesc}
                            className={`w-full py-2 px-4 rounded-md text-white font-medium text-sm transition duration-150 ease-in-out ${
                                loading || !techStack || !dbSchema || !apiDesc
                                    ? 'bg-blue-300 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating Code...
                                </span>
                            ) : (
                                'Generate Backend Code'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Panel - Code Display */}
            <div className="flex-grow bg-gray-100 flex flex-col">
                {/* Header */}
                <div className="bg-gray-200 p-2 border-b border-gray-300">
                    <h2 className="text-sm font-semibold text-gray-700">Generated Code</h2>
                </div>

                {/* Code Display Area */}
                <div className="flex-grow overflow-auto p-4 bg-gray-800 text-gray-200">
                    {response ? (
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                            {response}
                        </pre>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center">
                            <div className="text-center text-gray-400">
                                <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l4-4 4 4" />
                                </svg>
                                <p className="text-sm">Your generated code will appear here</p>
                                <p className="text-xs mt-1">Enter specifications and click "Generate Backend Code"</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                <div className="bg-gray-200 p-1 text-xs text-gray-600 border-t border-gray-300">
                    <div className="flex justify-between">
                        <div>Status: {response ? 'Code generated' : 'Ready'}</div>
                        <div>Backend Code Generator</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
