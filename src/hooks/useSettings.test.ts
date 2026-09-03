import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSettings } from './useSettings';

describe('useSettings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with defaults when nothing is persisted', () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.theme).toBe('dark');
    expect(result.current.fontSize).toBe(13);
  });

  it('persists theme changes to localStorage', () => {
    const { result } = renderHook(() => useSettings());
    act(() => result.current.setTheme('light'));
    expect(result.current.theme).toBe('light');
    const stored = JSON.parse(
      localStorage.getItem('fountain-editor-settings')!,
    );
    expect(stored.theme).toBe('light');
  });

  it('clamps fontSize between 10 and 24', () => {
    const { result } = renderHook(() => useSettings());
    act(() => result.current.setFontSize(5));
    expect(result.current.fontSize).toBe(10);
    act(() => result.current.setFontSize(99));
    expect(result.current.fontSize).toBe(24);
  });
});
