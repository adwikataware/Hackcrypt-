const mockResults = [
  {
    name: "Texture + Voice Clone",
    threats: [
      {
        type: 'texture_synthesis',
        confidence: 0.86,
        visual_score: 0.84,
        audio_score: 0.41,
        temporal_score: 0.79,
      },
      {
        type: 'voice_clone',
        confidence: 0.87,
        visual_score: 0.35,
        audio_score: 0.92,
        temporal_score: 0.70,
      }
    ]
  },
  {
    name: "Texture + Audio Sync",
    threats: [
      {
        type: 'texture_synthesis',
        confidence: 0.83,
        visual_score: 0.81,
        audio_score: 0.42,
        temporal_score: 0.76,
      },
      {
        type: 'audio_sync',
        confidence: 0.85,
        visual_score: 0.65,
        audio_score: 0.91,
        temporal_score: 0.78,
      }
    ]
  },
  {
    name: "Authentic - No Deepfake",
    threats: [
      {
        type: 'none',
        confidence: 0.23,
        visual_score: 0.08,
        audio_score: 0.06,
        temporal_score: 0.05,
      }
    ],
    authentic: true
  },
  {
    name: "Texture + Audio + Lip Sync",
    threats: [
      {
        type: 'texture_synthesis',
        confidence: 0.86,
        visual_score: 0.84,
        audio_score: 0.41,
        temporal_score: 0.79,
      },
      {
        type: 'audio_sync',
        confidence: 0.88,
        visual_score: 0.68,
        audio_score: 0.93,
        temporal_score: 0.81,
      },
      {
        type: 'lip_sync',
        confidence: 0.87,
        visual_score: 0.90,
        audio_score: 0.77,
        temporal_score: 0.84,
      }
    ]
  }
];

let mockDataIndex = 0;

function getNextMockResult() {
  const result = mockResults[mockDataIndex];
  
  // Randomize each threat's confidence between 80-93% (except for authentic case)
  const processedThreats = result.threats.map(threat => {
    // Don't randomize if it's the authentic case (type: 'none')
    if (threat.type === 'none' || result.authentic) {
      return threat;
    }
    return {
      ...threat,
      confidence: parseFloat((Math.random() * 0.13 + 0.80).toFixed(2))
    };
  });
  
  // Get the worst threat (highest confidence) as primary
  const primaryThreat = processedThreats.reduce((prev, current) =>
    (prev.confidence > current.confidence) ? prev : current
  );
  
  const response = {
    success: true,
    confidence: primaryThreat.confidence,
    threat_level: getThreatLevel(primaryThreat.confidence),
    threat_type: primaryThreat.type,
    visual_score: primaryThreat.visual_score,
    audio_score: primaryThreat.audio_score,
    temporal_score: primaryThreat.temporal_score,
    all_threats: processedThreats
  };
  
  if (result.authentic) {
    response.authentic = true;
  }
  
  // Move to next result for next time
  mockDataIndex = (mockDataIndex + 1) % mockResults.length;
  
  return response;
}

function getThreatLevel(confidence) {
  if (confidence >= 0.90) return 'CRITICAL';
  if (confidence >= 0.85) return 'HIGH';
  if (confidence >= 0.80) return 'MEDIUM';
  return 'LOW';
}

function resetMockDataIndex() {
  mockDataIndex = 0;
}
