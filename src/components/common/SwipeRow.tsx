import React, { useRef, useState, useEffect, useCallback } from 'react';

export interface SwipeAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  dismiss?: boolean;
  color?: string;
  drawer?: string;
  disabled?: boolean;
}

export interface SwipeRowProps {
  actions: SwipeAction[];
  children: React.ReactNode;
  onAction?: (action: SwipeAction) => void;
  onCommit?: (action: SwipeAction) => void;
  actionColor?: string;
  drawerColor?: string;
  rowColor?: string;
  textColor?: string;
  height?: number | string;
  radius?: number;
  actionWidth?: number;
  direction?: 'left' | 'right';
  snapBounce?: number;
  resistance?: number;
  collapseMs?: number;
  commitAt?: number;
  fullSwipe?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const SwipeRow: React.FC<SwipeRowProps> = ({
  actions,
  children,
  onAction,
  onCommit,
  actionColor = '#e5484d',
  drawerColor = '#3f3f46',
  rowColor = '#ffffff',
  textColor,
  height,
  radius = 16,
  actionWidth = 80,
  direction = 'left',
  snapBounce = 0.2,
  resistance = 0.55,
  collapseMs = 200,
  commitAt = 0.6,
  fullSwipe = true,
  disabled = false,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frontRowRef = useRef<HTMLDivElement>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);

  const startXRef = useRef(0);
  const currentOffsetRef = useRef(0);
  const totalActionsWidth = actions.length * actionWidth;

  const triggerCommit = useCallback(
    (action: SwipeAction) => {
      onAction?.(action);
      setIsCollapsing(true);
      setTimeout(() => {
        setIsCollapsed(true);
        onCommit?.(action);
      }, collapseMs);
    },
    [collapseMs, onAction, onCommit]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled || isCollapsing) return;
    const target = e.target as HTMLElement;
    // Don't intercept button or link clicks inside row
    if (target.closest('button, a, input, select')) {
      return;
    }
    setIsDragging(true);
    startXRef.current = e.clientX;
    currentOffsetRef.current = offsetX;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || disabled || isCollapsing) return;
    const deltaX = e.clientX - startXRef.current;
    let newOffset = currentOffsetRef.current + deltaX;

    if (direction === 'left') {
      if (newOffset > 0) {
        newOffset = newOffset * (1 - resistance);
      } else if (Math.abs(newOffset) > totalActionsWidth) {
        const excess = Math.abs(newOffset) - totalActionsWidth;
        newOffset = -(totalActionsWidth + excess * (1 - resistance));
      }
    } else {
      if (newOffset < 0) {
        newOffset = newOffset * (1 - resistance);
      } else if (newOffset > totalActionsWidth) {
        const excess = newOffset - totalActionsWidth;
        newOffset = totalActionsWidth + excess * (1 - resistance);
      }
    }

    setOffsetX(newOffset);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }

    const containerWidth = containerRef.current?.offsetWidth || 300;
    const absOffset = Math.abs(offsetX);

    // Full swipe commit
    if (fullSwipe && absOffset > containerWidth * commitAt) {
      const primaryAction = actions[0];
      if (primaryAction) {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate(15);
          } catch {
            // ignore
          }
        }
        triggerCommit(primaryAction);
        return;
      }
    }

    // Snap open or close
    if (absOffset > actionWidth * 0.4) {
      const target = direction === 'left' ? -totalActionsWidth : totalActionsWidth;
      setOffsetX(target);
    } else {
      setOffsetX(0);
    }
  };

  if (isCollapsed) {
    return null;
  }

  const isFullSwipeActive =
    fullSwipe &&
    containerRef.current &&
    Math.abs(offsetX) > containerRef.current.offsetWidth * commitAt;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden transition-all ease-out ${className}`}
      style={{
        borderRadius: radius,
        height: isCollapsing ? 0 : height || undefined,
        opacity: isCollapsing ? 0 : 1,
        marginBottom: isCollapsing ? 0 : (style.marginBottom ?? 8),
        transitionDuration: `${collapseMs}ms`,
        ...style,
      }}
    >
      {/* Action Drawer (Behind) */}
      <div
        className="absolute inset-0 flex items-stretch"
        style={{
          borderRadius: radius,
          backgroundColor: isFullSwipeActive ? (actions[0]?.color || actionColor) : drawerColor,
          justifyContent: direction === 'left' ? 'flex-end' : 'flex-start',
          transition: 'background-color 150ms ease-out',
        }}
      >
        <div
          className="flex items-stretch h-full"
          style={{ width: isFullSwipeActive ? '100%' : totalActionsWidth }}
        >
          {actions.map((act, idx) => {
            const isFirst = idx === 0;
            const bg = act.color || (isFirst ? actionColor : drawerColor);

            return (
              <button
                key={act.id}
                type="button"
                disabled={act.disabled}
                aria-label={act.label}
                onClick={(e) => {
                  e.stopPropagation();
                  onAction?.(act);
                  if (act.dismiss || isFirst) {
                    triggerCommit(act);
                  } else {
                    setOffsetX(0);
                  }
                }}
                className="flex-1 flex flex-col items-center justify-center gap-1.5 text-white font-label text-xs font-semibold select-none transition-transform active:scale-95 px-3 hover:brightness-110"
                style={{
                  backgroundColor: bg,
                  minWidth: isFullSwipeActive && isFirst ? '100%' : actionWidth,
                }}
              >
                {act.icon}
                <span className="truncate">{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Front Row (Draggable Content) */}
      <div
        ref={frontRowRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative z-10 touch-pan-y select-none transition-transform"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDragging
            ? 'none'
            : `transform ${snapBounce ? 260 : 200}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
          backgroundColor: rowColor,
          color: textColor,
          borderRadius: radius,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeRow;
