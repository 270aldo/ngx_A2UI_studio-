import React, { useState, useEffect, useCallback } from 'react';
import { X, Delete } from 'lucide-react';

interface NumpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: number) => void;
  initialValue?: number;
  title?: string;
  unit?: string;
  min?: number;
  max?: number;
  allowDecimal?: boolean;
}

/**
 * NumpadModal - Touchscreen-friendly numeric input
 *
 * Features:
 * - Large touch targets for mobile
 * - Decimal support (optional)
 * - Min/Max validation
 * - Backspace/Clear functionality
 * - Keyboard support
 */
export const NumpadModal: React.FC<NumpadModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialValue = 0,
  title = 'Enter Value',
  unit = '',
  min = 0,
  max = 9999,
  allowDecimal = true,
}) => {
  const [value, setValue] = useState(initialValue.toString());
  const [hasDecimal, setHasDecimal] = useState(initialValue.toString().includes('.'));

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setValue(initialValue.toString());
      setHasDecimal(initialValue.toString().includes('.'));
    }
  }, [isOpen, initialValue]);

  // Handle keyboard input
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '.' && allowDecimal) {
        handleDecimal();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        handleConfirm();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, value, allowDecimal]);

  const handleDigit = useCallback((digit: string) => {
    setValue(prev => {
      // Replace initial 0 unless it's "0."
      if (prev === '0' && digit !== '0') {
        return digit;
      }
      // Limit decimal places to 2
      if (hasDecimal && prev.includes('.')) {
        const parts = prev.split('.');
        if (parts[1] && parts[1].length >= 2) {
          return prev;
        }
      }
      // Limit total length
      if (prev.length >= 6) return prev;

      return prev + digit;
    });
  }, [hasDecimal]);

  const handleDecimal = useCallback(() => {
    if (hasDecimal || !allowDecimal) return;
    setValue(prev => prev + '.');
    setHasDecimal(true);
  }, [hasDecimal, allowDecimal]);

  const handleBackspace = useCallback(() => {
    setValue(prev => {
      if (prev.length <= 1) return '0';
      const newValue = prev.slice(0, -1);
      if (!newValue.includes('.')) {
        setHasDecimal(false);
      }
      return newValue;
    });
  }, []);

  const handleClear = useCallback(() => {
    setValue('0');
    setHasDecimal(false);
  }, []);

  const handleConfirm = useCallback(() => {
    const numValue = parseFloat(value) || 0;
    const clampedValue = Math.max(min, Math.min(max, numValue));
    onConfirm(clampedValue);
    onClose();
  }, [value, min, max, onConfirm, onClose]);

  if (!isOpen) return null;

  const numpadButtons = [
    '7', '8', '9',
    '4', '5', '6',
    '1', '2', '3',
    '.', '0', 'DEL',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 w-80 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Display */}
        <div className="bg-[#050505] border border-white/10 rounded-xl p-4 mb-4">
          <div className="flex items-baseline justify-end gap-2">
            <span className="text-4xl font-bold text-white font-mono">
              {value}
            </span>
            {unit && (
              <span className="text-lg text-white/40">{unit}</span>
            )}
          </div>
        </div>

        {/* Numpad Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {numpadButtons.map((btn) => {
            const isDecimal = btn === '.';
            const isDelete = btn === 'DEL';
            const isDisabled = isDecimal && (!allowDecimal || hasDecimal);

            return (
              <button
                key={btn}
                onClick={() => {
                  if (isDelete) handleBackspace();
                  else if (isDecimal) handleDecimal();
                  else handleDigit(btn);
                }}
                disabled={isDisabled}
                className={`
                  h-14 rounded-xl text-xl font-bold transition-all
                  ${isDelete
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : isDisabled
                      ? 'bg-white/5 text-white/20 cursor-not-allowed'
                      : 'bg-white/5 text-white hover:bg-white/10 active:bg-[#6D00FF]/30'
                  }
                `}
              >
                {isDelete ? <Delete size={20} className="mx-auto" /> : btn}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 font-bold hover:bg-white/10 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleConfirm}
            className="flex-2 flex-grow-[2] py-3 rounded-xl bg-[#6D00FF] text-white font-bold hover:bg-[#5800CC] transition-colors"
          >
            Confirm
          </button>
        </div>

        {/* Range hint */}
        <p className="text-center text-[10px] text-white/30 mt-3">
          Range: {min} - {max} {unit}
        </p>
      </div>
    </div>
  );
};

export default NumpadModal;
