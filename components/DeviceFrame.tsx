import React from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';

// Device type definition
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// Device presets with dimensions and styling
export const DEVICE_PRESETS = {
  mobile: {
    width: 375,
    height: 700,
    scale: 1,
    showBezel: true,
    name: 'Mobile',
    icon: Smartphone
  },
  tablet: {
    width: 768,
    height: 1024,
    scale: 0.6,
    showBezel: true,
    name: 'Tablet',
    icon: Tablet
  },
  desktop: {
    width: 1200,
    height: 800,
    scale: 0.45,
    showBezel: false,
    name: 'Desktop',
    icon: Monitor
  }
} as const;

interface DeviceFrameProps {
  device: DeviceType;
  children: React.ReactNode;
}

/**
 * DeviceFrame - Responsive preview frame for different device sizes
 * Uses CSS transform scale to maintain widget fidelity across device sizes
 */
export const DeviceFrame: React.FC<DeviceFrameProps> = ({ device, children }) => {
  const preset = DEVICE_PRESETS[device];

  // Calculate container dimensions after scaling
  const scaledWidth = preset.width * preset.scale;
  const scaledHeight = preset.height * preset.scale;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: scaledWidth,
        height: scaledHeight,
      }}
    >
      {/* Scaled content wrapper */}
      <div
        style={{
          width: preset.width,
          height: preset.height,
          transform: `scale(${preset.scale})`,
          transformOrigin: 'top left',
        }}
      >
        {preset.showBezel ? (
          // Phone/Tablet frame with bezel
          <div
            className="w-full h-full bg-[#0A0A0A] rounded-[3rem] border-[8px] border-[#1a1a1a] shadow-2xl overflow-hidden relative flex flex-col"
          >
            {/* Notch (only for mobile) */}
            {device === 'mobile' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-28 bg-[#000] rounded-b-2xl z-20" />
            )}

            {/* Dynamic Island style for tablet */}
            {device === 'tablet' && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 h-2 w-20 bg-[#1a1a1a] rounded-full z-20" />
            )}

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pt-12">
              {children}
            </div>

            {/* Home indicator */}
            <div className="h-8 flex items-center justify-center">
              <div className="w-32 h-1 bg-white/20 rounded-full" />
            </div>
          </div>
        ) : (
          // Desktop frame (no bezel, browser-like)
          <div className="w-full h-full bg-[#0A0A0A] rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
            {/* Browser-like header */}
            <div className="h-10 bg-[#1a1a1a] border-b border-white/10 flex items-center px-4 gap-2">
              {/* Traffic lights */}
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
              </div>
              {/* URL bar */}
              <div className="flex-1 mx-4">
                <div className="bg-[#0A0A0A] rounded-md px-3 py-1 text-[10px] text-white/40">
                  genesis.ngx.app
                </div>
              </div>
            </div>

            {/* Content area - scrollable grid for desktop */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                {children}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface DeviceSelectorProps {
  currentDevice: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
}

/**
 * DeviceSelector - Toggle buttons for switching between device previews
 */
export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  currentDevice,
  onDeviceChange
}) => {
  return (
    <div className="flex items-center gap-1 bg-[#0A0A0A] rounded-lg p-1 border border-white/10">
      {(Object.keys(DEVICE_PRESETS) as DeviceType[]).map((device) => {
        const preset = DEVICE_PRESETS[device];
        const Icon = preset.icon;
        const isActive = currentDevice === device;

        return (
          <button
            key={device}
            onClick={() => onDeviceChange(device)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
              ${isActive
                ? 'bg-[#6D00FF] text-white'
                : 'text-white/50 hover:text-white hover:bg-white/5'
              }
            `}
            title={preset.name}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{preset.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DeviceFrame;
