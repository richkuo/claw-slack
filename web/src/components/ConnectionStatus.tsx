"use client";

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  error?: string | null;
}

export default function ConnectionStatus({ 
  isConnected, 
  isConnecting, 
  error 
}: ConnectionStatusProps) {
  if (isConnecting) {
    return (
      <div className="flex items-center gap-2 text-yellow-400">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        <span className="text-xs">Connecting...</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 text-green-400">
        <div className="w-2 h-2 bg-green-400 rounded-full" />
        <span className="text-xs">Connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-red-400">
      <div className="w-2 h-2 bg-red-400 rounded-full" />
      <span className="text-xs" title={error || 'Disconnected'}>
        {error ? 'Error' : 'Disconnected'}
      </span>
    </div>
  );
}