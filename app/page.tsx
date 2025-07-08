'use client';

import { useChat } from 'ai/react';
import { useState, useEffect } from 'react';
import React from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
  });

  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const [sessionInfo, setSessionInfo] = useState({
    startTime: null as Date | null,
    messageCount: 0,
  });
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
    setSessionInfo(prev => ({
      ...prev,
      startTime: new Date()
    }));
  }, []);

  // Update session info when messages change
  useEffect(() => {
    if (mounted) {
      setSessionInfo(prev => ({
        ...prev,
        messageCount: messages.length
      }));
    }
  }, [messages, mounted]);

  // Auto-scroll to bottom on new messages (client-side only)
  useEffect(() => {
    if (mounted) {
      const messagesContainer = document.getElementById('messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [messages, isLoading, mounted]);

  const clearChat = () => {
    if (confirm('Clear chat display? (Agent memory persists)')) {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Letta Agent Chat</h1>
            <p className="text-gray-600 mt-1">Connected to your self-hosted Letta agent</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span className="text-sm text-gray-600">
              {error ? 'Disconnected' : 'Connected'}
            </span>
            <button
              onClick={clearChat}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Clear Chat
            </button>
            <button
              onClick={() => setShowSystemInfo(!showSystemInfo)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {showSystemInfo ? 'Hide Info' : 'Agent Info'}
            </button>
          </div>
        </div>
        
        {/* Session Stats */}
        {mounted && (
          <div className="mt-2 text-xs text-gray-500">
            Session: {sessionInfo.messageCount} messages • Started: {sessionInfo.startTime?.toLocaleTimeString() || 'Loading...'}
          </div>
        )}
        
        {/* System Info Panel */}
        {showSystemInfo && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <h3 className="font-semibold text-blue-800 mb-2">Agent Information</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Agent ID:</strong> {process.env.LETTA_AGENT_ID || '[Not configured]'}</p>
              <p><strong>Server:</strong> Railway (Self-hosted)</p>
              <p><strong>Status:</strong> {error ? 'Error - Check console' : 'Active'}</p>
              <p><strong>Memory:</strong> Persistent (agent remembers across sessions)</p>
              <p><strong>Type:</strong> Stateful Agent (maintains conversation history)</p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
            <h3 className="font-semibold text-red-800 mb-2">Connection Error</h3>
            <p className="text-sm text-red-700">
              Unable to connect to Letta agent. Check your environment variables and server status.
            </p>
          </div>
        )}
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div 
          id="messages-container"
          className="flex-1 overflow-y-auto p-6 space-y-6 chat-messages"
        >
          {messages.length === 0 && (
            <div className="text-center mt-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Start a conversation with your Letta agent
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Your Letta agent has <strong>persistent memory</strong> and maintains context across conversations. 
                It can remember information about you, learn from interactions, and use tools.
                Try asking about previous conversations or giving it tasks to remember.
              </p>
              {mounted && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <button 
                    onClick={() => {
                      const event = { target: { value: "Hello! Please introduce yourself and tell me about your capabilities." } } as React.ChangeEvent<HTMLInputElement>;
                      handleInputChange(event);
                    }}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    Introduction
                  </button>
                  <button 
                    onClick={() => {
                      const event = { target: { value: "What can you help me with today?" } } as React.ChangeEvent<HTMLInputElement>;
                      handleInputChange(event);
                    }}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    Capabilities
                  </button>
                  <button 
                    onClick={() => {
                      const event = { target: { value: "Remember that I'm working on a Next.js project with Letta integration." } } as React.ChangeEvent<HTMLInputElement>;
                      handleInputChange(event);
                    }}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    Set Context
                  </button>
                </div>
              )}
            </div>
          )}
          
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  m.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium opacity-70">
                    {m.role === 'user' ? 'You' : 'Letta Agent'}
                  </span>
                  {mounted && (
                    <span className="text-xs opacity-50">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-[80%]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-600">Letta Agent</span>
                  <span className="text-xs text-gray-400">thinking...</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-gray-50 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end" suppressHydrationWarning>
            <div className="flex-1">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message to Letta..."
                disabled={isLoading}
                rows={1}
                suppressHydrationWarning
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                style={{
                  minHeight: '48px',
                  maxHeight: '120px',
                  height: 'auto',
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Send'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
