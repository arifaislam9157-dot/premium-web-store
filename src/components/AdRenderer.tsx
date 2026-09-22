import { useEffect, useRef } from 'react';
import { AdSlot } from '../types';

interface AdRendererProps {
  adSlot?: AdSlot | null;
  className?: string;
  showPlaceholderIfEmpty?: boolean;
}

export default function AdRenderer({
  adSlot,
  className = '',
  showPlaceholderIfEmpty = false,
}: AdRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adSlot || !adSlot.enabled || !adSlot.code || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    // Check if code contains script tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = adSlot.code;

    const scripts = tempDiv.querySelectorAll('script');
    if (scripts.length > 0) {
      // Append non-script HTML elements first
      Array.from(tempDiv.childNodes).forEach((node) => {
        if (node.nodeName !== 'SCRIPT') {
          container.appendChild(node.cloneNode(true));
        }
      });

      // Execute and append script elements so ads run
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        if (oldScript.innerHTML) {
          newScript.innerHTML = oldScript.innerHTML;
        }
        container.appendChild(newScript);
      });
    } else {
      // Standard HTML / iframe / banner
      container.innerHTML = adSlot.code;
    }
  }, [adSlot]);

  if (!adSlot || !adSlot.enabled) {
    if (showPlaceholderIfEmpty) {
      return (
        <div
          id={`ad-slot-disabled-${adSlot?.id || 'unknown'}`}
          className={`border border-dashed border-slate-800 rounded-xl p-4 text-center text-xs text-slate-500 bg-slate-900/40 ${className}`}
        >
          [Ad Slot ({adSlot?.name || 'Disabled'}) is inactive in Admin Panel]
        </div>
      );
    }
    return null;
  }

  return (
    <div
      id={`ad-slot-${adSlot.id}`}
      className={`ad-container relative my-2 overflow-hidden flex justify-center items-center ${className}`}
    >
      <div ref={containerRef} className="w-full flex justify-center items-center" />
    </div>
  );
}
