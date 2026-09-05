import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFountainFile } from './useFountainFile';

describe('useFountainFile', () => {
  const setContent = vi.fn();
  const markSaved = vi.fn();

  beforeEach(() => {
    setContent.mockClear();
    markSaved.mockClear();

    // Mock the preload-exposed window.api surface used by this hook
    (global as any).window = {
      api: {
        openFile: vi.fn(),
        saveFile: vi.fn(),
        saveFileAs: vi.fn(),
      },
    };
  });

  it('openFile: does nothing if the dialog is cancelled (null result)', async () => {
    window.api.openFile = vi.fn().mockResolvedValue(null);
    const { result } = renderHook(() =>
      useFountainFile({ content: '', filePath: null, setContent, markSaved }),
    );

    await act(async () => {
      await result.current.openFile();
    });

    expect(setContent).not.toHaveBeenCalled();
    expect(markSaved).not.toHaveBeenCalled();
  });

  it('openFile: sets content and marks saved on a successful open', async () => {
    window.api.openFile = vi.fn().mockResolvedValue({
      filePath: '/tmp/script.fountain',
      content: 'FADE IN:',
    });
    const { result } = renderHook(() =>
      useFountainFile({ content: '', filePath: null, setContent, markSaved }),
    );

    await act(async () => {
      await result.current.openFile();
    });

    expect(setContent).toHaveBeenCalledWith('FADE IN:');
    expect(markSaved).toHaveBeenCalledWith('/tmp/script.fountain');
  });

  it('saveFile: calls saveFile with the existing path when one exists', async () => {
    window.api.saveFile = vi.fn().mockResolvedValue(true);
    const { result } = renderHook(() =>
      useFountainFile({
        content: 'INT. HOUSE - DAY',
        filePath: '/tmp/script.fountain',
        setContent,
        markSaved,
      }),
    );

    await act(async () => {
      await result.current.saveFile();
    });

    expect(window.api.saveFile).toHaveBeenCalledWith(
      '/tmp/script.fountain',
      'INT. HOUSE - DAY',
    );
    expect(markSaved).toHaveBeenCalledWith('/tmp/script.fountain');
  });

  it('saveFile: falls back to saveFileAs when there is no existing path', async () => {
    window.api.saveFileAs = vi
      .fn()
      .mockResolvedValue('/tmp/new-script.fountain');
    const { result } = renderHook(() =>
      useFountainFile({
        content: 'INT. HOUSE - DAY',
        filePath: null,
        setContent,
        markSaved,
      }),
    );

    await act(async () => {
      await result.current.saveFile();
    });

    expect(window.api.saveFileAs).toHaveBeenCalledWith('INT. HOUSE - DAY');
    expect(markSaved).toHaveBeenCalledWith('/tmp/new-script.fountain');
  });

  it('saveFile: does not mark saved if saveFileAs is cancelled (null result)', async () => {
    window.api.saveFileAs = vi.fn().mockResolvedValue(null);
    const { result } = renderHook(() =>
      useFountainFile({
        content: 'INT. HOUSE - DAY',
        filePath: null,
        setContent,
        markSaved,
      }),
    );

    await act(async () => {
      await result.current.saveFile();
    });

    expect(markSaved).not.toHaveBeenCalled();
  });

  it('saveFileAs: always opens the save dialog regardless of existing path', async () => {
    window.api.saveFileAs = vi.fn().mockResolvedValue('/tmp/another.fountain');
    const { result } = renderHook(() =>
      useFountainFile({
        content: 'A RIVER.',
        filePath: '/tmp/script.fountain',
        setContent,
        markSaved,
      }),
    );

    await act(async () => {
      await result.current.saveFileAs();
    });

    expect(window.api.saveFileAs).toHaveBeenCalledWith('A RIVER.');
    expect(markSaved).toHaveBeenCalledWith('/tmp/another.fountain');
  });

  it('uses the latest content/filePath via refs, not stale closures', async () => {
    window.api.saveFile = vi.fn().mockResolvedValue(true);
    const { result, rerender } = renderHook(
      ({ content, filePath }) =>
        useFountainFile({ content, filePath, setContent, markSaved }),
      {
        initialProps: {
          content: 'old content',
          filePath: '/tmp/script.fountain',
        },
      },
    );

    // Update content without changing the hook's returned function identity expectations
    rerender({ content: 'new content', filePath: '/tmp/script.fountain' });

    await act(async () => {
      await result.current.saveFile();
    });

    expect(window.api.saveFile).toHaveBeenCalledWith(
      '/tmp/script.fountain',
      'new content',
    );
  });
});
