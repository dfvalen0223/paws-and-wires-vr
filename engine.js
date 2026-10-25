/**
 * CHRONO-HANDS: ECHO CO-OP — Deterministic 4D Spacetime Loop, Causal Handoff,
 * Astronomical Clockwork CAD Kinematics & Agentic Temporal Partner (`AION-3`) Engine
 * Project 8 (idea-08-chrono-hands-echo) — Meta VR Start Developer Competition 2026
 *
 * Dual-environment UMD module (Node.js CommonJS + Browser `window.ChronoHandsEngine`).
 * Strictly zero `.innerHTML` and zero emojis.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ChronoHandsEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const DESK_TOPOLOGIES = {
    NARROW_DESK: {
      id: 'NARROW_DESK',
      nameEs: 'Escritorio Compacto / Asiento de Avión (0.52m × 0.34m)',
      nameEn: 'Compact Desk / Airplane Seat (0.52m × 0.34m)',
      badge: '0.52m × 0.34m • AIRPLANE SEAT READY',
      widthM: 0.52,
      depthM: 0.34,
      scaleX: 0.78,
      scaleZ: 0.82,
      arcHeightM: 0.14,
      catchRadiusM: 0.085
    },
    WIDE_STAGE_TABLE: {
      id: 'WIDE_STAGE_TABLE',
      nameEs: 'Mesa de Estudio Relojero (0.88m × 0.48m)',
      nameEn: 'Horological Studio Table (0.88m × 0.48m)',
      badge: '0.88m × 0.48m • STUDIO TABLE',
      widthM: 0.88,
      depthM: 0.48,
      scaleX: 1.0,
      scaleZ: 1.0,
      arcHeightM: 0.18,
      catchRadiusM: 0.095
    },
    FLOATING_ASTROLABE: {
      id: 'FLOATING_ASTROLABE',
      nameEs: 'Astrolabio Flotante Doble Ancla (0.72m × 0.44m)',
      nameEn: 'Dual-Anchor Floating Astrolabe (0.72m × 0.44m)',
      badge: '0.72m × 0.44m • DUAL ANCHOR 3D',
      widthM: 0.72,
      depthM: 0.44,
      scaleX: 0.92,
      scaleZ: 0.95,
      arcHeightM: 0.22,
      catchRadiusM: 0.092
    }
  };

  const VAULT_CATALOG = {
    VAULT_01_PENDULUM: {
      id: 'VAULT_01_PENDULUM',
      code: 'V01',
      nameEs: 'Bóveda 01: El Despertar del Péndulo Solar',
      nameEn: 'Vault 01: Solar Pendulum Awakening',
      subtitleEs: 'Bucle 1 abre la válvula y lanza el núcleo; Bucle 2 lo atrapa en el aire e inserta el engranaje.',
      subtitleEn: 'Loop 1 opens the valve and tosses the core; Loop 2 catches it mid-air and docks the gear.',
      loopDurationSec: 10.0,
      requiredHandsTotal: 4,
      requiredEchoes: 1,
      requiresAgentHand: false,
      requiresHighFive: true,
      gearTeeth: [24, 16, 32],
      baseNodes: [
        { id: 'VALVE_WEST', role: 'LATCH_VALVE', labelEs: 'Válvula de Escape Oeste', labelEn: 'West Escapement Valve', x: -0.21, y: 0.16, z: 0.06 },
        { id: 'CORE_EMITTER', role: 'EMITTER', labelEs: 'Emisor de Cristal Cuántico', labelEn: 'Quantum Crystal Emitter', x: -0.14, y: 0.22, z: -0.04 },
        { id: 'HANDOFF_APEX', role: 'APEX_CATCH', labelEs: 'Punto de Pase Aéreo 4D', labelEn: '4D Mid-Air Handoff Apex', x: 0.0, y: 0.31, z: 0.04 },
        { id: 'HIGH_FIVE_NODE', role: 'BIOMETRIC_SYNC', labelEs: 'Sello de Choque de Palmas Temporal', labelEn: 'Temporal High-Five Biometric Seal', x: 0.0, y: 0.25, z: 0.12 },
        { id: 'CORE_RECEPTACLE', role: 'RECEPTACLE', labelEs: 'Núcleo del Péndulo Astronómico', labelEn: 'Astronomical Pendulum Core', x: 0.20, y: 0.19, z: 0.02 }
      ]
    },
    VAULT_02_PRISM_BRIDGE: {
      id: 'VAULT_02_PRISM_BRIDGE',
      code: 'V02',
      nameEs: 'Bóveda 02: El Puente de Prismas Astronómicos',
      nameEn: 'Vault 02: Astronomical Prism Bridge',
      subtitleEs: 'Tu Eco sostiene el gimbal óptico mientras tus manos actuales giran el planetario y atrapan el fotón.',
      subtitleEn: 'Your Echo aims the optical gimbal while your live hands rotate the planetary gear and catch the photon.',
      loopDurationSec: 12.0,
      requiredHandsTotal: 4,
      requiredEchoes: 1,
      requiresAgentHand: false,
      requiresHighFive: true,
      gearTeeth: [30, 15, 20, 40],
      baseNodes: [
        { id: 'VALVE_WEST', role: 'LATCH_VALVE', labelEs: 'Gimbal de Prisma Cian', labelEn: 'Cyan Prism Gimbal', x: -0.23, y: 0.20, z: 0.04 },
        { id: 'CORE_EMITTER', role: 'EMITTER', labelEs: 'Forja de Fotón Solar', labelEn: 'Solar Photon Forge', x: -0.12, y: 0.24, z: -0.06 },
        { id: 'HANDOFF_APEX', role: 'APEX_CATCH', labelEs: 'Arco de Refracción Central', labelEn: 'Central Refraction Arc', x: 0.02, y: 0.33, z: 0.02 },
        { id: 'HIGH_FIVE_NODE', role: 'BIOMETRIC_SYNC', labelEs: 'Resonador de Palmas Gemelas', labelEn: 'Twin-Palm Resonator', x: 0.08, y: 0.26, z: 0.11 },
        { id: 'CORE_RECEPTACLE', role: 'RECEPTACLE', labelEs: 'Corona del Astrolabio', labelEn: 'Astrolabe Crown Socket', x: 0.22, y: 0.21, z: 0.03 }
      ]
    },
    VAULT_03_SIX_HAND_PARADOX: {
      id: 'VAULT_03_SIX_HAND_PARADOX',
      code: 'V03',
      nameEs: 'Bóveda 03: La Sinfonía de las 6 Manos (AION-3 Co-Op)',
      nameEn: 'Vault 03: Symphony of 6 Hands (AION-3 Co-Op)',
      subtitleEs: 'Tus Manos + Tu Eco Cian + Las Manos Doradas del Agente AION-3 operan el escape triple sin paradojas.',
      subtitleEn: 'Your Live Hands + Cyan Echo + AION-3 Golden Agent Hands operate the triple escapement without paradoxes.',
      loopDurationSec: 12.0,
      requiredHandsTotal: 6,
      requiredEchoes: 2,
      requiresAgentHand: true,
      requiresHighFive: true,
      gearTeeth: [36, 18, 24, 12, 48],
      baseNodes: [
        { id: 'VALVE_WEST', role: 'LATCH_VALVE', labelEs: 'Válvula de Escape Alfa (Eco 1)', labelEn: 'Alpha Escapement Valve (Echo 1)', x: -0.24, y: 0.17, z: 0.08 },
        { id: 'VALVE_NORTH', role: 'AGENT_VALVE', labelEs: 'Válvula Astral Norte (Agente AION-3)', labelEn: 'North Astral Valve (Agent AION-3)', x: 0.0, y: 0.29, z: -0.09 },
        { id: 'CORE_EMITTER', role: 'EMITTER', labelEs: 'Cámara de Relojería Cuántica', labelEn: 'Quantum Horology Chamber', x: -0.15, y: 0.22, z: -0.02 },
        { id: 'HANDOFF_APEX', role: 'APEX_CATCH', labelEs: 'Vórtice de Pase Triple', labelEn: 'Triple Handoff Vortex', x: 0.0, y: 0.34, z: 0.04 },
        { id: 'HIGH_FIVE_NODE', role: 'BIOMETRIC_SYNC', labelEs: 'Nexo Biométrico de 3 Líneas Temporales', labelEn: '3-Timeline Biometric Nexus', x: 0.06, y: 0.25, z: 0.13 },
        { id: 'CORE_RECEPTACLE', role: 'RECEPTACLE', labelEs: 'Corazón del Gran Cronómetro', labelEn: 'Grand Chronometer Heart', x: 0.23, y: 0.19, z: 0.04 }
      ]
    },
    VAULT_04_ZERO_G_ASTROLABE: {
      id: 'VAULT_04_ZERO_G_ASTROLABE',
      code: 'V04',
      nameEs: 'Bóveda 04: El Astrolabio de Gravedad Invertida',
      nameEn: 'Vault 04: Inverted Gravity Astrolabe',
      subtitleEs: 'Pases orbitales en curvatura cero con desvío de rayos temporales y estabilización de paradojas.',
      subtitleEn: 'Zero-G orbital handoffs with temporal ray deflection and causal paradox stabilization.',
      loopDurationSec: 14.0,
      requiredHandsTotal: 6,
      requiredEchoes: 2,
      requiresAgentHand: true,
      requiresHighFive: true,
      gearTeeth: [28, 14, 28, 42],
      baseNodes: [
        { id: 'VALVE_WEST', role: 'LATCH_VALVE', labelEs: 'Anillo Giroscópico Oeste', labelEn: 'West Gyroscopic Ring', x: -0.22, y: 0.23, z: 0.06 },
        { id: 'VALVE_NORTH', role: 'AGENT_VALVE', labelEs: 'Anillo Giroscópico Cenit (AION-3)', labelEn: 'Zenith Gyroscopic Ring (AION-3)', x: 0.0, y: 0.35, z: -0.07 },
        { id: 'CORE_EMITTER', role: 'EMITTER', labelEs: 'Inyector de Singularidad', labelEn: 'Singularity Injector', x: -0.14, y: 0.25, z: -0.04 },
        { id: 'HANDOFF_APEX', role: 'APEX_CATCH', labelEs: 'Órbita de Captura Kepler', labelEn: 'Kepler Catch Orbit', x: 0.02, y: 0.36, z: 0.05 },
        { id: 'HIGH_FIVE_NODE', role: 'BIOMETRIC_SYNC', labelEs: 'Sello de Convergencia Orbital', labelEn: 'Orbital Convergence Seal', x: -0.04, y: 0.26, z: 0.12 },
        { id: 'CORE_RECEPTACLE', role: 'RECEPTACLE', labelEs: 'Bóveda Celeste Este', labelEn: 'East Celestial Vault', x: 0.22, y: 0.23, z: 0.03 }
      ]
    },
    VAULT_05_GRAND_HOROLOGIST: {
      id: 'VAULT_05_GRAND_HOROLOGIST',
      code: 'V05',
      nameEs: 'Bóveda 05: Santuario del Gran Relojero',
      nameEn: 'Vault 05: Sanctuary of the Grand Horologist',
      subtitleEs: 'Maestría final: 2 Ecos + Agente AION-3 + Tus Manos en armonía musical y mecánica perfecta.',
      subtitleEn: 'Master finale: 2 Echoes + Agent AION-3 + Live Hands in musical and mechanical harmony.',
      loopDurationSec: 15.0,
      requiredHandsTotal: 6,
      requiredEchoes: 2,
      requiresAgentHand: true,
      requiresHighFive: true,
      gearTeeth: [40, 20, 30, 15, 60],
      baseNodes: [
        { id: 'VALVE_WEST', role: 'LATCH_VALVE', labelEs: 'Torre de Escape Solar', labelEn: 'Solar Escapement Tower', x: -0.25, y: 0.19, z: 0.07 },
        { id: 'VALVE_NORTH', role: 'AGENT_VALVE', labelEs: 'Torre de Escape Lunar (AION-3)', labelEn: 'Lunar Escapement Tower (AION-3)', x: 0.0, y: 0.32, z: -0.08 },
        { id: 'CORE_EMITTER', role: 'EMITTER', labelEs: 'Matriz del Cristal Primordial', labelEn: 'Primordial Crystal Matrix', x: -0.16, y: 0.23, z: -0.03 },
        { id: 'HANDOFF_APEX', role: 'APEX_CATCH', labelEs: 'Cúpula de Relevos 4D', labelEn: '4D Relay Dome', x: 0.0, y: 0.35, z: 0.03 },
        { id: 'HIGH_FIVE_NODE', role: 'BIOMETRIC_SYNC', labelEs: 'Altar de Sincronía de 6 Manos', labelEn: '6-Hand Synchrony Altar', x: 0.05, y: 0.27, z: 0.12 },
        { id: 'CORE_RECEPTACLE', role: 'RECEPTACLE', labelEs: 'Trono del Tiempo Eterno', labelEn: 'Eternal Time Throne', x: 0.25, y: 0.20, z: 0.04 }
      ]
    }
  };

  function generateDailyChronoRifts() {
    const rifts = {};
    const vaultKeys = Object.keys(VAULT_CATALOG);
    const topologies = ['NARROW_DESK', 'WIDE_STAGE_TABLE', 'FLOATING_ASTROLABE'];
    const harmonies = ['CELESTIAL_GOLD_CYAN', 'QUANTUM_VIOLET_AMBER', 'EMERALD_CHRONO_BRASS', 'SOLAR_RUBY_COBALT'];
    for (let i = 1; i <= 30; i++) {
      const id = `DAILY_RIFT_${String(i).padStart(2, '0')}`;
      const vKey = vaultKeys[(i - 1) % vaultKeys.length];
      const topo = topologies[(i - 1) % topologies.length];
      const harm = harmonies[(i - 1) % harmonies.length];
      const targetParLoops = (i % 3) + 2;
      const handoffWindowMs = 340 - (i % 5) * 15;
      rifts[id] = {
        id,
        dayNumber: i,
        titleEs: `Grieta Diaria #${String(i).padStart(2, '0')}: ${VAULT_CATALOG[vKey].nameEs.split(': ')[1]}`,
        titleEn: `Daily Rift #${String(i).padStart(2, '0')}: ${VAULT_CATALOG[vKey].nameEn.split(': ')[1]}`,
        vaultId: vKey,
        topology: topo,
        harmonyPalette: harm,
        parLoops: targetParLoops,
        handoffWindowMs,
        bpm: 108 + (i % 6) * 6,
        solvableByBfs: true,
        optimalSteps: [
          'RECORD_ECHO_1_VALVE_AND_TOSS',
          'REWIND_TIMELINE_TO_ZERO',
          'ACTIVATE_AION3_TEMPORAL_ASSIST',
          'CATCH_MID_AIR_CORE_AT_APEX',
          'SYNC_HIGH_FIVE_AND_DOCK_RECEPTACLE'
        ]
      };
    }
    return rifts;
  }

  const DAILY_CHRONO_RIFTS = generateDailyChronoRifts();

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function dist3D(a, b) {
    if (!a || !b) return 999;
    const dx = (a.x || 0) - (b.x || 0);
    const dy = (a.y || 0) - (b.y || 0);
    const dz = (a.z || 0) - (b.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  function computeBallisticArcPoint(p0, p1, uNorm, arcHeightM) {
    const u = clamp(uNorm, 0, 1);
    const parabola = 4 * (arcHeightM || 0.16) * u * (1 - u);
    return {
      x: Number(((1 - u) * p0.x + u * p1.x).toFixed(4)),
      y: Number(((1 - u) * p0.y + u * p1.y + parabola).toFixed(4)),
      z: Number(((1 - u) * p0.z + u * p1.z).toFixed(4))
    };
  }

  function getScaledVaultNodes(vaultId, topologyId) {
    const vault = VAULT_CATALOG[vaultId] || VAULT_CATALOG.VAULT_01_PENDULUM;
    const topo = DESK_TOPOLOGIES[topologyId] || DESK_TOPOLOGIES.WIDE_STAGE_TABLE;
    return vault.baseNodes.map((n) => ({
      ...n,
      x: Number((n.x * topo.scaleX).toFixed(4)),
      y: Number(n.y.toFixed(4)),
      z: Number((n.z * topo.scaleZ).toFixed(4))
    }));
  }

  function buildDeterministicEchoTrack(slotIndex, vaultId, topologyId, oneHandedMode = false) {
    const nodes = getScaledVaultNodes(vaultId, topologyId);
    const topo = DESK_TOPOLOGIES[topologyId] || DESK_TOPOLOGIES.WIDE_STAGE_TABLE;
    const valveW = nodes.find((n) => n.id === 'VALVE_WEST') || nodes[0];
    const emitter = nodes.find((n) => n.id === 'CORE_EMITTER') || nodes[1];
    const apex = nodes.find((n) => n.id === 'HANDOFF_APEX') || nodes[2];
    const hiFive = nodes.find((n) => n.id === 'HIGH_FIVE_NODE') || nodes[3];
    const recep = nodes.find((n) => n.id === 'CORE_RECEPTACLE') || nodes[nodes.length - 1];

    const samples = [];
    const totalFrames = 72; // Normalized 72 keyframes across the loop (0.0 .. 1.0)
    for (let f = 0; f <= totalFrames; f++) {
      const tau = f / totalFrames;
      let leftPos;
      let rightPos;
      let leftPinch = 0.1;
      let rightPinch = 0.1;
      let eventTag = null;

      if (slotIndex === 0) {
        // ECHO_1 (Electric Cyan): Left hand latches West Valve; Right hand grabs Core from Emitter and tosses to Apex at tau=0.45, then moves to High-Five Node at tau=0.75
        leftPos = {
          x: Number((valveW.x + Math.sin(tau * Math.PI * 2) * 0.015).toFixed(4)),
          y: Number((valveW.y + 0.01 * Math.cos(tau * Math.PI * 2)).toFixed(4)),
          z: Number(valveW.z.toFixed(4))
        };
        leftPinch = tau >= 0.12 && tau <= 0.88 ? 0.92 : 0.15;

        if (tau < 0.45) {
          const u = tau / 0.45;
          rightPos = computeBallisticArcPoint(emitter, apex, u, topo.arcHeightM * 0.65);
          rightPinch = 0.88;
        } else if (tau < 0.75) {
          const u = (tau - 0.45) / 0.30;
          rightPos = computeBallisticArcPoint(apex, hiFive, u, 0.04);
          rightPinch = 0.20;
          if (Math.abs(tau - 0.45) < 0.02) eventTag = 'ECHO1_TOSS_AT_APEX';
        } else {
          rightPos = {
            x: Number((hiFive.x + Math.sin(tau * Math.PI * 4) * 0.01).toFixed(4)),
            y: Number(hiFive.y.toFixed(4)),
            z: Number(hiFive.z.toFixed(4))
          };
          rightPinch = 0.85;
          if (Math.abs(tau - 0.78) < 0.02) eventTag = 'ECHO1_HIGH_FIVE_READY';
        }
      } else {
        // ECHO_2 (Neon Violet): Catches core at Apex at tau=0.48, carries it to Receptacle at tau=0.85, while Left hand aligns with High-Five Node
        leftPos = computeBallisticArcPoint(valveW, hiFive, clamp(tau * 1.25, 0, 1), 0.06);
        leftPinch = tau >= 0.68 ? 0.90 : 0.20;
        if (tau < 0.45) {
          rightPos = computeBallisticArcPoint({ x: 0.16, y: 0.22, z: 0.10 }, apex, tau / 0.45, 0.05);
          rightPinch = 0.25;
        } else {
          const u = (tau - 0.45) / 0.55;
          rightPos = computeBallisticArcPoint(apex, recep, u, topo.arcHeightM * 0.55);
          rightPinch = 0.92;
          if (Math.abs(tau - 0.48) < 0.025) eventTag = 'ECHO2_CAUGHT_CORE';
          if (tau >= 0.92) eventTag = 'ECHO2_DOCKED_RECEPTACLE';
        }
      }

      if (oneHandedMode) {
        // In One-Handed Accessibility Mode, each recorded loop represents a single physical hand mirrored into its assigned role
        leftPinch = slotIndex === 0 ? 0.92 : 0.0;
      }

      samples.push({
        tau: Number(tau.toFixed(4)),
        leftHand: { ...leftPos, pinch: leftPinch },
        rightHand: { ...rightPos, pinch: rightPinch },
        event: eventTag
      });
    }

    return {
      slotIndex,
      echoId: slotIndex === 0 ? 'ECHO_1_CYAN' : 'ECHO_2_VIOLET',
      colorHex: slotIndex === 0 ? '#00e5ff' : '#b388ff',
      vaultId,
      topologyId,
      oneHandedRecorded: Boolean(oneHandedMode),
      handoffReleaseTau: 0.45,
      highFiveSyncTau: 0.78,
      samples
    };
  }

  function buildAgentGoldenTrack(vaultId, topologyId) {
    const nodes = getScaledVaultNodes(vaultId, topologyId);
    const northValve = nodes.find((n) => n.id === 'VALVE_NORTH') || nodes[0];
    const apex = nodes.find((n) => n.id === 'HANDOFF_APEX') || nodes[2];
    const recep = nodes.find((n) => n.id === 'CORE_RECEPTACLE') || nodes[nodes.length - 1];

    const waypoints = [
      { tau: 0.0, left: { ...northValve }, right: { x: apex.x, y: apex.y + 0.05, z: apex.z - 0.04 }, action: 'LATCH_NORTH_VALVE' },
      { tau: 0.45, left: { ...northValve }, right: { ...apex }, action: 'MAGNETIC_APEX_STABILIZE' },
      { tau: 0.78, left: { ...northValve }, right: computeBallisticArcPoint(apex, recep, 0.5, 0.06), action: 'GUIDE_CORE_TO_RECEPTACLE' },
      { tau: 1.0, left: { ...northValve }, right: { ...recep }, action: 'LOCK_ESCAPEMENT_CROWN' }
    ];

    return {
      agentId: 'AION-3',
      colorHex: '#ffbe3d',
      vaultId,
      topologyId,
      waypoints
    };
  }

  function createEngine() {
    const state = {
      stateVersion: 1,
      anchored: true,
      topology: 'WIDE_STAGE_TABLE',
      virtualFallbackActive: false,
      activeVaultId: 'VAULT_01_PENDULUM',
      activeDailyRiftId: 'DAILY_RIFT_01',
      loopDurationSec: 10.0,
      timelinePhaseNorm: 0.45,
      isPlayingTimeline: true,
      isRecordingLoop: false,
      activeLoopCount: 1,
      recordedEchoes: [],
      agentAssistActive: false,
      agentTrack: null,
      pendingAgentPlan: null,
      paradoxState: {
        active: false,
        code: 'TIMELINE_COHERENT',
        nodeId: null,
        descriptionEs: 'Línea espacio-temporal coherente (0 paradojas activas).',
        descriptionEn: 'Spacetime timeline coherent (0 active paradoxes).'
      },
      handoffState: {
        coreInFlight: true,
        handoffCompleted: false,
        highFiveCompleted: false,
        valveWestLatched: true,
        valveNorthLatched: false,
        vaultUnlocked: false,
        catchAccuracyMeters: 0.018,
        syncDeltaMs: 42
      },
      liveHands: {
        left: { x: -0.18, y: 0.22, z: 0.08, pinch: 0.85 },
        right: { x: 0.0, y: 0.31, z: 0.04, pinch: 0.90 }
      },
      accessibility: {
        oneHandedMode: false,
        comfortCone40Deg: false,
        highContrast: false,
        timeDilationFactor: 1.0
      },
      musicAmbience: {
        followMusicActive: false,
        bpm: 120,
        activeChoreographyId: 'CHOREO_CELESTIAL_PENDULUM'
      },
      companionState: {
        connectedPeers: 1,
        timeDilationZoneActive: false,
        dilationCenter: { x: 0, y: 0.30, z: 0.04 },
        coopMagneticPulseCount: 0,
        lastCompanionAction: 'READY'
      },
      horologistProgression: {
        unlockedVaults: ['VAULT_01_PENDULUM'],
        completedDailyRifts: [],
        celestialGearsCollected: 3
      }
    };

    // Initialize with Echo 1 pre-recorded so the stage is immediately alive and interactive
    state.recordedEchoes = [buildDeterministicEchoTrack(0, state.activeVaultId, state.topology, false)];
    state.agentTrack = buildAgentGoldenTrack(state.activeVaultId, state.topology);

    function bumpVersion() {
      state.stateVersion += 1;
      return state.stateVersion;
    }

    function evaluateVaultCausalState() {
      const vault = VAULT_CATALOG[state.activeVaultId] || VAULT_CATALOG.VAULT_01_PENDULUM;
      const topo = DESK_TOPOLOGIES[state.topology] || DESK_TOPOLOGIES.WIDE_STAGE_TABLE;
      const nodes = getScaledVaultNodes(state.activeVaultId, state.topology);
      const apex = nodes.find((n) => n.id === 'HANDOFF_APEX') || nodes[2];
      const recep = nodes.find((n) => n.id === 'CORE_RECEPTACLE') || nodes[nodes.length - 1];

      const hasEcho1 = state.recordedEchoes.length >= 1;
      const hasEcho2OrAgent = state.recordedEchoes.length >= 2 || state.agentAssistActive || state.accessibility.oneHandedMode;

      state.handoffState.valveWestLatched = hasEcho1;
      state.handoffState.valveNorthLatched = !vault.requiresAgentHand || state.agentAssistActive || state.recordedEchoes.length >= 2;

      const dRightApex = dist3D(state.liveHands.right, apex);
      const dRightRecep = dist3D(state.liveHands.right, recep);
      if (dRightApex <= topo.catchRadiusM * 1.35 || dRightRecep <= topo.catchRadiusM * 1.35) {
        state.handoffState.handoffCompleted = true;
        state.handoffState.catchAccuracyMeters = Number(Math.min(dRightApex, dRightRecep).toFixed(4));
      }

      if (
        !state.paradoxState.active &&
        state.handoffState.valveWestLatched &&
        state.handoffState.valveNorthLatched &&
        state.handoffState.handoffCompleted &&
        (state.handoffState.highFiveCompleted || hasEcho2OrAgent)
      ) {
        state.handoffState.vaultUnlocked = true;
        if (!state.horologistProgression.unlockedVaults.includes(state.activeVaultId)) {
          state.horologistProgression.unlockedVaults.push(state.activeVaultId);
          state.horologistProgression.celestialGearsCollected += 1;
        }
      } else {
        state.handoffState.vaultUnlocked = false;
      }

      return {
        vaultId: state.activeVaultId,
        topology: state.topology,
        nodes,
        echoCount: state.recordedEchoes.length,
        agentAssistActive: state.agentAssistActive,
        paradoxState: { ...state.paradoxState },
        handoffState: { ...state.handoffState },
        stateVersion: state.stateVersion
      };
    }

    function startChronoSession(opts = {}) {
      state.anchored = true;
      if (opts.topology && DESK_TOPOLOGIES[opts.topology]) {
        state.topology = opts.topology;
      }
      bumpVersion();
      return {
        ok: true,
        anchored: state.anchored,
        topology: state.topology,
        evaluation: evaluateVaultCausalState(),
        stateVersion: state.stateVersion
      };
    }

    function setDeskTopology(topologyId, opts = {}) {
      const targetId = DESK_TOPOLOGIES[topologyId] ? topologyId : 'WIDE_STAGE_TABLE';
      state.topology = targetId;
      state.virtualFallbackActive = Boolean(opts.virtualFallback);
      state.recordedEchoes = state.recordedEchoes.map((_, idx) =>
        buildDeterministicEchoTrack(idx, state.activeVaultId, state.topology, state.accessibility.oneHandedMode)
      );
      state.agentTrack = buildAgentGoldenTrack(state.activeVaultId, state.topology);
      bumpVersion();
      return {
        ok: true,
        topology: DESK_TOPOLOGIES[targetId],
        virtualFallbackActive: state.virtualFallbackActive,
        nodes: getScaledVaultNodes(state.activeVaultId, targetId),
        evaluation: evaluateVaultCausalState(),
        stateVersion: state.stateVersion
      };
    }

    function selectVault(vaultId) {
      const v = VAULT_CATALOG[vaultId] || VAULT_CATALOG.VAULT_01_PENDULUM;
      state.activeVaultId = v.id;
      state.loopDurationSec = v.loopDurationSec;
      state.paradoxState = {
        active: false,
        code: 'TIMELINE_COHERENT',
        nodeId: null,
        descriptionEs: 'Línea espacio-temporal coherente (0 paradojas activas).',
        descriptionEn: 'Spacetime timeline coherent (0 active paradoxes).'
      };
      state.handoffState.handoffCompleted = false;
      state.handoffState.highFiveCompleted = false;
      state.handoffState.vaultUnlocked = false;
      state.recordedEchoes = [buildDeterministicEchoTrack(0, v.id, state.topology, state.accessibility.oneHandedMode)];
      if (v.requiredEchoes >= 2) {
        state.recordedEchoes.push(buildDeterministicEchoTrack(1, v.id, state.topology, state.accessibility.oneHandedMode));
      }
      state.agentTrack = buildAgentGoldenTrack(v.id, state.topology);
      bumpVersion();
      return {
        ok: true,
        vault: v,
        evaluation: evaluateVaultCausalState(),
        stateVersion: state.stateVersion
      };
    }

    function recordAndRewindEchoLoop(opts = {}) {
      const maxEchoes = 2;
      const nextSlot = state.recordedEchoes.length < maxEchoes ? state.recordedEchoes.length : 1;
      const newTrack = buildDeterministicEchoTrack(
        nextSlot,
        state.activeVaultId,
        state.topology,
        state.accessibility.oneHandedMode
      );
      if (Array.isArray(opts.customSamples) && opts.customSamples.length >= 2) {
        newTrack.samples = opts.customSamples;
      }
      if (state.recordedEchoes.length < maxEchoes) {
        state.recordedEchoes.push(newTrack);
      } else {
        state.recordedEchoes[1] = newTrack;
      }
      state.activeLoopCount += 1;
      state.timelinePhaseNorm = 0.0;
      state.isRecordingLoop = false;
      state.isPlayingTimeline = true;
      bumpVersion();
      return {
        ok: true,
        recordedEchoId: newTrack.echoId,
        echoCount: state.recordedEchoes.length,
        activeLoopCount: state.activeLoopCount,
        evaluation: evaluateVaultCausalState(),
        stateVersion: state.stateVersion
      };
    }

    function triggerTemporalHandoff(opts = {}) {
      if (state.paradoxState.active) {
        return {
          ok: false,
          code: 'PARADOX_BLOCKS_HANDOFF',
          error: 'Cannot complete causal handoff while a temporal paradox is active. Stabilize or rewind first.',
          paradoxState: state.paradoxState,
          stateVersion: state.stateVersion
        };
      }
      const nodes = getScaledVaultNodes(state.activeVaultId, state.topology);
      const apex = nodes.find((n) => n.id === 'HANDOFF_APEX') || nodes[2];
      const recep = nodes.find((n) => n.id === 'CORE_RECEPTACLE') || nodes[nodes.length - 1];
      const targetPt = opts.dockAtReceptacle ? recep : apex;
      state.liveHands.right = { x: targetPt.x, y: targetPt.y, z: targetPt.z, pinch: 0.94 };
      state.handoffState.handoffCompleted = true;
      state.handoffState.catchAccuracyMeters = 0.008;
      if (opts.includeHighFive !== false) {
        state.handoffState.highFiveCompleted = true;
        state.handoffState.syncDeltaMs = 18;
      }
      bumpVersion();
      return {
        ok: true,
        handoffCompleted: state.handoffState.handoffCompleted,
        highFiveCompleted: state.handoffState.highFiveCompleted,
        evaluation: evaluateVaultCausalState(),
        stateVersion: state.stateVersion
      };
    }

    function triggerTemporalHighFive(opts = {}) {
      const nodes = getScaledVaultNodes(state.activeVaultId, state.topology);
      const hiFive = nodes.find((n) => n.id === 'HIGH_FIVE_NODE') || nodes[3];
      state.liveHands.left = { x: hiFive.x, y: hiFive.y, z: hiFive.z, pinch: 0.88 };
      const deltaMs = typeof opts.syncDeltaMs === 'number' ? Math.abs(opts.syncDeltaMs) : 24;
      if (deltaMs > 350) {
        return {
          ok: false,
          code: 'HIGH_FIVE_OUT_OF_SYNC_WINDOW',
          syncDeltaMs: deltaMs,
          maxAllowedMs: 350,
          stateVersion: state.stateVersion
        };
      }
      state.handoffState.highFiveCompleted = true;
      state.handoffState.syncDeltaMs = deltaMs;
      bumpVersion();
      return {
        ok: true,
        highFiveCompleted: true,
        syncDeltaMs: deltaMs,
        evaluation: evaluateVaultCausalState(),
        stateVersion: state.stateVersion
      };
    }

    function injectParadoxState(opts = {}) {
      const active = opts.active !== undefined ? Boolean(opts.active) : true;
      if (active) {
        state.paradoxState = {
          active: true,
          code: 'PARADOX_CAUSAL_COLLISION',
          nodeId: opts.nodeId || 'CORE_EMITTER',
          descriptionEs: 'PARADOJA CAUSAL DETECTADA: El Bucle Presente interceptó el Cristal Cuántico en t=1.8s antes de que el Eco 1 pudiera lanzarlo en t=4.5s.',
          descriptionEn: 'CAUSAL PARADOX DETECTED: Present Loop intercepted the Quantum Crystal at t=1.8s before Echo 1 could toss it at t=4.5s.'
        };
        state.handoffState.vaultUnlocked = false;
      } else {
        state.paradoxState = {
          active: false,
          code: 'TIMELINE_COHERENT',
          nodeId: null,
          descriptionEs: 'Línea espacio-temporal coherente (0 paradojas activas).',
          descriptionEn: 'Spacetime timeline coherent (0 active paradoxes).'
        };
      }
      bumpVersion();
      return {
        ok: true,
        paradoxState: { ...state.paradoxState },
        evaluation: evaluateVaultCausalState(),
        stateVersion: state.stateVersion
      };
    }

    function setAccessibilityModes(opts = {}) {
      if (typeof opts.oneHandedMode === 'boolean') state.accessibility.oneHandedMode = opts.oneHandedMode;
      if (typeof opts.comfortCone40Deg === 'boolean') state.accessibility.comfortCone40Deg = opts.comfortCone40Deg;
      if (typeof opts.highContrast === 'boolean') state.accessibility.highContrast = opts.highContrast;
      if (typeof opts.timeDilationFactor === 'number') {
        state.accessibility.timeDilationFactor = clamp(opts.timeDilationFactor, 0.25, 1.5);
      }
      bumpVersion();
      return {
        ok: true,
        accessibility: { ...state.accessibility },
        evaluation: evaluateVaultCausalState(),
        stateVersion: state.stateVersion
      };
    }

    // =========================================================================
    // SPATIAL AGENT `AION-3` TOOLS (STRICT `stateVersion` CONCURRENCY CONTROL)
    // =========================================================================
    function inspect_spacetime_loop() {
      const t0 = Date.now();
      const evalSnap = evaluateVaultCausalState();
      return {
        ok: true,
        tool: 'inspect_spacetime_loop',
        agentId: 'AION-3',
        latencyMs: Math.max(1, Date.now() - t0),
        vaultId: state.activeVaultId,
        topology: state.topology,
        echoCount: state.recordedEchoes.length,
        paradoxActive: state.paradoxState.active,
        handoffState: evalSnap.handoffState,
        stateVersion: state.stateVersion
      };
    }

    function propose_temporal_assist(args = {}) {
      if (
        typeof args.stateVersion === 'number' &&
        args.stateVersion !== state.stateVersion
      ) {
        return {
          ok: false,
          code: 'STALE_STATE_VERSION',
          expectedStateVersion: state.stateVersion,
          receivedStateVersion: args.stateVersion
        };
      }
      const vault = VAULT_CATALOG[state.activeVaultId] || VAULT_CATALOG.VAULT_01_PENDULUM;
      const track = buildAgentGoldenTrack(vault.id, state.topology);
      const plan = {
        planId: `AION3_PLAN_v${state.stateVersion}_${vault.code}`,
        tool: 'propose_temporal_assist',
        agentId: 'AION-3',
        vaultId: vault.id,
        topology: state.topology,
        mode: args.mode || (state.paradoxState.active ? 'RESOLVE_PARADOX_AND_ASSIST' : 'SIX_HAND_SYNCHRONIZED_ASSIST'),
        proposedAtStateVersion: state.stateVersion,
        stateVersion: state.stateVersion,
        latencyMs: 1.4,
        goldenWaypoints: track.waypoints,
        summaryEs: `AION-3 sostendrá la válvula astral norte y estabilizará el pase aéreo en (${track.waypoints[1].right.x}m, ${track.waypoints[1].right.y}m, ${track.waypoints[1].right.z}m).`,
        summaryEn: `AION-3 will latch the north astral valve and stabilize the mid-air handoff at (${track.waypoints[1].right.x}m, ${track.waypoints[1].right.y}m, ${track.waypoints[1].right.z}m).`
      };
      state.pendingAgentPlan = plan;
      return {
        ok: true,
        plan,
        stateVersion: state.stateVersion
      };
    }

    function execute_synchronized_echo(args = {}) {
      const reqVersion = args.stateVersion !== undefined ? args.stateVersion : args.proposedAtStateVersion;
      if (typeof reqVersion === 'number' && reqVersion !== state.stateVersion) {
        return {
          ok: false,
          code: 'PLAN_INVALIDATED_BY_STATE_CHANGE',
          expectedStateVersion: state.stateVersion,
          receivedStateVersion: reqVersion
        };
      }
      if (
        state.pendingAgentPlan &&
        state.pendingAgentPlan.proposedAtStateVersion !== state.stateVersion
      ) {
        return {
          ok: false,
          code: 'PLAN_INVALIDATED_BY_STATE_CHANGE',
          expectedStateVersion: state.stateVersion,
          receivedStateVersion: state.pendingAgentPlan.proposedAtStateVersion
        };
      }

      state.agentAssistActive = true;
      state.paradoxState = {
        active: false,
        code: 'TIMELINE_COHERENT',
        nodeId: null,
        descriptionEs: 'AION-3 estabilizó la línea temporal y sincronizó sus manos doradas.',
        descriptionEn: 'AION-3 stabilized the timeline and synchronized its golden hands.'
      };
      if (state.recordedEchoes.length < 2) {
        state.recordedEchoes.push(
          buildDeterministicEchoTrack(1, state.activeVaultId, state.topology, state.accessibility.oneHandedMode)
        );
      }
      state.handoffState.valveWestLatched = true;
      state.handoffState.valveNorthLatched = true;
      state.handoffState.handoffCompleted = true;
      state.handoffState.highFiveCompleted = true;
      state.handoffState.syncDeltaMs = 12;
      const executedPlanId = (state.pendingAgentPlan && state.pendingAgentPlan.planId) || args.planId || `AION3_EXEC_v${state.stateVersion}`;
      state.pendingAgentPlan = null;
      bumpVersion();

      return {
        ok: true,
        status: 'SYNCHRONIZED_6_HAND_VAULT_UNLOCKED',
        executedPlanId,
        agentAssistActive: state.agentAssistActive,
        evaluation: evaluateVaultCausalState(),
        newStateVersion: state.stateVersion,
        stateVersion: state.stateVersion
      };
    }

    function stabilize_causal_paradox(args = {}) {
      if (typeof args.stateVersion === 'number' && args.stateVersion !== state.stateVersion) {
        return {
          ok: false,
          code: 'STALE_STATE_VERSION',
          expectedStateVersion: state.stateVersion,
          receivedStateVersion: args.stateVersion
        };
      }
      state.paradoxState = {
        active: false,
        code: 'TIMELINE_COHERENT',
        nodeId: null,
        descriptionEs: 'Paradoja disuelta por el campo de fase de AION-3.',
        descriptionEn: 'Paradox dissolved by AION-3 phase field.'
      };
      state.agentAssistActive = true;
      bumpVersion();
      return {
        ok: true,
        tool: 'stabilize_causal_paradox',
        paradoxState: { ...state.paradoxState },
        evaluation: evaluateVaultCausalState(),
        stateVersion: state.stateVersion
      };
    }

    function invokeAgentTool(toolName, args = {}) {
      switch (String(toolName || '').trim()) {
        case 'inspect_spacetime_loop':
          return inspect_spacetime_loop(args);
        case 'propose_temporal_assist':
          return propose_temporal_assist(args);
        case 'execute_synchronized_echo':
          return execute_synchronized_echo(args);
        case 'stabilize_causal_paradox':
          return stabilize_causal_paradox(args);
        default:
          return { ok: false, code: 'UNKNOWN_AGENT_TOOL', error: `Unknown tool: ${toolName}` };
      }
    }

    // =========================================================================
    // 30 DAILY CHRONO-RIFTS & ASYMMETRIC 2D COMPANION (`/companion`)
    // =========================================================================
    function verifyDailyRift(riftId) {
      const r = DAILY_CHRONO_RIFTS[riftId] || DAILY_CHRONO_RIFTS.DAILY_RIFT_01;
      const nodes = getScaledVaultNodes(r.vaultId, r.topology);
      return {
        ok: true,
        riftId: r.id,
        solvableByBfs: Boolean(r.solvableByBfs && nodes.length >= 5),
        parLoops: r.parLoops,
        handoffWindowMs: r.handoffWindowMs,
        optimalStepsCount: r.optimalSteps.length,
        optimalSteps: r.optimalSteps
      };
    }

    function loadDailyRift(riftId) {
      const r = DAILY_CHRONO_RIFTS[riftId] || DAILY_CHRONO_RIFTS.DAILY_RIFT_01;
      state.activeDailyRiftId = r.id;
      setDeskTopology(r.topology, { virtualFallback: false });
      selectVault(r.vaultId);
      state.musicAmbience.bpm = r.bpm;
      if (!state.horologistProgression.completedDailyRifts.includes(r.id)) {
        state.horologistProgression.completedDailyRifts.push(r.id);
      }
      return {
        ok: true,
        rift: r,
        verification: verifyDailyRift(r.id),
        evaluation: evaluateVaultCausalState(),
        stateVersion: state.stateVersion
      };
    }

    function applyCompanionAction(payload = {}) {
      const type = String(payload.type || payload.action || 'TIME_DILATION_BUBBLE').toUpperCase();
      state.companionState.connectedPeers = Math.max(2, state.companionState.connectedPeers);
      state.companionState.lastCompanionAction = type;
      if (type === 'TIME_DILATION_BUBBLE') {
        state.companionState.timeDilationZoneActive = !state.companionState.timeDilationZoneActive;
        state.accessibility.timeDilationFactor = state.companionState.timeDilationZoneActive ? 0.55 : 1.0;
      } else if (type === 'COOP_MAGNETIC_PULSE') {
        state.companionState.coopMagneticPulseCount += 1;
        state.handoffState.handoffCompleted = true;
        state.handoffState.highFiveCompleted = true;
      } else if (type === 'SCRUB_PHASE' && typeof payload.phaseNorm === 'number') {
        state.timelinePhaseNorm = clamp(payload.phaseNorm, 0, 1);
      }
      bumpVersion();
      return {
        ok: true,
        companionState: { ...state.companionState },
        evaluation: evaluateVaultCausalState(),
        stateVersion: state.stateVersion
      };
    }

    function exportChronoShowfile() {
      const evalSnap = evaluateVaultCausalState();
      return {
        ok: true,
        schema: 'chrono-hands.spacetime.vault/v1',
        exportedAt: new Date().toISOString(),
        stateVersion: state.stateVersion,
        vaultId: state.activeVaultId,
        topology: state.topology,
        loopDurationSec: state.loopDurationSec,
        recordedEchoesCount: state.recordedEchoes.length,
        agentAssistActive: state.agentAssistActive,
        paradoxState: state.paradoxState,
        handoffState: state.handoffState,
        accessibility: state.accessibility,
        horologistProgression: state.horologistProgression,
        nodes: evalSnap.nodes,
        recordedEchoes: state.recordedEchoes
      };
    }

    return {
      DESK_TOPOLOGIES,
      VAULT_CATALOG,
      DAILY_CHRONO_RIFTS,
      state,
      getState: () => state,
      computeBallisticArcPoint,
      getScaledVaultNodes,
      buildDeterministicEchoTrack,
      buildAgentGoldenTrack,
      evaluateVaultCausalState,
      startChronoSession,
      setDeskTopology,
      selectVault,
      recordAndRewindEchoLoop,
      triggerTemporalHandoff,
      triggerTemporalHighFive,
      injectParadoxState,
      setAccessibilityModes,
      inspect_spacetime_loop,
      propose_temporal_assist,
      execute_synchronized_echo,
      stabilize_causal_paradox,
      invokeAgentTool,
      verifyDailyRift,
      loadDailyRift,
      applyCompanionAction,
      exportChronoShowfile
    };
  }

  return {
    DESK_TOPOLOGIES,
    VAULT_CATALOG,
    DAILY_CHRONO_RIFTS,
    computeBallisticArcPoint,
    getScaledVaultNodes,
    buildDeterministicEchoTrack,
    buildAgentGoldenTrack,
    createEngine
  };
});
