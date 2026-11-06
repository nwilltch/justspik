/**
 * Service d'enregistrement audio brut du navigateur (MediaRecorder API)
 * Permet à l'utilisateur d'écouter son propre enregistrement vocal.
 */

class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private mediaStream: MediaStream | null = null;
  private currentAudioUrl: string | null = null;
  private isRecording: boolean = false;

  private getSupportedMimeType(): string | undefined {
    if (typeof MediaRecorder === 'undefined') return undefined;

    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      'audio/aac',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return undefined;
  }

  public async start(): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }

    try {
      this.cleanupCurrentAudio();
      this.audioChunks = [];

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const mimeType = this.getSupportedMimeType();
      this.mediaRecorder = mimeType
        ? new MediaRecorder(this.mediaStream, { mimeType })
        : new MediaRecorder(this.mediaStream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100);
      this.isRecording = true;
      return true;
    } catch (err) {
      console.warn('[AudioRecorder] Erreur d’accès au micro:', err);
      this.isRecording = false;
      return false;
    }
  }

  public async stop(): Promise<string | null> {
    const recorder = this.mediaRecorder;
    if (!recorder || !this.isRecording || recorder.state === 'inactive') {
      this.stopMediaStream();
      return this.currentAudioUrl;
    }

    this.isRecording = false;

    return new Promise((resolve) => {
      recorder.onstop = () => {
        try {
          if (this.audioChunks.length === 0) {
            resolve(this.currentAudioUrl);
            return;
          }

          const mimeType = recorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(this.audioChunks, { type: mimeType });
          const url = URL.createObjectURL(audioBlob);
          this.currentAudioUrl = url;
          resolve(url);
        } catch (e) {
          console.warn('[AudioRecorder] Erreur création blob audio:', e);
          resolve(null);
        } finally {
          this.stopMediaStream();
        }
      };

      try {
        recorder.stop();
      } catch {
        this.stopMediaStream();
        resolve(this.currentAudioUrl);
      }
    });
  }

  public getCurrentAudioUrl(): string | null {
    return this.currentAudioUrl;
  }

  private stopMediaStream() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }

  public cleanupCurrentAudio() {
    if (this.currentAudioUrl) {
      try {
        URL.revokeObjectURL(this.currentAudioUrl);
      } catch {
        // Ignorer
      }
      this.currentAudioUrl = null;
    }
  }
}

export const audioRecorder = new AudioRecorderService();
