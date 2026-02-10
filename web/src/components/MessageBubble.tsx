"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { SessionMessage } from '@/lib/types';

interface MessageBubbleProps {
  message: SessionMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { role, content, timestamp, toolCall, toolName } = message;
  
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'user':
        return {
          label: 'You',
          bgColor: 'bg-blue-600',
          textColor: 'text-white',
          align: 'ml-auto',
          maxWidth: 'max-w-[80%]',
          avatar: '👤'
        };
      case 'assistant':
        return {
          label: 'Assistant',
          bgColor: 'bg-slate-700',
          textColor: 'text-slate-100',
          align: 'mr-auto',
          maxWidth: 'max-w-[80%]',
          avatar: '🤖'
        };
      case 'system':
        return {
          label: 'System',
          bgColor: 'bg-yellow-800',
          textColor: 'text-yellow-100',
          align: 'mx-auto',
          maxWidth: 'max-w-[90%]',
          avatar: '⚙️'
        };
      case 'tool':
        return {
          label: toolName || 'Tool',
          bgColor: 'bg-purple-700',
          textColor: 'text-purple-100',
          align: 'mr-auto',
          maxWidth: 'max-w-[80%]',
          avatar: '🔧'
        };
      default:
        return {
          label: role,
          bgColor: 'bg-gray-600',
          textColor: 'text-gray-100',
          align: 'mr-auto',
          maxWidth: 'max-w-[80%]',
          avatar: '❓'
        };
    }
  };

  const roleConfig = getRoleConfig(role);

  return (
    <div className={`flex flex-col ${roleConfig.align} ${roleConfig.maxWidth} mb-4`}>
      {/* Message header */}
      <div className="flex items-center gap-2 mb-1">
        {role !== 'user' && (
          <div className="flex items-center gap-2">
            <span className="text-lg">{roleConfig.avatar}</span>
            <span className="text-xs font-medium text-slate-400">
              {roleConfig.label}
            </span>
          </div>
        )}
        <span className="text-xs text-slate-500">
          {formatTime(timestamp)}
        </span>
      </div>

      {/* Message content */}
      <div className={`
        px-4 py-3 rounded-lg ${roleConfig.bgColor} ${roleConfig.textColor}
        ${role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'}
      `}>
        {toolCall ? (
          <div className="font-mono text-sm">
            <div className="text-purple-300 mb-1">🔧 Tool Call</div>
            <pre className="whitespace-pre-wrap text-xs">{content}</pre>
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Override link styling
                a: ({ href, children, ...props }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 underline"
                    {...props}
                  >
                    {children}
                  </a>
                ),
                // Override code block styling
                pre: ({ children, ...props }) => (
                  <pre
                    className="bg-slate-900 border border-slate-600 rounded p-3 overflow-x-auto text-sm"
                    {...props}
                  >
                    {children}
                  </pre>
                ),
                // Override inline code styling
                code: ({ children, className, ...props }) => {
                  if (className?.includes('language-')) {
                    // This is a code block, let the pre handle it
                    return <code className={className} {...props}>{children}</code>;
                  }
                  // This is inline code
                  return (
                    <code
                      className="bg-slate-600 px-1 py-0.5 rounded text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}