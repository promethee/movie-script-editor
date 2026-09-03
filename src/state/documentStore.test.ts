import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDocument } from './documentStore';

describe('useDocument', () => {
  it('starts with empty content and not dirty', () => {
    const { result } = renderHook(() => useDocument());
    expect(result.current.content).toBe('');
    expect(result.current.isDirty).toBe(false);
    expect(result.current.filePath).toBeNull();
  });

  it('marks dirty on content update', () => {
    const { result } = renderHook(() => useDocument());
    act(() => result.current.updateContent('FADE IN:'));
    expect(result.current.content).toBe('FADE IN:');
    expect(result.current.isDirty).toBe(true);
  });

  it('clears dirty and sets filePath on markSaved', () => {
    const { result } = renderHook(() => useDocument());
    act(() => result.current.updateContent('FADE IN:'));
    act(() => result.current.markSaved('/tmp/script.fountain'));
    expect(result.current.isDirty).toBe(false);
    expect(result.current.filePath).toBe('/tmp/script.fountain');
  });

  it('resetDocument clears everything', () => {
    const { result } = renderHook(() => useDocument());
    act(() => result.current.updateContent('FADE IN:'));
    act(() => result.current.markSaved('/tmp/script.fountain'));
    act(() => result.current.resetDocument());
    expect(result.current.content).toBe('');
    expect(result.current.filePath).toBeNull();
    expect(result.current.isDirty).toBe(false);
  });
});
