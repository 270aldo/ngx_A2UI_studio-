import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, ChevronDown, ChevronRight, Copy, X } from 'lucide-react';
import { ValidationResult, ValidationError } from '../schemas/layoutSchemas';

interface ValidationErrorsProps {
  result: ValidationResult | null;
  parseError: string | null;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onErrorClick?: (path: string) => void;
}

export const ValidationErrors: React.FC<ValidationErrorsProps> = ({
  result,
  parseError,
  isCollapsed = false,
  onToggleCollapse,
  onErrorClick
}) => {
  // No validation yet
  if (!result && !parseError) {
    return null;
  }

  // Parse error takes priority
  if (parseError) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3">
        <div className="flex items-start gap-2">
          <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-red-400 mb-1">JSON Parse Error</p>
            <p className="text-xs text-red-300/80 font-mono break-all">{parseError}</p>
          </div>
        </div>
      </div>
    );
  }

  // Valid JSON
  if (result?.valid && result.warnings.length === 0) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 mb-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-green-400" />
          <span className="text-xs text-green-400">JSON valido</span>
        </div>
      </div>
    );
  }

  const hasErrors = result && result.errors.length > 0;
  const hasWarnings = result && result.warnings.length > 0;

  // Collapsible header
  const headerContent = (
    <div
      className={`flex items-center justify-between cursor-pointer ${onToggleCollapse ? 'hover:opacity-80' : ''}`}
      onClick={onToggleCollapse}
    >
      <div className="flex items-center gap-2">
        {onToggleCollapse && (
          isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />
        )}
        {hasErrors ? (
          <AlertCircle size={14} className="text-red-400" />
        ) : (
          <AlertTriangle size={14} className="text-yellow-400" />
        )}
        <span className={`text-xs font-bold ${hasErrors ? 'text-red-400' : 'text-yellow-400'}`}>
          {hasErrors ? `${result.errors.length} error${result.errors.length > 1 ? 'es' : ''}` : ''}
          {hasErrors && hasWarnings ? ' · ' : ''}
          {hasWarnings ? `${result.warnings.length} warning${result.warnings.length > 1 ? 's' : ''}` : ''}
        </span>
      </div>
    </div>
  );

  if (isCollapsed) {
    return (
      <div className={`border rounded-lg p-2 mb-3 ${hasErrors ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
        {headerContent}
      </div>
    );
  }

  return (
    <div className={`border rounded-lg p-3 mb-3 ${hasErrors ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
      {headerContent}

      {/* Errors */}
      {hasErrors && (
        <div className="mt-2 space-y-1">
          {result.errors.map((error, i) => (
            <ErrorItem key={i} error={error} onClick={onErrorClick} />
          ))}
        </div>
      )}

      {/* Warnings */}
      {hasWarnings && (
        <div className={`${hasErrors ? 'mt-3 pt-2 border-t border-white/10' : 'mt-2'} space-y-1`}>
          {result.warnings.map((warning, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <AlertTriangle size={12} className="text-yellow-400 mt-0.5 shrink-0" />
              <span className="text-yellow-300/80">{warning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface ErrorItemProps {
  error: ValidationError;
  onClick?: (path: string) => void;
}

const ErrorItem: React.FC<ErrorItemProps> = ({ error, onClick }) => {
  const handleClick = () => {
    onClick?.(error.path);
  };

  const handleCopyPath = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(error.path);
  };

  return (
    <div
      className={`flex items-start gap-2 text-xs p-1.5 rounded ${onClick ? 'cursor-pointer hover:bg-white/5' : ''}`}
      onClick={handleClick}
    >
      <X size={12} className="text-red-400 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          <code className="text-red-300 font-mono text-[10px] bg-red-500/20 px-1 rounded truncate max-w-[150px]">
            {error.path}
          </code>
          <button
            onClick={handleCopyPath}
            className="text-white/30 hover:text-white/60 p-0.5"
            title="Copy path"
          >
            <Copy size={10} />
          </button>
        </div>
        <p className="text-red-300/80">{error.message}</p>
      </div>
    </div>
  );
};

// Compact inline validation indicator
interface ValidationIndicatorProps {
  result: ValidationResult | null;
  parseError: string | null;
}

export const ValidationIndicator: React.FC<ValidationIndicatorProps> = ({ result, parseError }) => {
  if (parseError) {
    return (
      <div className="flex items-center gap-1 text-red-400">
        <AlertCircle size={12} />
        <span className="text-[10px]">Parse Error</span>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  if (result.valid && result.warnings.length === 0) {
    return (
      <div className="flex items-center gap-1 text-green-400">
        <CheckCircle2 size={12} />
        <span className="text-[10px]">Valid</span>
      </div>
    );
  }

  const hasErrors = result.errors.length > 0;

  return (
    <div className={`flex items-center gap-1 ${hasErrors ? 'text-red-400' : 'text-yellow-400'}`}>
      {hasErrors ? <AlertCircle size={12} /> : <AlertTriangle size={12} />}
      <span className="text-[10px]">
        {hasErrors ? `${result.errors.length} error${result.errors.length > 1 ? 's' : ''}` : `${result.warnings.length} warning${result.warnings.length > 1 ? 's' : ''}`}
      </span>
    </div>
  );
};

export default ValidationErrors;
