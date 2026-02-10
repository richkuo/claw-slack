"use client";

import { useState, useRef } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function MessageInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type a message..."
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage();
  };

  const sendMessage = async () => {
    if (!message.trim() || disabled || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  return (
    <div className="border-t border-slate-700 bg-slate-800 p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Select a session to start chatting" : placeholder}
            disabled={disabled || isSending}
            className={`
              w-full px-4 py-3 pr-12 
              bg-slate-700 border border-slate-600 rounded-lg
              text-white placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              resize-none min-h-[48px] max-h-[120px]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all
            `}
            rows={1}
          />
          
          {/* Send button inside textarea */}
          <button
            type="submit"
            disabled={!message.trim() || disabled || isSending}
            className={`
              absolute right-2 bottom-2 p-2 rounded-md
              transition-all duration-200
              ${message.trim() && !disabled && !isSending
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="transform rotate-45"
              >
                <path d="M8 0L16 8L8 16L8 12L0 12L0 4L8 4L8 0Z" />
              </svg>
            )}
          </button>
        </div>
      </form>
      
      {/* Help text */}
      <div className="mt-2 text-xs text-slate-500 text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}