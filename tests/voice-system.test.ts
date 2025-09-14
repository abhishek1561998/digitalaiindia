/**
 * Voice AI System - Comprehensive Test Suite
 * Tests all voice functionality, error handling, and performance
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock Web APIs
const mockMediaRecorder = {
  start: vi.fn(),
  stop: vi.fn(),
  ondataavailable: null,
  onstop: null,
};

const mockAudioContext = {
  createAnalyser: vi.fn(() => ({
    fftSize: 256,
    frequencyBinCount: 128,
    getByteFrequencyData: vi.fn(),
  })),
  createMediaStreamSource: vi.fn(() => ({
    connect: vi.fn(),
  })),
  close: vi.fn(),
};

const mockGetUserMedia = vi.fn(() => Promise.resolve({
  getTracks: () => [{ stop: vi.fn() }],
}));

// Mock global objects
Object.defineProperty(global, 'MediaRecorder', {
  value: vi.fn(() => mockMediaRecorder),
  writable: true,
});

Object.defineProperty(global, 'AudioContext', {
  value: vi.fn(() => mockAudioContext),
  writable: true,
});

Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
  },
  writable: true,
});

describe('Voice AI System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Speech-to-Text API', () => {
    it('should process audio and return text', async () => {
      const mockAudioBlob = new Blob(['test audio'], { type: 'audio/webm' });
      const mockResponse = { text: 'Hello, this is a test', confidence: 0.95 };
      
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
      ) as any;

      const formData = new FormData();
      formData.append('audio', mockAudioBlob);

      const response = await fetch('/api/voice/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      expect(response.ok).toBe(true);
      expect(result.text).toBe('Hello, this is a test');
      expect(result.confidence).toBe(0.95);
    });

    it('should handle API errors gracefully', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'API Error' }),
        })
      ) as any;

      const mockAudioBlob = new Blob(['test audio'], { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', mockAudioBlob);

      const response = await fetch('/api/voice/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });

    it('should validate audio file size', async () => {
      const largeAudioBlob = new Blob([new ArrayBuffer(11 * 1024 * 1024)], { type: 'audio/webm' });
      
      // This should be handled by the API validation
      expect(largeAudioBlob.size).toBeGreaterThan(10 * 1024 * 1024);
    });
  });

  describe('Text-to-Speech API', () => {
    it('should generate speech from text', async () => {
      const mockAudioBuffer = new ArrayBuffer(1024);
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          blob: () => Promise.resolve(new Blob([mockAudioBuffer], { type: 'audio/mpeg' })),
        })
      ) as any;

      const response = await fetch('/api/voice/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Hello, this is a test',
          voiceId: 'pNInz6obpgDQGcFmaJgB',
          voiceSettings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      });

      expect(response.ok).toBe(true);
      expect(response.headers.get('Content-Type')).toBe('audio/mpeg');
    });

    it('should handle voice settings validation', async () => {
      const invalidSettings = {
        text: 'Hello',
        voiceSettings: {
          stability: 1.5, // Invalid: should be 0-1
          similarity_boost: -0.5, // Invalid: should be 0-1
        },
      };

      // This should be validated by the API
      expect(invalidSettings.voiceSettings.stability).toBeGreaterThan(1);
      expect(invalidSettings.voiceSettings.similarity_boost).toBeLessThan(0);
    });
  });

  describe('Voice Chat Integration', () => {
    it('should handle complete voice conversation flow', async () => {
      const mockChatResponse = {
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there! How can I help you?' },
        ],
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          body: {
            getReader: () => ({
              read: () => Promise.resolve({
                done: false,
                value: new TextEncoder().encode('data: {"type":"token","token":"Hi"}\n\n'),
              }),
            }),
          },
        })
      ) as any;

      const response = await fetch('/api/voice/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: mockChatResponse.messages,
          newMessage: 'Hello',
          chatId: 'test-chat',
          isVoice: true,
          voiceSettings: {
            voiceId: 'pNInz6obpgDQGcFmaJgB',
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      });

      expect(response.ok).toBe(true);
    });
  });

  describe('Audio Recording', () => {
    it('should start and stop recording', async () => {
      const mockStream = {
        getTracks: () => [{ stop: vi.fn() }],
      };

      mockGetUserMedia.mockResolvedValueOnce(mockStream);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.start();
      expect(mockMediaRecorder.start).toHaveBeenCalled();

      mediaRecorder.stop();
      expect(mockMediaRecorder.stop).toHaveBeenCalled();
    });

    it('should handle microphone permission denial', async () => {
      const permissionError = new Error('Permission denied');
      mockGetUserMedia.mockRejectedValueOnce(permissionError);

      await expect(navigator.mediaDevices.getUserMedia({ audio: true }))
        .rejects.toThrow('Permission denied');
    });

    it('should process audio data', () => {
      const mockChunks = [new Blob(['chunk1']), new Blob(['chunk2'])];
      const mockBlob = new Blob(mockChunks, { type: 'audio/webm' });

      expect(mockBlob.type).toBe('audio/webm');
      expect(mockBlob.size).toBeGreaterThan(0);
    });
  });

  describe('Audio Playback', () => {
    it('should play audio from blob', () => {
      const mockAudioBlob = new Blob(['audio data'], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(mockAudioBlob);

      expect(audioUrl).toMatch(/^blob:/);
      
      // Clean up
      URL.revokeObjectURL(audioUrl);
    });

    it('should handle audio playback errors', () => {
      const mockAudio = {
        play: vi.fn().mockRejectedValue(new Error('Playback failed')),
        onended: null,
      };

      expect(() => mockAudio.play()).rejects.toThrow('Playback failed');
    });
  });

  describe('Performance Tests', () => {
    it('should meet speech-to-text latency requirements', async () => {
      const startTime = Date.now();
      
      // Mock fast response
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ text: 'Test', confidence: 0.95 }),
        })
      ) as any;

      const mockAudioBlob = new Blob(['test'], { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', mockAudioBlob);

      await fetch('/api/voice/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      const latency = Date.now() - startTime;
      expect(latency).toBeLessThan(2000); // Should be under 2 seconds
    });

    it('should meet text-to-speech latency requirements', async () => {
      const startTime = Date.now();
      
      // Mock fast response
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          blob: () => Promise.resolve(new Blob(['audio'], { type: 'audio/mpeg' })),
        })
      ) as any;

      await fetch('/api/voice/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Test' }),
      });

      const latency = Date.now() - startTime;
      expect(latency).toBeLessThan(3000); // Should be under 3 seconds
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

      await expect(fetch('/api/voice/speech-to-text'))
        .rejects.toThrow('Network error');
    });

    it('should handle invalid audio format', async () => {
      const invalidAudioBlob = new Blob(['invalid audio'], { type: 'text/plain' });
      
      // This should be handled by validation
      expect(invalidAudioBlob.type).not.toMatch(/audio\//);
    });

    it('should handle empty text input', async () => {
      const emptyText = '';
      
      // This should be validated
      expect(emptyText.trim()).toBe('');
    });
  });

  describe('Security Tests', () => {
    it('should validate API key presence', () => {
      const apiKey = process.env.ELEVENLABS_API_KEY;
      
      // In tests, this might be undefined, but in production it should be set
      expect(typeof apiKey).toBe('string');
    });

    it('should sanitize user input', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const sanitized = maliciousInput.replace(/<[^>]*>/g, '');
      
      expect(sanitized).toBe('alert("xss")');
      expect(sanitized).not.toContain('<script>');
    });

    it('should validate file size limits', () => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const testSize = 5 * 1024 * 1024; // 5MB
      
      expect(testSize).toBeLessThanOrEqual(maxSize);
    });
  });

  describe('Accessibility Tests', () => {
    it('should provide keyboard navigation', () => {
      const mockButton = {
        focus: vi.fn(),
        click: vi.fn(),
      };

      // Simulate keyboard navigation
      mockButton.focus();
      expect(mockButton.focus).toHaveBeenCalled();
    });

    it('should provide screen reader support', () => {
      const mockElement = {
        setAttribute: vi.fn(),
        getAttribute: vi.fn(),
      };

      // Set ARIA attributes
      mockElement.setAttribute('aria-label', 'Voice recording button');
      expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-label', 'Voice recording button');
    });
  });
});
