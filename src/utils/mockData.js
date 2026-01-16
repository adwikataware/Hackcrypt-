/**
 * Mock data generator for testing frontend without backend
 * Simulates realistic API responses for different file types
 */

export const generateMockResults = (fileType) => {
  const baseData = {
    file_type: fileType,
    analysis_timestamp: new Date().toISOString(),
  }

  if (fileType === 'video') {
    return {
      ...baseData,
      overall_confidence: 0.87,
      classification: 'Multi-Stage Hybrid Deepfake',
      threat_level: 'HIGH',
      visual_score: 0.92,
      audio_score: 0.87,
      temporal_score: 0.81,
      lipsync_score: 0.76,
      metadata_score: 0.45,
      is_deepfake: true,
      primary_findings: [
        {
          type: 'face_swap',
          confidence: 0.92,
          tool: 'DeepFaceLab',
          description: 'Facial boundary artifacts and inconsistent lighting detected',
        },
        {
          type: 'voice_clone',
          confidence: 0.87,
          tool: 'RVC',
          description: 'Synthetic voice patterns and missing breathing sounds detected',
        },
        {
          type: 'lipsync_manipulation',
          confidence: 0.76,
          tool: 'Wav2Lip',
          description: 'Mouth region quality inconsistencies and timing issues detected',
        },
      ],
      timeline: [
        { time: '14:30:00', event: 'Original video recorded', type: 'original' },
        { time: '15:15:00', event: 'Video loaded into editing software', type: 'detected' },
        { time: '15:40:00', event: 'Face swap processing (DeepFaceLab)', type: 'manipulation' },
        { time: '16:05:00', event: 'Voice clone applied (RVC)', type: 'manipulation' },
        { time: '16:20:00', event: 'Lip-sync correction (Wav2Lip)', type: 'manipulation' },
        { time: '16:45:00', event: 'Final render & export', type: 'detected' },
      ],
      creation_time: '2h 15m',
      creator_skill: 'Advanced',
      tools_used: 3,
    }
  }

  if (fileType === 'image') {
    return {
      ...baseData,
      overall_confidence: 0.79,
      classification: 'AI-Generated or Heavily Manipulated',
      threat_level: 'MEDIUM',
      visual_score: 0.79,
      audio_score: 0,
      temporal_score: 0,
      lipsync_score: 0,
      metadata_score: 0.62,
      is_deepfake: true,
      primary_findings: [
        {
          type: 'ai_generated',
          confidence: 0.79,
          tool: 'Midjourney / Stable Diffusion',
          description: 'Subtle inconsistencies in face structure and skin texture',
        },
        {
          type: 'metadata_anomaly',
          confidence: 0.62,
          tool: 'Metadata Analysis',
          description: 'Missing or suspicious EXIF data, signs of heavy editing',
        },
      ],
      artifacts: [
        { artifact: 'Unnatural eye patterns', severity: 'high' },
        { artifact: 'Inconsistent skin texture', severity: 'high' },
        { artifact: 'Missing reflection details', severity: 'medium' },
        { artifact: 'Blurred background transitions', severity: 'medium' },
      ],
    }
  }

  if (fileType === 'audio') {
    return {
      ...baseData,
      overall_confidence: 0.84,
      classification: 'Synthetic Voice / Voice Clone',
      threat_level: 'HIGH',
      visual_score: 0,
      audio_score: 0.84,
      temporal_score: 0,
      lipsync_score: 0,
      metadata_score: 0.51,
      is_deepfake: true,
      primary_findings: [
        {
          type: 'voice_clone',
          confidence: 0.84,
          tool: 'RVC / So-VITS-VC',
          description: 'Synthetic voice patterns detected in spectral analysis',
        },
        {
          type: 'audio_anomaly',
          confidence: 0.78,
          tool: 'Prosody Analysis',
          description: 'Unnatural pitch consistency and missing breathing sounds',
        },
      ],
      audio_anomalies: [
        { anomaly: 'Overly consistent pitch pattern', status: 'Suspicious', detail: 'Robotic tone detected' },
        { anomaly: 'Missing breathing sounds', status: 'Missing', detail: 'No natural respiration between phrases' },
        { anomaly: 'Unnatural prosody', status: 'Unnatural', detail: 'Emotional intonation mismatch' },
        { anomaly: 'Limited harmonic complexity', status: 'Anomalous', detail: 'Missing human vocal richness' },
      ],
    }
  }

  // Default fallback
  return {
    ...baseData,
    overall_confidence: 0.65,
    classification: 'Unknown Classification',
    threat_level: 'MEDIUM',
    visual_score: 0.65,
    audio_score: 0.55,
    temporal_score: 0.60,
    lipsync_score: 0.50,
    metadata_score: 0.45,
    is_deepfake: false,
  }
}
