/**
 * MIAU-BOMBA: DEFENSA FELINA SIN TEXTO (VISUAL-ONLY C4 BRIEFCASE & SCULPTED CAT)
 * Project #8 (idea-08-chrono-hands-echo)
 *
 * - ZERO TEXT IN GAMEPLAY: 100% Visual 7-Segment Bomb Countdown + Glowing Color Bulbs + Graphical Icons
 * - Sculpted 3D Ginger Tabby Cat ("Catone") with procedural tabby fur texture, beveled ears,
 *   emerald eyes with specular catchlights & eyelids, cheek tufts, curved S-tail, and 4-toed mittens
 * - Open Tactical C4 Bomb Briefcase with braided 3D wires, C4 blocks, and physical push-buttons
 */
(function () {
  'use strict';

  var ChronoHandsEngine = window.ChronoHandsEngine;
  if (!ChronoHandsEngine) {
    console.error('[BombCat] ChronoHandsEngine not found on window.');
    return;
  }

  var engine = ChronoHandsEngine.createEngine();
  var state = engine.getState();

  // 4 Tactile Bomb Push-Pads arranged in a wide, spacious U-arc on the Curved Crescent Console (18.5cm to 19cm apart!)
  var PAD_DEFS = [
    {
      index: 0,
      hex: 0xef6a4c,
      emissiveHex: 0xcf5038,
      css: '#ef6a4c',
      x: -0.27,
      y: 0.038,
      z: 0.04
    },
    {
      index: 1,
      hex: 0x76a0e2,
      emissiveHex: 0x3d6b88,
      css: '#76a0e2',
      x: -0.095,
      y: 0.038,
      z: -0.015
    },
    {
      index: 2,
      hex: 0x43c25c,
      emissiveHex: 0x2e6f56,
      css: '#43c25c',
      x: 0.095,
      y: 0.038,
      z: -0.015
    },
    {
      index: 3,
      hex: 0xf4b829,
      emissiveHex: 0xd49c1f,
      css: '#f4b829',
      x: 0.27,
      y: 0.038,
      z: 0.04
    }
  ];

  // 10 Progressive Bomb-Defusal Levels (Pure visual sequences + Cat mischief)
  var LEVEL_SPECS = [
    {
      level: 1,
      code: '1-1',
      timeLimitSec: 55,
      sequence: [1, 2, 3],
      needsLeftFuse: true,
      needsRightFuse: false,
      hasLaserGadget: true,
      hasKibbleGadget: false,
      catAggression: 0.75,
      canLoaf: false,
      startLoaf: false
    },
    {
      level: 2,
      code: '1-2',
      timeLimitSec: 50,
      sequence: [2, 0, 1],
      needsLeftFuse: true,
      needsRightFuse: false,
      hasLaserGadget: false,
      hasKibbleGadget: false,
      catAggression: 0.65,
      canLoaf: false,
      startLoaf: false
    },
    {
      level: 3,
      code: '1-3',
      timeLimitSec: 50,
      sequence: [1, 3, 0, 2],
      needsLeftFuse: true,
      needsRightFuse: true,
      hasLaserGadget: true,
      hasKibbleGadget: false,
      catAggression: 0.90,
      canLoaf: false,
      startLoaf: false
    },
    {
      level: 4,
      code: '1-4',
      timeLimitSec: 55,
      sequence: [3, 2, 1, 0],
      needsLeftFuse: true,
      needsRightFuse: true,
      hasLaserGadget: true,
      hasKibbleGadget: true,
      catAggression: 0.95,
      canLoaf: true,
      startLoaf: true
    },
    {
      level: 5,
      code: '1-5',
      timeLimitSec: 55,
      sequence: [0, 2, 3, 1, 2],
      needsLeftFuse: true,
      needsRightFuse: true,
      hasLaserGadget: true,
      hasKibbleGadget: true,
      catAggression: 1.15,
      canLoaf: true,
      startLoaf: false
    },
    {
      level: 6,
      code: '2-1',
      timeLimitSec: 48,
      sequence: [1, 0, 3, 2, 1],
      needsLeftFuse: true,
      needsRightFuse: true,
      hasLaserGadget: true,
      hasKibbleGadget: true,
      catAggression: 1.25,
      canLoaf: true,
      startLoaf: false
    },
    {
      level: 7,
      code: '2-2',
      timeLimitSec: 46,
      sequence: [3, 1, 2, 0, 3],
      needsLeftFuse: true,
      needsRightFuse: true,
      hasLaserGadget: true,
      hasKibbleGadget: true,
      catAggression: 1.35,
      canLoaf: true,
      startLoaf: true
    },
    {
      level: 8,
      code: '2-3',
      timeLimitSec: 46,
      sequence: [2, 3, 0, 1, 3, 2],
      needsLeftFuse: true,
      needsRightFuse: true,
      hasLaserGadget: true,
      hasKibbleGadget: true,
      catAggression: 1.45,
      canLoaf: true,
      startLoaf: false
    },
    {
      level: 9,
      code: '2-4',
      timeLimitSec: 44,
      sequence: [0, 1, 3, 2, 0, 1],
      needsLeftFuse: true,
      needsRightFuse: true,
      hasLaserGadget: true,
      hasKibbleGadget: true,
      catAggression: 1.55,
      canLoaf: true,
      startLoaf: true
    },
    {
      level: 10,
      code: '2-5',
      timeLimitSec: 45,
      sequence: [3, 0, 2, 1, 3, 2],
      needsLeftFuse: true,
      needsRightFuse: true,
      hasLaserGadget: true,
      hasKibbleGadget: true,
      catAggression: 1.65,
      canLoaf: true,
      startLoaf: true
    }
  ];

  // Runtime State + Exponential Incremental Economy, Prestige, Bilingual (EN/ES) & Audio Mixer
  var currentLang = 'en'; // Primary language: 'en' (English), toggleable to 'es' (Spanish)
  var audioMuted = false;
  var currentLevelNum = 1;
  var levelTimerSec = 55.0;
  var lastWholeSecBeep = 55;
  var sequenceStepIndex = 0;
  var bombMaxCharge = 100.0;
  var bombCurrentCharge = 100.0;
  var activeTargetPadIndex = 1;
  var clickerCoins = 0;
  var lifetimeTotalCoins = 0;
  var prestigeMedals = 0;
  var totalClicksCount = 0;
  var comboCount = 0;
  var comboMultiplier = 1;
  var comboDecayTimer = 0.0;
  var upgPowerLevel = 1;
  var upgAutoLevel = 1;
  var upgCritLevel = 1;
  var autoClickAccum = 0.0;
  var autoHammerAnim = 0.0;
  var goldenFeverTimer = 0.0;
  var nextGoldenFeverCountdown = 9.5;
  var adaptiveSkillFactor = 1.0; // Silent automatic difficulty adaptation (0.72x .. 1.85x)
  var seqStepTimer = 2.4;
  var seqStepDuration = 2.4;
  var laserTurretPivotRef = null;
  var laserTargetPos = { x: 0.0, y: 0.16, z: -0.424 };

  // Title Screen Mode + Scoreboard + Guest Star Cat ("Catwho" — Black & White Masked Cat)
  var inTitleScreenMode = true;
  var titleScreenCanvas = null;
  var titleScreenCtx = null;
  var titleScreenTex = null;
  var titleScreenMesh = null;
  var leftMonitorGroupRef = null;
  var rightMonitorGroupRef = null;
  var maxLevelReached = 1;
  var totalBombsDisarmed = 0;
  var totalCatSabotagesFoiled = 0;
  var peakComboReached = 1;
  var matchScore = 0;
  var highScoresList = [];

  var catwhoRig = null;
  var tipiBodyGroup = null;
  var tipiHeadGroup = null;
  var tipiPawLeftGroup = null;
  var tipiPawRightGroup = null;
  var tipiUpperArmLeft = null;
  var tipiElbowLeft = null;
  var tipiForearmLeft = null;
  var tipiUpperArmRight = null;
  var tipiElbowRight = null;
  var tipiForearmRight = null;
  var tipiTailPivot = null;
  var tipiEarLeft = null;
  var tipiEarRight = null;
  var tipiEyelidLeft = null;
  var tipiEyelidRight = null;
  var catwhoPhase = 'HIDDEN'; // 'HIDDEN' | 'APPROACHING' | 'DUO_PLAY' | 'DUO_SABOTAGE' | 'LEAVING'
  var catwhoTimer = 0.0;
  var catwhoCooldown = 7.5;
  var catwhoTargetAction = 'PRESS_FORBIDDEN';
  var catwhoAttackProgress = 0.0;
  var catwhoAttackDuration = 3.6;
  var catwhoAttackPawSide = 'left';
  var tipiCurrentPawWorldPos = { x: 0.14, y: 0.06, z: -0.14 };
  var tipiBlinkTimer = 1.4;
  var catWalkCyclePhase = 0.0;
  var tipiWalkCyclePhase = 0.0;

  var fuseLeftLocked = true;
  var fuseRightLocked = true;
  var fuseLeftKnockAnim = 0.0;
  var fuseRightKnockAnim = 0.0;
  var circuitDisarmed = false;
  var bombExplodedFlash = 0.0;

  // Cat AI State
  var catState = 'IDLE';
  var catStateTimer = 2.0;
  var catAttackProgress = 0.0;
  var catAttackDuration = 3.3;
  var catAttackPawSide = 'right';
  var endingModalOpenTime = 0.0;
  var endingModalMode = 'VOLUNTARY'; // 'VICTORY' | 'EXPLODED_TAUNT' | 'VOLUNTARY'
  var YARN_UNLOCK_LEVEL = 1;
  var yarnActiveTimer = 0.0;
  var yarnBallGroup = null;
  var yarnBallMesh = null;
  var yarnShadowMesh = null;
  var yarnPhys = {
    x: -0.440,
    y: 0.032,
    z: -0.085,
    vx: 0.0,
    vy: 0.0,
    vz: 0.0,
    radius: 0.032,
    batCooldown: 0.0
  };
  var laserActiveTimer = 0.0;
  var kibbleActiveTimer = 0.0;
  var catBlinkTimer = 0.0;

  // Button Spring Depression
  var padDepress = [0, 0, 0, 0];
  var masterBarDepress = 0;
  var forbiddenDepress = 0;
  var laserBtnDepress = 0;
  var kibbleBtnDepress = 0;
  var yarnBtnDepress = 0;
  var exitXrBtnDepress = 0;
  var autoUpgBtnDepress = 0;
  var audioBtnDepress = 0;
  var langBtnDepress = 0;

  var touchCooldowns = {
    pad0: 0,
    pad1: 0,
    pad2: 0,
    pad3: 0,
    master: 0,
    forbidden: 0,
    fuseLeft: 0,
    fuseRight: 0,
    laser: 0,
    kibble: 0,
    yarn: 0,
    exitXr: 0,
    boop: 0,
    surgeWire: 0,
    trapWire: 0,
    autoUpg: 0,
    audioBtn: 0,
    langBtn: 0,
    titleStart: 0,
    shopMonitor: 0,
    endingClose: 0
  };

  // Three.js References
  var scene = null;
  var camera = null;
  var renderer = null;
  var tableRootGroup = null;
  var xrTableCalibrated = false;
  var lastFrameTimeMs = performance.now();
  var clockSec = 0;

  // Bomb Briefcase, Realistic Ordnance Hardware & Upgrade Stations
  var colorPadGroups = [];
  var colorPadCapMeshes = [];
  var colorPadHaloMeshes = [];
  var seqBulbMeshes = [];
  var seqBulbRingMeshes = [];
  var masterDisarmGroup = null;
  var masterBarCapMesh = null;
  var forbiddenButtonGroup = null;
  var forbiddenDomeMesh = null;
  var leftFuseGroup = null;
  var leftFuseCoreMesh = null;
  var rightFuseGroup = null;
  var rightFuseCoreMesh = null;
  var laserGadgetGroup = null;
  var laserBtnCapMesh = null;
  var laserBeamMesh = null;
  var laserDotMesh = null;
  var kibbleGadgetGroup = null;
  var kibbleBtnCapMesh = null;
  var catBowlGroup = null;
  var kibblePelletsGroup = null;
  var yarnGadgetGroup = null;
  var yarnBtnCapMesh = null;
  var exitXrGadgetGroup = null;
  var exitXrBtnCapMesh = null;

  // Dynamic 3D Button Badge Canvases & 3D Audio/Language Console Buttons
  var laserBadgeCanvas = null;
  var laserBadgeTexture = null;
  var fishBadgeCanvas = null;
  var fishBadgeTexture = null;
  var yarnBadgeCanvas = null;
  var yarnBadgeTexture = null;
  var exitXrBadgeCanvas = null;
  var exitXrBadgeTexture = null;
  var audioToggleGroup = null;
  var audioToggleCapMesh = null;
  var audioBadgeCanvas = null;
  var audioBadgeTexture = null;
  var langToggleGroup = null;
  var langToggleCapMesh = null;
  var langBadgeCanvas = null;
  var langBadgeTexture = null;

  // Popups, Blasting Cap LEDs & 3D Coin Particles
  var autoClickerStationGroup = null;
  var autoClickerBtnMesh = null;
  var autoClickerHammerGroup = null;
  var pressureGaugeGroup = null;
  var gaugeNeedleMesh = null;
  var blastingCapLeds = [];
  var upgPowerPips = [];
  var upgAutoPips = [];
  var upgCritPips = [];
  var coinParticlesList = [];
  var clickPopupList = [];
  var clickBarFlashTimer = 0.0;

  // VR Spatial Mechanics: 3D Arched Wire Severing + Holographic Hand Deflector Shield
  var wireBridgeGroup = null;
  var surgeWireIntactMesh = null;
  var surgeWireCutLeftMesh = null;
  var surgeWireCutRightMesh = null;
  var surgeWireSevered = false;
  var trapWireIntactMesh = null;
  var trapWireCutLeftMesh = null;
  var trapWireCutRightMesh = null;
  var trapWireSevered = false;
  var wireSparksGroup = null;
  var wireSparksTimer = 0.0;
  var handShieldLeftMesh = null;
  var handShieldRightMesh = null;

  // 3D Multi-Stage Bomb Explosion + Physical Structural Destruction Registry (`destructiblePartsList`)
  var explosionGroup = null;
  var fireballCoreMesh = null;
  var fireballOuterMesh = null;
  var shockwaveRingMesh = null;
  var explosionLight = null;
  var explosionDebrisList = [];
  var explosionSmokeList = [];
  var destructiblePartsList = [];
  var scorchCraterMesh = null;
  var bombIsDestroyed = false;
  var explosionActiveTimer = 0.0;
  var explosionDuration = 2.0;
  var explosionScaleFactor = 1.0;
  var tableShakeIntensity = 0.0;
  var levelResetPendingTimer = 0.0;

  // 3D Sculpted Cat & Connected 2-Bone IK Arm References
  var catRig = null;
  var catBodyGroup = null;
  var catHeadGroup = null;
  var catEarLeft = null;
  var catEarRight = null;
  var catEyelidLeft = null;
  var catEyelidRight = null;
  var catTailPivot = null;
  var catPawLeftGroup = null;
  var catPawRightGroup = null;
  var catUpperArmLeft = null;
  var catForearmLeft = null;
  var catElbowLeft = null;
  var catUpperArmRight = null;
  var catForearmRight = null;
  var catElbowRight = null;
  var catPawWarningRing = null;
  var catCurrentPawLocalPos = { x: 0, y: 0.22, z: -0.22 };

  // Player Hands
  var liveHandLeft = null;
  var liveHandRight = null;
  var actionHandTargetPos = null;
  var actionHandTargetTimer = 0.0;
  var cursorWorldTarget = { x: 0.08, y: 0.13, z: 0.12 };

  // 3D Panoramic Stage Background Displays (Left: Timer/Defuse, Right: Economy/Combo/Status) & Dynamic Lights
  var bombClockCanvas = null;
  var bombClockCtx = null;
  var bombClockTexture = null;
  var bombClockMesh = null;
  var stageRightCanvas = null;
  var stageRightCtx = null;
  var stageRightTexture = null;
  var stageRightMesh = null;
  var xrTargetBeaconGroup = null;
  var targetGlowLight = null;
  var impactFlashLight = null;
  var impactFlashTimer = 0.0;
  var oledToastText = '';
  var oledToastColor = '#38bdf8';
  var oledToastTimer = 0.0;

  // WebXR, Camera Orbit & Multi-Bus WebAudio Mixer (`Master <- {Music, SFX}`)
  var xrSessionActive = false;
  var xrControllersList = [];
  var camAzimuth = 0.0;
  var camElevation = 0.50;
  var camDistance = 0.72;
  var isOrbitDragging = false;
  var lastPointerX = 0;
  var lastPointerY = 0;
  var audioCtx = null;
  var masterBusGain = null;
  var masterCompressor = null;
  var reverbConvolver = null;
  var wetReverbGain = null;
  var musicBusGain = null;
  var musicFilterNode = null;
  var sfxBusGain = null;
  var voiceBusGain = null;
  var ambienceBusGain = null;
  var sharedNoiseBuffer = null;
  var audioHardwareUnlocked = false;
  var musicStepAccum = 0.285;
  var musicStepIndex = 0;
  var musicIntensity = 0.25;
  var purrAccumTimer = 0.0;
  var tickTockParity = 0;

  function getSpec() {
    var idx = Math.max(0, Math.min(LEVEL_SPECS.length - 1, currentLevelNum - 1));
    return LEVEL_SPECS[idx];
  }

  function tr(enStr, esStr) {
    return currentLang === 'es' ? esStr : enStr;
  }

  // ============================================================================
  // EXPONENTIAL INCREMENTAL MATH: Cost(n) = Base * 1.15^n, Milestones & Prestige
  // ============================================================================
  function getMilestoneMultiplier(lvl) {
    if (lvl >= 25) return 10.0;
    if (lvl >= 10) return 5.0;
    if (lvl >= 5) return 2.0;
    return 1.0;
  }

  function getLevelShopInflation() {
    // Shop prices scale progressively as the player advances through Levels 1..10 (+28% per level)
    return Math.pow(1.28, Math.max(0, (currentLevelNum || 1) - 1));
  }

  function getLaserUpgradeCost() {
    // Cost(n, lvl) = BaseCost(10) * 1.18^(n-1) * 1.28^(lvl-1)
    return Math.floor(10 * Math.pow(1.18, Math.max(0, upgPowerLevel - 1)) * getLevelShopInflation());
  }

  function getFishUpgradeCost() {
    // Cost(n, lvl) = BaseCost(15) * 1.18^(n-1) * 1.28^(lvl-1)
    return Math.floor(15 * Math.pow(1.18, Math.max(0, upgAutoLevel - 1)) * getLevelShopInflation());
  }

  function getChronoUpgradeCost() {
    // Cat Yarn Ball Cost(n, lvl) = BaseCost(15) * 1.18^(n-1) * 1.28^(lvl-1)
    return Math.floor(15 * Math.pow(1.18, Math.max(0, upgCritLevel - 1)) * getLevelShopInflation());
  }

  function computePrestigeMedalsFromTotal(totalHistorical) {
    // MP = floor(2 * cbrt(Total / 100))
    if (totalHistorical < 100) return 0;
    return Math.floor(2.0 * Math.cbrt(totalHistorical / 100.0));
  }

  function getPrestigeMultiplier() {
    // Prestige Multiplier = 1 + (MP * 0.25) (+25% permanent production per medal)
    return 1.0 + prestigeMedals * 0.25;
  }

  function getManualTapPower(baseVal) {
    var feverMult = goldenFeverTimer > 0 ? 5.0 : 1.0;
    var milestoneMult = getMilestoneMultiplier(upgPowerLevel);
    return (
      baseVal *
      (1.0 + (upgPowerLevel - 1) * 0.45) *
      milestoneMult *
      (1.0 + (comboMultiplier - 1) * 0.30) *
      getPrestigeMultiplier() *
      feverMult
    );
  }

  function getSequenceSpeedMultiplier() {
    var pctDisarmed = Math.max(0, Math.min(1.0, 1.0 - bombCurrentCharge / Math.max(1.0, bombMaxCharge)));
    // Invisible automatic adaptation: adjusts smoothly to the player's skill (`adaptiveSkillFactor`),
    // bomb defusal progress (`0% -> 100%`), current level (`1..10`), and active combo!
    var rawSpeed =
      (1.0 + pctDisarmed * 1.15 + (currentLevelNum - 1) * 0.16 + (comboMultiplier - 1) * 0.06) *
      adaptiveSkillFactor;
    // Chrono Overclock upgrades (`upgCritLevel`) help stabilize rapid sequences (`-6%` per level)!
    var chronoSlow = 1.0 + Math.min(0.55, (upgCritLevel - 1) * 0.06);
    return Math.max(0.55, Math.min(3.50, rawSpeed / chronoSlow));
  }

  function getCurrentSeqStepDuration() {
    return Math.max(0.58, Math.min(3.60, 2.50 / getSequenceSpeedMultiplier()));
  }

  var LEVEL_TITLES_EN = [
    'WARMUP CIRCUIT',
    'LEFT COIL LOCK',
    'CATWHO DUO WAVE',
    'DUAL COIL SURGE',
    'SLEEPING LOAF HAZARD',
    'HIGH-SPEED RELAY',
    'TWIN PAW AMBUSH',
    'OVERCLOCKED DETONATOR',
    'CRITICAL FUSE STORM',
    'FINAL CAT-ASTROPHE'
  ];

  var LEVEL_TITLES_ES = [
    'CIRCUITO INICIAL',
    'BOBINA IZQUIERDA',
    'OLEADA DÚO CATWHO',
    'DOBLE BOBINA ACTIVA',
    'GATO DORMILÓN',
    'RELÉ DE ALTA VELOCIDAD',
    'EMBOSCADA DE DOS GATOS',
    'DETONADOR ACELERADO',
    'TORMENTA DE BOBINAS',
    'CAT-ÁSTROFE FINAL'
  ];

  function getLevelTitle(lvlNum) {
    var idx = Math.max(0, Math.min(9, (lvlNum || currentLevelNum) - 1));
    return currentLang === 'es' ? LEVEL_TITLES_ES[idx] : LEVEL_TITLES_EN[idx];
  }

  function computeTotalMatchScore() {
    var lvlPts = maxLevelReached * 1000;
    var disarmPts = totalBombsDisarmed * 2500;
    var foilPts = totalCatSabotagesFoiled * 450;
    var comboPts = Math.round(peakComboReached * 250 * getPrestigeMultiplier());
    var goldPts = Math.min(50000, Math.floor(clickerCoins * 0.5) + (upgPowerLevel + upgAutoLevel + upgCritLevel - 3) * 150);
    return lvlPts + disarmPts + foilPts + comboPts + goldPts + matchScore;
  }

  function saveHighScoreEntry(scoreVal, lvlVal) {
    try {
      var raw = window.localStorage.getItem('paws_wires_highscores_v1');
      var arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) arr = [];
      arr.push({
        score: Math.round(scoreVal),
        level: lvlVal,
        ts: Date.now()
      });
      arr.sort(function (a, b) {
        return b.score - a.score;
      });
      highScoresList = arr.slice(0, 5);
      window.localStorage.setItem('paws_wires_highscores_v1', JSON.stringify(highScoresList));
    } catch (_) {}
  }

  function resetMatchStateForNewRun() {
    clickerCoins = 0;
    lifetimeTotalCoins = 0;
    prestigeMedals = 0;
    upgPowerLevel = 1;
    upgAutoLevel = 1;
    upgCritLevel = 1;
    totalBombsDisarmed = 0;
    totalCatSabotagesFoiled = 0;
    maxLevelReached = 1;
    matchScore = 0;
    comboCount = 0;
    comboMultiplier = 1;
    peakComboReached = 1;
    adaptiveSkillFactor = 1.0;
    currentLevelNum = 1;
  }

  function isXrPresentingNow() {
    var activeSess = renderer && renderer.xr && typeof renderer.xr.getSession === 'function' ? renderer.xr.getSession() : null;
    return Boolean(activeSess || (renderer && renderer.xr && renderer.xr.isPresenting));
  }

  function updateXrEntryBannerVisibility() {
    var introOverlay = document.getElementById('game-intro-overlay');
    if (!introOverlay) return;
    var endingOpen = isEndingOverlayOpen();
    var xrAvailableIn2D = Boolean(navigator.xr) && !isXrPresentingNow();
    // Always keep the bottom-center VR/AR re-entry button visible whenever a WebXR headset is in 2D browser mode!
    var shouldShow = xrAvailableIn2D || (!endingOpen && inTitleScreenMode);
    introOverlay.classList.toggle('hidden', !shouldShow);
  }

  function openTitleScreenMode() {
    inTitleScreenMode = true;
    startImmediateHtml5AudioAutoplay();
    unlockAndResumeAudio();
    setTimeout(unlockAndResumeAudio, 150);
    closeFinalScoreboardModal();
    resetDestructibleParts();
    updateXrEntryBannerVisibility();
    if (titleScreenMesh) {
      titleScreenMesh.position.set(0, 0.185, -0.32);
      titleScreenMesh.rotation.x = -0.04;
      titleScreenMesh.renderOrder = 10;
      titleScreenMesh.visible = true;
    }
    if (catwhoRig) catwhoRig.visible = true;
    if (leftMonitorGroupRef) leftMonitorGroupRef.visible = false;
    if (rightMonitorGroupRef) rightMonitorGroupRef.visible = false;
    updateDomCounters();
    renderBombClockCanvas();
  }

  function startGameFromTitleScreen() {
    unlockAndResumeAudio();
    inTitleScreenMode = false;
    closeFinalScoreboardModal();
    resetMatchStateForNewRun();
    updateXrEntryBannerVisibility();
    if (titleScreenMesh) {
      titleScreenMesh.position.set(0, 0.185, -0.32);
      titleScreenMesh.rotation.x = -0.04;
      titleScreenMesh.renderOrder = 10;
      titleScreenMesh.visible = false;
    }
    if (leftMonitorGroupRef) leftMonitorGroupRef.visible = true;
    if (rightMonitorGroupRef) rightMonitorGroupRef.visible = true;
    catwhoPhase = 'HIDDEN';
    catwhoCooldown = 6.5;
    if (catwhoRig) catwhoRig.visible = false;
    playGameSound('win');
    loadLevelByNumber(1);
  }

  function closeFinalScoreboardModal() {
    var endingOverlay = document.getElementById('game-ending-overlay');
    if (endingOverlay) endingOverlay.classList.add('hidden');
    if (titleScreenMesh) {
      titleScreenMesh.position.set(0, 0.185, -0.32);
      titleScreenMesh.rotation.x = -0.04;
      titleScreenMesh.renderOrder = 10;
      if (!inTitleScreenMode) {
        titleScreenMesh.visible = false;
      }
    }
    updateXrEntryBannerVisibility();
    updateDomCounters();
  }

  function openFinalScoreboardModal(isMaxLevelVictory, isNoCoinsGameOver) {
    inTitleScreenMode = false;
    levelResetPendingTimer = 0.0;
    explosionActiveTimer = 0.0;
    if (explosionGroup) explosionGroup.visible = false;
    resetDestructibleParts();
    if (titleScreenMesh) {
      // Elevate and bring the 3D Final Scoreboard IN FRONT of the cats (`z = -0.135, y = 0.255`) so the cat NEVER blocks it!
      titleScreenMesh.position.set(0, 0.255, -0.135);
      titleScreenMesh.rotation.x = -0.10;
      titleScreenMesh.renderOrder = 30;
      titleScreenMesh.visible = true;
    }
    if (leftMonitorGroupRef) leftMonitorGroupRef.visible = true;
    if (rightMonitorGroupRef) rightMonitorGroupRef.visible = true;
    updateXrEntryBannerVisibility();

    var endingOverlay = document.getElementById('game-ending-overlay');
    if (!endingOverlay) return;
    endingOverlay.classList.remove('hidden');

    var lvlPts = maxLevelReached * 1000;
    var disarmPts = totalBombsDisarmed * 2500;
    var foilPts = totalCatSabotagesFoiled * 450;
    var comboPts = Math.round(peakComboReached * 250 * getPrestigeMultiplier());
    var goldPts = Math.min(50000, Math.floor(clickerCoins * 0.5) + (upgPowerLevel + upgAutoLevel + upgCritLevel - 3) * 150);
    var grandTotal = lvlPts + disarmPts + foilPts + comboPts + goldPts + matchScore;

    saveHighScoreEntry(grandTotal, maxLevelReached);

    var elKicker = document.getElementById('ending-kicker');
    if (elKicker) {
      elKicker.textContent = tr('PAWS & WIRES', 'PATAS Y CABLES');
    }
    var elBadge = document.getElementById('ending-badge-status');
    if (elBadge) {
      elBadge.textContent = isMaxLevelVictory
        ? tr('10/10 CLEARED!', '¡10/10 SUPERADO!')
        : isNoCoinsGameOver
        ? tr('0 COINS LEFT', 'SIN MONEDAS')
        : tr('LV.' + maxLevelReached + '/10', 'NV.' + maxLevelReached + '/10');
    }
    var elTitle = document.getElementById('ending-title');
    if (elTitle) {
      elTitle.textContent = isMaxLevelVictory
        ? tr('VICTORY!', '¡VICTORIA!')
        : isNoCoinsGameOver
        ? tr('GAME OVER', '¡FIN DEL JUEGO!')
        : tr('MATCH ENDED', 'FIN DE PARTIDA');
    }
    var elTotLbl = document.getElementById('ending-total-score-label');
    if (elTotLbl) elTotLbl.textContent = tr('SCORE', 'PUNTOS');
    var elTotVal = document.getElementById('ending-total-score-val');
    if (elTotVal) elTotVal.textContent = grandTotal.toLocaleString();

    var s1T = document.getElementById('ending-stat1-title');
    var s1V = document.getElementById('ending-stat1-val');
    var s1P = document.getElementById('ending-stat1-pts');
    if (s1T) s1T.textContent = tr('MAX LEVEL', 'NIVEL MÁX.');
    if (s1V) s1V.textContent = maxLevelReached + '/10';
    if (s1P) s1P.textContent = '+' + lvlPts.toLocaleString();

    var s2T = document.getElementById('ending-stat2-title');
    var s2V = document.getElementById('ending-stat2-val');
    var s2P = document.getElementById('ending-stat2-pts');
    if (s2T) s2T.textContent = tr('BOMBS DEFUSED', 'BOMBAS DESARMADAS');
    if (s2V) s2V.textContent = '' + totalBombsDisarmed;
    if (s2P) s2P.textContent = '+' + disarmPts.toLocaleString();

    var s3T = document.getElementById('ending-stat3-title');
    var s3V = document.getElementById('ending-stat3-val');
    var s3P = document.getElementById('ending-stat3-pts');
    if (s3T) s3T.textContent = tr('CATS STOPPED', 'GATOS FRENADOS');
    if (s3V) s3V.textContent = '' + totalCatSabotagesFoiled;
    if (s3P) s3P.textContent = '+' + (foilPts + comboPts + goldPts + matchScore).toLocaleString();

    var s4T = document.getElementById('ending-stat4-title');
    var s4V = document.getElementById('ending-stat4-val');
    var s4P = document.getElementById('ending-stat4-pts');
    if (s4T) s4T.textContent = 'COMBO';
    if (s4V) s4V.textContent = 'x' + peakComboReached;
    if (s4P) s4P.textContent = '+' + comboPts.toLocaleString();

    var s5T = document.getElementById('ending-stat5-title');
    var s5V = document.getElementById('ending-stat5-val');
    var s5P = document.getElementById('ending-stat5-pts');
    if (s5T) s5T.textContent = tr('GOLD', 'ORO');
    if (s5V) s5V.textContent = '$' + Math.floor(clickerCoins);
    if (s5P) s5P.textContent = '+' + (goldPts + matchScore).toLocaleString();

    var elHofTitle = document.getElementById('ending-hof-title');
    if (elHofTitle) elHofTitle.textContent = 'TOP 3';

    for (var hIdx = 0; hIdx < 3; hIdx++) {
      var slotEl = document.getElementById('hof-slot-' + (hIdx + 1));
      if (slotEl) {
        var entry = highScoresList[hIdx];
        slotEl.textContent = entry
          ? '#' + (hIdx + 1) + '  ' + entry.score.toLocaleString()
          : '#' + (hIdx + 1) + '  0';
      }
    }

    var btnCloseEnding = document.getElementById('btn-ending-close');
    if (btnCloseEnding) btnCloseEnding.textContent = tr('CLOSE', 'CERRAR');

    endingModalOpenTime = clockSec;
    if (isMaxLevelVictory) {
      endingModalMode = 'VICTORY';
    } else if (isNoCoinsGameOver || (bombIsDestroyed && clickerCoins <= 0)) {
      endingModalMode = 'EXPLODED_TAUNT';
    } else {
      endingModalMode = 'VOLUNTARY';
    }
    renderEndingTauntCanvas();

    var creditsEl = document.getElementById('ending-credits-line');
    if (creditsEl) {
      creditsEl.textContent =
        'Dev: Daniel Valencia   •   Creative: MVT   •   Starring Cats';
    }
    updateDomCounters();
  }

  // ============================================================================
  // HAND-INKED WOUND WOOL YARN BALL (`drawHandInkedYarnBall2D` — Ovillo de Lana)
  // ============================================================================
  function drawHandInkedYarnBall2D(ctx, cx, cy, r, isLocked) {
    var baseBlue = isLocked ? '#83a4d8' : '#6596ed';
    var midBlue = isLocked ? '#7596cc' : '#5283de';
    var deepBlue = isLocked ? '#5f7fb5' : '#3d6bc2';
    var hiBlue = isLocked ? '#adc6ed' : '#a8ccff';
    var ink = '#231e16';

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1. Unwinding Curly Loose Yarn Thread Tail (S-curve emerging from bottom of ball)
    var tailStartX = cx + r * 0.25;
    var tailStartY = cy + r * 0.78;
    ctx.strokeStyle = ink;
    ctx.lineWidth = Math.max(4.5, r * 0.30);
    ctx.beginPath();
    ctx.moveTo(tailStartX, tailStartY);
    ctx.bezierCurveTo(
      cx + r * 0.85,
      cy + r * 1.18,
      cx + r * 1.15,
      cy + r * 0.42,
      cx + r * 1.52,
      cy + r * 0.78
    );
    ctx.stroke();

    ctx.strokeStyle = baseBlue;
    ctx.lineWidth = Math.max(2.4, r * 0.16);
    ctx.beginPath();
    ctx.moveTo(tailStartX, tailStartY);
    ctx.bezierCurveTo(
      cx + r * 0.85,
      cy + r * 1.18,
      cx + r * 1.15,
      cy + r * 0.42,
      cx + r * 1.52,
      cy + r * 0.78
    );
    ctx.stroke();

    // 2. Plump Scalloped Outer Ink Silhouette Bumpers (gives soft wound-wool edge)
    ctx.fillStyle = baseBlue;
    ctx.strokeStyle = ink;
    ctx.lineWidth = Math.max(2.6, r * 0.13);
    for (var sb = 0; sb < 12; sb++) {
      var sang = (sb * Math.PI * 2) / 12;
      var bx = cx + Math.cos(sang) * (r * 0.84);
      var by = cy + Math.sin(sang) * (r * 0.84);
      ctx.beginPath();
      ctx.arc(bx, by, r * 0.22, sang - 0.9, sang + 0.9);
      ctx.fill();
      ctx.stroke();
    }

    // 3. Clipped Multi-Strand Overlapping Yarn Bundles (Classic 4-way wound wool pattern)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = baseBlue;
    ctx.fill();
    ctx.clip();

    var grooveW = Math.max(1.5, r * 0.078);
    var hiW = Math.max(1.4, r * 0.072);
    var bundleBorderW = Math.max(2.1, r * 0.105);

    // Helper to draw a curved bundle of parallel wool strands around center (bx, by)
    var drawWoolBundle = function (bx, by, minR, maxR, count, fillCol) {
      ctx.fillStyle = fillCol;
      ctx.beginPath();
      ctx.arc(bx, by, maxR, 0, Math.PI * 2);
      ctx.fill();

      // Leading overlap border of this yarn bundle
      ctx.strokeStyle = ink;
      ctx.lineWidth = bundleBorderW;
      ctx.beginPath();
      ctx.arc(bx, by, maxR, 0, Math.PI * 2);
      ctx.stroke();

      var step = (maxR - minR) / count;
      for (var k = 0; k < count; k++) {
        var rk = minR + k * step;
        // Highlight ridge of each wool strand
        ctx.strokeStyle = hiBlue;
        ctx.lineWidth = hiW;
        ctx.beginPath();
        ctx.arc(bx, by, rk + step * 0.48, 0, Math.PI * 2);
        ctx.stroke();

        // Deep wool groove + ink crease between parallel strands
        ctx.strokeStyle = k % 2 === 0 ? ink : deepBlue;
        ctx.lineWidth = grooveW;
        ctx.beginPath();
        ctx.arc(bx, by, rk, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    // Bundle A: Upper-Left vertical-diagonal wool wrap
    drawWoolBundle(cx - r * 0.75, cy - r * 0.30, r * 0.35, r * 1.48, 6, midBlue);
    // Bundle B: Upper-Right cross wrap overlapping Bundle A
    drawWoolBundle(cx + r * 0.78, cy - r * 0.58, r * 0.32, r * 1.38, 6, baseBlue);
    // Bundle C: Bottom-Left cross wrap overlapping Bundles A & B
    drawWoolBundle(cx - r * 0.62, cy + r * 0.82, r * 0.30, r * 1.32, 6, midBlue);
    // Bundle D: Lower-Right equatorial wrap crossing the front belly
    drawWoolBundle(cx + r * 0.72, cy + r * 0.65, r * 0.28, r * 1.18, 5, baseBlue);

    ctx.restore();

    // 4. Outer Crisp Ink Ring around the Yarn Ball Sphere
    ctx.strokeStyle = ink;
    ctx.lineWidth = Math.max(2.8, r * 0.135);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  // ============================================================================
  // END MATCH CAT VIGNETTE (`#ending-taunt-canvas`: EXPLODED TAUNT vs VOLUNTARY EXIT vs VICTORY)
  // ============================================================================
  function renderEndingTauntCanvas() {
    var endingOverlay = document.getElementById('game-ending-overlay');
    if (!endingOverlay || endingOverlay.classList.contains('hidden')) return;
    var c = document.getElementById('ending-taunt-canvas');
    if (!c) return;
    var ctx = c.getContext('2d');
    var w = c.width;
    var h = c.height;

    ctx.clearRect(0, 0, w, h);

    var isExplodedTaunt = endingModalMode === 'EXPLODED_TAUNT';
    var isVictory = endingModalMode === 'VICTORY';

    // Warm Drafting Board Background + Technical Grid (`colorfigures` + `wheresryan22/anatomy`)
    ctx.fillStyle = '#e6e1d4';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(35, 30, 22, 0.08)';
    ctx.lineWidth = 1;
    for (var gx = 32; gx < w; gx += 32) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, h);
      ctx.stroke();
    }

    var elapsed = Math.max(0, clockSec - endingModalOpenTime);
    var riseNorm = Math.min(1.0, elapsed / 0.55);
    var riseEase = 1.0 - Math.pow(1.0 - riseNorm, 3);
    var snickerWave = Math.sin(clockSec * 16.0);
    var snickerBob = isExplodedTaunt ? Math.abs(snickerWave) * 6.0 : Math.sin(clockSec * 4.5) * 2.5;
    var baseY = h + 44 - riseEase * 56 - snickerBob;

    if (isExplodedTaunt) {
      // Charred bomb crater & smoking debris on the left (`x = 76..165`)
      ctx.fillStyle = '#3d3935';
      ctx.strokeStyle = '#231e16';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(115, h - 12, 42, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Rising smoke curls from the exploded bomb
      for (var sm = 0; sm < 5; sm++) {
        var smPhase = (clockSec * 1.3 + sm * 0.2) % 1.0;
        var smX = 88 + sm * 18 + Math.sin(clockSec * 4.0 + sm) * 8;
        var smY = h - 22 - smPhase * 105;
        var smR = 9 + smPhase * 15;
        ctx.fillStyle = 'rgba(65, 83, 143, ' + (0.30 * (1.0 - smPhase)).toFixed(2) + ')';
        ctx.beginPath();
        ctx.arc(smX, smY, smR, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (isVictory) {
      // Golden Trophy Cup on the left (`x = 115`)
      ctx.fillStyle = '#f4b829';
      ctx.strokeStyle = '#231e16';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.arc(115, h - 42, 22, 0, Math.PI, false);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillRect(109, h - 22, 12, 10);
      ctx.strokeRect(109, h - 22, 12, 10);
      ctx.fillRect(98, h - 14, 34, 6);
      ctx.strokeRect(98, h - 14, 34, 6);
    } else {
      // Voluntary Exit: Intact Cobalt Wound Yarn Ball on the left + Floating Curious Question Marks (`?`)
      drawHandInkedYarnBall2D(ctx, 114, h - 28, 18, false);

      var qBob1 = Math.sin(clockSec * 4.2) * 5;
      var qBob2 = Math.cos(clockSec * 4.2) * 5;
      ctx.font = '900 28px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = '#41538f';
      ctx.textAlign = 'center';
      ctx.fillText('?', 168, 48 + qBob1);
      ctx.fillText('?', 432, 44 + qBob2);
      ctx.textAlign = 'left';
    }

    // 1. SCULPTED COLORFIGURES CATONE (Ginger Tabby) centered at `cx = 256`
    var cx = 256;
    var cy = baseY;

    // Wagging Ginger Tail behind Catone
    var tailWag = Math.sin(clockSec * (isExplodedTaunt ? 10.0 : 4.5)) * (isExplodedTaunt ? 15 : 8);
    ctx.strokeStyle = '#231e16';
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 44, cy + 12);
    ctx.quadraticCurveTo(cx - 80, cy - 18 + tailWag * 0.4, cx - 68 + tailWag, cy - 52);
    ctx.stroke();
    ctx.strokeStyle = '#ea872f';
    ctx.lineWidth = 9.5;
    ctx.stroke();

    // Catone Torso / Shoulders
    ctx.fillStyle = '#ea872f';
    ctx.strokeStyle = '#231e16';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 18, 48, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cream Belly Patch
    ctx.fillStyle = '#fbfaf3';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 22, 27, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Catone Head (smug tilt when exploded taunt, curious head-tilt when voluntary exit)
    var headTilt = isExplodedTaunt
      ? Math.sin(clockSec * 8.0) * 0.06 - 0.05
      : isVictory
      ? 0.0
      : Math.sin(clockSec * 3.2) * 0.12 + 0.11;
    ctx.save();
    ctx.translate(cx, cy - 24);
    ctx.rotate(headTilt);

    // Left & Right Ears
    var earTwitch = Math.max(0, Math.sin(clockSec * (isExplodedTaunt ? 11.0 : 5.0))) * 3.0;
    ctx.fillStyle = '#ea872f';
    ctx.beginPath();
    ctx.moveTo(-38, -12);
    ctx.lineTo(-46, -50 + earTwitch);
    ctx.lineTo(-12, -34);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(38, -12);
    ctx.lineTo(46, -50);
    ctx.lineTo(12, -34);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Pink Inner Ears
    ctx.fillStyle = '#f5a3b7';
    ctx.beginPath();
    ctx.moveTo(-34, -16);
    ctx.lineTo(-40, -42 + earTwitch);
    ctx.lineTo(-17, -30);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(34, -16);
    ctx.lineTo(40, -42);
    ctx.lineTo(17, -30);
    ctx.closePath();
    ctx.fill();

    // Head Oval
    ctx.fillStyle = '#ea872f';
    ctx.beginPath();
    ctx.ellipse(0, -6, 46, 36, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Forehead Ginger Tabby Stripes
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(-12, -34, 4, 12);
    ctx.fillRect(-2, -36, 4, 14);
    ctx.fillRect(8, -34, 4, 12);

    // Cream Muzzle Cheeks
    ctx.fillStyle = '#fbfaf3';
    ctx.beginPath();
    ctx.ellipse(-12, 5, 16, 11, 0, 0, Math.PI * 2);
    ctx.ellipse(12, 5, 16, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes: Squinting Crescent Eyes (`^  ^`) ONLY on Exploded Taunt; Wide Round Eyes (`o  o`) on Voluntary Exit & Victory
    ctx.strokeStyle = '#231e16';
    ctx.lineWidth = 3.8;
    if (isExplodedTaunt) {
      ctx.beginPath();
      ctx.arc(-18, -9, 9.5, Math.PI * 1.12, Math.PI * 1.88, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(18, -9, 9.5, Math.PI * 1.12, Math.PI * 1.88, false);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(-18, -9, 9.0, 0, Math.PI * 2);
      ctx.arc(18, -9, 9.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#231e16';
      ctx.beginPath();
      ctx.arc(-18, -9, 4.5, 0, Math.PI * 2);
      ctx.arc(18, -9, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-20, -11, 2.2, 0, Math.PI * 2);
      ctx.arc(16, -11, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pink Nose & Mouth
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(0, 1, 4.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#231e16';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-10, 7);
    ctx.quadraticCurveTo(-5, 12, 0, 6);
    ctx.quadraticCurveTo(5, 12, 10, 7);
    ctx.stroke();

    // Whiskers
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-25, 3);
    ctx.lineTo(-50, 0);
    ctx.moveTo(-25, 8);
    ctx.lineTo(-49, 9);
    ctx.moveTo(25, 3);
    ctx.lineTo(50, 0);
    ctx.moveTo(25, 8);
    ctx.lineTo(49, 9);
    ctx.stroke();
    ctx.restore();

    if (isExplodedTaunt) {
      // Catone's Right Paw raised over his mouth/whiskers stifling a Duck-Hunt snicker (`he-he-he`)!
      var pawLaughY = cy - 14 + snickerWave * 4.5;
      ctx.fillStyle = '#fbfaf3';
      ctx.strokeStyle = '#231e16';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.ellipse(cx + 15, pawLaughY, 14, 10.5, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f5a3b7';
      ctx.beginPath();
      ctx.arc(cx + 11, pawLaughY - 3, 2.5, 0, Math.PI * 2);
      ctx.arc(cx + 17, pawLaughY - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Catone's Left Paw playfully batting a charred red bomb cap along the workbench edge!
      var capRollX = 160 + Math.sin(clockSec * 5.5) * 16;
      ctx.fillStyle = '#ef6a4c';
      ctx.beginPath();
      ctx.arc(capRollX, h - 19, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fbfaf3';
      ctx.beginPath();
      ctx.ellipse(capRollX + 20, h - 20 + Math.abs(Math.cos(clockSec * 5.5)) * -4, 13, 8.5, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      // Voluntary Exit / Victory: Both paws resting politely or waving goodbye on the workbench rim!
      var waveX = cx - 46 + Math.sin(clockSec * 5.0) * 5;
      var waveY = cy - 8 + Math.cos(clockSec * 5.0) * 3;
      ctx.fillStyle = '#fbfaf3';
      ctx.strokeStyle = '#231e16';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.ellipse(waveX, waveY, 11.5, 13.5, -0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f5a3b7';
      ctx.beginPath();
      ctx.arc(waveX, waveY - 2, 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fbfaf3';
      ctx.beginPath();
      ctx.ellipse(cx + 28, h - 16, 13, 8.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // 2. CATWHO (Black & White Masked Cat) peeking up on the right (`cx2 = 372`)
    var cx2 = 372;
    var cy2 = h + 46 - riseEase * 52 - (isExplodedTaunt ? Math.abs(Math.cos(clockSec * 15.0)) * 4.5 : Math.sin(clockSec * 4.0) * 2.5);
    ctx.fillStyle = '#1e1b18';
    ctx.strokeStyle = '#231e16';
    ctx.lineWidth = 3.2;
    // Catwho Ears
    ctx.beginPath();
    ctx.moveTo(cx2 - 30, cy2 - 26);
    ctx.lineTo(cx2 - 36, cy2 - 56);
    ctx.lineTo(cx2 - 10, cy2 - 38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx2 + 30, cy2 - 26);
    ctx.lineTo(cx2 + 36, cy2 - 56);
    ctx.lineTo(cx2 + 10, cy2 - 38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Catwho Head
    ctx.fillStyle = '#fbfaf3';
    ctx.beginPath();
    ctx.ellipse(cx2, cy2 - 18, 36, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Bandit mask patches
    ctx.fillStyle = '#1e1b18';
    ctx.beginPath();
    ctx.ellipse(cx2 - 14, cy2 - 21, 11.5, 9.5, -0.2, 0, Math.PI * 2);
    ctx.ellipse(cx2 + 14, cy2 - 21, 11.5, 9.5, 0.2, 0, Math.PI * 2);
    ctx.fill();

    if (isExplodedTaunt) {
      // Smug arched eyes on Catwho
      ctx.strokeStyle = '#8af0ae';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.arc(cx2 - 14, cy2 - 20, 6.2, Math.PI * 1.15, Math.PI * 1.85, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx2 + 14, cy2 - 20, 6.2, Math.PI * 1.15, Math.PI * 1.85, false);
      ctx.stroke();
    } else {
      // Curious round green eyes on Catwho
      ctx.fillStyle = '#8af0ae';
      ctx.beginPath();
      ctx.arc(cx2 - 14, cy2 - 21, 5.5, 0, Math.PI * 2);
      ctx.arc(cx2 + 14, cy2 - 21, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e1b18';
      ctx.beginPath();
      ctx.arc(cx2 - 14, cy2 - 21, 2.5, 0, Math.PI * 2);
      ctx.arc(cx2 + 14, cy2 - 21, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Workbench foreground lip along the bottom edge (`y = h - 12..h`)
    ctx.fillStyle = '#5c4128';
    ctx.fillRect(0, h - 12, w, 12);
    ctx.strokeStyle = '#231e16';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, h - 12);
    ctx.lineTo(w, h - 12);
    ctx.stroke();

    // 3. Compact Comic Speech Bubble (`x = 428..618, y = 24..72`) — Purely Visual 1-Liner!
    var bubX = 428;
    var bubY = 24 + (isExplodedTaunt ? snickerWave * 2.5 : Math.sin(clockSec * 4.0) * 2.0);
    drawColorfigureCard(ctx, bubX, bubY, 188, 46, 23, '#fff4d6', '#231e16', 3.5, '#41538f', 4);
    ctx.font = '900 16px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = isExplodedTaunt ? '#ef6a4c' : isVictory ? '#1f4034' : '#41538f';
    ctx.textAlign = 'center';
    var shortBubbleText = isVictory
      ? tr('PURR-FECT!', '¡MIAU-GISTRAL!')
      : isExplodedTaunt
      ? tr('MIAU-HE-HE!', '¡MIAU-JE-JE!')
      : tr('MEOW...?', '¿MIAU...?');
    ctx.fillText(shortBubbleText, bubX + 94, bubY + 29);
    ctx.textAlign = 'left';
  }

  function summonCatwhoDuoWave() {
    if (inTitleScreenMode || circuitDisarmed || bombIsDestroyed) return;
    if (catwhoPhase === 'APPROACHING' || catwhoPhase === 'DUO_PLAY' || catwhoPhase === 'DUO_SABOTAGE') {
      return;
    }
    if (catwhoPhase === 'HIDDEN' && catwhoRig) {
      catwhoRig.position.set(0.74, 0.008, -0.285);
      catwhoRig.rotation.y = -1.45;
      catwhoRig.visible = true;
    }
    catwhoPhase = 'APPROACHING';
    catwhoTimer = 3.2;
    catwhoAttackProgress = 0.0;
    catwhoAttackDuration = Math.max(2.6, 4.0 - currentLevelNum * 0.14);
    if (catwhoRig) catwhoRig.visible = true;
    if (catState !== 'LOAF_ON_BOARD' && catState !== 'EAT_KIBBLE' && catState !== 'CHASE_LASER') {
      catState = 'IDLE';
      catStateTimer = 4.2;
      catAttackProgress = 0.0;
    }
    playGameSound('catwho_meow', 0, 0.55);
    spawnClickPopup3D(
      tr('CATWHO APPROACHING!', '¡CATWHO ACERCÁNDOSE!'),
      tr('WALKING IN TO PLAY -> DUO ATTACK!', '¡VIENE CAMINANDO A JUGAR!'),
      '#38bdf8',
      0.0,
      0.14,
      -0.18,
      true
    );
    renderBombClockCanvas();
  }

  function boopCatwhoPaw() {
    if (circuitDisarmed || bombIsDestroyed) return;
    moveActionHandTo(tipiCurrentPawWorldPos.x, tipiCurrentPawWorldPos.y + 0.02, tipiCurrentPawWorldPos.z);
    pulseXrHaptics(0.8, 70);
    playGameSound('boop', 0, tipiCurrentPawWorldPos.x);
    playGameSound('catwho_meow', 0, tipiCurrentPawWorldPos.x);

    if (
      catwhoPhase === 'APPROACHING' ||
      catwhoPhase === 'DUO_SABOTAGE' ||
      catwhoPhase === 'DUO_PLAY'
    ) {
      catwhoPhase = 'LEAVING';
      catwhoTimer = 3.2;
      catwhoAttackProgress = 0.0;
      catwhoCooldown = Math.max(7.5, 14.0 - currentLevelNum * 0.6);
      totalCatSabotagesFoiled++;
      comboCount += 2;
      comboMultiplier = Math.min(10, 1 + Math.floor(comboCount / 2));
      peakComboReached = Math.max(peakComboReached, comboMultiplier);
      comboDecayTimer = 3.6;
      applyBombClickDrain(
        16.0,
        tipiCurrentPawWorldPos.x,
        tipiCurrentPawWorldPos.y,
        tipiCurrentPawWorldPos.z,
        6,
        tr('BYE CATWHO!', '¡CHAO CATWHO!'),
        true
      );
    }
    updateDomCounters();
    renderBombClockCanvas();
  }

  function getAutomaticIps() {
    if (upgAutoLevel <= 1 && upgCritLevel <= 1) return 0;
    var feverMult = goldenFeverTimer > 0 ? 5.0 : 1.0;
    var autoPart = (upgAutoLevel - 1) * 2.5 * getMilestoneMultiplier(upgAutoLevel);
    var chronoPart = (upgCritLevel - 1) * 6.0 * getMilestoneMultiplier(upgCritLevel);
    return (autoPart + chronoPart) * getPrestigeMultiplier() * feverMult;
  }

  function checkAndAwardPrestigeRebirth() {
    var earnedMp = computePrestigeMedalsFromTotal(lifetimeTotalCoins);
    if (earnedMp > prestigeMedals) {
      var gained = earnedMp - prestigeMedals;
      prestigeMedals = earnedMp;
      spawnClickPopup3D(
        tr('PRESTIGE +' + gained + ' MP', 'PRESTIGIO +' + gained + ' MP'),
        'x' + getPrestigeMultiplier().toFixed(2) + ' GLOBAL',
        '#facc15',
        0.0,
        0.10,
        0.05,
        true
      );
    }
    saveIncrementalState();
  }

  function saveIncrementalState() {
    try {
      var payload = {
        coins: Math.floor(clickerCoins),
        lifetime: Math.floor(lifetimeTotalCoins),
        mp: prestigeMedals,
        pwr: upgPowerLevel,
        auto: upgAutoLevel,
        crit: upgCritLevel,
        lang: currentLang,
        muted: audioMuted,
        ts: Date.now()
      };
      window.localStorage.setItem('bombcat_incremental_v2', JSON.stringify(payload));
    } catch (_) {}
  }

  function loadIncrementalStateAndOfflineGain() {
    try {
      clickerCoins = 0;
      lifetimeTotalCoins = 0;
      prestigeMedals = 0;
      upgPowerLevel = 1;
      upgAutoLevel = 1;
      upgCritLevel = 1;
      adaptiveSkillFactor = 1.0;
      // Always start with audio UNMUTED so a previous accidental mute never silences a new session!
      audioMuted = false;
      var raw = window.localStorage.getItem('bombcat_incremental_v2');
      if (!raw) return;
      var data = JSON.parse(raw);
      if (data.lang === 'es' || data.lang === 'en') currentLang = data.lang;
    } catch (_) {}
  }

  // ============================================================================
  // STUDIO-GRADE PROCEDURAL WEB AUDIO ENGINE (`audio-design` + `game-feel` skills)
  // Multi-Bus Mixer (`Master <- Compressor <- {Music, SFX, Voice, Ambience, Reverb}`),
  // 2-Formant Biological Feline Vocal Synthesis, Tactile Switch Transients & 3D Panning
  // ============================================================================
  function dbToLinear(db) {
    if (db <= -80) return 0.0;
    return Math.pow(10.0, db / 20.0);
  }

  function createStudioRoomImpulse(ctx, durationSec, decayRate) {
    var sr = ctx.sampleRate || 44100;
    var len = Math.max(1, Math.floor(sr * (durationSec || 0.36)));
    var buf = ctx.createBuffer(2, len, sr);
    for (var ch = 0; ch < 2; ch++) {
      var data = buf.getChannelData(ch);
      for (var i = 0; i < len; i++) {
        var t = i / len;
        // Early tabletop reflections + smooth exponential room tail
        var earlyBoost = i < sr * 0.025 ? 1.35 : 1.0;
        data[i] = (Math.random() * 2.0 - 1.0) * Math.pow(1.0 - t, decayRate || 3.2) * earlyBoost;
      }
    }
    return buf;
  }

  function createSharedNoiseBuffer(ctx) {
    var sr = ctx.sampleRate || 44100;
    var len = Math.floor(sr * 1.5);
    var buf = ctx.createBuffer(1, len, sr);
    var out = buf.getChannelData(0);
    for (var i = 0; i < len; i++) {
      out[i] = Math.random() * 2.0 - 1.0;
    }
    return buf;
  }

  function ensureAudioGraph() {
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx) {
      audioCtx = window.__earlyAudioCtx || new AudioContextClass();

      // Master Dynamics Compressor (`DynamicsCompressorNode` — glues mix & prevents clipping)
      masterCompressor = audioCtx.createDynamicsCompressor();
      var t0 = audioCtx.currentTime;
      masterCompressor.threshold.setValueAtTime(-16, t0);
      masterCompressor.knee.setValueAtTime(24, t0);
      masterCompressor.ratio.setValueAtTime(8, t0);
      masterCompressor.attack.setValueAtTime(0.003, t0);
      masterCompressor.release.setValueAtTime(0.20, t0);

      masterBusGain = audioCtx.createGain();
      musicBusGain = audioCtx.createGain();
      sfxBusGain = audioCtx.createGain();
      voiceBusGain = audioCtx.createGain();
      ambienceBusGain = audioCtx.createGain();
      wetReverbGain = audioCtx.createGain();

      // Dynamic Warm Analog Low-Pass Filter on Music Bus (keeps high frequencies silky & non-digital!)
      musicFilterNode = audioCtx.createBiquadFilter();
      musicFilterNode.type = 'lowpass';
      musicFilterNode.frequency.setValueAtTime(3800, t0);
      musicFilterNode.Q.setValueAtTime(0.70, t0);

      // Algorithmic Warm Jazz-Studio Room Reverb (`ConvolverNode` — 0.78s lush acoustic room tail)
      reverbConvolver = audioCtx.createConvolver();
      reverbConvolver.buffer = createStudioRoomImpulse(audioCtx, 0.78, 2.5);
      sharedNoiseBuffer = createSharedNoiseBuffer(audioCtx);

      // Set calibrated dB bus levels (`audio-design` skill Pattern #1)
      // Music raised to -1.2 dB (0.87 linear) + 0.48 stereo room reverb send for full, enveloping immersion on Quest speakers!
      masterBusGain.gain.value = audioMuted ? 0.0 : dbToLinear(-0.4);
      musicBusGain.gain.value = dbToLinear(-1.2);
      sfxBusGain.gain.value = dbToLinear(-1.8);
      voiceBusGain.gain.value = dbToLinear(-0.8);
      ambienceBusGain.gain.value = dbToLinear(-9.0);
      wetReverbGain.gain.value = dbToLinear(-8.5);

      var musicReverbSend = audioCtx.createGain();
      musicReverbSend.gain.value = 0.48;

      // Connect Mixing Graph:
      // Music -> musicFilterNode -> musicBusGain -> masterBusGain + reverbConvolver (enveloping 3D room warmth!)
      musicFilterNode.connect(musicBusGain);
      musicBusGain.connect(masterBusGain);
      musicBusGain.connect(musicReverbSend);
      musicReverbSend.connect(reverbConvolver);

      // SFX, Voice & Ambience -> Dry to masterBusGain + Wet send to reverbConvolver
      sfxBusGain.connect(masterBusGain);
      sfxBusGain.connect(reverbConvolver);
      voiceBusGain.connect(masterBusGain);
      voiceBusGain.connect(reverbConvolver);
      ambienceBusGain.connect(masterBusGain);

      reverbConvolver.connect(wetReverbGain);
      wetReverbGain.connect(masterBusGain);

      masterBusGain.connect(masterCompressor);
      masterCompressor.connect(audioCtx.destination);

      audioCtx.onstatechange = function () {
        if (audioCtx && audioCtx.state === 'running') {
          audioHardwareUnlocked = true;
          stopHtml5FallbackBgm();
          if (musicStepAccum < 0.25) musicStepAccum = 0.285;
        }
      };
    }
    if ((audioCtx.state === 'suspended' || audioCtx.state === 'interrupted') && !audioMuted) {
      try {
        var p = audioCtx.resume();
        if (p && typeof p.then === 'function') {
          p.then(function () {
            audioHardwareUnlocked = true;
            stopHtml5FallbackBgm();
          }).catch(function () {});
        }
      } catch (_) {}
    } else if (audioCtx.state === 'running') {
      audioHardwareUnlocked = true;
      stopHtml5FallbackBgm();
    }
    return audioCtx;
  }

  var bgmFallbackEl = null;
  var bgmFallbackPlayInFlight = false;

  function stopHtml5FallbackBgm() {
    if (!bgmFallbackEl) bgmFallbackEl = document.getElementById('bgm-autoplay-el');
    if (!bgmFallbackEl) return;
    try {
      window.__bgmHandedOffToWebAudio = true;
      bgmFallbackEl.volume = 0.0;
      if (!bgmFallbackEl.paused) bgmFallbackEl.pause();
    } catch (_) {}
  }

  function startImmediateHtml5AudioAutoplay() {
    if (!bgmFallbackEl) bgmFallbackEl = document.getElementById('bgm-autoplay-el');
    if (audioMuted || !bgmFallbackEl) return;
    if (audioCtx && audioCtx.state === 'running') {
      stopHtml5FallbackBgm();
      return;
    }
    if (bgmFallbackPlayInFlight || !bgmFallbackEl.paused) return;
    try {
      window.__bgmHandedOffToWebAudio = false;
      bgmFallbackEl.volume = 0.88;
      bgmFallbackPlayInFlight = true;
      var playPromise = bgmFallbackEl.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(function () {
            bgmFallbackPlayInFlight = false;
          })
          .catch(function () {
            bgmFallbackPlayInFlight = false;
          });
      } else {
        bgmFallbackPlayInFlight = false;
      }
    } catch (_) {
      bgmFallbackPlayInFlight = false;
    }
  }

  function unlockAndResumeAudio() {
    try {
      var ctx = ensureAudioGraph();
      if (!ctx) return;
      if (ctx.state === 'suspended' || ctx.state === 'interrupted') {
        var p = ctx.resume();
        if (p && typeof p.then === 'function') {
          p.then(function () {
            audioHardwareUnlocked = true;
            stopHtml5FallbackBgm();
            if (musicStepAccum < 0.25) musicStepAccum = 0.285;
          }).catch(function () {});
        }
      } else if (ctx.state === 'running') {
        audioHardwareUnlocked = true;
        stopHtml5FallbackBgm();
      }
      // Play a 1-sample silent buffer directly into destination during every gesture while not yet unlocked!
      if (!audioHardwareUnlocked || ctx.state !== 'running') {
        var silentBuf = ctx.createBuffer(1, 1, 22050);
        var silentSrc = ctx.createBufferSource();
        silentSrc.buffer = silentBuf;
        silentSrc.connect(ctx.destination);
        silentSrc.start(0);
        if (ctx.state === 'running') {
          audioHardwareUnlocked = true;
          stopHtml5FallbackBgm();
          if (musicStepAccum < 0.25) musicStepAccum = 0.285;
        }
      }
      // If WebAudio is still held suspended, trigger the t=0ms in-memory HTML5 WAV
      if (!ctx || ctx.state !== 'running') {
        startImmediateHtml5AudioAutoplay();
      }
    } catch (_) {}
  }

  function connectSpatialPan(ctx, sourceNode, targetBus, panX) {
    if (!ctx || !sourceNode || !targetBus) return;
    if (typeof panX === 'number' && typeof ctx.createStereoPanner === 'function') {
      try {
        var panner = ctx.createStereoPanner();
        var clampedPan = Math.max(-0.92, Math.min(0.92, panX / 0.60));
        panner.pan.setValueAtTime(clampedPan, ctx.currentTime);
        sourceNode.connect(panner);
        panner.connect(targetBus);
        return;
      } catch (_) {}
    }
    sourceNode.connect(targetBus);
  }

  function duckMusicBus(durationSec, dipDb) {
    if (!audioCtx || !musicBusGain || audioMuted) return;
    // Only duck music on major climax events (explosions / level victory fanfare) so the background music NEVER drops out during gameplay!
    if (typeof durationSec === 'number' && durationSec < 0.50) return;
    try {
      var now = audioCtx.currentTime;
      var normalLinear = dbToLinear(-1.2);
      var targetDipLinear = dbToLinear(-5.5);
      musicBusGain.gain.cancelScheduledValues(now);
      musicBusGain.gain.setValueAtTime(normalLinear, now);
      musicBusGain.gain.linearRampToValueAtTime(targetDipLinear, now + 0.04);
      musicBusGain.gain.exponentialRampToValueAtTime(normalLinear, now + Math.max(0.45, durationSec || 0.65));
    } catch (_) {}
  }

  // ============================================================================
  // WARM ACOUSTIC CHAMBER TRIO ENGINE (Zero-Digital Modal & Spectral-Decay Modeling)
  // One Single Cohesive Musical Composition in E Minor 9 at a Steady 105 BPM Groove:
  //   1. Acoustic Pizzicato Upright Contrabass (Root-Fifth Bossa/Jazz Groove)
  //   2. Close-Miked Warm Felt Upright Piano (Smooth Voice-Led Comping Chords)
  //   3. Acoustic Rosewood Marimba / Celesta Lead Melody (Lyrical Motif with Breathing Space)
  // ============================================================================
  var audioResumeRetryTimer = 0.0;

  // Cohesive 4-Bar Progression in E Minor / G Major (8 eighth-note steps per bar = 32 steps total)
  // Bar 0: Em9  | Bar 1: Am9  | Bar 2: D9sus4 -> D9  | Bar 3: Gmaj7 -> B7sus4
  var CHAMBER_CHORDS = [
    [196.00, 246.94, 293.66, 369.99], // Bar 0: Em9   (G3, B3, D4, F#4)
    [196.00, 261.63, 329.63, 392.00], // Bar 1: Am9   (G3, C4, E4, G4)
    [185.00, 261.63, 293.66, 369.99], // Bar 2: D9    (F#3, C4, D4, F#4)
    [196.00, 246.94, 293.66, 329.63]  // Bar 3: Gmaj7/B7sus (G3, B3, D4, E4)
  ];

  // Sparse, Root-Fifth Upright Contrabass Groove (0 = rest/sustain so the bass breathes naturally!)
  var CHAMBER_BASS_STEPS = [
    // Bar 0 (Em9): E2 (82.41), B2 (123.47)
    82.41,  0,      0,      123.47, 82.41,  0,      98.00,  0,
    // Bar 1 (Am9): A2 (110.00), E2 (82.41)
    110.00, 0,      0,      82.41,  110.00, 0,      123.47, 0,
    // Bar 2 (D9):  D2 (73.42), A2 (110.00)
    73.42,  0,      0,      110.00, 73.42,  0,      92.50,  0,
    // Bar 3 (Gmaj7 -> B7): G2 (98.00) -> B2 (123.47)
    98.00,  0,      0,      110.00, 123.47, 0,      92.50,  0
  ];

  // Single Lyrical Rosewood Marimba / Felt Piano Melody (Strictly chord tones + natural rests so it NEVER clashes!)
  var CHAMBER_MELODY_STEPS = [
    // Bar 0 (Em9): B4 -> G4 -> F#4 -> E4
    493.88, 0,      392.00, 0,      369.99, 0,      329.63, 0,
    // Bar 1 (Am9): E4 -> G4 -> B4 (sustains through second half of bar)
    329.63, 0,      392.00, 0,      493.88, 0,      0,      0,
    // Bar 2 (D9):  A4 -> F#4 -> D4 (sustains through second half of bar)
    440.00, 0,      369.99, 0,      293.66, 0,      0,      0,
    // Bar 3 (Gmaj7): G4 -> F#4 -> E4 (resolves warmly & rests)
    392.00, 0,      369.99, 0,      329.63, 0,      0,      0
  ];

  function playNoiseBurst(ctx, targetBus, startTime, durationSec, filterType, freqHz, qVal, peakGain, panX) {
    if (!sharedNoiseBuffer) sharedNoiseBuffer = createSharedNoiseBuffer(ctx);
    var src = ctx.createBufferSource();
    src.buffer = sharedNoiseBuffer;
    var maxOffset = Math.max(0, sharedNoiseBuffer.duration - durationSec - 0.02);
    var randOffset = Math.random() * maxOffset;

    var flt = ctx.createBiquadFilter();
    flt.type = filterType || 'bandpass';
    flt.frequency.setValueAtTime(freqHz || 1800, startTime);
    if (typeof qVal === 'number') flt.Q.setValueAtTime(qVal, startTime);

    var g = ctx.createGain();
    g.gain.setValueAtTime(peakGain || 0.12, startTime);
    g.gain.exponentialRampToValueAtTime(0.0008, startTime + durationSec);

    src.connect(flt);
    flt.connect(g);
    connectSpatialPan(ctx, g, targetBus, panX);
    src.start(startTime, randOffset, durationSec + 0.01);
  }

  // Acoustic Pizzicato Upright Contrabass (Warm wooden spruce body resonance + rapid upper-partial decay, zero synth buzz!)
  function playWarmUprightBass(ctx, targetNode, noteTime, freqHz, sustainSec) {
    // Soft flesh-finger pluck transient on wooden fingerboard (14ms low-passed at 210 Hz)
    playNoiseBurst(ctx, targetNode, noteTime, 0.014, 'lowpass', 210, 0.9, 0.075, -0.14);

    // 1. Deep Fundamental (1x) + 2. Warm Octave Gut-String Body (2x, 146-246 Hz so Quest strap speakers project warmly!)
    var osc1 = ctx.createOscillator();
    var osc2 = ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(freqHz, noteTime);
    osc2.frequency.setValueAtTime(freqHz * 2.0, noteTime);

    var g1 = ctx.createGain();
    var g2 = ctx.createGain();
    g1.gain.setValueAtTime(0.001, noteTime);
    g1.gain.linearRampToValueAtTime(0.38, noteTime + 0.014);
    g1.gain.exponentialRampToValueAtTime(0.0015, noteTime + sustainSec);

    // The 2nd harmonic blooms on the pluck and decays faster than the fundamental (natural acoustic string physics!)
    g2.gain.setValueAtTime(0.001, noteTime);
    g2.gain.linearRampToValueAtTime(0.26, noteTime + 0.010);
    g2.gain.exponentialRampToValueAtTime(0.001, noteTime + sustainSec * 0.58);

    osc1.connect(g1);
    osc2.connect(g2);
    connectSpatialPan(ctx, g1, targetNode, -0.14);
    connectSpatialPan(ctx, g2, targetNode, -0.14);

    osc1.start(noteTime);
    osc2.start(noteTime);
    osc1.stop(noteTime + sustainSec + 0.03);
    osc2.stop(noteTime + sustainSec * 0.62);
  }

  // Close-Miked Felt Upright Piano Voice (Wool-felt hammer thump + long fundamental + fast-decaying 2nd harmonic)
  function playFeltPianoVoice(ctx, targetNode, noteTime, freqHz, sustainSec, peakGain, panX) {
    // Subtle wool-felt hammer key tap (12ms low-passed at 310 Hz)
    playNoiseBurst(ctx, targetNode, noteTime, 0.012, 'lowpass', 310, 0.8, peakGain * 0.16, panX);

    var fundOsc = ctx.createOscillator();
    var overOsc = ctx.createOscillator();
    fundOsc.type = 'sine';
    overOsc.type = 'sine';
    fundOsc.frequency.setValueAtTime(freqHz, noteTime);
    overOsc.frequency.setValueAtTime(freqHz * 2.0, noteTime);

    var fundGain = ctx.createGain();
    var overGain = ctx.createGain();

    // Soft felt attack (15ms) and warm singing wooden soundboard decay
    fundGain.gain.setValueAtTime(0.0008, noteTime);
    fundGain.gain.linearRampToValueAtTime(peakGain, noteTime + 0.015);
    fundGain.gain.exponentialRampToValueAtTime(0.001, noteTime + sustainSec);

    // 2nd harmonic decays 3x faster so the note starts warm and immediately becomes velvety & pure
    overGain.gain.setValueAtTime(0.0008, noteTime);
    overGain.gain.linearRampToValueAtTime(peakGain * 0.24, noteTime + 0.010);
    overGain.gain.exponentialRampToValueAtTime(0.0008, noteTime + sustainSec * 0.34);

    fundOsc.connect(fundGain);
    overOsc.connect(overGain);
    connectSpatialPan(ctx, fundGain, targetNode, panX);
    connectSpatialPan(ctx, overGain, targetNode, panX);

    fundOsc.start(noteTime);
    overOsc.start(noteTime);
    fundOsc.stop(noteTime + sustainSec + 0.03);
    overOsc.stop(noteTime + sustainSec * 0.38);
  }

  function playFeltAcousticPianoChord(ctx, targetNode, noteTime, chordNotes, sustainSec, peakPerVoice) {
    for (var i = 0; i < chordNotes.length; i++) {
      // Gentle 7ms human pianist finger spread across the chord keys
      var strikeTime = noteTime + i * 0.007;
      var panPos = (i - 1.5) * 0.20;
      playFeltPianoVoice(ctx, targetNode, strikeTime, chordNotes[i], sustainSec, peakPerVoice, panPos);
    }
  }

  // Acoustic Rosewood Marimba Note (Arch-carved rosewood bar physics: fundamental + 4x harmonic that vanishes in 55ms!)
  function playWoodenMarimbaNote(ctx, targetNode, noteTime, freqHz, sustainSec, peakGain, panX) {
    // Soft yarn-mallet wood contact transient (10ms bandpass at 420 Hz)
    playNoiseBurst(ctx, targetNode, noteTime, 0.010, 'bandpass', 420, 1.6, peakGain * 0.22, panX);

    var barFund = ctx.createOscillator();
    var barMode4 = ctx.createOscillator();
    barFund.type = 'sine';
    barMode4.type = 'sine';
    barFund.frequency.setValueAtTime(freqHz, noteTime);
    // Real rosewood marimba bars have their second vibrational mode tuned to 4.0x (two octaves above fundamental)
    barMode4.frequency.setValueAtTime(freqHz * 4.0, noteTime);

    var gFund = ctx.createGain();
    var gMode4 = ctx.createGain();

    gFund.gain.setValueAtTime(0.001, noteTime);
    gFund.gain.linearRampToValueAtTime(peakGain, noteTime + 0.008);
    gFund.gain.exponentialRampToValueAtTime(0.001, noteTime + sustainSec);

    // The 4x woody overtone creates the authentic hollow wood "plock" in the first 55ms and then disappears completely!
    gMode4.gain.setValueAtTime(0.001, noteTime);
    gMode4.gain.linearRampToValueAtTime(peakGain * 0.18, noteTime + 0.004);
    gMode4.gain.exponentialRampToValueAtTime(0.0008, noteTime + 0.058);

    barFund.connect(gFund);
    barMode4.connect(gMode4);
    connectSpatialPan(ctx, gFund, targetNode, panX);
    connectSpatialPan(ctx, gMode4, targetNode, panX);

    barFund.start(noteTime);
    barMode4.start(noteTime);
    barFund.stop(noteTime + sustainSec + 0.02);
    barMode4.stop(noteTime + 0.065);
  }

  function updateAdaptiveSpyMusic(dt) {
    if (audioMuted) {
      window.__bgmUserMuted = true;
      stopHtml5FallbackBgm();
      return;
    }
    window.__bgmUserMuted = false;
    if (!bgmFallbackEl) {
      bgmFallbackEl = document.getElementById('bgm-autoplay-el');
      startImmediateHtml5AudioAutoplay();
    }
    // Always ensure the AudioContext exists (even on the Title Screen before any click!)
    var ctx = audioCtx || ensureAudioGraph();
    if (!ctx) return;
    if (ctx.state === 'suspended' || ctx.state === 'interrupted') {
      audioResumeRetryTimer += dt;
      if (audioResumeRetryTimer >= 0.25) {
        audioResumeRetryTimer = 0.0;
        startImmediateHtml5AudioAutoplay();
        try {
          var rp = ctx.resume();
          if (rp && typeof rp.then === 'function') {
            rp.then(function () {
              audioHardwareUnlocked = true;
              stopHtml5FallbackBgm();
              if (musicStepAccum < 0.25) musicStepAccum = 0.285;
            }).catch(function () {});
          }
        } catch (_) {}
      }
      return;
    }
    // As soon as AudioContext is running, hand off cleanly from HTML5 <audio> to the live WebAudio Chamber Trio!
    stopHtml5FallbackBgm();
    if (!musicFilterNode || !musicBusGain) return;

    // 1. Soft Acoustic Breath Purr (Filtered warm noise only — zero sawtooth oscillator so it NEVER clashes with the music!)
    var isPurringState = !inTitleScreenMode && !isEndingOverlayOpen() && (catState === 'LOAF_ON_BOARD' || catState === 'EAT_KIBBLE');
    if (isPurringState && ambienceBusGain) {
      purrAccumTimer += dt;
      if (purrAccumTimer >= 0.55) {
        purrAccumTimer = 0.0;
        try {
          playNoiseBurst(ctx, ambienceBusGain, ctx.currentTime, 0.32, 'lowpass', 195, 1.4, 0.045, catRig ? catRig.position.x : 0.0);
        } catch (_) {}
      }
    }

    // 2. Smooth Dynamic Expression (Maintains ONE unified tempo & key at all times!)
    var targetIntensity = 0.50;
    if (inTitleScreenMode || isEndingOverlayOpen()) {
      targetIntensity = 0.52;
    } else {
      var timeUrgency = Math.max(0, Math.min(1.0, (28.0 - levelTimerSec) / 22.0));
      var catThreat =
        catwhoPhase === 'DUO_SABOTAGE'
          ? 0.35
          : catState === 'PRESS_FORBIDDEN' || catState === 'SWAT_LEFT_FUSE' || catState === 'SWAT_RIGHT_FUSE'
          ? 0.25
          : 0.0;
      targetIntensity = Math.min(1.0, 0.50 + timeUrgency * 0.30 + catThreat);
    }
    musicIntensity += (targetIntensity - musicIntensity) * Math.min(1.0, dt * 2.5);

    // Keep the Music Bus analog low-pass filter warm and natural (`2600 Hz -> 3800 Hz`)
    try {
      var cutoffHz = 2600 + musicIntensity * 1200;
      musicFilterNode.frequency.setTargetAtTime(cutoffHz, ctx.currentTime, 0.18);
    } catch (_) {}

    // Steady, Locked 105 BPM Acoustic Groove (`0.285s` per eighth-note step — never warps or stumbles!)
    var stepDur = 0.285;
    musicStepAccum += dt;
    if (musicStepAccum < stepDur) return;
    musicStepAccum -= stepDur;

    try {
      var step32 = musicStepIndex % 32;
      var barIdx = Math.floor(step32 / 8) % CHAMBER_CHORDS.length;
      var barStep = step32 % 8;
      musicStepIndex++;

      // Subtle human bossa/jazz swing on odd eighth-notes (+18ms)
      var swingOffset = (step32 % 2 === 1) ? 0.018 : 0.0;
      var now = ctx.currentTime + swingOffset;

      // 1. ACOUSTIC PIZZICATO UPRIGHT BASS (Plays root-fifth groove on steps 0, 3, 4, 6)
      var bassFreq = CHAMBER_BASS_STEPS[step32];
      if (bassFreq > 0) {
        playWarmUprightBass(ctx, musicFilterNode, now, bassFreq, stepDur * 2.4);
      }

      // 2. CLOSE-MIKED WARM FELT UPRIGHT PIANO CHORDS (Plays on Beat 1 `barStep === 0` and syncopated Beat 2+ `barStep === 3`)
      var chordNotes = CHAMBER_CHORDS[barIdx];
      if (barStep === 0) {
        playFeltAcousticPianoChord(ctx, musicFilterNode, now, chordNotes, stepDur * 4.2, 0.145);
      } else if (barStep === 3) {
        playFeltAcousticPianoChord(ctx, musicFilterNode, now, chordNotes, stepDur * 2.8, 0.110);
      } else if (barStep === 6 && musicIntensity > 0.68) {
        // Gentle extra piano comp on Beat 4 during tense moments (same chord, same rhythm!)
        playFeltAcousticPianoChord(ctx, musicFilterNode, now, chordNotes, stepDur * 1.9, 0.090);
      }

      // 3. ROSEWOOD MARIMBA / FELT PIANO LEAD MELODY (Single clear melodic voice locked to the chord tones!)
      var melodyFreq = CHAMBER_MELODY_STEPS[step32];
      if (melodyFreq > 0) {
        var melPan = ((step32 % 4) - 1.5) * 0.18;
        playWoodenMarimbaNote(ctx, musicFilterNode, now, melodyFreq, stepDur * 2.6, 0.24, melPan);
      }

      // 4. SUBTLE ACOUSTIC CAJÓN & BRUSH SHAKER (Soft room percussion, zero electronic 808 pitch-sweeps!)
      if (barStep === 0 || barStep === 4) {
        // Soft wooden cajón palm tap (warm 92 Hz body resonance + soft wood tap)
        playNoiseBurst(ctx, musicFilterNode, now, 0.022, 'lowpass', 240, 1.2, 0.14, 0.0);
      }
      if (barStep % 2 === 0) {
        // Whisper-soft jazz brush sweep on coated drumhead
        playNoiseBurst(ctx, musicFilterNode, now, 0.075, 'bandpass', barStep === 2 || barStep === 6 ? 2100 : 1650, 1.8, 0.042, -0.22);
      }
    } catch (_) {}
  }

  function toggleAudioMute() {
    var wasAudiblyPlaying =
      !audioMuted &&
      ((bgmFallbackEl && !bgmFallbackEl.paused && !bgmFallbackEl.muted && bgmFallbackEl.volume > 0.05) ||
        (audioCtx && audioCtx.state === 'running' && audioHardwareUnlocked));
    if (!wasAudiblyPlaying && !audioMuted) {
      // If the browser had held audio suspended at startup, the VERY FIRST press on SOUND turns audio ON (never mutes it)!
      audioMuted = false;
    } else {
      audioMuted = !audioMuted;
    }
    window.__bgmUserMuted = audioMuted;
    audioBtnDepress = 1.0;
    if (audioMuted) {
      stopHtml5FallbackBgm();
    } else {
      unlockAndResumeAudio();
      startImmediateHtml5AudioAutoplay();
    }
    if (masterBusGain && audioCtx) {
      masterBusGain.gain.setValueAtTime(audioMuted ? 0.0 : dbToLinear(-0.4), audioCtx.currentTime);
    }
    if (!audioMuted) {
      musicStepAccum = 0.285;
      playGameSound('pad_ok', 2, 0.0);
    }
    refreshAllDynamicBadges();
    updateDomCounters();
    saveIncrementalState();
  }

  function toggleLanguage() {
    unlockAndResumeAudio();
    currentLang = currentLang === 'en' ? 'es' : 'en';
    langBtnDepress = 1.0;
    playGameSound('pad_ok', 1, 0.0);
    refreshAllDynamicBadges();
    updateDomCounters();
    renderBombClockCanvas();
    saveIncrementalState();
  }

  // True 2-Formant Biological Feline Vocal Tract Synthesizer (`playFormantCatMeow`)
  function playFormantCatMeow(ctx, now, isCatwho, panX, isShortChirp) {
    var basePitch = isCatwho ? 610 : 475;
    var peakPitch = isCatwho ? 1020 : 810;
    var endPitch = isCatwho ? 510 : 390;
    var dur = isShortChirp ? 0.20 : 0.44;
    var wobble = 0.95 + Math.random() * 0.10;

    // 1. Rich Glottal Source (Sawtooth + Triangle) with 6.5 Hz Biological Vibrato LFO
    var glottalSaw = ctx.createOscillator();
    var glottalTri = ctx.createOscillator();
    glottalSaw.type = 'sawtooth';
    glottalTri.type = 'triangle';

    glottalSaw.frequency.setValueAtTime(basePitch * wobble, now);
    glottalSaw.frequency.exponentialRampToValueAtTime(peakPitch * wobble, now + dur * 0.30);
    glottalSaw.frequency.exponentialRampToValueAtTime(endPitch * wobble, now + dur);

    glottalTri.frequency.setValueAtTime(basePitch * wobble, now);
    glottalTri.frequency.exponentialRampToValueAtTime(peakPitch * wobble, now + dur * 0.30);
    glottalTri.frequency.exponentialRampToValueAtTime(endPitch * wobble, now + dur);

    var vibLfo = ctx.createOscillator();
    var vibGain = ctx.createGain();
    vibLfo.frequency.setValueAtTime(6.8, now);
    vibGain.gain.setValueAtTime(14.0, now);
    vibLfo.connect(vibGain);
    vibGain.connect(glottalSaw.frequency);
    vibGain.connect(glottalTri.frequency);

    // 2. Parallel Vocal Tract Formant Filters: F1 (mouth opening "M -> AA -> OW") & F2 (nasal/palatal resonance)
    var formantF1 = ctx.createBiquadFilter();
    formantF1.type = 'bandpass';
    formantF1.Q.setValueAtTime(4.8, now);
    formantF1.frequency.setValueAtTime(760 * wobble, now);
    formantF1.frequency.linearRampToValueAtTime(1420 * wobble, now + dur * 0.35);
    formantF1.frequency.linearRampToValueAtTime(640 * wobble, now + dur);

    var formantF2 = ctx.createBiquadFilter();
    formantF2.type = 'bandpass';
    formantF2.Q.setValueAtTime(5.5, now);
    formantF2.frequency.setValueAtTime(1580 * wobble, now);
    formantF2.frequency.linearRampToValueAtTime(2480 * wobble, now + dur * 0.35);
    formantF2.frequency.linearRampToValueAtTime(1320 * wobble, now + dur);

    var voxGain = ctx.createGain();
    voxGain.gain.setValueAtTime(0.001, now);
    voxGain.gain.linearRampToValueAtTime(isShortChirp ? 0.24 : 0.30, now + 0.035);
    voxGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    glottalSaw.connect(formantF1);
    glottalTri.connect(formantF1);
    glottalSaw.connect(formantF2);
    formantF1.connect(voxGain);
    formantF2.connect(voxGain);
    connectSpatialPan(ctx, voxGain, voiceBusGain || sfxBusGain, panX);

    glottalSaw.start(now);
    glottalTri.start(now);
    vibLfo.start(now);
    glottalSaw.stop(now + dur + 0.02);
    glottalTri.stop(now + dur + 0.02);
    vibLfo.stop(now + dur + 0.02);
  }

  function playGameSound(kind, pitchIndex, spatialX) {
    if (audioMuted) return;
    try {
      var ctx = ensureAudioGraph();
      if (!ctx || !sfxBusGain) return;
      if (ctx.state === 'suspended' || ctx.state === 'interrupted') {
        var rp = ctx.resume();
        if (rp && typeof rp.catch === 'function') rp.catch(function () {});
      }

      var now = ctx.currentTime;
      var wobble = 0.96 + Math.random() * 0.08;
      var panX = typeof spatialX === 'number' ? spatialX : 0.0;

      if (kind === 'tick') {
        // Mechanical Pocket-Watch Escapement (Alternating Tick / Tock + Crisp Double-Tick in final 10s, zero digital sonar beep!)
        tickTockParity = 1 - tickTockParity;
        var isUrgentTick = levelTimerSec <= 10;
        var tickFreq = tickTockParity === 0 ? 1380 : 1060;
        playNoiseBurst(ctx, sfxBusGain, now, 0.015, 'bandpass', tickFreq * wobble, 6.5, isUrgentTick ? 0.14 : 0.08, -0.25);

        if (isUrgentTick) {
          // Crisp mechanical double-escapement tick 95ms later (purely mechanical, never a digital sine beep!)
          playNoiseBurst(ctx, sfxBusGain, now + 0.095, 0.013, 'bandpass', (tickFreq * 1.18) * wobble, 6.5, 0.11, -0.20);
        }
      } else if (kind === 'pad_ok') {
        // Tactile Mechanical Key Switch + Warm Rosewood Marimba Note in E Minor 9 (Matches background music key 100%!)
        var padIdx = (pitchIndex || 0) % 4;
        var padPan = PAD_DEFS[padIdx] ? PAD_DEFS[padIdx].x : panX;
        playNoiseBurst(ctx, sfxBusGain, now, 0.014, 'bandpass', 1850 * wobble, 3.8, 0.14, padPan);

        // E minor pentatonic chord tones: E4 (329.63), G4 (392.00), B4 (493.88), E5 (659.25) — no 8-bit frequency slide!
        var padMarimbaNotes = [329.63, 392.00, 493.88, 659.25];
        playWoodenMarimbaNote(ctx, sfxBusGain, now, padMarimbaNotes[padIdx], 0.28, 0.26, padPan);
      } else if (kind === 'pad_wrong' || kind === 'shock') {
        // Low Wooden Thud + Muted Brass/Relay Drop (Filtered warm lowpass, no harsh raw sawtooth!)
        playNoiseBurst(ctx, sfxBusGain, now, 0.12, 'lowpass', 420, 1.8, 0.22, panX);
        playFeltPianoVoice(ctx, sfxBusGain, now, 110.0, 0.26, 0.24, panX);
        playFeltPianoVoice(ctx, sfxBusGain, now + 0.04, 98.0, 0.28, 0.24, panX);
      } else if (kind === 'fuse_lock') {
        // Heavy Mechanical Relay Latch + Warm Acoustic Octave Fifth (E3 -> B3)
        playNoiseBurst(ctx, sfxBusGain, now, 0.028, 'lowpass', 580, 1.8, 0.24, panX);
        playWarmUprightBass(ctx, sfxBusGain, now, 164.81, 0.24);
        playWoodenMarimbaNote(ctx, sfxBusGain, now + 0.035, 246.94, 0.26, 0.22, panX);
      } else if (kind === 'boop') {
        // Soft Velvet Paw Tap + Warm Marimba Pluck + Surprised Feline "Mrrp!" Trill
        var boopPan = panX || (catRig ? catRig.position.x : 0.0);
        playNoiseBurst(ctx, sfxBusGain, now, 0.020, 'lowpass', 620, 2.0, 0.15, boopPan);
        playWoodenMarimbaNote(ctx, sfxBusGain, now, 392.00 * wobble, 0.18, 0.20, boopPan);
        playFormantCatMeow(ctx, now + 0.03, false, boopPan, true);
      } else if (kind === 'meow' || kind === 'catwho_meow') {
        var isCatwho = kind === 'catwho_meow' || (catwhoPhase === 'DUO_SABOTAGE' && Math.random() < 0.45);
        var cPan = isCatwho && catwhoRig ? catwhoRig.position.x : catRig ? catRig.position.x : panX;
        playFormantCatMeow(ctx, now, isCatwho, cPan, false);
      } else if (kind === 'laser') {
        // Soft Mechanical Switch Click + Warm Acoustic Harmonic Gliss (`x = -0.55`)
        var lPan = -0.55;
        playNoiseBurst(ctx, sfxBusGain, now, 0.018, 'bandpass', 1450, 3.0, 0.15, lPan);
        playWoodenMarimbaNote(ctx, sfxBusGain, now, 587.33, 0.20, 0.20, lPan);
        playWoodenMarimbaNote(ctx, sfxBusGain, now + 0.045, 783.99, 0.24, 0.18, lPan);
      } else if (kind === 'kibble') {
        // Staggered Ceramic Bowl Kibble Pellet Cascade + Warm Rosewood Marimba Triad in E Minor (`x = +0.48`)
        var kPan = 0.48;
        for (var kp = 0; kp < 4; kp++) {
          playNoiseBurst(
            ctx,
            sfxBusGain,
            now + kp * 0.042,
            0.022,
            'bandpass',
            (1450 + kp * 240) * wobble,
            4.5,
            0.14,
            kPan
          );
        }
        var kNotes = [329.63, 392.00, 493.88, 659.25];
        for (var kn = 0; kn < kNotes.length; kn++) {
          playWoodenMarimbaNote(ctx, sfxBusGain, now + kn * 0.052, kNotes[kn], 0.22, 0.18, kPan);
        }
      } else if (kind === 'yarn_toss' || kind === 'yarn_bat') {
        // Soft Wool Air Whoosh + Warm Wooden Kalimba Tap inside the Rolling Yarn Ball!
        var yPan = yarnPhys ? yarnPhys.x : -0.45;
        var isToss = kind === 'yarn_toss';
        playNoiseBurst(ctx, sfxBusGain, now, isToss ? 0.10 : 0.05, 'lowpass', isToss ? 580 : 780, 1.8, isToss ? 0.15 : 0.10, yPan);
        playWoodenMarimbaNote(ctx, sfxBusGain, now, isToss ? 493.88 : 587.33, 0.20, isToss ? 0.18 : 0.14, yPan);
      } else if (kind === 'win') {
        // Lush Acoustic Felt Piano & Rosewood Marimba Victory Resolution in E Minor 9 (`E4 - G4 - B4 - D5 - F#5`)
        duckMusicBus(0.65, -5.5);
        var winNotes = [329.63, 392.00, 493.88, 587.33, 739.99];
        for (var wn = 0; wn < winNotes.length; wn++) {
          var wt = now + wn * 0.065;
          var wPan = (wn - 2) * 0.18;
          playFeltPianoVoice(ctx, sfxBusGain, wt, winNotes[wn], 0.65, 0.18, wPan);
          playWoodenMarimbaNote(ctx, sfxBusGain, wt, winNotes[wn], 0.45, 0.16, wPan);
        }
      } else if (kind === 'wire_cut') {
        // Crisp Steel Shear Snip + Warm Acoustic Chord Release (No harsh sawtooth zap!)
        playNoiseBurst(ctx, sfxBusGain, now, 0.018, 'bandpass', 2400, 2.5, 0.22, panX);
        playNoiseBurst(ctx, sfxBusGain, now + 0.022, 0.06, 'lowpass', 820, 2.0, 0.16, panX);
        playWoodenMarimbaNote(ctx, sfxBusGain, now + 0.02, 493.88, 0.24, 0.20, panX);
      } else if (kind === 'explosion') {
        // 3-Stage C4 Detonation: (1) Sub-Bass Shockwave + (2) Filtered Fireball Blast Roar + (3) Shrapnel Debris Clangs
        duckMusicBus(1.25, -26.0);
        var subBoom = ctx.createOscillator();
        var midBoom = ctx.createOscillator();
        var boomGain = ctx.createGain();
        subBoom.type = 'sine';
        midBoom.type = 'sawtooth';
        subBoom.frequency.setValueAtTime(118, now);
        subBoom.frequency.exponentialRampToValueAtTime(22, now + 0.95);
        midBoom.frequency.setValueAtTime(92, now);
        midBoom.frequency.exponentialRampToValueAtTime(18, now + 0.85);
        boomGain.gain.setValueAtTime(0.48, now);
        boomGain.gain.exponentialRampToValueAtTime(0.001, now + 1.05);
        subBoom.connect(boomGain);
        midBoom.connect(boomGain);
        boomGain.connect(sfxBusGain);
        subBoom.start(now);
        midBoom.start(now);
        subBoom.stop(now + 1.08);
        midBoom.stop(now + 1.08);

        // Sweeping Low-Pass Blast Roar
        if (!sharedNoiseBuffer) sharedNoiseBuffer = createSharedNoiseBuffer(ctx);
        var blastNoise = ctx.createBufferSource();
        blastNoise.buffer = sharedNoiseBuffer;
        var blastFlt = ctx.createBiquadFilter();
        blastFlt.type = 'lowpass';
        blastFlt.frequency.setValueAtTime(3400, now);
        blastFlt.frequency.exponentialRampToValueAtTime(160, now + 1.10);
        var blastGain = ctx.createGain();
        blastGain.gain.setValueAtTime(0.44, now);
        blastGain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);
        blastNoise.connect(blastFlt);
        blastFlt.connect(blastGain);
        blastGain.connect(sfxBusGain);
        blastNoise.start(now, 0, 1.20);

        // Staggered Metallic Shrapnel Clangs across the tabletop
        for (var deb = 0; deb < 4; deb++) {
          var dtDeb = now + 0.14 + deb * 0.09;
          playNoiseBurst(
            ctx,
            sfxBusGain,
            dtDeb,
            0.045,
            'bandpass',
            1400 + deb * 420,
            7.0,
            0.16,
            (deb - 1.5) * 0.35
          );
        }
      }
    } catch (_) {}
  }

  function pulseXrHaptics(intensity, durationMs) {
    try {
      if (!renderer || !renderer.xr || !renderer.xr.getSession) return;
      var sess = renderer.xr.getSession();
      if (!sess || !sess.inputSources) return;
      for (var i = 0; i < sess.inputSources.length; i++) {
        var src = sess.inputSources[i];
        if (src && src.gamepad && src.gamepad.hapticActuators && src.gamepad.hapticActuators[0]) {
          src.gamepad.hapticActuators[0].pulse(intensity || 0.6, durationMs || 60);
        }
      }
    } catch (_) {}
  }

  // ============================================================================
  // 3D PHYSICAL STRUCTURAL DESTRUCTION & COIN PARTICLE BURST HELPERS
  // ============================================================================
  function registerDestructiblePart(obj, weight) {
    if (!obj) return;
    destructiblePartsList.push({
      obj: obj,
      weight: weight || 1.0,
      restPos: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
      restRot: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z },
      vx: 0,
      vy: 0,
      vz: 0,
      rx: 0,
      ry: 0,
      rz: 0
    });
  }

  function resetDestructibleParts() {
    bombIsDestroyed = false;
    if (scorchCraterMesh) scorchCraterMesh.visible = false;
    for (var i = 0; i < destructiblePartsList.length; i++) {
      var dp = destructiblePartsList[i];
      if (!dp.obj) continue;
      dp.obj.position.set(dp.restPos.x, dp.restPos.y, dp.restPos.z);
      dp.obj.rotation.set(dp.restRot.x, dp.restRot.y, dp.restRot.z);
      dp.vx = 0;
      dp.vy = 0;
      dp.vz = 0;
      dp.rx = 0;
      dp.ry = 0;
      dp.rz = 0;
    }
  }

  function spawnCoinBurst(originX, originY, originZ, count) {
    var spawned = 0;
    for (var i = 0; i < coinParticlesList.length && spawned < count; i++) {
      var cp = coinParticlesList[i];
      if (cp.life <= 0) {
        cp.life = 0.75 + Math.random() * 0.25;
        cp.maxLife = cp.life;
        var ang = (spawned / Math.max(1, count)) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
        var spd = 0.22 + Math.random() * 0.35;
        cp.mesh.position.set(originX, originY + 0.025, originZ);
        cp.vx = Math.cos(ang) * spd;
        cp.vy = 0.68 + Math.random() * 0.52;
        cp.vz = Math.sin(ang) * spd;
        cp.mesh.visible = true;
        spawned++;
      }
    }
  }

  function spawnClickPopup3D(mainText, subText, accentColorCss, originX, originY, originZ, isCrit) {
    // 1. Route all feedback into the Bomb's Integrated OLED Glass Screen Ribbon (Zero 3D floating text planes!)
    if (mainText || subText) {
      oledToastText = (mainText || '') + (subText ? '  |  ' + subText : '');
      oledToastColor = accentColorCss || (isCrit ? '#facc15' : '#38bdf8');
      oledToastTimer = isCrit ? 1.35 : 0.95;
    }

    // 2. Trigger a real 3D PointLight flash right on the pressed button/component!
    if (impactFlashLight && typeof originX === 'number') {
      impactFlashLight.color.set(accentColorCss || '#38bdf8');
      impactFlashLight.position.set(originX, (originY || 0.04) + 0.045, originZ || 0.08);
      impactFlashLight.intensity = isCrit ? 2.8 : 1.6;
      impactFlashTimer = 0.20;
    }
  }

  // ============================================================================
  // 3D MULTI-STAGE BOMB EXPLOSION + FULL STRUCTURAL DESTRUCTION TRIGGER
  // ============================================================================
  function triggerBombExplosion3D(scaleMult) {
    explosionScaleFactor = scaleMult || 1.0;
    explosionActiveTimer = explosionDuration;
    bombExplodedFlash = 1.0;
    tableShakeIntensity = 0.042 * explosionScaleFactor;
    bombIsDestroyed = true;
    if (scorchCraterMesh) scorchCraterMesh.visible = true;
    playGameSound('explosion');
    pulseXrHaptics(1.0, 260);

    // Deduct a hefty chunk of coins on explosion and automatically ease sequence speed!
    var lostCoins = 0;
    if (clickerCoins > 0) {
      lostCoins = Math.min(clickerCoins, Math.max(15, Math.ceil(clickerCoins * 0.45)));
      clickerCoins = Math.max(0, clickerCoins - lostCoins);
    }
    adaptiveSkillFactor = Math.max(0.72, adaptiveSkillFactor - 0.14);
    if (clickerCoins <= 0) {
      spawnClickPopup3D(
        tr('BOOM! 0 COINS LEFT!', '¡BÚM! ¡SIN MONEDAS!'),
        tr('GAME OVER — MATCH ENDED', 'FIN DEL JUEGO — PARTIDA TERMINADA'),
        '#ef4444',
        0.0,
        0.10,
        0.06,
        true
      );
    } else if (lostCoins > 0) {
      spawnClickPopup3D(
        tr('BOOM! -$' + lostCoins + ' COINS!', '¡BÚM! -$' + lostCoins + ' MONEDAS!'),
        tr('BALANCE: $' + clickerCoins, 'SALDO: $' + clickerCoins),
        '#ef4444',
        0.0,
        0.10,
        0.06,
        true
      );
    }
    refreshAllDynamicBadges();
    updateDomCounters();
    renderBombClockCanvas();

    // 1. Blast every physical bomb part (buttons, C4 blocks, lid, gauges, rails) outward onto the workbench!
    for (var p = 0; p < destructiblePartsList.length; p++) {
      var dp = destructiblePartsList[p];
      if (!dp.obj) continue;
      var dx = dp.restPos.x;
      var dz = dp.restPos.z - 0.01;
      var dist = Math.max(0.05, Math.hypot(dx, dz));
      var invW = 1.0 / Math.max(0.6, dp.weight);
      var outSpd = (0.14 + Math.random() * 0.22) * explosionScaleFactor * invW;
      dp.vx = (dx / dist) * outSpd + (Math.random() - 0.5) * 0.12;
      dp.vy = (0.72 + Math.random() * 0.68) * explosionScaleFactor * invW;
      dp.vz = (dz / dist) * outSpd + (Math.random() - 0.5) * 0.12;
      dp.rx = (Math.random() - 0.5) * 9.0 * invW;
      dp.ry = (Math.random() - 0.5) * 9.0 * invW;
      dp.rz = (Math.random() - 0.5) * 9.0 * invW;
    }

    if (!explosionGroup) return;
    explosionGroup.visible = true;

    for (var i = 0; i < explosionDebrisList.length; i++) {
      var d = explosionDebrisList[i];
      var ang = (i / explosionDebrisList.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      var spd = (0.65 + Math.random() * 1.35) * explosionScaleFactor;
      d.mesh.position.set(
        (Math.random() - 0.5) * 0.14,
        0.04 + Math.random() * 0.05,
        (Math.random() - 0.5) * 0.10
      );
      d.vx = Math.cos(ang) * spd;
      d.vy = (0.85 + Math.random() * 1.55) * explosionScaleFactor;
      d.vz = Math.sin(ang) * spd;
      d.rx = (Math.random() - 0.5) * 22;
      d.ry = (Math.random() - 0.5) * 22;
      d.rz = (Math.random() - 0.5) * 22;
      d.mesh.visible = true;
    }

    for (var s = 0; s < explosionSmokeList.length; s++) {
      var sm = explosionSmokeList[s];
      var sAng = (s / explosionSmokeList.length) * Math.PI * 2;
      var sRad = 0.03 + (s % 3) * 0.035;
      sm.mesh.position.set(Math.cos(sAng) * sRad, 0.04 + (s % 4) * 0.015, Math.sin(sAng) * sRad - 0.02);
      sm.vx = Math.cos(sAng) * (0.08 + Math.random() * 0.10);
      sm.vy = 0.14 + Math.random() * 0.15;
      sm.vz = Math.sin(sAng) * (0.06 + Math.random() * 0.08) - 0.03;
      sm.baseScale = (0.55 + Math.random() * 0.45) * explosionScaleFactor;
      sm.mesh.scale.set(0.25, 0.25, 0.25);
      sm.mesh.visible = true;
    }
  }

  // ============================================================================
  // TACTILE BOMB-CLICKER, UPGRADE STATIONS & CAT DEFENSE MECHANICS
  // ============================================================================
  function isCircuitReadyToDisarm() {
    var spec = getSpec();
    var chargeDrained = bombCurrentCharge <= 0.01 || sequenceStepIndex >= spec.sequence.length;
    var leftOk = !spec.needsLeftFuse || fuseLeftLocked;
    var rightOk = !spec.needsRightFuse || fuseRightLocked;
    var notLoafing = catState !== 'LOAF_ON_BOARD';
    return chargeDrained && leftOk && rightOk && notLoafing;
  }

  function moveActionHandTo(x, y, z) {
    actionHandTargetPos = { x: x, y: y, z: z };
    actionHandTargetTimer = 0.45;
  }

  function applyBombClickDrain(baseAmount, originX, originY, originZ, coinBonus, customLabel, isCrit) {
    if (circuitDisarmed || bombIsDestroyed) return;
    totalClicksCount++;
    clickBarFlashTimer = 0.22;
    var spec = getSpec();
    var drain = getManualTapPower(baseAmount);
    bombCurrentCharge = Math.max(0, bombCurrentCharge - drain);

    // Sync sequenceStepIndex proportionally with charge drained so legacy counters & bulbs progress smoothly
    var pctDone = 1.0 - bombCurrentCharge / Math.max(1.0, bombMaxCharge);
    var syncedSteps = Math.min(spec.sequence.length, Math.floor(pctDone * spec.sequence.length + 0.02));
    if (bombCurrentCharge <= 0.01) {
      syncedSteps = spec.sequence.length;
      bombCurrentCharge = 0;
    }
    if (syncedSteps > sequenceStepIndex) {
      sequenceStepIndex = syncedSteps;
    }

    var feverMult = goldenFeverTimer > 0 ? 5.0 : 1.0;
    var earnedCoins = Math.max(
      1,
      Math.round((coinBonus || 1) * comboMultiplier * getPrestigeMultiplier() * feverMult)
    );
    clickerCoins += earnedCoins;
    lifetimeTotalCoins += earnedCoins;
    spawnCoinBurst(originX, originY, originZ, Math.min(8, earnedCoins));

    var dmgInt = Math.max(1, Math.round((drain / Math.max(1.0, bombMaxCharge)) * 100));
    var topTxt = customLabel || (isCrit ? 'CRIT -' + dmgInt + '%' : '-' + dmgInt + '%');
    var subTxt = '+$' + earnedCoins + (comboMultiplier > 1 ? ' [x' + comboMultiplier + ']' : '');
    var colCss = goldenFeverTimer > 0 || isCrit ? '#facc15' : '#38bdf8';
    spawnClickPopup3D(topTxt, subTxt, colCss, originX, originY, originZ, !!isCrit);

    refreshAllDynamicBadges();
    updateDomCounters();
    renderBombClockCanvas();
  }

  function upgradeAutoClickerStation() {
    pressKibbleGadget();
  }

  function cutSurgeWire() {
    if (circuitDisarmed || surgeWireSevered || bombIsDestroyed) return;
    surgeWireSevered = true;
    if (surgeWireIntactMesh) surgeWireIntactMesh.visible = false;
    if (surgeWireCutLeftMesh) surgeWireCutLeftMesh.visible = true;
    if (surgeWireCutRightMesh) surgeWireCutRightMesh.visible = true;
    wireSparksTimer = 0.75;
    if (wireSparksGroup) {
      wireSparksGroup.position.set(-0.115, 0.068, -0.088);
      wireSparksGroup.visible = true;
    }

    moveActionHandTo(-0.115, 0.08, -0.088);
    playGameSound('wire_cut', 0, -0.18);
    pulseXrHaptics(0.85, 80);

    // VR Spatial Wire-Chop Bonus: +5s on Bomb Clock + Massive 25% Charge Drain + Gold Coins!
    levelTimerSec = Math.min(99.0, levelTimerSec + 5.0);
    comboCount += 3;
    comboMultiplier = Math.min(10, 1 + Math.floor(comboCount / 2));
    comboDecayTimer = 3.8;
    applyBombClickDrain(bombMaxCharge * 0.25, -0.115, 0.075, -0.088, 6, '-25% +5s', true);
  }

  function cutTrapWire() {
    if (circuitDisarmed || trapWireSevered || bombIsDestroyed) return;
    // If a cat is reaching for the Red Bomb Button or Fuses, touching near the red wire boops the cat's paw instead of exploding!
    if (
      catState === 'PRESS_FORBIDDEN' ||
      catState === 'SWAT_LEFT_FUSE' ||
      catState === 'SWAT_RIGHT_FUSE' ||
      catwhoPhase === 'DUO_SABOTAGE'
    ) {
      boopCatPaw();
      return;
    }
    trapWireSevered = true;
    if (trapWireIntactMesh) trapWireIntactMesh.visible = false;
    if (trapWireCutLeftMesh) trapWireCutLeftMesh.visible = true;
    if (trapWireCutRightMesh) trapWireCutRightMesh.visible = true;
    wireSparksTimer = 0.85;
    if (wireSparksGroup) {
      wireSparksGroup.position.set(0.115, 0.068, -0.088);
      wireSparksGroup.visible = true;
    }

    moveActionHandTo(0.115, 0.08, -0.088);
    playGameSound('boop');
    pulseXrHaptics(0.55, 50);
    applyBombClickDrain(6.0, 0.115, 0.075, -0.088, 2, tr('WIRE CUT!', '¡CABLE CORTADO!'), false);
  }

  function pressColorPad(padIdx) {
    // Prevent accidental match restarts when the 10/10 Final Scoreboard is open!
    if (isEndingOverlayOpen()) return;
    if (inTitleScreenMode) {
      startGameFromTitleScreen();
      return;
    }
    if (circuitDisarmed || bombIsDestroyed) return;
    var pad = PAD_DEFS[padIdx];
    if (!pad) return;

    padDepress[padIdx] = 1.0;
    moveActionHandTo(pad.x, pad.y + 0.04, pad.z);
    pulseXrHaptics(0.55, 45);

    if (catState === 'LOAF_ON_BOARD') {
      playGameSound('meow');
      spawnClickPopup3D(
        tr('BLOCKED', 'BLOQUEADO'),
        tr('USE TREATS ->', 'USA COMIDA ->'),
        '#f97316',
        pad.x,
        pad.y + 0.03,
        pad.z,
        true
      );
      return;
    }

    // If charge is already 0% and coils are locked, tapping any pad also completes the level so level progression is seamless!
    if (isCircuitReadyToDisarm()) {
      pressMasterDisarm();
      return;
    }

    var isCriticalHit = padIdx === activeTargetPadIndex;
    if (isCriticalHit) {
      comboCount++;
      comboMultiplier = Math.min(10, 1 + Math.floor(comboCount / 2));
      peakComboReached = Math.max(peakComboReached, comboMultiplier);
      comboDecayTimer = 3.4;
      adaptiveSkillFactor = Math.min(1.85, adaptiveSkillFactor + 0.035);

      var critMult = 1.0 + (upgCritLevel - 1) * 0.42;
      applyBombClickDrain(15.5 * critMult, pad.x, pad.y + 0.03, pad.z, 3, null, true);
      playGameSound('pad_ok', padIdx);

      // Hop the Critical Target to a different button and reset the automatic sequence step timer!
      var nextTarget = (activeTargetPadIndex + 1 + Math.floor(Math.random() * 3)) % PAD_DEFS.length;
      activeTargetPadIndex = nextTarget;
      seqStepDuration = getCurrentSeqStepDuration();
      seqStepTimer = seqStepDuration;
    } else {
      adaptiveSkillFactor = Math.max(0.72, adaptiveSkillFactor - 0.02);
      comboDecayTimer = Math.max(comboDecayTimer, 2.0);
      applyBombClickDrain(6.5, pad.x, pad.y + 0.03, pad.z, 1, null, false);
      playGameSound('pad_ok', padIdx);
    }
  }

  function pressFuseModule(side) {
    if (isEndingOverlayOpen()) return;
    if (inTitleScreenMode) {
      startGameFromTitleScreen();
      return;
    }
    if (circuitDisarmed || bombIsDestroyed) return;
    if (side === 'left') {
      fuseLeftLocked = true;
      fuseLeftKnockAnim = 0.0;
      moveActionHandTo(-0.40, 0.08, -0.07);
      playGameSound('fuse_lock', 0, -0.45);
      pulseXrHaptics(0.7, 60);
      applyBombClickDrain(9.5, -0.40, 0.07, -0.07, 2, tr('COIL OK!', 'BOBINA OK!'), true);
      if (catState === 'SWAT_LEFT_FUSE') {
        catState = 'BOOPED_RETREAT';
        catStateTimer = 1.6;
        catAttackProgress = 0;
        totalCatSabotagesFoiled++;
      }
      if (catwhoPhase === 'DUO_SABOTAGE' && catwhoTargetAction === 'SWAT_LEFT_FUSE') {
        boopCatwhoPaw();
      }
    } else if (side === 'right') {
      fuseRightLocked = true;
      fuseRightKnockAnim = 0.0;
      moveActionHandTo(0.40, 0.08, -0.07);
      playGameSound('fuse_lock', 0, 0.45);
      pulseXrHaptics(0.7, 60);
      applyBombClickDrain(9.5, 0.40, 0.07, -0.07, 2, tr('COIL OK!', 'BOBINA OK!'), true);
      if (catState === 'SWAT_RIGHT_FUSE') {
        catState = 'BOOPED_RETREAT';
        catStateTimer = 1.6;
        catAttackProgress = 0;
        totalCatSabotagesFoiled++;
      }
      if (catwhoPhase === 'DUO_SABOTAGE' && catwhoTargetAction === 'SWAT_RIGHT_FUSE') {
        boopCatwhoPaw();
      }
    }
    updateDomCounters();
  }

  function boopCatPaw() {
    if (isEndingOverlayOpen()) return;
    if (inTitleScreenMode) {
      startGameFromTitleScreen();
      return;
    }
    if (circuitDisarmed || bombIsDestroyed) return;
    moveActionHandTo(catCurrentPawLocalPos.x, catCurrentPawLocalPos.y + 0.02, catCurrentPawLocalPos.z);
    pulseXrHaptics(0.75, 65);

    if (catwhoPhase === 'DUO_SABOTAGE' || catwhoPhase === 'DUO_PLAY') {
      boopCatwhoPaw();
    }

    if (catState === 'LOAF_ON_BOARD') {
      if (clickerCoins < getFishUpgradeCost()) {
        catState = 'BOOPED_RETREAT';
        catStateTimer = 1.8;
        catAttackProgress = 0.0;
        totalCatSabotagesFoiled++;
        playGameSound('boop');
        playGameSound('meow');
        spawnClickPopup3D(
          tr('NUDGED CATONE!', '¡DESPERTASTE A CATONE!'),
          tr('BOARD CLEARED', 'TABLERO DESPEJADO'),
          '#34d399',
          0,
          0.11,
          0.06,
          true
        );
        return;
      }
      playGameSound('meow');
      spawnClickPopup3D(
        tr('SLEEPING CATONE', 'CATONE DORMIDO'),
        tr('USE TREATS ->', 'USA COMIDA ->'),
        '#f97316',
        0,
        0.11,
        0.06,
        true
      );
      return;
    }

    if (
      catState === 'SWAT_LEFT_FUSE' ||
      catState === 'SWAT_RIGHT_FUSE' ||
      catState === 'PRESS_FORBIDDEN'
    ) {
      catState = 'BOOPED_RETREAT';
      catStateTimer = 2.4;
      catAttackProgress = 0.0;
      totalCatSabotagesFoiled++;
      comboCount += 2;
      comboMultiplier = Math.min(10, 1 + Math.floor(comboCount / 2));
      peakComboReached = Math.max(peakComboReached, comboMultiplier);
      comboDecayTimer = 3.5;
      applyBombClickDrain(
        14.0,
        catCurrentPawLocalPos.x,
        catCurrentPawLocalPos.y,
        catCurrentPawLocalPos.z,
        5,
        tr('SHOO CATONE!', '¡FUERA CATONE!'),
        true
      );
      playGameSound('boop');
      playGameSound('meow');
    } else {
      // Petting Catone while he is peaceful/idle only triggers a cute meow (zero free coins or bomb drain!)
      playGameSound('boop');
      spawnClickPopup3D(
        tr('MEOW! ~', '¡MIAU! ~'),
        tr('WAIT FOR SABOTAGE!', '¡SOLO AL SABOTEAR!'),
        '#f472b6',
        0,
        0.09,
        -0.18,
        false
      );
    }
    updateDomCounters();
  }

  function pressLaserGadget() {
    if (isEndingOverlayOpen()) return;
    if (inTitleScreenMode) {
      startGameFromTitleScreen();
      return;
    }
    if (circuitDisarmed || bombIsDestroyed) return;
    laserBtnDepress = 1.0;
    moveActionHandTo(-0.55, 0.075, 0.05);
    pulseXrHaptics(0.65, 55);

    var upgCost = getLaserUpgradeCost();
    if (clickerCoins < upgCost) {
      playGameSound('pad_wrong');
      spawnClickPopup3D(
        clickerCoins <= 0
          ? tr('NO COINS FOR LASER!', '¡SIN MONEDAS PARA LÁSER!')
          : tr('LASER COSTS $' + upgCost, 'LÁSER CUESTA $' + upgCost),
        tr('NEED $' + upgCost + ' COINS', 'FALTAN $' + upgCost + ' MONEDAS'),
        '#ef4444',
        -0.55,
        0.08,
        0.05,
        true
      );
      refreshAllDynamicBadges();
      updateDomCounters();
      renderBombClockCanvas();
      return;
    }

    clickerCoins -= upgCost;
    var oldMile = getMilestoneMultiplier(upgPowerLevel);
    upgPowerLevel++;
    var newMile = getMilestoneMultiplier(upgPowerLevel);
    var milestoneUnlocked = newMile > oldMile;
    saveIncrementalState();
    playGameSound('laser');
    playGameSound('win');

    laserActiveTimer = 5.5 + Math.min(12, upgPowerLevel * 0.45);
    if (catState !== 'LOAF_ON_BOARD') {
      if (catState === 'SWAT_LEFT_FUSE' || catState === 'SWAT_RIGHT_FUSE' || catState === 'PRESS_FORBIDDEN') {
        totalCatSabotagesFoiled++;
      }
      catState = 'CHASE_LASER';
      catStateTimer = laserActiveTimer;
      catAttackProgress = 0.0;
    }
    if (
      catwhoPhase === 'APPROACHING' ||
      catwhoPhase === 'DUO_SABOTAGE' ||
      catwhoPhase === 'DUO_PLAY'
    ) {
      totalCatSabotagesFoiled++;
      catwhoPhase = 'LEAVING';
      catwhoTimer = 3.2;
      catwhoAttackProgress = 0.0;
      catwhoCooldown = Math.max(8.0, 14.0 - currentLevelNum * 0.5);
    }
    spawnClickPopup3D(
      milestoneUnlocked
        ? tr('TIER x' + getMilestoneMultiplier(upgPowerLevel) + '!', '¡ESCALÓN x' + getMilestoneMultiplier(upgPowerLevel) + '!')
        : tr('LASER ACTIVE! -$' + upgCost, '¡LÁSER ACTIVO! -$' + upgCost),
      tr('LEVEL ' + upgPowerLevel, 'NIVEL ' + upgPowerLevel),
      '#facc15',
      -0.55,
      0.08,
      0.05,
      true
    );
    refreshAllDynamicBadges();
    updateDomCounters();
    renderBombClockCanvas();
  }

  function pressKibbleGadget() {
    if (isEndingOverlayOpen()) return;
    if (inTitleScreenMode) {
      startGameFromTitleScreen();
      return;
    }
    if (circuitDisarmed || bombIsDestroyed) return;
    kibbleBtnDepress = 1.0;
    moveActionHandTo(0.52, 0.075, 0.27);
    pulseXrHaptics(0.65, 60);

    var upgCost = getFishUpgradeCost();
    if (clickerCoins < upgCost) {
      playGameSound('pad_wrong');
      spawnClickPopup3D(
        clickerCoins <= 0
          ? tr('NO COINS FOR TREATS!', '¡SIN MONEDAS PARA CROQUETAS!')
          : tr('TREATS COST $' + upgCost, 'CROQUETAS CUESTAN $' + upgCost),
        tr('NEED $' + upgCost + ' COINS', 'FALTAN $' + upgCost + ' MONEDAS'),
        '#ef4444',
        0.52,
        0.08,
        0.27,
        true
      );
      refreshAllDynamicBadges();
      updateDomCounters();
      renderBombClockCanvas();
      return;
    }

    clickerCoins -= upgCost;
    var oldMile = getMilestoneMultiplier(upgAutoLevel);
    upgAutoLevel++;
    var newMile = getMilestoneMultiplier(upgAutoLevel);
    var milestoneUnlocked = newMile > oldMile;
    saveIncrementalState();
    playGameSound('kibble');
    playGameSound('meow');

    if (catState === 'LOAF_ON_BOARD' || catState === 'SWAT_LEFT_FUSE' || catState === 'SWAT_RIGHT_FUSE' || catState === 'PRESS_FORBIDDEN') {
      totalCatSabotagesFoiled++;
    }
    kibbleActiveTimer = 6.0 + Math.min(12, upgAutoLevel * 0.45);
    if (kibblePelletsGroup) kibblePelletsGroup.visible = true;
    catState = 'EAT_KIBBLE';
    catStateTimer = kibbleActiveTimer;
    catAttackProgress = 0.0;
    if (
      catwhoPhase === 'APPROACHING' ||
      catwhoPhase === 'DUO_SABOTAGE' ||
      catwhoPhase === 'DUO_PLAY'
    ) {
      totalCatSabotagesFoiled++;
      catwhoPhase = 'LEAVING';
      catwhoTimer = 3.2;
      catwhoAttackProgress = 0.0;
      catwhoCooldown = Math.max(8.0, 14.0 - currentLevelNum * 0.5);
    }
    spawnClickPopup3D(
      milestoneUnlocked
        ? tr('TIER x' + getMilestoneMultiplier(upgAutoLevel) + '!', '¡ESCALÓN x' + getMilestoneMultiplier(upgAutoLevel) + '!')
        : tr('TREATS! -$' + upgCost, '¡CROQUETAS! -$' + upgCost),
      '+' + getAutomaticIps().toFixed(1) + '/s (LV.' + upgAutoLevel + ')',
      '#facc15',
      0.52,
      0.08,
      0.27,
      true
    );
    refreshAllDynamicBadges();
    updateDomCounters();
    renderBombClockCanvas();
  }

  function buyChronoOverclockUpgrade() {
    if (isEndingOverlayOpen()) return;
    if (inTitleScreenMode) {
      startGameFromTitleScreen();
      return;
    }
    if (circuitDisarmed || bombIsDestroyed) return;
    yarnBtnDepress = 1.0;
    moveActionHandTo(-0.52, 0.075, 0.27);
    pulseXrHaptics(0.75, 65);
    var cost = getChronoUpgradeCost();
    if (clickerCoins >= cost) {
      clickerCoins -= cost;
      var oldMile = getMilestoneMultiplier(upgCritLevel);
      upgCritLevel++;
      var newMile = getMilestoneMultiplier(upgCritLevel);
      var milestoneUnlocked = newMile > oldMile;
      levelTimerSec = Math.min(99.0, levelTimerSec + 3.0);
      yarnActiveTimer = 11.5 + Math.min(8.0, upgCritLevel * 0.5);
      spawnYarnBallWithPhysics();
      if (
        catState === 'LOAF_ON_BOARD' ||
        catState === 'SWAT_LEFT_FUSE' ||
        catState === 'SWAT_RIGHT_FUSE' ||
        catState === 'PRESS_FORBIDDEN'
      ) {
        totalCatSabotagesFoiled++;
      }
      catState = 'PLAY_YARN';
      catStateTimer = yarnActiveTimer;
      catAttackProgress = 0.0;
      if (
        catwhoPhase === 'APPROACHING' ||
        catwhoPhase === 'DUO_SABOTAGE' ||
        catwhoPhase === 'DUO_PLAY'
      ) {
        totalCatSabotagesFoiled++;
        catwhoPhase = 'PLAY_YARN';
        catwhoTimer = yarnActiveTimer;
        catwhoAttackProgress = 0.0;
      }
      saveIncrementalState();
      playGameSound('yarn_toss');
      playGameSound('win');
      playGameSound('meow');
      spawnCoinBurst(-0.52, 0.07, 0.27, 6);
      spawnClickPopup3D(
        milestoneUnlocked
          ? tr('YARN TIER x' + newMile + '!', '¡MADEJA ESCALÓN x' + newMile + '!')
          : tr('CAT YARN! -$' + cost, '¡MADEJA DE LANA! -$' + cost),
        tr('CATS ENTERTAINED (' + Math.round(yarnActiveTimer) + 's)', 'GATOS ENTRETENIDOS (' + Math.round(yarnActiveTimer) + 's)'),
        '#76a0e2',
        -0.52,
        0.08,
        0.27,
        true
      );
    } else {
      // Even without enough coins for a level-up upgrade, immediately toss out the 3D Yarn Ball for a 6s roll!
      yarnActiveTimer = Math.max(yarnActiveTimer, 6.0);
      spawnYarnBallWithPhysics();
      if (
        catState === 'LOAF_ON_BOARD' ||
        catState === 'SWAT_LEFT_FUSE' ||
        catState === 'SWAT_RIGHT_FUSE' ||
        catState === 'PRESS_FORBIDDEN'
      ) {
        totalCatSabotagesFoiled++;
      }
      catState = 'PLAY_YARN';
      catStateTimer = yarnActiveTimer;
      catAttackProgress = 0.0;
      playGameSound('boop');
      playGameSound('meow');
      spawnClickPopup3D(
        tr('YARN TOSSED! (6s)', '¡LANA LANZADA! (6s)'),
        tr('UPGRADE LV.' + (upgCritLevel + 1) + ': $' + cost, 'MEJORAR NV.' + (upgCritLevel + 1) + ': $' + cost),
        '#76a0e2',
        -0.52,
        0.08,
        0.27,
        true
      );
    }
    refreshAllDynamicBadges();
    updateDomCounters();
    renderBombClockCanvas();
  }

  var userManuallyExitedXr = false;
  var lastXrExitTimeMs = 0;
  var xrSessionRequestInFlight = false;
  var hasAutoLaunchedXrOnce = false;
  var xrExitInProgress = false;

  function triggerExitXrOrEndMatch() {
    if (xrExitInProgress) return;
    exitXrBtnDepress = 1.0;
    userManuallyExitedXr = true;
    lastXrExitTimeMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    moveActionHandTo(0.66, 0.05, -0.07);
    pulseXrHaptics(0.85, 80);
    playGameSound('boop');
    if (renderer && renderer.xr) {
      var activeSess = renderer.xr.getSession();
      if (activeSess) {
        xrExitInProgress = true;
        try {
          var p = activeSess.end();
          if (p && typeof p.catch === 'function') p.catch(function () {});
        } catch (_) {}
        setTimeout(function () {
          xrExitInProgress = false;
        }, 400);
        return;
      }
    }
    openFinalScoreboardModal(false);
  }

  function buyShopUpgrade(slotIdx) {
    if (slotIdx === 1) {
      pressLaserGadget();
    } else if (slotIdx === 2) {
      pressKibbleGadget();
    } else if (slotIdx === 3) {
      buyChronoOverclockUpgrade();
    } else {
      // Auto-pick whichever affordable upgrade the player can buy right now!
      if (clickerCoins >= getChronoUpgradeCost()) buyChronoOverclockUpgrade();
      else if (clickerCoins >= getFishUpgradeCost()) pressKibbleGadget();
      else pressLaserGadget();
    }
  }

  function triggerForbiddenButtonPenalty() {
    if (circuitDisarmed || bombIsDestroyed) return;
    forbiddenDepress = 1.0;
    comboCount = 0;
    comboMultiplier = 1;
    bombCurrentCharge = Math.min(bombMaxCharge, bombCurrentCharge + bombMaxCharge * 0.25);
    levelTimerSec = Math.max(2.5, levelTimerSec - 6.0);
    checkAndAwardPrestigeRebirth();
    triggerBombExplosion3D(1.15);
    levelResetPendingTimer = 1.85;
    playGameSound('meow');
    updateDomCounters();
  }

  function pressMasterDisarm() {
    if (isEndingOverlayOpen()) {
      if (clockSec - endingModalOpenTime < 2.4) return;
      startGameFromTitleScreen();
      return;
    }
    if (inTitleScreenMode) {
      startGameFromTitleScreen();
      return;
    }
    if (circuitDisarmed || bombIsDestroyed) return;
    masterBarDepress = 1.0;
    moveActionHandTo(0.0, 0.07, 0.235);
    pulseXrHaptics(0.9, 100);

    if (!isCircuitReadyToDisarm()) {
      applyBombClickDrain(10.5, 0.0, 0.05, 0.235, 2, tr('DRAIN!', '¡DESCARGA!'), false);
      playGameSound('fuse_lock');
      if (!isCircuitReadyToDisarm()) return;
    }

    // BOMB TIMER STOPPED — LEVEL COMPLETED, JACKPOT COIN FOUNTAIN & PRESTIGE CHECK!
    circuitDisarmed = true;
    catState = 'IDLE';
    catAttackProgress = 0.0;
    catwhoPhase = 'HIDDEN';
    if (catwhoRig) catwhoRig.visible = false;

    totalBombsDisarmed++;
    adaptiveSkillFactor = Math.min(1.85, adaptiveSkillFactor + 0.05);
    matchScore += Math.round(levelTimerSec * 25) + currentLevelNum * 300;
    var completedLvl = currentLevelNum;
    if (completedLvl < LEVEL_SPECS.length) {
      maxLevelReached = Math.max(maxLevelReached, completedLvl + 1);
    } else {
      maxLevelReached = LEVEL_SPECS.length;
    }

    var bonusJackpot = Math.round((25 + currentLevelNum * 12) * getPrestigeMultiplier());
    clickerCoins += bonusJackpot;
    lifetimeTotalCoins += bonusJackpot;
    checkAndAwardPrestigeRebirth();
    spawnCoinBurst(0.0, 0.06, 0.08, 16);
    spawnClickPopup3D(
      completedLvl >= LEVEL_SPECS.length
        ? tr('MAX LEVEL 10/10 CLEARED!', '¡NIVEL MÁXIMO 10/10 SUPERADO!')
        : tr('LEVEL ' + completedLvl + '/10 CLEARED! -> LV.' + (completedLvl + 1), '¡NIVEL ' + completedLvl + '/10 SUPERADO! -> NV.' + (completedLvl + 1)),
      '+$' + bonusJackpot,
      '#43c25c',
      0.0,
      0.08,
      0.14,
      true
    );
    playGameSound('win');
    engine.triggerTemporalHandoff({ dockAtReceptacle: true });
    engine.triggerTemporalHighFive({ syncDeltaMs: 18 });
    refreshAllDynamicBadges();
    updateDomCounters();
    renderBombClockCanvas();

    setTimeout(function () {
      if (!circuitDisarmed) return;
      if (completedLvl < LEVEL_SPECS.length) {
        loadLevelByNumber(completedLvl + 1);
      } else {
        // Maximum Level (10/10) Completed -> Automatically display Final Scoreboard & Credits!
        openFinalScoreboardModal(true);
      }
    }, 1500);
  }

  function performSmartNextStep() {
    if (inTitleScreenMode) {
      startGameFromTitleScreen();
      return;
    }
    var spec = getSpec();
    if (catwhoPhase === 'DUO_SABOTAGE') {
      boopCatwhoPaw();
      return;
    }
    if (catState === 'LOAF_ON_BOARD') {
      pressKibbleGadget();
      return;
    }
    if (
      catState === 'SWAT_LEFT_FUSE' ||
      catState === 'SWAT_RIGHT_FUSE' ||
      catState === 'PRESS_FORBIDDEN'
    ) {
      boopCatPaw();
      return;
    }
    if (spec.needsLeftFuse && !fuseLeftLocked) {
      pressFuseModule('left');
      return;
    }
    if (spec.needsRightFuse && !fuseRightLocked) {
      pressFuseModule('right');
      return;
    }
    if (!isCircuitReadyToDisarm()) {
      pressColorPad(activeTargetPadIndex);
      return;
    }
    pressMasterDisarm();
  }

  function updateDomCounters() {
    document.title = tr('Paws & Wires: Catone & Catwho', 'Patas y Cables: Catone & Catwho');
    var figTitle = document.getElementById('app-main-title');
    if (figTitle) {
      figTitle.textContent =
        tr('Paws & Wires: Catone & Catwho — Level ', 'Patas y Cables: Catone & Catwho — Nivel ') + currentLevelNum + '/10';
    }
    var scoreHands = document.getElementById('val-score-hands');
    if (scoreHands) {
      scoreHands.textContent = '$' + clickerCoins + ' | x' + comboMultiplier + ' | MP:' + prestigeMedals;
    }
    var scoreVaults = document.getElementById('val-score-vaults');
    var pct = Math.max(0, Math.min(100, Math.round((1.0 - bombCurrentCharge / Math.max(1, bombMaxCharge)) * 100)));
    if (scoreVaults) scoreVaults.textContent = pct + '%';

    var btnEndGame = document.getElementById('btn-end-game');
    if (btnEndGame) {
      btnEndGame.textContent = tr('END MATCH', 'TERMINAR');
      var endingOverlayEl = document.getElementById('game-ending-overlay');
      var isEndingOpen = endingOverlayEl && !endingOverlayEl.classList.contains('hidden');
      btnEndGame.classList.toggle('hidden', Boolean(inTitleScreenMode || isEndingOpen));
    }

    var btnStartMain = document.getElementById('btn-start-game-main');
    if (btnStartMain) {
      if (navigator.xr && !isXrPresentingNow()) {
        btnStartMain.textContent = hasAutoLaunchedXrOnce
          ? tr('🥽 RE-ENTER AR / MR MODE (TAP HERE)', '🥽 VOLVER A MODO GAFAS AR / MR (TOCA AQUÍ)')
          : tr('🥽 ENTER AR / MR MODE (TAP HERE)', '🥽 ENTRAR EN MODO GAFAS AR / MR (TOCA AQUÍ)');
      } else {
        btnStartMain.textContent = tr('START GAME', 'INICIAR JUEGO');
      }
    }
    updateXrEntryBannerVisibility();

    var btnAudio = document.getElementById('btn-toggle-audio');
    if (btnAudio) {
      btnAudio.textContent = tr(
        audioMuted ? 'SOUND: OFF' : 'SOUND: ON',
        audioMuted ? 'SILENCIO' : 'SONIDO: ON'
      );
    }
    var btnLang = document.getElementById('btn-toggle-lang');
    if (btnLang) {
      btnLang.textContent = currentLang.toUpperCase();
    }
  }

  function loadLevelByNumber(lvlNum) {
    currentLevelNum = Math.max(1, Math.min(LEVEL_SPECS.length, lvlNum));
    maxLevelReached = Math.max(maxLevelReached, currentLevelNum);
    var spec = getSpec();

    resetDestructibleParts();

    levelTimerSec = spec.timeLimitSec;
    lastWholeSecBeep = Math.ceil(levelTimerSec);
    sequenceStepIndex = 0;
    // Exponential Boss Bomb Charge Curve across waves (`Cost(n) = Base * 1.25^lvl`)
    bombMaxCharge = Math.round(80.0 * Math.pow(1.25, currentLevelNum - 1));
    bombCurrentCharge = bombMaxCharge;
    activeTargetPadIndex = spec.sequence[0] || 1;
    seqStepDuration = getCurrentSeqStepDuration();
    seqStepTimer = seqStepDuration;
    circuitDisarmed = false;
    bombExplodedFlash = 0.0;
    levelResetPendingTimer = 0.0;
    laserActiveTimer = 0.0;
    kibbleActiveTimer = 0.0;
    yarnActiveTimer = 0.0;
    if (yarnBallGroup) yarnBallGroup.visible = false;
    if (yarnShadowMesh) yarnShadowMesh.visible = false;
    if (kibblePelletsGroup) kibblePelletsGroup.visible = false;

    catwhoPhase = 'HIDDEN';
    catwhoAttackProgress = 0.0;
    catwhoCooldown = Math.max(5.5, 11.5 - currentLevelNum * 0.6);
    if (catwhoRig) catwhoRig.visible = inTitleScreenMode;
    if (leftMonitorGroupRef) leftMonitorGroupRef.visible = !inTitleScreenMode;
    if (rightMonitorGroupRef) rightMonitorGroupRef.visible = !inTitleScreenMode;

    fuseLeftLocked = !spec.needsLeftFuse;
    fuseRightLocked = !spec.needsRightFuse;
    fuseLeftKnockAnim = 0.0;
    fuseRightKnockAnim = 0.0;

    surgeWireSevered = false;
    if (surgeWireIntactMesh) surgeWireIntactMesh.visible = true;
    if (surgeWireCutLeftMesh) surgeWireCutLeftMesh.visible = false;
    if (surgeWireCutRightMesh) surgeWireCutRightMesh.visible = false;

    trapWireSevered = false;
    if (trapWireIntactMesh) trapWireIntactMesh.visible = true;
    if (trapWireCutLeftMesh) trapWireCutLeftMesh.visible = false;
    if (trapWireCutRightMesh) trapWireCutRightMesh.visible = false;
    if (wireSparksGroup) wireSparksGroup.visible = false;

    if (spec.startLoaf && clickerCoins >= getFishUpgradeCost()) {
      catState = 'LOAF_ON_BOARD';
      catStateTimer = 999.0;
      catAttackProgress = 0.0;
    } else {
      catState = 'IDLE';
      catStateTimer = spec.catAggression > 0 ? 2.3 : 999.0;
      catAttackProgress = 0.0;
    }

    if (leftFuseGroup) leftFuseGroup.visible = true;
    if (rightFuseGroup) rightFuseGroup.visible = true;
    if (laserGadgetGroup) laserGadgetGroup.visible = true;
    if (kibbleGadgetGroup) kibbleGadgetGroup.visible = true;
    if (yarnGadgetGroup) yarnGadgetGroup.visible = true;
    if (exitXrGadgetGroup) exitXrGadgetGroup.visible = true;
    if (catBowlGroup) catBowlGroup.visible = true;

    refreshAllDynamicBadges();
    updateDomCounters();
    renderBombClockCanvas();
  }

  // ============================================================================
  // PANORAMIC BACKGROUND STAGE DISPLAYS (LEFT: COUNTDOWN & DEFUSE, RIGHT: ECONOMY & STATUS)
  // Unobstructed, High-Contrast & Easy to Read at a Glance Behind the Workbench!
  // ============================================================================
  function drawRoundedCard(ctx, x, y, w, h, r, fillCss, strokeCss, lineW) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fillCss) {
      ctx.fillStyle = fillCss;
      ctx.fill();
    }
    if (strokeCss) {
      ctx.strokeStyle = strokeCss;
      ctx.lineWidth = lineW || 4;
      ctx.stroke();
    }
  }

  function drawColorfigureCard(ctx, x, y, w, h, r, fillCss, strokeCss, lineW, shadowCss, shadowOff) {
    var sOff = typeof shadowOff === 'number' ? shadowOff : 5;
    if (shadowCss) {
      drawRoundedCard(ctx, x + sOff, y + sOff, w, h, r, shadowCss, null, 0);
    }
    drawRoundedCard(ctx, x, y, w, h, r, fillCss, strokeCss || '#231e16', lineW || 4);
  }

  function drawAnatomyCornerScrewsAndTicks(ctx, w, h) {
    var corners = [
      [22, 22],
      [w - 22, 22],
      [22, h - 22],
      [w - 22, h - 22]
    ];
    for (var c = 0; c < corners.length; c++) {
      var cx = corners[c][0];
      var cy = corners[c][1];
      ctx.fillStyle = '#cfc8b8';
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#231e16';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 4.5, cy - 3.5);
      ctx.lineTo(cx + 4.5, cy + 3.5);
      ctx.stroke();
    }
    // Millimeter tick marks along top & bottom edges (`wheresryan22/anatomy`)
    ctx.strokeStyle = 'rgba(35, 30, 22, 0.35)';
    ctx.lineWidth = 1.5;
    for (var tx = 64; tx <= w - 64; tx += 16) {
      var tickH = tx % 64 === 0 ? 9 : 5;
      ctx.beginPath();
      ctx.moveTo(tx, 10);
      ctx.lineTo(tx, 10 + tickH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tx, h - 10);
      ctx.lineTo(tx, h - 10 - tickH);
      ctx.stroke();
    }
  }

  function renderBombClockCanvas() {
    // 1. LEFT BACKGROUND STAGE PLATE (`bombClockCanvas` 840x560 — Colorfigures + Anatomy Hand-Inked Plate)
    if (bombClockCtx && bombClockCanvas) {
      var ctx = bombClockCtx;
      var w = bombClockCanvas.width;
      var h = bombClockCanvas.height;
      var spec = getSpec();

      ctx.clearRect(0, 0, w, h);
      var plateBg = bombIsDestroyed ? '#f7d6cf' : '#f8f6f0';
      var plateBorder = circuitDisarmed ? '#2e6f56' : levelTimerSec < 10 ? '#ef6a4c' : '#231e16';
      drawColorfigureCard(ctx, 6, 6, w - 12, h - 12, 24, plateBg, plateBorder, 7, '#41538f', 4);
      drawAnatomyCornerScrewsAndTicks(ctx, w, h);

      // Hands-First 3D Scoreboard Summary inside VR when Final Scoreboard (`#game-ending-overlay`) is active!
      if (isEndingOverlayOpen()) {
        drawColorfigureCard(ctx, 36, 30, w - 72, 96, 16, '#fff4d6', '#231e16', 4, '#41538f', 3);
        ctx.font = '900 34px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillStyle = '#231e16';
        ctx.textAlign = 'left';
        ctx.fillText(
          endingModalMode === 'VICTORY'
            ? tr('VICTORY!', '¡VICTORIA!')
            : endingModalMode === 'EXPLODED_TAUNT'
            ? tr('GAME OVER', '¡FIN DEL JUEGO!')
            : tr('MATCH ENDED', 'FIN DE PARTIDA'),
          58,
          88
        );
        var elTot3D = document.getElementById('ending-total-score-val');
        ctx.textAlign = 'right';
        ctx.fillStyle = '#1f4034';
        ctx.fillText((elTot3D ? elTot3D.textContent : '0') + ' PTS', w - 58, 88);

        var cards3D = [
          {
            lbl: tr('MAX LEVEL', 'NIVEL MÁX.'),
            val: maxLevelReached + '/10',
            bg: '#f8f6f0'
          },
          {
            lbl: tr('BOMBS DEFUSED', 'BOMBAS DESARMADAS'),
            val: '' + totalBombsDisarmed,
            bg: '#f8f6f0'
          },
          {
            lbl: tr('CATS STOPPED', 'GATOS FRENADOS'),
            val: '' + totalCatSabotagesFoiled,
            bg: '#f8f6f0'
          }
        ];
        for (var c3 = 0; c3 < 3; c3++) {
          var cx3 = 36 + c3 * 260;
          drawColorfigureCard(ctx, cx3, 148, 248, 245, 16, cards3D[c3].bg, '#231e16', 3.5, '#231e16', 2);
          ctx.textAlign = 'center';
          ctx.font = '800 18px ui-monospace, SFMono-Regular, Menlo, monospace';
          ctx.fillStyle = '#6e6659';
          ctx.fillText(cards3D[c3].lbl, cx3 + 124, 212);
          ctx.font = '900 58px ui-monospace, SFMono-Regular, Menlo, monospace';
          ctx.fillStyle = '#231e16';
          ctx.fillText(cards3D[c3].val, cx3 + 124, 305);
        }

        drawColorfigureCard(ctx, 36, 418, w - 72, 96, 18, '#93d3b0', '#231e16', 4, '#231e16', 3);
        ctx.textAlign = 'center';
        ctx.font = '900 26px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillStyle = '#231e16';
        ctx.fillText(
          tr('[ TOUCH OR PINCH TO PLAY AGAIN ]', '[ TOCA O PELLIZCA PARA JUGAR DE NUEVO ]'),
          w / 2,
          475
        );
        ctx.textAlign = 'left';
        if (bombClockTexture) bombClockTexture.needsUpdate = true;
      } else {

      // Top Header Card (`y = 26..80`): Hand-inked Cream Callout Tag + Level Title + 10 Step Blocks
      drawColorfigureCard(ctx, 32, 26, w - 64, 54, 14, '#ebe6da', '#231e16', 3.5, null, 0);

      // Level Callout Pill (`#fff4d6` tag from `colorfigures`)
      drawColorfigureCard(ctx, 44, 34, 158, 38, 19, '#fff4d6', '#231e16', 3, '#231e16', 2);
      ctx.font = '800 21px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#231e16';
      ctx.fillText(tr('LEVEL ', 'NIVEL ') + currentLevelNum + '/10', 44 + 79, 60);

      // Level Title Pill (`tomato` / `mustard` / `mint` swatch)
      drawColorfigureCard(ctx, 212, 34, 238, 38, 19, '#f4b829', '#231e16', 2.5, null, 0);
      ctx.font = '800 16px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = '#231e16';
      ctx.fillText(getLevelTitle(currentLevelNum), 212 + 119, 59);

      // 10 Numbered Level Progress Swatch Blocks (`1..10`)
      for (var lv = 0; lv < 10; lv++) {
        var lvlIdx = lv + 1;
        var bx = 464 + lv * 33;
        var by = 35;
        var bFill = lvlIdx < currentLevelNum ? '#93d3b0' : lvlIdx === currentLevelNum ? '#ef6a4c' : '#f8f6f0';
        drawRoundedCard(ctx, bx, by, 29, 36, 7, bFill, '#231e16', 2.5);
        ctx.font = '800 15px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillStyle = lvlIdx === currentLevelNum ? '#ffffff' : '#231e16';
        ctx.fillText('' + lvlIdx, bx + 14.5, by + 24);
      }
      ctx.textAlign = 'left';

      // Upper-Middle Card (`y = 94..278`): Colorfigures Appliance Screen (`#1d2a26` with `#8af0ae` / `#ef6a4c` digits!)
      drawColorfigureCard(
        ctx,
        32,
        94,
        w - 64,
        182,
        18,
        '#1d2a26',
        '#231e16',
        5,
        '#41538f',
        5
      );

      // Subtle glass reflection streaks on screen (`colorfigures` glass spec: white streaks at .22 opacity)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(64, 114);
      ctx.lineTo(138, 114);
      ctx.stroke();

      var safeT = Math.max(0, levelTimerSec);
      var mins = Math.floor(safeT / 60);
      var secs = Math.floor(safeT % 60);
      var tenths = Math.floor((safeT * 10) % 10);
      var minStr = mins < 10 ? '0' + mins : '' + mins;
      var secStr = secs < 10 ? '0' + secs : '' + secs;
      var digitalStr = minStr + ':' + secStr + '.' + tenths;

      ctx.font = '800 132px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'center';

      var timerColor = circuitDisarmed
        ? '#8af0ae'
        : levelTimerSec < 10
        ? Math.floor(clockSec * 8) % 2 === 0
          ? '#fff4d6'
          : '#ef6a4c'
        : '#8af0ae';
      ctx.fillStyle = timerColor;
      ctx.fillText(digitalStr, w / 2, 230);
      ctx.textAlign = 'left';

      // Lower-Middle Card (`y = 294..378`): Hand-Inked Defusal Gauge Bar (`DEFUSE: 68%`)
      var pctDisarmed = Math.max(0, Math.min(1.0, 1.0 - bombCurrentCharge / Math.max(1.0, bombMaxCharge)));
      var barX = 32;
      var barY = 294;
      var barW = w - 64;
      var barH = 82;

      drawColorfigureCard(ctx, barX, barY, barW, barH, 16, '#ebe6da', '#231e16', 4.5, '#41538f', 4);

      var fillW = Math.floor((barW - 10) * pctDisarmed);
      if (fillW > 10) {
        var fillCol = goldenFeverTimer > 0 ? '#f4b829' : clickBarFlashTimer > 0 ? '#93d3b0' : '#43c25c';
        drawRoundedCard(ctx, barX + 5, barY + 5, fillW, barH - 10, 12, fillCol, '#231e16', 2.5);
      }

      // Vertical graduation tick marks across the gauge bar (`wheresryan22/anatomy`)
      ctx.strokeStyle = 'rgba(35, 30, 22, 0.25)';
      ctx.lineWidth = 2;
      for (var gx = barX + 60; gx < barX + barW - 40; gx += 60) {
        ctx.beginPath();
        ctx.moveTo(gx, barY + 6);
        ctx.lineTo(gx, barY + 20);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(gx, barY + barH - 6);
        ctx.lineTo(gx, barY + barH - 20);
        ctx.stroke();
      }

      var pctInt = Math.round(pctDisarmed * 100);
      var barLabel = circuitDisarmed
        ? tr('BOMB DEFUSED!', '¡BOMBA DESARMADA!')
        : pctDisarmed >= 0.99
        ? tr('READY — PRESS GREEN BAR!', '¡LISTO — PRESIONA BARRA VERDE!')
        : tr('DEFUSE PROGRESS: ', 'PROGRESO DESARME: ') + pctInt + '%';
      ctx.font = '800 30px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff4d6';
      ctx.fillText(barLabel, w / 2 + 2, barY + 53);
      ctx.fillStyle = '#231e16';
      ctx.fillText(barLabel, w / 2, barY + 51);
      ctx.textAlign = 'left';

      // Bottom Card (`y = 394..534`): Callout Status Tag + Sequence Timer Bar + 4 Hand-Inked Target Swatches
      drawColorfigureCard(ctx, 32, 394, w - 64, 140, 16, '#ebe6da', '#231e16', 4, null, 0);

      var toastActiveL = oledToastTimer > 0 && oledToastText;
      var statusHeaderL = toastActiveL
        ? oledToastText
        : catwhoPhase === 'DUO_SABOTAGE'
        ? tr('DUO SABOTAGE! BOOP CATONE & CATWHO!', '¡SABOTAJE DÚO! ¡TOCA LAS 2 PATAS!')
        : catwhoPhase === 'DUO_PLAY'
        ? tr('CATONE & CATWHO PLAYING -> WATCH OUT!', '¡CATONE Y CATWHO JUGANDO -> ATENTO!')
        : catwhoPhase === 'APPROACHING'
        ? tr('CATWHO WALKING IN...', 'CATWHO ACERCÁNDOSE...')
        : catState === 'LOAF_ON_BOARD'
        ? tr('CATONE SLEEPING — USE TREATS!', '¡CATONE DORMIDO — USA COMIDA!')
        : !fuseLeftLocked || !fuseRightLocked
        ? tr('PRESS GLOWING COPPER COIL!', '¡PRESIONA LA BOBINA ILUMINADA!')
        : tr('TAP THE LIT PLUNGER IN ORDER!', '¡PRESIONA EL BOTÓN ILUMINADO!');

      drawRoundedCard(ctx, 74, 402, w - 148, 32, 16, toastActiveL ? '#f4b829' : '#fff4d6', '#231e16', 2.5);
      ctx.font = '800 19px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#231e16';
      ctx.fillText(statusHeaderL, w / 2, 425);
      ctx.textAlign = 'left';

      // Live Sequence Step Countdown Bar (`y = 440..450`)
      var seqFrac = Math.max(0, Math.min(1.0, seqStepTimer / Math.max(0.2, seqStepDuration)));
      var activePadCss = (PAD_DEFS[activeTargetPadIndex] && PAD_DEFS[activeTargetPadIndex].css) || '#ef6a4c';
      drawRoundedCard(ctx, 90, 440, w - 180, 10, 5, '#cfc8b8', '#231e16', 2);
      if (seqFrac > 0.02 && !circuitDisarmed) {
        drawRoundedCard(ctx, 90, 440, Math.floor((w - 180) * seqFrac), 10, 5, activePadCss, '#231e16', 1.5);
      }

      var spacing = 176;
      var startX = Math.floor(w / 2 - (3 * spacing) / 2);
      var cy = 493;

      for (var i = 0; i < PAD_DEFS.length; i++) {
        var pad = PAD_DEFS[i];
        var cx = startX + i * spacing;
        var isCritTarget = i === activeTargetPadIndex && !circuitDisarmed && pctDisarmed < 0.999;

        ctx.save();
        // Flat indigo-blue cast shadow under each target swatch (`colorfigures`)
        ctx.fillStyle = '#41538f';
        ctx.beginPath();
        ctx.arc(cx + 4, cy + 4, isCritTarget ? 32 : 23, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isCritTarget ? pad.css : '#dfd9c8';
        ctx.beginPath();
        ctx.arc(cx, cy, isCritTarget ? 32 : 23, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#231e16';
        ctx.lineWidth = isCritTarget ? 4.5 : 3;
        ctx.stroke();

        // Inner swatch dot
        ctx.fillStyle = isCritTarget ? '#fff4d6' : pad.css;
        ctx.beginPath();
        ctx.arc(cx, cy, isCritTarget ? 13 : 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#231e16';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      if (bombClockTexture) bombClockTexture.needsUpdate = true;
      }
    }

    // 2. RIGHT BACKGROUND STAGE PLATE (`stageRightCanvas` 840x560 — Colorfigures + Anatomy Shop Plate)
    if (stageRightCtx && stageRightCanvas) {
      var rctx = stageRightCtx;
      var rw = stageRightCanvas.width;
      var rh = stageRightCanvas.height;

      rctx.clearRect(0, 0, rw, rh);
      var rPlateBg = goldenFeverTimer > 0 ? '#fff4d6' : '#f8f6f0';
      drawColorfigureCard(rctx, 6, 6, rw - 12, rh - 12, 24, rPlateBg, '#231e16', 7, '#41538f', 4);
      drawAnatomyCornerScrewsAndTicks(rctx, rw, rh);

      // Top Card (`y = 26..142`): GOLD BANK (`$0`) + PASSIVE AUTO RATE (`+$0.0/s`) + MULTIPLIERS
      drawColorfigureCard(rctx, 32, 26, rw - 64, 114, 16, '#fff4d6', '#231e16', 4, '#41538f', 4);

      // Hand-inked Mustard Coin Emblem (`#f4b829` with `#231e16` outline & `#41538f` cast shadow)
      rctx.fillStyle = '#41538f';
      rctx.beginPath();
      rctx.arc(88, 87, 35, 0, Math.PI * 2);
      rctx.fill();

      rctx.fillStyle = '#f4b829';
      rctx.beginPath();
      rctx.arc(84, 83, 35, 0, Math.PI * 2);
      rctx.fill();
      rctx.strokeStyle = '#231e16';
      rctx.lineWidth = 4.5;
      rctx.stroke();
      rctx.font = '800 44px ui-monospace, SFMono-Regular, Menlo, monospace';
      rctx.textAlign = 'center';
      rctx.fillStyle = '#231e16';
      rctx.fillText('$', 84, 99);
      rctx.textAlign = 'left';

      // Giant Ink Balance Number
      rctx.font = '800 60px ui-monospace, SFMono-Regular, Menlo, monospace';
      rctx.fillStyle = '#231e16';
      rctx.fillText('$' + clickerCoins, 136, 86);

      // Passive Income Per Second (`+0.0/s`)
      var ipsVal = getAutomaticIps().toFixed(1);
      rctx.font = '800 22px ui-monospace, SFMono-Regular, Menlo, monospace';
      rctx.fillStyle = '#1f4034';
      rctx.fillText(tr('AUTO: +$', 'AUTO: +$') + ipsVal + '/s', 138, 122);

      // Right Side of Top Card: Active Multiplier & Prestige Tag
      drawColorfigureCard(rctx, rw - 312, 38, 264, 88, 12, '#f8f6f0', '#231e16', 3, '#231e16', 2);
      rctx.font = '800 22px ui-monospace, SFMono-Regular, Menlo, monospace';
      rctx.fillStyle = '#cf5038';
      rctx.fillText(
        goldenFeverTimer > 0 ? 'FEVER x5.0' : 'COMBO x' + comboMultiplier,
        rw - 292,
        73
      );
      rctx.fillStyle = '#1c2948';
      rctx.fillText(
        tr('PRESTIGE x', 'PRESTIGIO x') + getPrestigeMultiplier().toFixed(2),
        rw - 292,
        108
      );

      // Section Header (`y = 152..178`) — Minimalist Visual Header
      rctx.font = '900 22px ui-monospace, SFMono-Regular, Menlo, monospace';
      rctx.textAlign = 'center';
      rctx.fillStyle = '#231e16';
      rctx.fillText(
        tr('SHOP', 'TIENDA'),
        rw / 2,
        173
      );
      rctx.textAlign = 'left';

      // 3 Interactive Hand-Inked Upgrade Store Cards (`y = 186`, `y = 308`, `y = 430`) — Visual Icon + Minimal Text!
      var yarnUnlocked = currentLevelNum >= YARN_UNLOCK_LEVEL;
      var shopItems = [
        {
          kind: 'laser',
          title: tr('LASER', 'LÁSER'),
          lvl: upgPowerLevel,
          badge: '+45% TAP',
          cost: getLaserUpgradeCost(),
          accent: '#ef6a4c',
          locked: false
        },
        {
          kind: 'treats',
          title: tr('TREATS', 'CROQUETAS'),
          lvl: upgAutoLevel,
          badge: '+' + (2.5 * getMilestoneMultiplier(upgAutoLevel)).toFixed(1) + '/s',
          cost: getFishUpgradeCost(),
          accent: '#f4b829',
          locked: false
        },
        {
          kind: 'yarn',
          title: tr('YARN BALL', 'BOLA DE LANA'),
          lvl: upgCritLevel,
          badge: yarnUnlocked ? '12s PLAY' : tr('LV.' + YARN_UNLOCK_LEVEL, 'NV.' + YARN_UNLOCK_LEVEL),
          cost: getChronoUpgradeCost(),
          accent: '#76a0e2',
          locked: !yarnUnlocked
        }
      ];

      for (var sIdx = 0; sIdx < shopItems.length; sIdx++) {
        var item = shopItems[sIdx];
        var sy = 186 + sIdx * 122;
        var canBuy = !item.locked && clickerCoins >= item.cost;

        drawColorfigureCard(
          rctx,
          32,
          sy,
          rw - 64,
          104,
          16,
          item.locked ? '#dfd9c8' : canBuy ? '#fff4d6' : '#ebe6da',
          '#231e16',
          canBuy ? 4 : 3,
          '#41538f',
          4
        );

        // 1. Big Hand-Inked Visual Product Icon Box (`86 x 80` at `x = 46, y = sy + 12`)
        var icBoxX = 46;
        var icBoxY = sy + 12;
        var icBoxW = 86;
        var icBoxH = 80;
        drawColorfigureCard(
          rctx,
          icBoxX,
          icBoxY,
          icBoxW,
          icBoxH,
          14,
          item.locked ? '#cfc8b8' : '#f8f6f0',
          '#231e16',
          3,
          '#231e16',
          2
        );
        var icx = icBoxX + icBoxW / 2;
        var icy = icBoxY + icBoxH / 2;

        rctx.save();
        if (item.kind === 'laser') {
          // Hand-Inked Laser Emitter + Diagonal Beam + Glowing Red Target Dot & Crosshair Rays
          rctx.fillStyle = '#3d3935';
          rctx.strokeStyle = '#231e16';
          rctx.lineWidth = 3;
          rctx.beginPath();
          rctx.roundRect(icx - 32, icy + 6, 22, 14, 4);
          rctx.fill();
          rctx.stroke();

          rctx.strokeStyle = '#ef6a4c';
          rctx.lineWidth = 5.5;
          rctx.beginPath();
          rctx.moveTo(icx - 10, icy + 10);
          rctx.lineTo(icx + 18, icy - 14);
          rctx.stroke();

          rctx.fillStyle = '#ef6a4c';
          rctx.beginPath();
          rctx.arc(icx + 20, icy - 15, 11, 0, Math.PI * 2);
          rctx.fill();
          rctx.strokeStyle = '#231e16';
          rctx.lineWidth = 3;
          rctx.stroke();

          rctx.fillStyle = '#fff4d6';
          rctx.beginPath();
          rctx.arc(icx + 20, icy - 15, 4.5, 0, Math.PI * 2);
          rctx.fill();
        } else if (item.kind === 'treats') {
          // Hand-Inked Red Cat Bowl Overflowing with Golden Kibble Nuggets + Fish Emblem
          var kibbleOffsets = [
            [-14, -4],
            [-5, -9],
            [5, -8],
            [14, -4],
            [-9, -2],
            [2, -2],
            [10, -1]
          ];
          for (var kb = 0; kb < kibbleOffsets.length; kb++) {
            rctx.fillStyle = kb % 2 === 0 ? '#b45309' : '#f4b829';
            rctx.strokeStyle = '#231e16';
            rctx.lineWidth = 2.5;
            rctx.beginPath();
            rctx.arc(icx + kibbleOffsets[kb][0], icy + kibbleOffsets[kb][1], 6.5, 0, Math.PI * 2);
            rctx.fill();
            rctx.stroke();
          }
          // Red Trapezoid Cat Bowl
          rctx.fillStyle = '#ef6a4c';
          rctx.strokeStyle = '#231e16';
          rctx.lineWidth = 3.2;
          rctx.beginPath();
          rctx.moveTo(icx - 24, icy - 1);
          rctx.lineTo(icx + 24, icy - 1);
          rctx.lineTo(icx + 30, icy + 22);
          rctx.lineTo(icx - 30, icy + 22);
          rctx.closePath();
          rctx.fill();
          rctx.stroke();
          // Cream Fish Silhouette on Bowl Front
          rctx.fillStyle = '#fff4d6';
          rctx.beginPath();
          rctx.ellipse(icx - 2, icy + 11, 9, 4.5, 0, 0, Math.PI * 2);
          rctx.fill();
          rctx.beginPath();
          rctx.moveTo(icx + 6, icy + 11);
          rctx.lineTo(icx + 12, icy + 6);
          rctx.lineTo(icx + 12, icy + 16);
          rctx.closePath();
          rctx.fill();
        } else {
          // Hand-Inked Wound Wool Yarn Ball + Curly Loose Thread (`drawHandInkedYarnBall2D`)
          drawHandInkedYarnBall2D(rctx, icx - 4, icy - 2, 22, item.locked);
        }
        rctx.restore();

        // 2. Concise Title + Visual Level Pips & Stat Pill (`x = 148`)
        rctx.font = '900 28px ui-monospace, SFMono-Regular, Menlo, monospace';
        rctx.fillStyle = item.locked ? '#6e6659' : '#231e16';
        rctx.fillText(item.title, 148, sy + 44);

        // Level Badge Pill (`LV.1`)
        drawRoundedCard(
          rctx,
          148,
          sy + 56,
          86,
          30,
          15,
          item.locked ? '#cfc8b8' : item.accent,
          '#231e16',
          2.5
        );
        rctx.font = '900 17px ui-monospace, SFMono-Regular, Menlo, monospace';
        rctx.textAlign = 'center';
        rctx.fillStyle = item.locked ? '#6e6659' : '#231e16';
        rctx.fillText(
          item.locked ? tr('LOCK', 'BLOQ') : tr('LV.', 'NV.') + item.lvl,
          148 + 43,
          sy + 77
        );

        // Short Stat Pill (`+45% TAP` / `+2.5/s` / `8s PLAY`)
        drawRoundedCard(rctx, 244, sy + 56, 128, 30, 15, '#f8f6f0', '#231e16', 2.5);
        rctx.fillStyle = '#1f4034';
        rctx.fillText(item.badge, 244 + 64, sy + 77);
        rctx.textAlign = 'left';

        // 5 Visual Level Progress Dots (`x = 386..498`)
        var pipProgress = item.locked ? 0 : ((item.lvl - 1) % 5) + 1;
        for (var pIdx = 0; pIdx < 5; pIdx++) {
          var px = 388 + pIdx * 24;
          var py = sy + 63;
          drawRoundedCard(
            rctx,
            px,
            py,
            16,
            16,
            5,
            pIdx < pipProgress ? item.accent : '#dfd9c8',
            '#231e16',
            2
          );
        }

        // 3. Right Interactive BUY Pill Box (`$15` or `LV.4`)
        var btnW = 190;
        var btnH = 72;
        var btnX = rw - 48 - btnW;
        var btnY = sy + 16;
        drawColorfigureCard(
          rctx,
          btnX,
          btnY,
          btnW,
          btnH,
          36,
          item.locked ? '#cfc8b8' : canBuy ? '#93d3b0' : '#f8f6f0',
          '#231e16',
          3.5,
          '#231e16',
          3
        );

        rctx.font = '900 26px ui-monospace, SFMono-Regular, Menlo, monospace';
        rctx.textAlign = 'center';
        rctx.fillStyle = item.locked ? '#6e6659' : canBuy ? '#231e16' : '#857d6e';
        rctx.fillText(
          item.locked
            ? tr('LV.' + YARN_UNLOCK_LEVEL, 'NV.' + YARN_UNLOCK_LEVEL)
            : '$' + item.cost,
          btnX + btnW / 2,
          btnY + 46
        );
        rctx.textAlign = 'left';
      }

      if (stageRightTexture) stageRightTexture.needsUpdate = true;
    }

    // 3. 3D START SCREEN BANNER OR 3D FINAL SCOREBOARD (`titleScreenCanvas` 1024x512 — Native 3D UI for WebXR!)
    if ((inTitleScreenMode || isEndingOverlayOpen()) && titleScreenCtx && titleScreenCanvas) {
      var tctx = titleScreenCtx;
      var tw = titleScreenCanvas.width;
      var th = titleScreenCanvas.height;

      tctx.clearRect(0, 0, tw, th);

      if (isEndingOverlayOpen()) {
        // Render the Full Final Scoreboard + Live Cat Taunt Vignette directly in 3D for VR Headset Players!
        drawColorfigureCard(tctx, 64, 10, tw - 128, th - 20, 26, '#f8f6f0', '#231e16', 7, '#41538f', 6);

        // Top Header Row: Title + Grand Total Score Box
        drawColorfigureCard(tctx, 94, 28, 490, 74, 16, '#ebe6da', '#231e16', 3.5, null, 0);
        tctx.font = '900 34px ui-monospace, SFMono-Regular, Menlo, monospace';
        tctx.fillStyle = '#231e16';
        tctx.textAlign = 'left';
        tctx.fillText(
          endingModalMode === 'VICTORY'
            ? tr('VICTORY! 10/10', '¡VICTORIA! 10/10')
            : endingModalMode === 'EXPLODED_TAUNT'
            ? tr('GAME OVER', '¡FIN DEL JUEGO!')
            : tr('MATCH ENDED', 'FIN DE PARTIDA'),
          116,
          76
        );

        var elTot3D = document.getElementById('ending-total-score-val');
        drawColorfigureCard(tctx, 600, 28, 330, 74, 16, '#fff4d6', '#231e16', 4, '#41538f', 3);
        tctx.textAlign = 'right';
        tctx.font = '900 34px ui-monospace, SFMono-Regular, Menlo, monospace';
        tctx.fillStyle = '#1f4034';
        tctx.fillText((elTot3D ? elTot3D.textContent : '0') + ' PTS', 908, 76);

        // Copy the live animated 2D Cat Vignette (`#ending-taunt-canvas`) onto the left half of the 3D Scoreboard!
        var tauntCanv = document.getElementById('ending-taunt-canvas');
        if (tauntCanv) {
          drawColorfigureCard(tctx, 94, 116, 444, 272, 16, '#e6e1d4', '#231e16', 4, '#41538f', 3);
          tctx.drawImage(tauntCanv, 100, 122, 432, 260);
        }

        // Right Half: 3 Stat Summary Cards + Top 3 Hall of Fame
        var sCards = [
          { lbl: tr('MAX LEVEL', 'NIVEL MÁX.'), val: maxLevelReached + '/10' },
          { lbl: tr('BOMBS DEFUSED', 'BOMBAS DESARMADAS'), val: '' + totalBombsDisarmed },
          { lbl: tr('CATS STOPPED', 'GATOS FRENADOS'), val: '' + totalCatSabotagesFoiled }
        ];
        for (var scIdx = 0; scIdx < 3; scIdx++) {
          var scY = 116 + scIdx * 66;
          drawColorfigureCard(tctx, 556, scY, 374, 56, 12, '#ebe6da', '#231e16', 3, null, 0);
          tctx.textAlign = 'left';
          tctx.font = '800 18px ui-monospace, SFMono-Regular, Menlo, monospace';
          tctx.fillStyle = '#6e6659';
          tctx.fillText(sCards[scIdx].lbl, 576, scY + 35);
          tctx.textAlign = 'right';
          tctx.font = '900 26px ui-monospace, SFMono-Regular, Menlo, monospace';
          tctx.fillStyle = '#231e16';
          tctx.fillText(sCards[scIdx].val, 910, scY + 37);
        }

        // Top 3 Hall of Fame Strip
        var top1Score = highScoresList[0] ? highScoresList[0].score.toLocaleString() : '0';
        drawColorfigureCard(tctx, 556, 316, 374, 72, 14, '#fff4d6', '#231e16', 3.5, '#231e16', 2);
        tctx.textAlign = 'center';
        tctx.font = '900 20px ui-monospace, SFMono-Regular, Menlo, monospace';
        tctx.fillStyle = '#231e16';
        tctx.fillText(tr('BEST SCORE: #1  ', 'MEJOR PUNTAJE: #1  ') + top1Score, 556 + 187, 360);

        // Big Pulsing 3D Play Again CTA Button at the Bottom (`y = 404..482`) with 2.4s Safety Lock!
        var elapsedEndingSec = Math.max(0, clockSec - endingModalOpenTime);
        var lockRemainSec = Math.max(0, 2.4 - elapsedEndingSec);
        var isScoreLocked = lockRemainSec > 0.05;
        var ctaPulse = isScoreLocked
          ? '#e6e1d4'
          : Math.floor(clockSec * 4) % 2 === 0
          ? '#93d3b0'
          : '#f4b829';
        drawColorfigureCard(tctx, 94, 404, tw - 188, 76, 38, ctaPulse, '#231e16', 5, '#231e16', 4);
        tctx.textAlign = 'center';
        tctx.font = '900 25px ui-monospace, SFMono-Regular, Menlo, monospace';
        tctx.fillStyle = isScoreLocked ? '#6e6659' : '#231e16';
        tctx.fillText(
          isScoreLocked
            ? tr(
                '[ SCORE LOCKED (' + Math.ceil(lockRemainSec) + 's) — READ YOUR RESULTS ]',
                '[ PROTEGIDO (' + Math.ceil(lockRemainSec) + 's) — MIRA TU PUNTAJE ]'
              )
            : tr(
                '[ TOUCH THIS BOARD OR GREEN BAR TO PLAY AGAIN ]',
                '[ TOCA ESTE PANEL O LA BARRA VERDE PARA JUGAR ]'
              ),
          tw / 2,
          451
        );
        tctx.textAlign = 'left';
      } else {
        // Compact floating `colorfigures` + `wheresryan22/anatomy` Title Plaque centered above Catone & Catwho
        var cardX = 242;
        var cardY = 16;
        var cardW = 540;
        var cardH = 156;
        drawColorfigureCard(tctx, cardX, cardY, cardW, cardH, 24, '#f8f6f0', '#231e16', 7, '#41538f', 6);
        drawRoundedCard(tctx, cardX + 12, cardY + 12, cardW - 24, cardH - 24, 16, null, '#ddd6c8', 2);

        // 4 Corner Screw Heads on the floating plaque (`wheresryan22/anatomy`)
        var pScrews = [
          [cardX + 24, cardY + 24],
          [cardX + cardW - 24, cardY + 24],
          [cardX + 24, cardY + cardH - 24],
          [cardX + cardW - 24, cardY + cardH - 24]
        ];
        for (var ps = 0; ps < pScrews.length; ps++) {
          tctx.fillStyle = '#e6e1d4';
          tctx.beginPath();
          tctx.arc(pScrews[ps][0], pScrews[ps][1], 7, 0, Math.PI * 2);
          tctx.fill();
          tctx.strokeStyle = '#231e16';
          tctx.lineWidth = 2.5;
          tctx.stroke();
          tctx.beginPath();
          tctx.moveTo(pScrews[ps][0] - 4, pScrews[ps][1] - 4);
          tctx.lineTo(pScrews[ps][0] + 4, pScrews[ps][1] + 4);
          tctx.stroke();
        }

        // 4 Colorfigures swatch dots at top center (`tomato`, `mustard`, `mint`, `cobalt`)
        var swCols = ['#ef6a4c', '#f4b829', '#93d3b0', '#76a0e2'];
        for (var sw = 0; sw < 4; sw++) {
          var sx = tw / 2 - 48 + sw * 32;
          tctx.fillStyle = swCols[sw];
          tctx.beginPath();
          tctx.arc(sx, cardY + 24, 7, 0, Math.PI * 2);
          tctx.fill();
          tctx.strokeStyle = '#231e16';
          tctx.lineWidth = 2.5;
          tctx.stroke();
        }

        tctx.textAlign = 'center';

        // Bold Hand-Inked Title (`PAWS & WIRES`) with offset mustard shadow
        tctx.font = '900 52px ui-monospace, SFMono-Regular, Menlo, monospace';
        tctx.fillStyle = '#f4b829';
        tctx.fillText(tr('PAWS & WIRES', 'PATAS Y CABLES'), tw / 2 + 3, cardY + 84);
        tctx.fillStyle = '#231e16';
        tctx.fillText(tr('PAWS & WIRES', 'PATAS Y CABLES'), tw / 2, cardY + 81);

        // Cream Callout Pill (`#fff4d6` tag from `colorfigures`: `STARRING CATONE & CATWHO`)
        drawColorfigureCard(tctx, tw / 2 - 195, cardY + 100, 390, 34, 17, '#fff4d6', '#231e16', 3.5, '#41538f', 3);
        tctx.font = '800 17px ui-monospace, SFMono-Regular, Menlo, monospace';
        tctx.fillStyle = '#231e16';
        tctx.fillText(
          tr('STARRING CATONE & CATWHO', 'CON CATONE Y CATWHO'),
          tw / 2,
          cardY + 123
        );

        // Sleek 3D Start Button Pill below the cats (`y = 418..486`)
        drawColorfigureCard(tctx, tw / 2 - 250, 418, 500, 66, 33, '#f4b829', '#231e16', 4.5, '#231e16', 4);
        tctx.font = '900 25px ui-monospace, SFMono-Regular, Menlo, monospace';
        tctx.fillStyle = '#231e16';
        tctx.fillText(
          tr('[ PRESS GREEN BAR TO START ]', '[ PRESIONA BARRA VERDE PARA INICIAR ]'),
          tw / 2,
          460
        );

        tctx.textAlign = 'left';
      }

      if (titleScreenTex) titleScreenTex.needsUpdate = true;
    }
  }

  // ============================================================================
  // COLORFIGURES + ANATOMY HAND-INKED PROCEDURAL TEXTURES & DYNAMIC 3D BADGES
  // ============================================================================
  function createRealisticSteelDeckTexture() {
    var c = document.createElement('canvas');
    c.width = 1024;
    c.height = 1024;
    var cx = c.getContext('2d');

    // Warm Ceramic/Paper Recessed Cutaway Mechanism Deck (`CERAMIC` from `colorfigures`)
    cx.fillStyle = '#e3e0d2';
    cx.fillRect(0, 0, 1024, 1024);

    // Inner technical schematic plate (`#f8f6f0` with `#231e16` hand-inked border)
    drawColorfigureCard(cx, 56, 56, 912, 888, 22, '#f8f6f0', '#231e16', 8, '#41538f', 6);

    // Fine drafting grid inside the mechanism bay
    cx.strokeStyle = 'rgba(35, 30, 22, 0.08)';
    cx.lineWidth = 2;
    for (var g = 96; g <= 928; g += 48) {
      cx.beginPath();
      cx.moveTo(g, 64);
      cx.lineTo(g, 936);
      cx.stroke();
      cx.beginPath();
      cx.moveTo(64, g);
      cx.lineTo(960, g);
      cx.stroke();
    }

    // Hand-inked schematic wire traces in Colorfigures swatches (`tomato`, `cobalt`, `mint`, `mustard`)
    var traceCols = ['#ef6a4c', '#76a0e2', '#43c25c', '#f4b829'];
    for (var tr = 0; tr < 16; tr++) {
      var tx = 136 + tr * 50;
      cx.strokeStyle = traceCols[tr % 4];
      cx.lineWidth = 5;
      cx.beginPath();
      cx.moveTo(tx, 110);
      cx.lineTo(tx, 340 + (tr % 4) * 35);
      cx.lineTo(tx + (tr % 2 === 0 ? 24 : -24), 420 + (tr % 3) * 40);
      cx.lineTo(tx + (tr % 2 === 0 ? 24 : -24), 890);
      cx.stroke();
    }

    // Inked terminal rivets
    for (var vx = 136; vx <= 896; vx += 95) {
      for (var vy = 136; vy <= 860; vy += 120) {
        cx.fillStyle = '#f4b829';
        cx.beginPath();
        cx.arc(vx, vy, 8, 0, Math.PI * 2);
        cx.fill();
        cx.strokeStyle = '#231e16';
        cx.lineWidth = 3;
        cx.stroke();
      }
    }

    // Component mounting bays (`wheresryan22/anatomy` technical boxes)
    cx.strokeStyle = '#231e16';
    cx.lineWidth = 4;
    cx.strokeRect(130, 150, 190, 120);
    cx.strokeRect(704, 150, 190, 120);
    cx.strokeRect(362, 170, 300, 140);

    return new THREE.CanvasTexture(c);
  }

  function createRealisticC4Texture() {
    var c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    var cx = c.getContext('2d');

    cx.fillStyle = '#cfc8b8';
    cx.fillRect(0, 0, 256, 256);

    cx.strokeStyle = '#231e16';
    cx.lineWidth = 8;
    cx.strokeRect(8, 8, 240, 240);

    drawRoundedCard(cx, 26, 48, 204, 52, 10, '#fff4d6', '#231e16', 4);
    cx.fillStyle = '#231e16';
    cx.font = '800 28px ui-monospace, SFMono-Regular, Menlo, monospace';
    cx.fillText('M112 C-4', 56, 84);
    cx.font = '800 18px ui-monospace, SFMono-Regular, Menlo, monospace';
    cx.fillStyle = '#3d3935';
    cx.fillText('CHARGE BLOCK', 54, 138);
    cx.fillText('REV 08-CF', 72, 172);

    return new THREE.CanvasTexture(c);
  }

  function renderLaserBadgeCanvas() {
    if (!laserBadgeCanvas) {
      laserBadgeCanvas = document.createElement('canvas');
      laserBadgeCanvas.width = 256;
      laserBadgeCanvas.height = 256;
    }
    var cx = laserBadgeCanvas.getContext('2d');
    var cost = getLaserUpgradeCost();
    var canAfford = clickerCoins >= cost;

    cx.clearRect(0, 0, 256, 256);
    cx.fillStyle = '#fff4d6';
    cx.beginPath();
    cx.arc(128, 128, 120, 0, Math.PI * 2);
    cx.fill();

    cx.strokeStyle = '#231e16';
    cx.lineWidth = 12;
    cx.stroke();

    // Hand-inked Laser beam & tomato target icon
    cx.strokeStyle = '#ef6a4c';
    cx.lineWidth = 9;
    cx.beginPath();
    cx.moveTo(46, 134);
    cx.lineTo(176, 76);
    cx.stroke();

    cx.fillStyle = '#ef6a4c';
    cx.beginPath();
    cx.arc(176, 76, 22, 0, Math.PI * 2);
    cx.fill();
    cx.strokeStyle = '#231e16';
    cx.lineWidth = 4;
    cx.stroke();

    cx.font = '800 26px ui-monospace, SFMono-Regular, Menlo, monospace';
    cx.textAlign = 'center';
    cx.fillStyle = '#231e16';
    cx.fillText(tr('LASER LV.', 'LÁSER NV.') + upgPowerLevel, 128, 182);
    cx.font = '800 24px ui-monospace, SFMono-Regular, Menlo, monospace';
    cx.fillStyle = canAfford ? '#1f4034' : '#cf5038';
    cx.fillText('$' + cost + ' [x' + getMilestoneMultiplier(upgPowerLevel) + ']', 128, 216);
    cx.textAlign = 'left';

    if (laserBadgeTexture) laserBadgeTexture.needsUpdate = true;
  }

  function createLaserButtonBadgeTexture() {
    renderLaserBadgeCanvas();
    laserBadgeTexture = new THREE.CanvasTexture(laserBadgeCanvas);
    return laserBadgeTexture;
  }

  function renderFishBadgeCanvas() {
    if (!fishBadgeCanvas) {
      fishBadgeCanvas = document.createElement('canvas');
      fishBadgeCanvas.width = 256;
      fishBadgeCanvas.height = 256;
    }
    var cx = fishBadgeCanvas.getContext('2d');
    var cost = getFishUpgradeCost();
    var canAfford = clickerCoins >= cost;

    cx.clearRect(0, 0, 256, 256);
    cx.fillStyle = '#fff4d6';
    cx.beginPath();
    cx.arc(128, 128, 120, 0, Math.PI * 2);
    cx.fill();

    cx.strokeStyle = '#231e16';
    cx.lineWidth = 12;
    cx.stroke();

    // Hand-inked Salmon Fish Icon (`tomato` + `#231e16` ink outline)
    cx.fillStyle = '#ef6a4c';
    cx.strokeStyle = '#231e16';
    cx.lineWidth = 5;
    cx.beginPath();
    cx.ellipse(115, 92, 48, 25, 0, 0, Math.PI * 2);
    cx.fill();
    cx.stroke();

    cx.beginPath();
    cx.moveTo(156, 92);
    cx.lineTo(198, 66);
    cx.lineTo(198, 118);
    cx.closePath();
    cx.fill();
    cx.stroke();

    cx.fillStyle = '#231e16';
    cx.beginPath();
    cx.arc(84, 86, 6, 0, Math.PI * 2);
    cx.fill();

    cx.font = '800 26px ui-monospace, SFMono-Regular, Menlo, monospace';
    cx.textAlign = 'center';
    cx.fillStyle = '#231e16';
    cx.fillText(tr('TREATS LV.', 'COMIDA NV.') + upgAutoLevel, 128, 182);
    cx.font = '800 23px ui-monospace, SFMono-Regular, Menlo, monospace';
    cx.fillStyle = canAfford ? '#1f4034' : '#cf5038';
    cx.fillText('$' + cost + ' [+' + getAutomaticIps().toFixed(1) + '/s]', 128, 216);
    cx.textAlign = 'left';

    if (fishBadgeTexture) fishBadgeTexture.needsUpdate = true;
  }

  function createFishButtonBadgeTexture() {
    renderFishBadgeCanvas();
    fishBadgeTexture = new THREE.CanvasTexture(fishBadgeCanvas);
    return fishBadgeTexture;
  }

  function renderYarnBadgeCanvas() {
    if (!yarnBadgeCanvas) {
      yarnBadgeCanvas = document.createElement('canvas');
      yarnBadgeCanvas.width = 256;
      yarnBadgeCanvas.height = 256;
    }
    var cx = yarnBadgeCanvas.getContext('2d');
    var cost = getChronoUpgradeCost();
    var canAfford = clickerCoins >= cost;

    cx.clearRect(0, 0, 256, 256);
    cx.fillStyle = '#fff4d6';
    cx.beginPath();
    cx.arc(128, 128, 120, 0, Math.PI * 2);
    cx.fill();

    cx.strokeStyle = '#231e16';
    cx.lineWidth = 12;
    cx.stroke();

    // Hand-inked Wound Wool Yarn Ball Icon
    if (typeof drawHandInkedYarnBall2D === 'function') {
      drawHandInkedYarnBall2D(cx, 124, 86, 36, false);
    } else {
      cx.fillStyle = '#76a0e2';
      cx.beginPath();
      cx.arc(128, 86, 34, 0, Math.PI * 2);
      cx.fill();
      cx.strokeStyle = '#231e16';
      cx.lineWidth = 5;
      cx.stroke();
    }

    cx.font = '800 25px ui-monospace, SFMono-Regular, Menlo, monospace';
    cx.textAlign = 'center';
    cx.fillStyle = '#231e16';
    cx.fillText(tr('YARN LV.', 'LANA NV.') + upgCritLevel, 128, 182);
    cx.font = '800 23px ui-monospace, SFMono-Regular, Menlo, monospace';
    cx.fillStyle = canAfford ? '#1f4034' : '#3159ab';
    cx.fillText(canAfford ? '$' + cost + ' [12s]' : tr('TAP TO TOSS!', '¡TOCA LANZAR!'), 128, 216);
    cx.textAlign = 'left';

    if (yarnBadgeTexture) yarnBadgeTexture.needsUpdate = true;
  }

  function createYarnButtonBadgeTexture() {
    renderYarnBadgeCanvas();
    yarnBadgeTexture = new THREE.CanvasTexture(yarnBadgeCanvas);
    return yarnBadgeTexture;
  }

  function renderExitXrBadgeCanvas() {
    if (!exitXrBadgeCanvas) {
      exitXrBadgeCanvas = document.createElement('canvas');
      exitXrBadgeCanvas.width = 256;
      exitXrBadgeCanvas.height = 256;
    }
    var cx = exitXrBadgeCanvas.getContext('2d');
    cx.clearRect(0, 0, 256, 256);
    cx.fillStyle = '#fff4d6';
    cx.beginPath();
    cx.arc(128, 128, 120, 0, Math.PI * 2);
    cx.fill();

    cx.strokeStyle = '#231e16';
    cx.lineWidth = 12;
    cx.stroke();

    // Hand-inked Door / Exit Arrow Icon
    cx.fillStyle = '#ef6a4c';
    cx.strokeStyle = '#231e16';
    cx.lineWidth = 6;
    cx.beginPath();
    cx.roundRect(78, 52, 66, 82, 8);
    cx.fill();
    cx.stroke();

    cx.strokeStyle = '#231e16';
    cx.lineWidth = 8;
    cx.beginPath();
    cx.moveTo(122, 93);
    cx.lineTo(186, 93);
    cx.moveTo(164, 71);
    cx.lineTo(188, 93);
    cx.lineTo(164, 115);
    cx.stroke();

    cx.font = '900 28px ui-monospace, SFMono-Regular, Menlo, monospace';
    cx.textAlign = 'center';
    cx.fillStyle = '#231e16';
    cx.fillText(tr('EXIT VR', 'SALIR VR'), 128, 180);
    cx.font = '800 21px ui-monospace, SFMono-Regular, Menlo, monospace';
    cx.fillStyle = '#cf5038';
    cx.fillText(tr('[ TOUCH HERE ]', '[ TOCA AQUÍ ]'), 128, 214);
    cx.textAlign = 'left';

    if (exitXrBadgeTexture) exitXrBadgeTexture.needsUpdate = true;
  }

  function createExitXrButtonBadgeTexture() {
    renderExitXrBadgeCanvas();
    exitXrBadgeTexture = new THREE.CanvasTexture(exitXrBadgeCanvas);
    return exitXrBadgeTexture;
  }

  function renderAudioBadgeCanvas() {
    if (!audioBadgeCanvas) {
      audioBadgeCanvas = document.createElement('canvas');
      audioBadgeCanvas.width = 256;
      audioBadgeCanvas.height = 128;
    }
    var cx = audioBadgeCanvas.getContext('2d');
    cx.fillStyle = audioMuted ? '#ebe6da' : '#93d3b0';
    cx.fillRect(0, 0, 256, 128);
    cx.strokeStyle = '#231e16';
    cx.lineWidth = 10;
    cx.strokeRect(5, 5, 246, 118);

    cx.font = '800 28px ui-monospace, SFMono-Regular, Menlo, monospace';
    cx.textAlign = 'center';
    cx.fillStyle = '#231e16';
    cx.fillText(
      tr(audioMuted ? 'SOUND: OFF' : 'SOUND: ON', audioMuted ? 'SILENCIO' : 'SONIDO: ON'),
      128,
      74
    );
    cx.textAlign = 'left';
    if (audioBadgeTexture) audioBadgeTexture.needsUpdate = true;
  }

  function renderLangBadgeCanvas() {
    if (!langBadgeCanvas) {
      langBadgeCanvas = document.createElement('canvas');
      langBadgeCanvas.width = 256;
      langBadgeCanvas.height = 128;
    }
    var cx = langBadgeCanvas.getContext('2d');
    cx.fillStyle = '#f4b829';
    cx.fillRect(0, 0, 256, 128);
    cx.strokeStyle = '#231e16';
    cx.lineWidth = 10;
    cx.strokeRect(5, 5, 246, 118);

    cx.font = '800 30px ui-monospace, SFMono-Regular, Menlo, monospace';
    cx.textAlign = 'center';
    cx.fillStyle = '#231e16';
    cx.fillText(tr('LANG: EN', 'IDIOMA: ES'), 128, 75);
    cx.textAlign = 'left';
    if (langBadgeTexture) langBadgeTexture.needsUpdate = true;
  }

  function refreshAllDynamicBadges() {
    renderLaserBadgeCanvas();
    renderFishBadgeCanvas();
    renderYarnBadgeCanvas();
    renderExitXrBadgeCanvas();
    renderAudioBadgeCanvas();
    renderLangBadgeCanvas();
  }

  function createScorchCraterTexture() {
    var c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    var cx = c.getContext('2d');

    var g = cx.createRadialGradient(256, 256, 18, 256, 256, 245);
    g.addColorStop(0, '#ff4500');
    g.addColorStop(0.22, '#7c2d12');
    g.addColorStop(0.5, '#090a0f');
    g.addColorStop(0.82, 'rgba(9, 10, 15, 0.75)');
    g.addColorStop(1, 'rgba(9, 10, 15, 0.0)');
    cx.fillStyle = g;
    cx.fillRect(0, 0, 512, 512);

    return new THREE.CanvasTexture(c);
  }

  function createGingerTabbyTexture() {
    var c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    var cx = c.getContext('2d');

    // Warm, Soft, Plush Cel-Shaded Ginger-Apricot Coat (Zero creepy dark worm stripes!)
    var grad = cx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#f59e0b');
    grad.addColorStop(0.5, '#fb923c');
    grad.addColorStop(1, '#fdba74');
    cx.fillStyle = grad;
    cx.fillRect(0, 0, 512, 512);

    // Subtle Warm Honey Highlights for Plush Cel-Shaded Appeal
    cx.fillStyle = 'rgba(254, 243, 199, 0.22)';
    for (var s = 0; s < 6; s++) {
      var sy = 64 + s * 76;
      cx.beginPath();
      cx.ellipse(256, sy, 210, 18, 0, 0, Math.PI * 2);
      cx.fill();
    }

    var tex = new THREE.CanvasTexture(c);
    return tex;
  }

  function createCatIrisTexture() {
    var c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    var cx = c.getContext('2d');

    // Bright Expressive Emerald-Mint Outer Iris Ring
    var grad = cx.createRadialGradient(128, 128, 36, 128, 128, 124);
    grad.addColorStop(0, '#6ee7b7');
    grad.addColorStop(0.65, '#10b981');
    grad.addColorStop(0.92, '#047857');
    grad.addColorStop(1, '#1e1b18');
    cx.fillStyle = grad;
    cx.fillRect(0, 0, 256, 256);

    // Huge Round Kawaii Playful Pupil (Friendly & Adorable instead of a scary slit!)
    cx.fillStyle = '#181310';
    cx.beginPath();
    cx.arc(128, 128, 76, 0, Math.PI * 2);
    cx.fill();

    // Large Glossy Kawaii Starlight Catchlights
    cx.fillStyle = '#ffffff';
    cx.beginPath();
    cx.arc(92, 84, 30, 0, Math.PI * 2);
    cx.fill();
    cx.beginPath();
    cx.arc(164, 162, 15, 0, Math.PI * 2);
    cx.fill();
    cx.beginPath();
    cx.arc(158, 92, 8, 0, Math.PI * 2);
    cx.fill();

    return new THREE.CanvasTexture(c);
  }

  function buildCurvedCatEar(furMat, pinkMat, creamMat, isRight) {
    var earGroup = new THREE.Group();

    // Smooth Rounded Triangular Ear Shape with Bevel (`ExtrudeGeometry`)
    var earShape = new THREE.Shape();
    earShape.moveTo(-0.026, 0);
    earShape.quadraticCurveTo(-0.028, 0.036, 0, 0.062);
    earShape.quadraticCurveTo(0.028, 0.036, 0.026, 0);
    earShape.closePath();

    var earGeo = new THREE.ExtrudeGeometry(earShape, {
      depth: 0.010,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.005,
      bevelSegments: 4
    });
    var outerEar = new THREE.Mesh(earGeo, furMat);
    outerEar.position.z = -0.005;
    earGroup.add(outerEar);

    // Pink Inner Concha
    var innerShape = new THREE.Shape();
    innerShape.moveTo(-0.015, 0.005);
    innerShape.quadraticCurveTo(-0.016, 0.028, 0, 0.046);
    innerShape.quadraticCurveTo(0.016, 0.028, 0.015, 0.005);
    innerShape.closePath();
    var innerGeo = new THREE.ShapeGeometry(innerShape);
    var innerMesh = new THREE.Mesh(innerGeo, pinkMat);
    innerMesh.position.set(0, 0, 0.012);
    earGroup.add(innerMesh);

    // Ear Fluff Tuft at Base
    var tuft = new THREE.Mesh(new THREE.SphereGeometry(0.011, 12, 10), creamMat);
    tuft.scale.set(1.4, 0.7, 0.6);
    tuft.position.set(isRight ? -0.008 : 0.008, 0.008, 0.012);
    earGroup.add(tuft);

    return earGroup;
  }

  var sharedInkOutlineMat = null;
  function addInkOutline(mesh, thicknessBump, colorHex) {
    if (!mesh || !mesh.geometry) return;
    if (!sharedInkOutlineMat && !colorHex) {
      sharedInkOutlineMat = new THREE.MeshBasicMaterial({
        color: 0x1c0d06,
        side: THREE.BackSide
      });
    }
    var mat = colorHex
      ? new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.BackSide })
      : sharedInkOutlineMat;
    var outline = new THREE.Mesh(mesh.geometry, mat);
    var s = 1.0 + (thicknessBump || 0.035);
    outline.scale.set(s, s, s);
    mesh.add(outline);
    return outline;
  }

  function createWorkbenchMatTexture() {
    var c = document.createElement('canvas');
    c.width = 1024;
    c.height = 1024;
    var cx = c.getContext('2d');

    // Warm Colorfigures Board Surface (`BOARD = #e6e1d4`)
    cx.fillStyle = '#e6e1d4';
    cx.fillRect(0, 0, 1024, 1024);

    // Outer Hand-Inked Border + Inner Rule (`#231e16`)
    drawRoundedCard(cx, 14, 14, 996, 996, 36, '#ebe6da', '#231e16', 10);
    drawRoundedCard(cx, 34, 34, 956, 956, 24, null, 'rgba(35, 30, 22, 0.28)', 3);

    // Subtle Anatomy Drafting Grid (`wheresryan22/anatomy`)
    cx.strokeStyle = 'rgba(35, 30, 22, 0.09)';
    cx.lineWidth = 2;
    for (var g = 64; g <= 960; g += 64) {
      cx.beginPath();
      cx.moveTo(g, 36);
      cx.lineTo(g, 988);
      cx.stroke();
      cx.beginPath();
      cx.moveTo(36, g);
      cx.lineTo(988, g);
      cx.stroke();
    }

    // Millimeter Ruler Ticks along Front & Back Edges (`wheresryan22/anatomy`)
    cx.strokeStyle = 'rgba(35, 30, 22, 0.42)';
    cx.lineWidth = 2;
    for (var rt = 80; rt <= 944; rt += 16) {
      var th = rt % 64 === 0 ? 18 : 9;
      cx.beginPath();
      cx.moveTo(rt, 988);
      cx.lineTo(rt, 988 - th);
      cx.stroke();
      cx.beginPath();
      cx.moveTo(rt, 36);
      cx.lineTo(rt, 36 + th);
      cx.stroke();
    }

    // 4 Corner Screw Heads (`wheresryan22/anatomy`)
    var bCorners = [
      [56, 56],
      [968, 56],
      [56, 968],
      [968, 968]
    ];
    for (var bc = 0; bc < bCorners.length; bc++) {
      var bx = bCorners[bc][0];
      var by = bCorners[bc][1];
      cx.fillStyle = '#cfc8b8';
      cx.beginPath();
      cx.arc(bx, by, 14, 0, Math.PI * 2);
      cx.fill();
      cx.strokeStyle = '#231e16';
      cx.lineWidth = 4;
      cx.stroke();
      cx.beginPath();
      cx.moveTo(bx - 9, by - 7);
      cx.lineTo(bx + 9, by + 7);
      cx.stroke();
    }

    // Signature Colorfigures Flat Indigo-Blue Cast Shadows (`#41538f` pushed lower-left on the board!)
    cx.fillStyle = 'rgba(65, 83, 143, 0.34)';
    // Main bomb briefcase cast shadow
    drawRoundedCard(cx, 184, 260, 620, 615, 28, 'rgba(65, 83, 143, 0.34)', null, 0);
    // Left laser turret cast shadow
    cx.beginPath();
    cx.arc(122, 730, 68, 0, Math.PI * 2);
    cx.fill();
    // Right treats dispenser cast shadow
    cx.beginPath();
    cx.arc(872, 730, 68, 0, Math.PI * 2);
    cx.fill();
    // Right kibble bowl cast shadow
    cx.beginPath();
    cx.arc(886, 480, 74, 0, Math.PI * 2);
    cx.fill();

    return new THREE.CanvasTexture(c);
  }

  function buildSculptedCatPaw(furMat, creamMat, pinkMat) {
    var pawGroup = new THREE.Group();

    // Plump Cream-White Mitten Base (Connected at Wrist `[0,0,0]` to the 2-bone IK Forearm!)
    var mittenBase = new THREE.Mesh(new THREE.SphereGeometry(0.032, 20, 16), creamMat);
    mittenBase.scale.set(1.18, 0.68, 1.18);
    mittenBase.position.set(0, 0, 0.014);
    addInkOutline(mittenBase, 0.055, 0x291105);
    pawGroup.add(mittenBase);

    // 4 Sculpted Soft Plush Toes + Pink Toe Beans (No scary spikes!)
    var toeOffsets = [-0.020, -0.007, 0.007, 0.020];
    for (var t = 0; t < 4; t++) {
      var zOff = t === 1 || t === 2 ? 0.038 : 0.032;
      var toe = new THREE.Mesh(new THREE.SphereGeometry(0.013, 14, 12), creamMat);
      toe.scale.set(0.95, 0.85, 1.18);
      toe.position.set(toeOffsets[t], -0.001, zOff);
      pawGroup.add(toe);

      var bean = new THREE.Mesh(new THREE.SphereGeometry(0.0075, 10, 10), pinkMat);
      bean.position.set(toeOffsets[t], -0.010, zOff + 0.003);
      pawGroup.add(bean);
    }

    // Central Heart-Shaped Pink Palm Pad
    var palmPad = new THREE.Mesh(new THREE.SphereGeometry(0.016, 14, 12), pinkMat);
    palmPad.scale.set(1.2, 0.5, 1.0);
    palmPad.position.set(0, -0.013, 0.014);
    pawGroup.add(palmPad);

    return pawGroup;
  }

  function createLimbSegmentMesh(radiusTop, radiusBottom, mat) {
    var segGroup = new THREE.Group();
    // Unit-length cylinder along +Z axis so `lookAt(target)` + `scale.z = dist` connects 2 points exactly!
    var cylGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, 1.0, 16);
    cylGeo.rotateX(Math.PI / 2);
    cylGeo.translate(0, 0, 0.5);
    var cylMesh = new THREE.Mesh(cylGeo, mat);
    segGroup.add(cylMesh);

    var outGeo = new THREE.CylinderGeometry(radiusTop + 0.003, radiusBottom + 0.003, 1.0, 16);
    outGeo.rotateX(Math.PI / 2);
    outGeo.translate(0, 0, 0.5);
    var outMesh = new THREE.Mesh(
      outGeo,
      new THREE.MeshBasicMaterial({ color: 0x291105, side: THREE.BackSide })
    );
    segGroup.add(outMesh);
    return segGroup;
  }

  function orientLocalLimbSegment(segObj, startPt, endPt) {
    var dx = endPt.x - startPt.x;
    var dy = endPt.y - startPt.y;
    var dz = endPt.z - startPt.z;
    var len = Math.max(0.005, Math.hypot(dx, dy, dz));
    var dir = new THREE.Vector3(dx / len, dy / len, dz / len);
    segObj.position.set(startPt.x, startPt.y, startPt.z);
    segObj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    segObj.scale.set(1, 1, len);
  }

  function updateCatArmIK(shoulderPos, wristPos, sideSign, upperArmObj, elbowMesh, forearmObj, pawGroup) {
    if (!upperArmObj || !elbowMesh || !forearmObj || !pawGroup) return;

    // Natural Feline Elbow (`E`) arched outward & slightly up between Shoulder (`S`) and Wrist (`W`) in local `catRig` space
    var elbowPos = {
      x: (shoulderPos.x + wristPos.x) * 0.5 + sideSign * 0.038,
      y: Math.max(shoulderPos.y, wristPos.y) + 0.016,
      z: (shoulderPos.z + wristPos.z) * 0.5 - 0.015
    };

    // 1. Upper Arm: Shoulder -> Elbow (100% local space via `setFromUnitVectors`)
    orientLocalLimbSegment(upperArmObj, shoulderPos, elbowPos);

    // 2. Seamless Furry Elbow Sphere
    elbowMesh.position.set(elbowPos.x, elbowPos.y, elbowPos.z);

    // 3. Forearm: Elbow -> Wrist (100% local space via `setFromUnitVectors`)
    orientLocalLimbSegment(forearmObj, elbowPos, wristPos);

    // 4. Orient Paw naturally along the forearm reach direction
    var dx = wristPos.x - elbowPos.x;
    var dz = Math.max(0.02, wristPos.z - elbowPos.z);
    pawGroup.rotation.y = Math.atan2(dx, dz) * 0.65;
    pawGroup.rotation.x = Math.max(-0.35, Math.min(0.45, (elbowPos.y - wristPos.y) * 1.8));
  }

  function buildSculptedGingerCat() {
    var root = new THREE.Group();
    root.position.set(0, 0.02, -0.23);

    var tabbyTex = createGingerTabbyTexture();
    var irisTex = createCatIrisTexture();

    var furMat = new THREE.MeshStandardMaterial({
      map: tabbyTex,
      roughness: 0.55,
      metalness: 0.04
    });
    var darkStripeMat = new THREE.MeshStandardMaterial({
      color: 0x7c2d12,
      roughness: 0.65
    });
    var creamMat = new THREE.MeshStandardMaterial({
      color: 0xfff7ed,
      roughness: 0.48,
      metalness: 0.02
    });
    var pinkMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.35
    });
    var eyeMat = new THREE.MeshBasicMaterial({ map: irisTex });
    var goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.2,
      metalness: 0.85
    });

    catBodyGroup = new THREE.Group();

    // Sculpted Torso + Seated Lower Body Base + Hind Haunches + Fluffy Cream Chest Bib
    var torso = new THREE.Mesh(new THREE.SphereGeometry(0.094, 28, 22), furMat);
    torso.scale.set(1.18, 1.05, 1.32);
    torso.position.set(0, 0.072, -0.01);
    addInkOutline(torso, 0.048, 0x291105);
    catBodyGroup.add(torso);

    // Seated lower belly/base cylinder so the cat sits flush on the workbench surface (zero floating gap!)
    var seatedBase = new THREE.Mesh(new THREE.CylinderGeometry(0.096, 0.112, 0.056, 24), furMat);
    seatedBase.position.set(0, 0.026, -0.015);
    addInkOutline(seatedBase, 0.045, 0x291105);
    catBodyGroup.add(seatedBase);

    for (var hSide = -1; hSide <= 1; hSide += 2) {
      var haunch = new THREE.Mesh(new THREE.SphereGeometry(0.068, 20, 18), furMat);
      haunch.scale.set(0.92, 0.98, 1.18);
      haunch.position.set(hSide * 0.072, 0.045, -0.032);
      addInkOutline(haunch, 0.048, 0x291105);
      catBodyGroup.add(haunch);

      // Tucked hind foot resting flat on the workbench mat
      var hindFoot = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 12), creamMat);
      hindFoot.scale.set(1.0, 0.52, 1.35);
      hindFoot.position.set(hSide * 0.082, 0.012, 0.032);
      addInkOutline(hindFoot, 0.048, 0x291105);
      catBodyGroup.add(hindFoot);

      // Sculpted Shoulder Deltoid Socket embedded into upper torso
      var shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.036, 18, 16), furMat);
      shoulderCap.position.set(hSide * 0.072, 0.088, 0.038);
      addInkOutline(shoulderCap, 0.05, 0x291105);
      catBodyGroup.add(shoulderCap);
    }

    var chestBib = new THREE.Mesh(new THREE.SphereGeometry(0.068, 22, 18), creamMat);
    chestBib.scale.set(1.04, 0.92, 0.70);
    chestBib.position.set(0, 0.074, 0.072);
    catBodyGroup.add(chestBib);

    // Sculpted Feline Head (`catHeadGroup`)
    catHeadGroup = new THREE.Group();
    catHeadGroup.position.set(0, 0.174, 0.048);

    var cranium = new THREE.Mesh(new THREE.SphereGeometry(0.084, 32, 24), furMat);
    cranium.scale.set(1.16, 0.96, 1.04);
    cranium.userData = { actionType: 'CAT_BOOP' };
    addInkOutline(cranium, 0.048, 0x291105);
    catHeadGroup.add(cranium);

    // Subtle Integrated Feline Cheeks
    for (var cSide = -1; cSide <= 1; cSide += 2) {
      var cheek = new THREE.Mesh(new THREE.SphereGeometry(0.038, 20, 16), creamMat);
      cheek.scale.set(1.05, 0.75, 0.85);
      cheek.position.set(cSide * 0.045, -0.018, 0.042);
      catHeadGroup.add(cheek);

      var cheekTuft = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.028, 12), furMat);
      cheekTuft.rotation.z = -cSide * 1.42;
      cheekTuft.position.set(cSide * 0.088, -0.012, 0.022);
      addInkOutline(cheekTuft, 0.055, 0x291105);
      catHeadGroup.add(cheekTuft);
    }

    // Forehead Tabby Stripes
    for (var st = -1; st <= 1; st++) {
      var stripe = new THREE.Mesh(new THREE.BoxGeometry(0.007, 0.026, 0.010), darkStripeMat);
      stripe.position.set(st * 0.018, 0.044, 0.072);
      stripe.rotation.z = st * -0.15;
      stripe.rotation.x = -0.38;
      catHeadGroup.add(stripe);
    }

    // Protruding Cream Whisker Pads (Muzzle) + Chin
    for (var mSide = -1; mSide <= 1; mSide += 2) {
      var muzzlePad = new THREE.Mesh(new THREE.SphereGeometry(0.022, 18, 14), creamMat);
      muzzlePad.scale.set(1.12, 0.85, 1.0);
      muzzlePad.position.set(mSide * 0.018, -0.018, 0.074);
      catHeadGroup.add(muzzlePad);
    }
    var chin = new THREE.Mesh(new THREE.SphereGeometry(0.016, 14, 12), creamMat);
    chin.scale.set(1.25, 0.6, 0.85);
    chin.position.set(0, -0.033, 0.068);
    catHeadGroup.add(chin);

    // Sculpted Heart-Shaped Pink Nose
    var nose = new THREE.Mesh(new THREE.SphereGeometry(0.010, 14, 12), pinkMat);
    nose.scale.set(1.3, 0.85, 0.9);
    nose.position.set(0, -0.006, 0.090);
    catHeadGroup.add(nose);

    // Cute ":3" Curved Feline Mouth (`TubeGeometry` with `CatmullRomCurve3`)
    var mouthMat = new THREE.MeshBasicMaterial({ color: 0x451a03 });
    for (var mArc = -1; mArc <= 1; mArc += 2) {
      var mCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.013, 0.089),
        new THREE.Vector3(mArc * 0.011, -0.023, 0.087),
        new THREE.Vector3(mArc * 0.022, -0.016, 0.081)
      ]);
      var mTube = new THREE.Mesh(new THREE.TubeGeometry(mCurve, 12, 0.0022, 8, false), mouthMat);
      catHeadGroup.add(mTube);
    }

    // Curved Beveled Cat Ears (`catEarLeft`, `catEarRight`)
    catEarLeft = buildCurvedCatEar(furMat, pinkMat, creamMat, false);
    catEarLeft.position.set(-0.052, 0.058, 0.005);
    catEarLeft.rotation.z = 0.26;
    catEarLeft.rotation.y = 0.16;
    catHeadGroup.add(catEarLeft);

    catEarRight = buildCurvedCatEar(furMat, pinkMat, creamMat, true);
    catEarRight.position.set(0.052, 0.058, 0.005);
    catEarRight.rotation.z = -0.26;
    catEarRight.rotation.y = -0.16;
    catHeadGroup.add(catEarRight);

    // Large Expressive Emerald Eyes
    for (var eSide = -1; eSide <= 1; eSide += 2) {
      var eyeGroup = new THREE.Group();
      eyeGroup.position.set(eSide * 0.036, 0.015, 0.070);

      var eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.023, 24, 20), eyeMat);
      eyeball.scale.set(0.52, 1.08, 1.08);
      eyeball.rotation.y = -Math.PI / 2 + eSide * 0.16;
      eyeGroup.add(eyeball);

      if (eSide < 0) catEyelidLeft = eyeGroup;
      else catEyelidRight = eyeGroup;

      catHeadGroup.add(eyeGroup);
    }

    // 6 Sleek Curved White Whiskers (`TubeGeometry`)
    var whiskerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (var wSide = -1; wSide <= 1; wSide += 2) {
      for (var wIdx = -1; wIdx <= 1; wIdx++) {
        var wCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(wSide * 0.024, -0.016 + wIdx * 0.005, 0.080),
          new THREE.Vector3(wSide * 0.058, -0.015 + wIdx * 0.007, 0.074),
          new THREE.Vector3(wSide * 0.092, -0.020 + wIdx * 0.011, 0.062)
        ]);
        var wMesh = new THREE.Mesh(new THREE.TubeGeometry(wCurve, 10, 0.0012, 6, false), whiskerMat);
        catHeadGroup.add(wMesh);
      }
    }

    // Plush Red Collar + Gold Bell
    var collar = new THREE.Mesh(
      new THREE.TorusGeometry(0.058, 0.009, 12, 28),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 })
    );
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, -0.056, 0.012);
    catHeadGroup.add(collar);

    var bell = new THREE.Mesh(new THREE.SphereGeometry(0.015, 16, 16), goldMat);
    bell.position.set(0, -0.064, 0.072);
    addInkOutline(bell, 0.06, 0x291105);
    catHeadGroup.add(bell);

    catBodyGroup.add(catHeadGroup);

    // Sculpted Curved S-Tail (`TubeGeometry` along `CatmullRomCurve3`)
    catTailPivot = new THREE.Group();
    catTailPivot.position.set(0, 0.055, -0.10);
    var tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.05, -0.05),
      new THREE.Vector3(0.02, 0.13, -0.07),
      new THREE.Vector3(-0.01, 0.20, -0.04)
    ]);
    var tailTube = new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 24, 0.018, 14, false), furMat);
    addInkOutline(tailTube, 0.05, 0x291105);
    catTailPivot.add(tailTube);

    var tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.019, 14, 14), creamMat);
    tailTip.position.set(-0.01, 0.20, -0.04);
    catTailPivot.add(tailTip);
    catBodyGroup.add(catTailPivot);

    root.add(catBodyGroup);

    // Connected 2-Bone IK Left & Right Arms (Upper Arm + Elbow Sphere + Forearm + Mitten Paw)
    catUpperArmLeft = createLimbSegmentMesh(0.024, 0.028, furMat);
    root.add(catUpperArmLeft);
    catElbowLeft = new THREE.Mesh(new THREE.SphereGeometry(0.026, 14, 12), furMat);
    addInkOutline(catElbowLeft, 0.05, 0x291105);
    root.add(catElbowLeft);
    catForearmLeft = createLimbSegmentMesh(0.023, 0.026, furMat);
    root.add(catForearmLeft);

    catUpperArmRight = createLimbSegmentMesh(0.024, 0.028, furMat);
    root.add(catUpperArmRight);
    catElbowRight = new THREE.Mesh(new THREE.SphereGeometry(0.026, 14, 12), furMat);
    addInkOutline(catElbowRight, 0.05, 0x291105);
    root.add(catElbowRight);
    catForearmRight = createLimbSegmentMesh(0.023, 0.026, furMat);
    root.add(catForearmRight);

    catPawLeftGroup = buildSculptedCatPaw(furMat, creamMat, pinkMat);
    catPawLeftGroup.position.set(-0.068, 0.024, 0.095);
    catPawLeftGroup.userData = { actionType: 'CAT_BOOP' };
    root.add(catPawLeftGroup);

    catPawRightGroup = buildSculptedCatPaw(furMat, creamMat, pinkMat);
    catPawRightGroup.position.set(0.068, 0.024, 0.095);
    catPawRightGroup.userData = { actionType: 'CAT_BOOP' };
    root.add(catPawRightGroup);

    updateCatArmIK(
      { x: -0.072, y: 0.088, z: 0.038 },
      catPawLeftGroup.position,
      -1,
      catUpperArmLeft,
      catElbowLeft,
      catForearmLeft,
      catPawLeftGroup
    );
    updateCatArmIK(
      { x: 0.072, y: 0.088, z: 0.038 },
      catPawRightGroup.position,
      1,
      catUpperArmRight,
      catElbowRight,
      catForearmRight,
      catPawRightGroup
    );

    return root;
  }

  // ============================================================================
  // GUEST STAR CAT: "CATWHO" (White & Black Masked Cat: Black Ears, Black Eye
  // Patches Covering Both Eye Areas, Pure White Fur on Nose & Mouth Muzzle!)
  // ============================================================================
  function buildSculptedCatwhoCat() {
    var root = new THREE.Group();
    root.position.set(0.18, 0.008, -0.255);

    var irisTex = createCatIrisTexture();

    var whiteFurMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.48,
      metalness: 0.02
    });
    var blackFurMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.56,
      metalness: 0.04
    });
    var pinkMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.35
    });
    var eyeMat = new THREE.MeshBasicMaterial({ map: irisTex });
    var silverBellMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.18,
      metalness: 0.88
    });

    tipiBodyGroup = new THREE.Group();

    // Snow-White Sculpted Torso + Seated Lower Body Base + Black Back Saddle Patch
    var torso = new THREE.Mesh(new THREE.SphereGeometry(0.090, 26, 20), whiteFurMat);
    torso.scale.set(1.15, 1.04, 1.28);
    torso.position.set(0, 0.070, -0.01);
    torso.userData = { actionType: 'TIPI_BOOP' };
    addInkOutline(torso, 0.046, 0x090d16);
    tipiBodyGroup.add(torso);

    var backSaddlePatch = new THREE.Mesh(new THREE.SphereGeometry(0.074, 22, 16), blackFurMat);
    backSaddlePatch.scale.set(1.12, 0.90, 1.15);
    backSaddlePatch.position.set(0.012, 0.086, -0.032);
    tipiBodyGroup.add(backSaddlePatch);

    var seatedBase = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.108, 0.054, 24), whiteFurMat);
    seatedBase.position.set(0, 0.025, -0.015);
    addInkOutline(seatedBase, 0.044, 0x090d16);
    tipiBodyGroup.add(seatedBase);

    for (var hSide = -1; hSide <= 1; hSide += 2) {
      var haunchMat = hSide > 0 ? blackFurMat : whiteFurMat;
      var haunch = new THREE.Mesh(new THREE.SphereGeometry(0.065, 18, 16), haunchMat);
      haunch.scale.set(0.92, 0.96, 1.16);
      haunch.position.set(hSide * 0.070, 0.044, -0.030);
      addInkOutline(haunch, 0.046, 0x090d16);
      tipiBodyGroup.add(haunch);

      var hindFoot = new THREE.Mesh(new THREE.SphereGeometry(0.031, 14, 12), whiteFurMat);
      hindFoot.scale.set(1.0, 0.52, 1.32);
      hindFoot.position.set(hSide * 0.078, 0.012, 0.030);
      addInkOutline(hindFoot, 0.046, 0x090d16);
      tipiBodyGroup.add(hindFoot);

      var shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.034, 16, 14), blackFurMat);
      shoulderCap.position.set(hSide * 0.070, 0.086, 0.036);
      addInkOutline(shoulderCap, 0.048, 0x090d16);
      tipiBodyGroup.add(shoulderCap);
    }

    var chestBib = new THREE.Mesh(new THREE.SphereGeometry(0.066, 20, 16), whiteFurMat);
    chestBib.scale.set(1.04, 0.92, 0.72);
    chestBib.position.set(0, 0.072, 0.070);
    tipiBodyGroup.add(chestBib);

    // Sculpted Head (`tipiHeadGroup`): Snow-White Base + 3D Vertex-Colored Black Eye-Mask Patches + Black Ears + White Nose/Mouth!
    tipiHeadGroup = new THREE.Group();
    tipiHeadGroup.position.set(0, 0.170, 0.046);

    var crGeo = new THREE.SphereGeometry(0.083, 64, 48);
    if (crGeo && crGeo.attributes && crGeo.attributes.position) {
      var posAttr = crGeo.attributes.position;
      var colors = new Float32Array(posAttr.count * 3);
      for (var vIdx = 0; vIdx < posAttr.count; vIdx++) {
        var vx = posAttr.getX(vIdx);
        var vy = posAttr.getY(vIdx);
        var vz = posAttr.getZ(vIdx);
        // Elliptical mask patches covering the Left & Right Eye Areas up to the Black Ears,
        // while keeping the Nose Bridge (`|vx| < 0.013, vy < 0.018`), Nose, Cheeks & Mouth (`vy < -0.008`) Pure White!
        var dLeftEye = Math.hypot((vx + 0.037) / 0.035, (vy - 0.018) / 0.032, (vz - 0.046) / 0.054);
        var dRightEye = Math.hypot((vx - 0.037) / 0.035, (vy - 0.018) / 0.032, (vz - 0.046) / 0.054);
        var inEyeMask =
          (dLeftEye <= 1.0 || dRightEye <= 1.0) &&
          vy > -0.007 &&
          !(Math.abs(vx) < 0.013 && vy < 0.018);
        if (inEyeMask) {
          colors[vIdx * 3] = 0.055;
          colors[vIdx * 3 + 1] = 0.078;
          colors[vIdx * 3 + 2] = 0.130;
        } else {
          colors[vIdx * 3] = 0.980;
          colors[vIdx * 3 + 1] = 0.988;
          colors[vIdx * 3 + 2] = 0.996;
        }
      }
      crGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
    var craniumMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      vertexColors: true,
      roughness: 0.48,
      metalness: 0.02
    });
    var cranium = new THREE.Mesh(crGeo, craniumMat);
    cranium.scale.set(1.15, 0.96, 1.04);
    cranium.userData = { actionType: 'TIPI_BOOP' };
    addInkOutline(cranium, 0.046, 0x090d16);
    tipiHeadGroup.add(cranium);

    // Upper Temple Patches & Snow-White Cheeks/Muzzle Pads (Leaving Center Bridge, Nose & Mouth Pure White!)
    for (var mSide = -1; mSide <= 1; mSide += 2) {
      var templePatch = new THREE.Mesh(new THREE.SphereGeometry(0.034, 18, 14), blackFurMat);
      templePatch.scale.set(1.08, 0.86, 0.86);
      templePatch.position.set(mSide * 0.045, 0.044, 0.014);
      tipiHeadGroup.add(templePatch);

      var cheek = new THREE.Mesh(new THREE.SphereGeometry(0.038, 18, 14), whiteFurMat);
      cheek.scale.set(1.06, 0.74, 0.86);
      cheek.position.set(mSide * 0.044, -0.020, 0.044);
      tipiHeadGroup.add(cheek);

      var muzzlePad = new THREE.Mesh(new THREE.SphereGeometry(0.023, 18, 14), whiteFurMat);
      muzzlePad.scale.set(1.14, 0.86, 1.02);
      muzzlePad.position.set(mSide * 0.018, -0.018, 0.075);
      tipiHeadGroup.add(muzzlePad);
    }

    // Pure White Bridge Blaze & White Chin so Nose and Mouth are 100% White Fur!
    var noseBlaze = new THREE.Mesh(new THREE.SphereGeometry(0.021, 16, 14), whiteFurMat);
    noseBlaze.scale.set(0.68, 1.05, 0.92);
    noseBlaze.position.set(0, -0.002, 0.073);
    tipiHeadGroup.add(noseBlaze);

    var chin = new THREE.Mesh(new THREE.SphereGeometry(0.016, 14, 12), whiteFurMat);
    chin.scale.set(1.25, 0.62, 0.88);
    chin.position.set(0, -0.033, 0.068);
    tipiHeadGroup.add(chin);

    // Pink Nose & Dark ":3" Mouth over the White Fur Muzzle
    var nose = new THREE.Mesh(new THREE.SphereGeometry(0.010, 14, 12), pinkMat);
    nose.scale.set(1.3, 0.85, 0.9);
    nose.position.set(0, -0.006, 0.091);
    tipiHeadGroup.add(nose);

    var mouthMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    for (var mArc = -1; mArc <= 1; mArc += 2) {
      var mCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.013, 0.090),
        new THREE.Vector3(mArc * 0.011, -0.023, 0.088),
        new THREE.Vector3(mArc * 0.022, -0.016, 0.082)
      ]);
      var mTube = new THREE.Mesh(new THREE.TubeGeometry(mCurve, 12, 0.0022, 8, false), mouthMat);
      tipiHeadGroup.add(mTube);
    }

    // Jet-Black Ears (`tipiEarLeft`, `tipiEarRight`) with Pink Inner Concha
    tipiEarLeft = buildCurvedCatEar(blackFurMat, pinkMat, whiteFurMat, false);
    tipiEarLeft.position.set(-0.052, 0.056, 0.005);
    tipiEarLeft.rotation.z = 0.26;
    tipiEarLeft.rotation.y = 0.16;
    tipiHeadGroup.add(tipiEarLeft);

    tipiEarRight = buildCurvedCatEar(blackFurMat, pinkMat, whiteFurMat, true);
    tipiEarRight.position.set(0.052, 0.056, 0.005);
    tipiEarRight.rotation.z = -0.26;
    tipiEarRight.rotation.y = -0.16;
    tipiHeadGroup.add(tipiEarRight);

    // Large Expressive Eyes (`eyeball` + bright sclera rim) gleaming vividly inside the Black Eye-Mask Patches!
    var scleraRimMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
    for (var eSide = -1; eSide <= 1; eSide += 2) {
      var eyeGroup = new THREE.Group();
      eyeGroup.position.set(eSide * 0.036, 0.015, 0.072);

      var scleraRim = new THREE.Mesh(new THREE.SphereGeometry(0.0245, 24, 20), scleraRimMat);
      scleraRim.scale.set(0.46, 1.12, 1.12);
      scleraRim.rotation.y = -Math.PI / 2 + eSide * 0.16;
      eyeGroup.add(scleraRim);

      var eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.0235, 24, 20), eyeMat);
      eyeball.scale.set(0.54, 1.08, 1.08);
      eyeball.rotation.y = -Math.PI / 2 + eSide * 0.16;
      eyeGroup.add(eyeball);

      if (eSide < 0) tipiEyelidLeft = eyeGroup;
      else tipiEyelidRight = eyeGroup;

      tipiHeadGroup.add(eyeGroup);
    }

    // 6 Crisp White Whiskers
    var whiskerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (var wSide = -1; wSide <= 1; wSide += 2) {
      for (var wIdx = -1; wIdx <= 1; wIdx++) {
        var wCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(wSide * 0.024, -0.016 + wIdx * 0.005, 0.080),
          new THREE.Vector3(wSide * 0.058, -0.015 + wIdx * 0.007, 0.074),
          new THREE.Vector3(wSide * 0.092, -0.020 + wIdx * 0.011, 0.062)
        ]);
        var wMesh = new THREE.Mesh(new THREE.TubeGeometry(wCurve, 10, 0.0012, 6, false), whiskerMat);
        tipiHeadGroup.add(wMesh);
      }
    }

    // Sleek Cyan-Blue Collar + Silver Bell for Catwho
    var collar = new THREE.Mesh(
      new THREE.TorusGeometry(0.056, 0.0085, 12, 28),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.30 })
    );
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, -0.054, 0.012);
    tipiHeadGroup.add(collar);

    var bell = new THREE.Mesh(new THREE.SphereGeometry(0.014, 14, 14), silverBellMat);
    bell.position.set(0, -0.062, 0.070);
    addInkOutline(bell, 0.05, 0x090d16);
    tipiHeadGroup.add(bell);

    tipiBodyGroup.add(tipiHeadGroup);

    // Sculpted Black S-Tail with Snow-White Tip
    tipiTailPivot = new THREE.Group();
    tipiTailPivot.position.set(0, 0.054, -0.098);
    var tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.05, -0.05),
      new THREE.Vector3(-0.02, 0.13, -0.07),
      new THREE.Vector3(0.01, 0.20, -0.04)
    ]);
    var tailTube = new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 22, 0.017, 12, false), blackFurMat);
    addInkOutline(tailTube, 0.048, 0x090d16);
    tipiTailPivot.add(tailTube);

    var tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.019, 14, 14), whiteFurMat);
    tailTip.position.set(0.01, 0.20, -0.04);
    tipiTailPivot.add(tailTip);
    tipiBodyGroup.add(tipiTailPivot);

    root.add(tipiBodyGroup);

    // Connected 2-Bone IK Left & Right Arms (Black Upper Sleeves + White Forearms + White Mitten Paws)
    tipiUpperArmLeft = createLimbSegmentMesh(0.023, 0.027, blackFurMat);
    root.add(tipiUpperArmLeft);
    tipiElbowLeft = new THREE.Mesh(new THREE.SphereGeometry(0.025, 14, 12), blackFurMat);
    addInkOutline(tipiElbowLeft, 0.048, 0x090d16);
    root.add(tipiElbowLeft);
    tipiForearmLeft = createLimbSegmentMesh(0.022, 0.025, whiteFurMat);
    root.add(tipiForearmLeft);

    tipiUpperArmRight = createLimbSegmentMesh(0.023, 0.027, blackFurMat);
    root.add(tipiUpperArmRight);
    tipiElbowRight = new THREE.Mesh(new THREE.SphereGeometry(0.025, 14, 12), blackFurMat);
    addInkOutline(tipiElbowRight, 0.048, 0x090d16);
    root.add(tipiElbowRight);
    tipiForearmRight = createLimbSegmentMesh(0.022, 0.025, whiteFurMat);
    root.add(tipiForearmRight);

    tipiPawLeftGroup = buildSculptedCatPaw(blackFurMat, whiteFurMat, pinkMat);
    tipiPawLeftGroup.position.set(-0.066, 0.024, 0.095);
    tipiPawLeftGroup.userData = { actionType: 'TIPI_BOOP' };
    root.add(tipiPawLeftGroup);

    tipiPawRightGroup = buildSculptedCatPaw(blackFurMat, whiteFurMat, pinkMat);
    tipiPawRightGroup.position.set(0.066, 0.024, 0.095);
    tipiPawRightGroup.userData = { actionType: 'TIPI_BOOP' };
    root.add(tipiPawRightGroup);

    updateCatArmIK(
      { x: -0.070, y: 0.086, z: 0.036 },
      tipiPawLeftGroup.position,
      -1,
      tipiUpperArmLeft,
      tipiElbowLeft,
      tipiForearmLeft,
      tipiPawLeftGroup
    );
    updateCatArmIK(
      { x: 0.070, y: 0.086, z: 0.036 },
      tipiPawRightGroup.position,
      1,
      tipiUpperArmRight,
      tipiElbowRight,
      tipiForearmRight,
      tipiPawRightGroup
    );

    return root;
  }

  // ============================================================================
  // INITIALIZE THREE.JS SCENE: SPY WORKSHOP + SCALE LENS + C4 BRIEFCASE + CAT
  // ============================================================================
  function buildHandModel(colorHex, emissiveHex, isLeftHand) {
    var group = new THREE.Group();
    var gloveMat = new THREE.MeshStandardMaterial({
      color: 0xfbfaf3,
      emissive: emissiveHex,
      emissiveIntensity: 0.06,
      roughness: 0.65,
      metalness: 0.08
    });
    var cuffMat = new THREE.MeshStandardMaterial({
      color: 0xf4b829,
      roughness: 0.6,
      metalness: 0.15
    });
    var palm = new THREE.Mesh(new THREE.SphereGeometry(0.028, 18, 14), gloveMat);
    palm.scale.set(1.15, 0.48, 1.25);
    addInkOutline(palm, 0.055, 0x231e16);
    group.add(palm);

    var cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.024, 0.022, 16), cuffMat);
    cuff.rotation.x = Math.PI / 2;
    cuff.position.set(0, 0, 0.036);
    addInkOutline(cuff, 0.055, 0x231e16);
    group.add(cuff);

    var tipMat = new THREE.MeshBasicMaterial({ color: 0xef6a4c });
    var indexFinger = new THREE.Mesh(new THREE.CylinderGeometry(0.0065, 0.008, 0.042, 12), gloveMat);
    indexFinger.rotation.x = Math.PI / 2;
    indexFinger.position.set(0, 0, -0.042);
    addInkOutline(indexFinger, 0.06, 0x231e16);
    group.add(indexFinger);

    var indexTip = new THREE.Mesh(new THREE.SphereGeometry(0.0085, 14, 14), tipMat);
    indexTip.position.set(0, 0, -0.064);
    addInkOutline(indexTip, 0.06, 0x231e16);
    group.add(indexTip);

    for (var f = -1; f <= 1; f++) {
      if (f === 0) continue;
      var finger = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.0075, 0.034, 12), gloveMat);
      finger.rotation.x = Math.PI / 2;
      finger.position.set(f * 0.015, 0, -0.038);
      addInkOutline(finger, 0.06, 0x231e16);
      group.add(finger);
    }

    // Diegetic 3D Holographic Hand-Deflector Shield Ring (Activates when blocking the Cat!)
    var shieldMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    var shieldDisc = new THREE.Mesh(new THREE.RingGeometry(0.036, 0.062, 24), shieldMat);
    shieldDisc.position.set(0, 0.008, -0.015);
    shieldDisc.visible = false;
    group.add(shieldDisc);
    if (isLeftHand) handShieldLeftMesh = shieldDisc;
    else handShieldRightMesh = shieldDisc;

    return group;
  }

  function initThreeStage() {
    var container = document.getElementById('canvas-3d-container');
    if (!container || typeof THREE === 'undefined') return;

    destructiblePartsList = [];
    blastingCapLeds = [];
    upgPowerPips = [];
    upgAutoPips = [];
    upgCritPips = [];
    coinParticlesList = [];

    scene = new THREE.Scene();
    // 100% Transparent Background (Zero solid background or fog so WebXR headset users see their real room!)
    scene.background = null;
    scene.fog = null;

    camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / Math.max(1, window.innerHeight),
      0.03,
      30
    );

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      xrCompatible: true,
      powerPreference: 'high-performance'
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.shadowMap.enabled = true;
    if (THREE.PCFSoftShadowMap) renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    if (THREE.ACESFilmicToneMapping) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
    }
    if (renderer.xr) {
      renderer.xr.enabled = true;
    }
    container.appendChild(renderer.domElement);

    // Warm Colorfigures + Anatomy Studio Lighting Rig
    var hemiLight = new THREE.HemisphereLight(0xfffcf5, 0x857d6e, 1.38);
    scene.add(hemiLight);

    var keyLight = new THREE.DirectionalLight(0xfffbeb, 1.65);
    keyLight.position.set(0.55, 1.9, 0.9);
    keyLight.castShadow = true;
    scene.add(keyLight);

    var rimLight = new THREE.DirectionalLight(0x76a0e2, 0.95);
    rimLight.position.set(-0.65, 1.4, -0.75);
    scene.add(rimLight);

    var warmSpecLight = new THREE.PointLight(0xf4b829, 0.72, 2.2);
    warmSpecLight.position.set(0.35, 1.05, 0.35);
    scene.add(warmSpecLight);

    // Root Workbench Group
    tableRootGroup = new THREE.Group();
    tableRootGroup.position.set(0, 0.73, 0);
    scene.add(tableRootGroup);

    // 1. STYLIZED CURVED CRESCENT STUDIO CONSOLE (`Consola Curva en Media Luna` — One-Piece Organic Bezier Shape + Tapered Brass-Tipped Legs!)
    var matTex = createWorkbenchMatTexture();
    var deskMat = new THREE.MeshStandardMaterial({
      map: matTex,
      roughness: 0.72,
      metalness: 0.06
    });
    var walnutRimMat = new THREE.MeshStandardMaterial({
      color: 0x2c221b,
      roughness: 0.62,
      metalness: 0.14
    });
    var brassTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf4b829,
      roughness: 0.36,
      metalness: 0.68
    });

    function buildCrescentConsoleShape() {
      var s = new THREE.Shape();
      // Shape in (x, y) where shapeY = -worldZ:
      // Forward central disarm ledge (z = +0.295 at center) + sweeping left/right wing lobes (x = ±0.77, z = +0.375)
      s.moveTo(0, -0.295);
      s.bezierCurveTo(0.22, -0.295, 0.36, -0.375, 0.54, -0.375);
      s.bezierCurveTo(0.71, -0.375, 0.78, -0.24, 0.77, 0.04);
      s.bezierCurveTo(0.76, 0.25, 0.62, 0.39, 0.36, 0.398);
      s.lineTo(-0.36, 0.398);
      s.bezierCurveTo(-0.62, 0.39, -0.76, 0.25, -0.77, 0.04);
      s.bezierCurveTo(-0.78, -0.24, -0.71, -0.375, -0.54, -0.375);
      s.bezierCurveTo(-0.36, -0.375, -0.22, -0.295, 0, -0.295);
      return s;
    }

    function normalizeHorizontalExtrudeUVs(geo, minX, maxX, minY, maxY) {
      var uv = geo.attributes.uv;
      var pos = geo.attributes.position;
      if (!uv || !pos) return;
      var spanX = Math.max(0.01, maxX - minX);
      var spanY = Math.max(0.01, maxY - minY);
      for (var i = 0; i < pos.count; i++) {
        var u = (pos.getX(i) - minX) / spanX;
        var v = (pos.getY(i) - minY) / spanY;
        uv.setXY(i, Math.max(0, Math.min(1, u)), Math.max(0, Math.min(1, v)));
      }
      uv.needsUpdate = true;
    }

    var crescentShape = buildCrescentConsoleShape();

    // 1A-1. Lower Walnut/Espresso Beveled Rim Chassis (`walnutRimMesh`)
    var rimGeo = new THREE.ExtrudeGeometry(crescentShape, {
      depth: 0.034,
      bevelEnabled: true,
      bevelThickness: 0.009,
      bevelSize: 0.014,
      bevelSegments: 5,
      curveSegments: 32
    });
    rimGeo.rotateX(-Math.PI / 2);
    var walnutRimMesh = new THREE.Mesh(rimGeo, walnutRimMat);
    walnutRimMesh.position.set(0, -0.042, 0);
    walnutRimMesh.receiveShadow = true;
    addInkOutline(walnutRimMesh, 0.014, 0x231e16);
    tableRootGroup.add(walnutRimMesh);

    // 1A-2. Gleaming Brass Perimeter Inlay Band (`brassBandMesh`)
    var brassGeo = new THREE.ExtrudeGeometry(crescentShape, {
      depth: 0.008,
      bevelEnabled: true,
      bevelThickness: 0.003,
      bevelSize: 0.008,
      bevelSegments: 3,
      curveSegments: 32
    });
    brassGeo.rotateX(-Math.PI / 2);
    var brassBandMesh = new THREE.Mesh(brassGeo, brassTrimMat);
    brassBandMesh.position.set(0, -0.012, 0);
    tableRootGroup.add(brassBandMesh);

    // 1A-3. Upper Cream/Birch Technical Drafting Top Surface (`tableSlab`)
    var topGeo = new THREE.ExtrudeGeometry(crescentShape, {
      depth: 0.018,
      bevelEnabled: true,
      bevelThickness: 0.004,
      bevelSize: 0.004,
      bevelSegments: 4,
      curveSegments: 32
    });
    normalizeHorizontalExtrudeUVs(topGeo, -0.73, 0.73, -0.38, 0.41);
    topGeo.rotateX(-Math.PI / 2);
    var tableSlab = new THREE.Mesh(topGeo, deskMat);
    tableSlab.position.set(0, -0.018, 0);
    tableSlab.receiveShadow = true;
    tableRootGroup.add(tableSlab);

    // 1A-4. Four Sleek Mid-Century Angled Tapered Studio Legs with Brass Ferrules
    var legCoords = [
      { x: -0.54, z: 0.20, rx: 0.14, rz: -0.14 },
      { x: 0.54, z: 0.20, rx: 0.14, rz: 0.14 },
      { x: -0.49, z: -0.26, rx: -0.12, rz: -0.12 },
      { x: 0.49, z: -0.26, rx: -0.12, rz: 0.12 }
    ];
    for (var lg = 0; lg < legCoords.length; lg++) {
      var lc = legCoords[lg];
      var legGrp = new THREE.Group();
      legGrp.position.set(lc.x, -0.045, lc.z);
      legGrp.rotation.set(lc.rx, 0, lc.rz);

      var legMount = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.026, 0.018, 18), brassTrimMat);
      legMount.position.y = -0.008;
      legGrp.add(legMount);

      var legShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.013, 0.32, 18), walnutRimMat);
      legShaft.position.y = -0.17;
      addInkOutline(legShaft, 0.045, 0x231e16);
      legGrp.add(legShaft);

      var brassFerrule = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.011, 0.065, 18), brassTrimMat);
      brassFerrule.position.y = -0.31;
      addInkOutline(brassFerrule, 0.05, 0x231e16);
      legGrp.add(brassFerrule);

      tableRootGroup.add(legGrp);
    }

    // 1B. 3D Hand-Inked Cat Yarn Ball (`yarnBallGroup` — Appears on the open left workbench deck with full sphere physics!)
    var yarnShadowMat = new THREE.MeshBasicMaterial({
      color: 0x231e16,
      transparent: true,
      opacity: 0.28,
      depthWrite: false
    });
    yarnShadowMesh = new THREE.Mesh(new THREE.CircleGeometry(0.035, 20), yarnShadowMat);
    yarnShadowMesh.rotation.x = -Math.PI / 2;
    yarnShadowMesh.position.set(-0.440, 0.002, -0.085);
    yarnShadowMesh.visible = false;
    tableRootGroup.add(yarnShadowMesh);

    yarnBallGroup = new THREE.Group();
    yarnBallGroup.position.set(-0.440, 0.032, -0.085);
    yarnBallGroup.visible = false;

    // Procedural Wound-Wool CanvasTexture for unmistakable 3D Yarn Ball appearance
    var woolTexCanvas = document.createElement('canvas');
    woolTexCanvas.width = 256;
    woolTexCanvas.height = 256;
    var wctx = woolTexCanvas.getContext('2d');
    wctx.fillStyle = '#4e80de';
    wctx.fillRect(0, 0, 256, 256);
    for (var wb = 0; wb < 32; wb++) {
      var wy = wb * 8;
      wctx.strokeStyle = '#7eaaf5';
      wctx.lineWidth = 2.8;
      wctx.beginPath();
      wctx.moveTo(0, wy + 2);
      wctx.bezierCurveTo(85, wy - 14, 170, wy + 18, 256, wy + 2);
      wctx.stroke();

      wctx.strokeStyle = wb % 2 === 0 ? '#231e16' : '#3159ab';
      wctx.lineWidth = 2.2;
      wctx.beginPath();
      wctx.moveTo(0, wy + 6);
      wctx.bezierCurveTo(85, wy - 10, 170, wy + 22, 256, wy + 6);
      wctx.stroke();
    }
    var yarnWoolTex = new THREE.CanvasTexture(woolTexCanvas);
    yarnWoolTex.wrapS = THREE.RepeatWrapping;
    yarnWoolTex.wrapT = THREE.RepeatWrapping;

    var yarnWoolMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: yarnWoolTex,
      emissive: 0x26478a,
      emissiveIntensity: 0.14,
      roughness: 0.84,
      metalness: 0.02
    });
    var yarnBundleLightMat = new THREE.MeshStandardMaterial({
      color: 0x5c8ee8,
      emissive: 0x26478a,
      emissiveIntensity: 0.12,
      roughness: 0.82,
      metalness: 0.02
    });
    var yarnBundleMidMat = new THREE.MeshStandardMaterial({
      color: 0x4170c9,
      emissive: 0x1e3b75,
      emissiveIntensity: 0.12,
      roughness: 0.84,
      metalness: 0.02
    });
    yarnBallMesh = new THREE.Group();
    var woolCore = new THREE.Mesh(new THREE.SphereGeometry(0.029, 24, 20), yarnWoolMat);
    addInkOutline(woolCore, 0.048, 0x231e16);
    yarnBallMesh.add(woolCore);

    // 4 Crisscrossing Multi-Strand 3D Wool Bundles (3 parallel strands per bundle = 12 wound strands)
    var bundleAngles = [
      { rx: 0.35, ry: 0.20, rz: 0.10 },
      { rx: 1.25, ry: 0.85, rz: -0.45 },
      { rx: -0.65, ry: 1.45, rz: 0.70 },
      { rx: 0.80, ry: -0.95, rz: 1.15 }
    ];
    for (var bIdx = 0; bIdx < bundleAngles.length; bIdx++) {
      var bGroup = new THREE.Group();
      bGroup.rotation.set(bundleAngles[bIdx].rx, bundleAngles[bIdx].ry, bundleAngles[bIdx].rz);
      for (var sIdx = -1; sIdx <= 1; sIdx++) {
        var sOffset = sIdx * 0.0056;
        var sRadius = Math.sqrt(Math.max(0.0004, 0.0302 * 0.0302 - sOffset * sOffset));
        var sMat = sIdx === 0 ? yarnBundleLightMat : yarnBundleMidMat;
        var strandTorus = new THREE.Mesh(new THREE.TorusGeometry(sRadius, 0.0033, 8, 28), sMat);
        strandTorus.position.z = sOffset;
        addInkOutline(strandTorus, 0.034, 0x231e16);
        bGroup.add(strandTorus);
      }
      yarnBallMesh.add(bGroup);
    }
    yarnBallGroup.add(yarnBallMesh);

    // 3D Trailing Smooth Continuous Curly Wool Strand Tail along the tabletop (`y = -0.026`)
    var yarnTailGroup = new THREE.Group();
    yarnTailGroup.position.set(0, -0.026, 0);
    if (THREE.CatmullRomCurve3 && THREE.TubeGeometry) {
      var tailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.008, 0.002, 0.008),
        new THREE.Vector3(0.022, 0.000, 0.020),
        new THREE.Vector3(0.036, 0.000, 0.014),
        new THREE.Vector3(0.048, 0.000, 0.028),
        new THREE.Vector3(0.056, 0.000, 0.022)
      ]);
      var tailTube = new THREE.Mesh(
        new THREE.TubeGeometry(tailCurve, 20, 0.0036, 8, false),
        yarnBundleLightMat
      );
      addInkOutline(tailTube, 0.036, 0x231e16);
      yarnTailGroup.add(tailTube);
    }
    yarnBallGroup.add(yarnTailGroup);
    tableRootGroup.add(yarnBallGroup);

    // 2. Colorfigures + Anatomy Hand-Inked Bomb Case Chassis (`DARK`, `METAL`, `CERAMIC`)
    var gunmetalMat = new THREE.MeshStandardMaterial({ color: 0x3d3935, roughness: 0.72, metalness: 0.18 });
    var chromeMat = new THREE.MeshStandardMaterial({ color: 0xeef0f0, roughness: 0.45, metalness: 0.35 });
    var copperMat = new THREE.MeshStandardMaterial({ color: 0xef6a4c, roughness: 0.52, metalness: 0.28 });
    var brassMat = new THREE.MeshStandardMaterial({ color: 0xf4b829, roughness: 0.50, metalness: 0.25 });
    var steelDeckTex = createRealisticSteelDeckTexture();
    var innerDeckMat = new THREE.MeshStandardMaterial({
      map: steelDeckTex,
      roughness: 0.74,
      metalness: 0.12
    });

    // Sculpted Rounded-Corner Bomb Console Chassis (`buildRoundedChassisShape` — Zero sharp blocky edges!)
    function buildRoundedChassisShape(w, d, r) {
      var hw = w * 0.5;
      var hd = d * 0.5;
      var s = new THREE.Shape();
      s.moveTo(-hw + r, -hd);
      s.lineTo(hw - r, -hd);
      s.quadraticCurveTo(hw, -hd, hw, -hd + r);
      s.lineTo(hw, hd - r);
      s.quadraticCurveTo(hw, hd, hw - r, hd);
      s.lineTo(-hw + r, hd);
      s.quadraticCurveTo(-hw, hd, -hw, hd - r);
      s.lineTo(-hw, -hd + r);
      s.quadraticCurveTo(-hw, -hd, -hw + r, -hd);
      return s;
    }

    var chassisShapeOuter = buildRoundedChassisShape(0.72, 0.48, 0.068);
    var chassisGeoOuter = new THREE.ExtrudeGeometry(chassisShapeOuter, {
      depth: 0.022,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.006,
      bevelSegments: 4
    });
    chassisGeoOuter.rotateX(-Math.PI / 2);
    var briefcaseShell = new THREE.Mesh(chassisGeoOuter, gunmetalMat);
    briefcaseShell.position.set(0, 0.002, 0.025);
    addInkOutline(briefcaseShell, 0.018, 0x231e16);
    tableRootGroup.add(briefcaseShell);

    var chassisShapeInner = buildRoundedChassisShape(0.68, 0.44, 0.056);
    var chassisGeoInner = new THREE.ExtrudeGeometry(chassisShapeInner, {
      depth: 0.025,
      bevelEnabled: false
    });
    normalizeHorizontalExtrudeUVs(chassisGeoInner, -0.34, 0.34, -0.22, 0.22);
    chassisGeoInner.rotateX(-Math.PI / 2);
    var innerDeck = new THREE.Mesh(chassisGeoInner, innerDeckMat);
    innerDeck.position.set(0, 0.003, 0.025);
    tableRootGroup.add(innerDeck);

    // Flush Circular Brass-Rimmed Instrument Coasters on the Left & Right Curved Wing Lobes
    var wingPadCoords = [
      { x: -0.55, z: 0.05 },
      { x: -0.52, z: 0.27 },
      { x: 0.52, z: 0.27 },
      { x: 0.66, z: -0.07 }
    ];
    for (var wp = 0; wp < wingPadCoords.length; wp++) {
      var wc = wingPadCoords[wp];
      var coasterBrass = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.072, 0.008, 32), brassMat);
      coasterBrass.position.set(wc.x, 0.004, wc.z);
      addInkOutline(coasterBrass, 0.035, 0x231e16);
      tableRootGroup.add(coasterBrass);

      var coasterInlay = new THREE.Mesh(new THREE.CylinderGeometry(0.061, 0.061, 0.009, 32), gunmetalMat);
      coasterInlay.position.set(wc.x, 0.005, wc.z);
      tableRootGroup.add(coasterInlay);
    }

    // Charred Blast Crater Decal on the Inner Deck (Revealed when Bomb Explodes!)
    var scorchTex = createScorchCraterTexture();
    scorchCraterMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.60, 0.38),
      new THREE.MeshBasicMaterial({ map: scorchTex, transparent: true, opacity: 0.95, depthWrite: false })
    );
    scorchCraterMesh.rotation.x = -Math.PI / 2;
    scorchCraterMesh.position.set(0, 0.030, 0.025);
    scorchCraterMesh.visible = false;
    tableRootGroup.add(scorchCraterMesh);

    // 4 Destructible Brass-Accented Perimeter Rails + Latches around the Rounded Bomb Chassis
    var railFront = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.022, 0.018), gunmetalMat);
    railFront.position.set(0, 0.030, 0.26);
    addInkOutline(railFront, 0.035, 0x231e16);
    tableRootGroup.add(railFront);
    registerDestructiblePart(railFront, 0.9);

    var railBack = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.022, 0.018), gunmetalMat);
    railBack.position.set(0, 0.030, -0.21);
    addInkOutline(railBack, 0.035, 0x231e16);
    tableRootGroup.add(railBack);
    registerDestructiblePart(railBack, 0.9);

    for (var rSide = -1; rSide <= 1; rSide += 2) {
      var railSide = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.022, 0.32), gunmetalMat);
      railSide.position.set(rSide * 0.355, 0.030, 0.025);
      addInkOutline(railSide, 0.035, 0x231e16);
      tableRootGroup.add(railSide);
      registerDestructiblePart(railSide, 0.9);

      var latch = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.028, 0.016), brassMat);
      latch.position.set(rSide * 0.24, 0.012, 0.012);
      addInkOutline(latch, 0.05, 0x231e16);
      railFront.add(latch);
    }

    // 3. Widely Separated Panoramic Dual-Wing Stage Command Plates (`±0.435, 0.228, -0.32`)
    var monitorFrameMat = new THREE.MeshStandardMaterial({ color: 0xf8f6f0, roughness: 0.76, metalness: 0.08 });

    // 3A. Left Background Stage Plate: Countdown Timer, Defuse Bar & 4 Target Swatches (`-0.435, 0.228, -0.32`)
    var leftMonitorGroup = new THREE.Group();
    leftMonitorGroup.position.set(-0.435, 0.228, -0.32);
    leftMonitorGroup.rotation.y = 0.16;
    leftMonitorGroup.rotation.x = 0.04;
    leftMonitorGroup.visible = !inTitleScreenMode;
    leftMonitorGroupRef = leftMonitorGroup;

    var leftMonitorHousing = new THREE.Mesh(new THREE.BoxGeometry(0.382, 0.258, 0.016), monitorFrameMat);
    leftMonitorHousing.position.set(0, 0, -0.009);
    addInkOutline(leftMonitorHousing, 0.028, 0x231e16);
    leftMonitorGroup.add(leftMonitorHousing);

    bombClockCanvas = document.createElement('canvas');
    bombClockCanvas.width = 840;
    bombClockCanvas.height = 560;
    bombClockCtx = bombClockCanvas.getContext('2d');
    bombClockTexture = new THREE.CanvasTexture(bombClockCanvas);
    bombClockMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.365, 0.244),
      new THREE.MeshBasicMaterial({ map: bombClockTexture })
    );
    leftMonitorGroup.add(bombClockMesh);
    tableRootGroup.add(leftMonitorGroup);

    // 3B. Right Background Stage Plate: Gold Bank & Interactive Upgrade Store (`+0.435, 0.228, -0.32`)
    var rightMonitorGroup = new THREE.Group();
    rightMonitorGroup.position.set(0.435, 0.228, -0.32);
    rightMonitorGroup.rotation.y = -0.16;
    rightMonitorGroup.rotation.x = 0.04;
    rightMonitorGroup.visible = !inTitleScreenMode;
    rightMonitorGroupRef = rightMonitorGroup;

    var rightMonitorHousing = new THREE.Mesh(new THREE.BoxGeometry(0.382, 0.258, 0.016), monitorFrameMat);
    rightMonitorHousing.position.set(0, 0, -0.009);
    addInkOutline(rightMonitorHousing, 0.028, 0x231e16);
    rightMonitorGroup.add(rightMonitorHousing);

    stageRightCanvas = document.createElement('canvas');
    stageRightCanvas.width = 840;
    stageRightCanvas.height = 560;
    stageRightCtx = stageRightCanvas.getContext('2d');
    stageRightTexture = new THREE.CanvasTexture(stageRightCanvas);
    stageRightMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.365, 0.244),
      new THREE.MeshBasicMaterial({ map: stageRightTexture })
    );
    stageRightMesh.userData = { actionType: 'SHOP_MONITOR' };
    rightMonitorGroup.add(stageRightMesh);
    tableRootGroup.add(rightMonitorGroup);

    // Low-profile Ordnance Header Rail on the back of the Bomb Case
    var lowHeaderRail = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.032, 0.028), gunmetalMat);
    lowHeaderRail.position.set(0, 0.038, -0.185);
    addInkOutline(lowHeaderRail, 0.035, 0x231e16);
    tableRootGroup.add(lowHeaderRail);
    registerDestructiblePart(lowHeaderRail, 1.1);

    // 3B. Hand-Inked M112 C-4 Explosive Bricks with Straps & Blinking Blasting Caps
    var c4Tex = createRealisticC4Texture();
    var c4Mat = new THREE.MeshStandardMaterial({ map: c4Tex, roughness: 0.72, metalness: 0.06 });
    var strapMat = new THREE.MeshStandardMaterial({ color: 0x231e16, roughness: 0.65, metalness: 0.15 });

    for (var c4Side = -1; c4Side <= 1; c4Side += 2) {
      var c4Group = new THREE.Group();
      c4Group.position.set(c4Side * 0.235, 0.042, -0.150);
      c4Group.rotation.x = -Math.PI / 2;
      c4Group.rotation.z = c4Side * 0.06;

      var c4Brick = new THREE.Mesh(new THREE.BoxGeometry(0.096, 0.128, 0.036), c4Mat);
      addInkOutline(c4Brick, 0.045, 0x231e16);
      c4Group.add(c4Brick);

      var strap1 = new THREE.Mesh(new THREE.BoxGeometry(0.100, 0.016, 0.040), strapMat);
      strap1.position.set(0, 0.032, 0);
      c4Group.add(strap1);

      var strap2 = new THREE.Mesh(new THREE.BoxGeometry(0.100, 0.016, 0.040), strapMat);
      strap2.position.set(0, -0.032, 0);
      c4Group.add(strap2);

      var buckle = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.020, 0.044), chromeMat);
      buckle.position.set(0, 0.032, 0);
      c4Group.add(buckle);

      // Metallic Detonator Blasting Cap + Blinking Red Piezo LED inserted into the C4 block
      var capCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.032, 12), chromeMat);
      capCyl.position.set(0, 0.072, 0.008);
      c4Group.add(capCyl);

      var capLedMat = new THREE.MeshBasicMaterial({ color: 0xff1e38 });
      var capLed = new THREE.Mesh(new THREE.SphereGeometry(0.007, 10, 10), capLedMat);
      capLed.position.set(0, 0.090, 0.008);
      c4Group.add(capLed);
      blastingCapLeds.push(capLed);

      tableRootGroup.add(c4Group);
      registerDestructiblePart(c4Group, 0.72);
    }

    // 4. REALISTIC BOMB PCB HARDWARE: Brass Terminal Blocks, Silicon IC Microchips & Red Dynamite Sticks
    var pcbHardwareGroup = new THREE.Group();
    var icMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.55 });
    var shrinkMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.85, metalness: 0.15 });
    var tntRedMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.65, metalness: 0.10 });

    // 2 Machined Brass Multi-Screw Terminal Blocks on the PCB (`z = -0.125` & `z = 0.085`)
    var termZPositions = [-0.125, 0.085];
    for (var tb = 0; tb < termZPositions.length; tb++) {
      var tz = termZPositions[tb];
      var termBlock = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.014, 0.020), icMat);
      termBlock.position.set(0, 0.025, tz);
      pcbHardwareGroup.add(termBlock);

      var brassStrip = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.006, 0.012), brassMat);
      brassStrip.position.set(0, 0.033, tz);
      pcbHardwareGroup.add(brassStrip);

      for (var sc = -4; sc <= 4; sc++) {
        var screw = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.008, 12), chromeMat);
        screw.position.set(sc * 0.052, 0.037, tz);
        pcbHardwareGroup.add(screw);
      }
    }

    // 6 Black Silicon IC Microchips with Silver Pin Legs soldered onto the Green/Gold PCB
    var chipCoords = [
      { x: -0.19, z: -0.105 },
      { x: -0.10, z: -0.105 },
      { x: 0.10, z: -0.105 },
      { x: 0.19, z: -0.105 },
      { x: -0.16, z: 0.145 },
      { x: 0.16, z: 0.145 }
    ];
    for (var ch = 0; ch < chipCoords.length; ch++) {
      var cc = chipCoords[ch];
      var icBody = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.010, 0.024), icMat);
      icBody.position.set(cc.x, 0.023, cc.z);
      pcbHardwareGroup.add(icBody);

      var pinBar1 = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.004, 0.030), chromeMat);
      pinBar1.position.set(cc.x, 0.020, cc.z);
      pcbHardwareGroup.add(pinBar1);
    }

    // 3 Bundled Red Wax-Paper Dynamite Cylinders (`TNT`) strapped at the base of the C-4 Console
    var dynGroup = new THREE.Group();
    dynGroup.position.set(0, 0.038, -0.155);
    for (var dy = -1; dy <= 1; dy++) {
      var stick = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.22, 16), tntRedMat);
      stick.rotation.z = Math.PI / 2;
      stick.position.set(0, (dy === 0 ? 0.012 : 0), dy * 0.016);
      dynGroup.add(stick);

      var brassEndL = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.018, 10), brassMat);
      brassEndL.rotation.z = Math.PI / 2;
      brassEndL.position.set(-0.112, (dy === 0 ? 0.012 : 0), dy * 0.016);
      dynGroup.add(brassEndL);

      var brassEndR = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.018, 10), brassMat);
      brassEndR.rotation.z = Math.PI / 2;
      brassEndR.position.set(0.112, (dy === 0 ? 0.012 : 0), dy * 0.016);
      dynGroup.add(brassEndR);
    }
    var dynTapeL = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.036, 0.052), shrinkMat);
    dynTapeL.position.set(-0.055, 0.005, 0);
    dynGroup.add(dynTapeL);
    var dynTapeR = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.036, 0.052), shrinkMat);
    dynTapeR.position.set(0.055, 0.005, 0);
    dynGroup.add(dynTapeR);
    pcbHardwareGroup.add(dynGroup);

    tableRootGroup.add(pcbHardwareGroup);
    registerDestructiblePart(pcbHardwareGroup, 0.72);

    // 4A. REALISTIC FLUSH-MOUNTED PCB WIRING HARNESSES (100% Grounded on PCB at `y = 0.030`, Zero Floating!)
    function buildRealisticCable(ptsArray, colorHex, emissiveHex, radius, parentGrp) {
      var curve = new THREE.CatmullRomCurve3(ptsArray);
      var wMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: emissiveHex || 0x000000,
        emissiveIntensity: emissiveHex ? 0.24 : 0.0,
        roughness: 0.34,
        metalness: 0.38
      });
      var tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, radius || 0.0040, 10, false), wMat);
      parentGrp.add(tube);

      // Horizontal Heat-Shrink Tubing Boots seated flat on the PCB (`rotation.x = Math.PI / 2`)
      var pStart = ptsArray[0];
      var pEnd = ptsArray[ptsArray.length - 1];
      var boot1 = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.45, radius * 1.45, 0.014, 10), shrinkMat);
      boot1.rotation.x = Math.PI / 2;
      boot1.position.copy(pStart);
      parentGrp.add(boot1);

      var boot2 = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.45, radius * 1.45, 0.014, 10), shrinkMat);
      boot2.rotation.x = Math.PI / 2;
      boot2.position.copy(pEnd);
      parentGrp.add(boot2);
      return tube;
    }

    var harnessGroup = new THREE.Group();
    for (var w = 0; w < PAD_DEFS.length; w++) {
      var pd = PAD_DEFS[w];
      var sideSign = pd.x < 0 ? -1 : 1;
      // Primary colored insulated cable routed 100% flush along the PCB surface (`y = 0.030`) into the Brass Terminal Blocks
      buildRealisticCable(
        [
          new THREE.Vector3(pd.x, 0.030, pd.z - 0.042),
          new THREE.Vector3(pd.x + sideSign * 0.012, 0.030, pd.z - 0.055),
          new THREE.Vector3(pd.x * 0.90, 0.030, -0.065),
          new THREE.Vector3(pd.x * 0.87 - sideSign * 0.010, 0.030, -0.095),
          new THREE.Vector3(pd.x * 0.84, 0.030, -0.125)
        ],
        pd.hex,
        pd.emissiveHex,
        0.0042,
        harnessGroup
      );

      // Secondary braided copper/black ground wire routed flush on the PCB (`y = 0.0295`) alongside each pad wire
      buildRealisticCable(
        [
          new THREE.Vector3(pd.x + 0.011, 0.0295, pd.z - 0.042),
          new THREE.Vector3(pd.x * 0.90 + 0.010, 0.0295, -0.065),
          new THREE.Vector3(pd.x * 0.86 + 0.009, 0.0295, -0.095),
          new THREE.Vector3(pd.x * 0.84 + 0.009, 0.0295, -0.125)
        ],
        w % 2 === 0 ? 0xd97706 : 0x1e293b,
        0x000000,
        0.0032,
        harnessGroup
      );
    }

    // High-Voltage Detonator Leads running flush on the PCB (`y = 0.031`) from the Rear Brass Terminal Block into the C-4/TNT Base
    var c4WireX = [-0.225, -0.105, 0.105, 0.225];
    var c4WireCols = [0xdc2626, 0xfacc15, 0x06b6d4, 0xdc2626];
    for (var cw = 0; cw < c4WireX.length; cw++) {
      var cxW = c4WireX[cw];
      buildRealisticCable(
        [
          new THREE.Vector3(cxW, 0.031, -0.125),
          new THREE.Vector3(cxW, 0.031, -0.138),
          new THREE.Vector3(cxW, 0.032, -0.150)
        ],
        c4WireCols[cw],
        0x000000,
        0.0036,
        harnessGroup
      );
    }

    // Flat U-Shaped PCB Cable Clamps holding the wiring harnesses flush against the board
    for (var zt = 0; zt < PAD_DEFS.length; zt++) {
      var uClamp = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.008, 0.012), shrinkMat);
      uClamp.position.set(PAD_DEFS[zt].x * 0.88, 0.030, -0.095);
      harnessGroup.add(uClamp);
    }

    tableRootGroup.add(harnessGroup);
    registerDestructiblePart(harnessGroup, 0.66);

    // 4B. VR SPATIAL MECHANIC: Low-Profile Bridged Detonator Wires on Brass Binding Posts (`wireBridgeGroup` at `z = -0.088` — Destructible!)
    wireBridgeGroup = new THREE.Group();
    var postXs = [-0.180, -0.055, 0.055, 0.180];
    for (var bpIdx = 0; bpIdx < postXs.length; bpIdx++) {
      var px = postXs[bpIdx];
      var postCollarMat = new THREE.MeshStandardMaterial({
        color: bpIdx < 2 ? 0x0284c7 : 0xdc2626,
        roughness: 0.3,
        metalness: 0.4
      });
      var collar = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.013, 0.010, 16), postCollarMat);
      collar.position.set(px, 0.025, -0.088);
      wireBridgeGroup.add(collar);

      var brassPost = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.022, 14), brassMat);
      brassPost.position.set(px, 0.034, -0.088);
      wireBridgeGroup.add(brassPost);

      var knurlNut = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.006, 16), chromeMat);
      knurlNut.position.set(px, 0.043, -0.088);
      wireBridgeGroup.add(knurlNut);
    }

    var surgeMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.85,
      roughness: 0.25,
      metalness: 0.4
    });
    // Low-profile bridged wire clamped tightly between the two brass binding posts (`y = 0.037..0.041, z = -0.088`)
    var surgeCurveFull = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.180, 0.037, -0.088),
      new THREE.Vector3(-0.148, 0.041, -0.084),
      new THREE.Vector3(-0.118, 0.039, -0.088),
      new THREE.Vector3(-0.088, 0.041, -0.092),
      new THREE.Vector3(-0.055, 0.037, -0.088)
    ]);
    surgeWireIntactMesh = new THREE.Mesh(new THREE.TubeGeometry(surgeCurveFull, 24, 0.0048, 10, false), surgeMat);
    surgeWireIntactMesh.userData = { actionType: 'SURGE_WIRE' };
    wireBridgeGroup.add(surgeWireIntactMesh);

    var surgeCurveL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.180, 0.037, -0.088),
      new THREE.Vector3(-0.158, 0.034, -0.084),
      new THREE.Vector3(-0.138, 0.030, -0.080)
    ]);
    surgeWireCutLeftMesh = new THREE.Mesh(new THREE.TubeGeometry(surgeCurveL, 12, 0.0048, 8, false), surgeMat);
    surgeWireCutLeftMesh.visible = false;
    wireBridgeGroup.add(surgeWireCutLeftMesh);

    var surgeCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.055, 0.037, -0.088),
      new THREE.Vector3(-0.075, 0.034, -0.092),
      new THREE.Vector3(-0.095, 0.030, -0.096)
    ]);
    surgeWireCutRightMesh = new THREE.Mesh(new THREE.TubeGeometry(surgeCurveR, 12, 0.0048, 8, false), surgeMat);
    surgeWireCutRightMesh.visible = false;
    wireBridgeGroup.add(surgeWireCutRightMesh);

    var trapMat = new THREE.MeshStandardMaterial({
      color: 0xff1e38,
      emissive: 0x991b1b,
      emissiveIntensity: 0.8,
      roughness: 0.25,
      metalness: 0.4
    });
    var trapCurveFull = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.055, 0.037, -0.088),
      new THREE.Vector3(0.088, 0.041, -0.084),
      new THREE.Vector3(0.118, 0.039, -0.088),
      new THREE.Vector3(0.148, 0.041, -0.092),
      new THREE.Vector3(0.180, 0.037, -0.088)
    ]);
    trapWireIntactMesh = new THREE.Mesh(new THREE.TubeGeometry(trapCurveFull, 24, 0.0048, 10, false), trapMat);
    trapWireIntactMesh.userData = { actionType: 'TRAP_WIRE' };
    wireBridgeGroup.add(trapWireIntactMesh);

    var trapCurveL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.055, 0.037, -0.088),
      new THREE.Vector3(0.075, 0.034, -0.084),
      new THREE.Vector3(0.095, 0.030, -0.080)
    ]);
    trapWireCutLeftMesh = new THREE.Mesh(new THREE.TubeGeometry(trapCurveL, 12, 0.0048, 8, false), trapMat);
    trapWireCutLeftMesh.visible = false;
    wireBridgeGroup.add(trapWireCutLeftMesh);

    var trapCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.180, 0.037, -0.088),
      new THREE.Vector3(0.158, 0.034, -0.092),
      new THREE.Vector3(0.138, 0.030, -0.096)
    ]);
    trapWireCutRightMesh = new THREE.Mesh(new THREE.TubeGeometry(trapCurveR, 12, 0.0048, 8, false), trapMat);
    trapWireCutRightMesh.visible = false;
    wireBridgeGroup.add(trapWireCutRightMesh);

    wireSparksGroup = new THREE.Group();
    var sparkMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    for (var sp = 0; sp < 10; sp++) {
      var spMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.008, 0), sparkMat);
      var spAng = (sp / 10) * Math.PI * 2;
      spMesh.position.set(Math.cos(spAng) * 0.025, Math.sin(spAng) * 0.025, (sp % 3 - 1) * 0.015);
      wireSparksGroup.add(spMesh);
    }
    wireSparksGroup.visible = false;
    wireBridgeGroup.add(wireSparksGroup);
    tableRootGroup.add(wireBridgeGroup);
    registerDestructiblePart(wireBridgeGroup, 0.68);

    // 5. Four Hand-Inked Colorfigures Push-Plungers (`PAD_DEFS` — Sleek 45mm bezel with 18.5cm+ center-to-center spacing!)
    colorPadGroups = [];
    colorPadCapMeshes = [];
    colorPadHaloMeshes = [];
    var bezelMat = new THREE.MeshStandardMaterial({ color: 0x3d3935, roughness: 0.72, metalness: 0.16 });

    for (var i = 0; i < PAD_DEFS.length; i++) {
      var pDef = PAD_DEFS[i];
      var pGroup = new THREE.Group();
      pGroup.position.set(pDef.x, 0.026, pDef.z);

      var bezel = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.049, 0.022, 28), bezelMat);
      bezel.position.y = 0.011;
      addInkOutline(bezel, 0.045, 0x231e16);
      pGroup.add(bezel);

      var chromeRing = new THREE.Mesh(new THREE.TorusGeometry(0.041, 0.0036, 10, 28), chromeMat);
      chromeRing.rotation.x = Math.PI / 2;
      chromeRing.position.y = 0.021;
      pGroup.add(chromeRing);

      var capMat = new THREE.MeshStandardMaterial({
        color: pDef.hex,
        emissive: pDef.emissiveHex,
        emissiveIntensity: 0.14,
        roughness: 0.55,
        metalness: 0.12
      });
      var cap = new THREE.Mesh(new THREE.CylinderGeometry(0.037, 0.039, 0.030, 28), capMat);
      cap.position.y = 0.026;
      cap.userData = { actionType: 'COLOR_PAD', padIndex: i };
      addInkOutline(cap, 0.055, 0x231e16);
      pGroup.add(cap);

      tableRootGroup.add(pGroup);
      colorPadGroups.push(pGroup);
      colorPadCapMeshes.push(cap);
      registerDestructiblePart(pGroup, 0.62);
    }

    // 6. Front Master Dynamo & Kill-Switch Bar (`masterDisarmGroup` — Positioned forward at `0, 0.026, 0.235`, 25cm+ ahead of middle pads!)
    masterDisarmGroup = new THREE.Group();
    masterDisarmGroup.position.set(0, 0.026, 0.235);
    var masterBase = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.022, 0.048), bezelMat);
    masterBase.position.y = 0.011;
    addInkOutline(masterBase, 0.035, 0x231e16);
    masterDisarmGroup.add(masterBase);

    var masterCapMat = new THREE.MeshStandardMaterial({
      color: 0x43c25c,
      emissive: 0x2e6f56,
      emissiveIntensity: 0.14,
      roughness: 0.55,
      metalness: 0.15
    });
    masterBarCapMesh = new THREE.Mesh(new THREE.BoxGeometry(0.185, 0.030, 0.038), masterCapMat);
    masterBarCapMesh.position.y = 0.026;
    masterBarCapMesh.userData = { actionType: 'MASTER_DISARM' };
    addInkOutline(masterBarCapMesh, 0.042, 0x231e16);
    masterDisarmGroup.add(masterBarCapMesh);
    tableRootGroup.add(masterDisarmGroup);
    registerDestructiblePart(masterDisarmGroup, 0.88);

    // 7. Rear-Center Forbidden Tomato-Red Piezo Detonator Dome (`forbiddenButtonGroup` at `0, 0.026, -0.155` — Nestled far back between the C-4 bricks!)
    forbiddenButtonGroup = new THREE.Group();
    forbiddenButtonGroup.position.set(0, 0.026, -0.155);

    var forbiddenMat = new THREE.MeshStandardMaterial({
      color: 0xef6a4c,
      emissive: 0xcf5038,
      emissiveIntensity: 0.72,
      roughness: 0.45,
      metalness: 0.15
    });
    forbiddenDomeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.036, 24, 18, 0, Math.PI * 2, 0, Math.PI / 2),
      forbiddenMat
    );
    forbiddenDomeMesh.position.y = 0.008;
    forbiddenDomeMesh.userData = { actionType: 'FORBIDDEN_BUTTON' };
    addInkOutline(forbiddenDomeMesh, 0.055, 0x231e16);
    forbiddenButtonGroup.add(forbiddenDomeMesh);
    tableRootGroup.add(forbiddenButtonGroup);
    registerDestructiblePart(forbiddenButtonGroup, 0.70);

    // 8. Left & Right Hand-Inked Copper Capacitor Coils (`leftFuseGroup`, `rightFuseGroup` placed on the Crescent Shoulders `±0.42, 0.026, -0.07`!)
    function createPlasmaFuseStation(xPos, sideName) {
      var fGroup = new THREE.Group();
      fGroup.position.set(xPos, 0.026, -0.07);
      var socket = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.054, 0.024, 24), bezelMat);
      socket.position.y = 0.012;
      addInkOutline(socket, 0.045, 0x231e16);
      fGroup.add(socket);

      var coreMat = new THREE.MeshStandardMaterial({
        color: 0xf4b829,
        emissive: 0xd49c1f,
        emissiveIntensity: 0.55,
        roughness: 0.48,
        metalness: 0.25
      });
      var core = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.064, 24), coreMat);
      core.position.y = 0.056;
      core.userData = { actionType: 'FUSE', side: sideName };
      addInkOutline(core, 0.05, 0x231e16);

      // Copper coil rings wrapped around the capacitor core
      for (var cr = -1; cr <= 1; cr++) {
        var coilRing = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.004, 10, 24), copperMat);
        coilRing.rotation.x = Math.PI / 2;
        coilRing.position.y = cr * 0.016;
        core.add(coilRing);
      }

      var capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.044, 0.014, 24), chromeMat);
      capTop.position.y = 0.034;
      addInkOutline(capTop, 0.05, 0x231e16);
      core.add(capTop);

      fGroup.add(core);
      tableRootGroup.add(fGroup);
      registerDestructiblePart(fGroup, 0.76);
      return { group: fGroup, core: core };
    }

    var leftFuseObj = createPlasmaFuseStation(-0.40, 'left');
    leftFuseGroup = leftFuseObj.group;
    leftFuseCoreMesh = leftFuseObj.core;

    var rightFuseObj = createPlasmaFuseStation(0.40, 'right');
    rightFuseGroup = rightFuseObj.group;
    rightFuseCoreMesh = rightFuseObj.core;

    // 9. LEFT CRESCENT WING MID GADGET: Hand-Inked Laser Pointer Turret (`laserGadgetGroup` at `-0.55, 0.012, +0.05` — 22cm behind Yarn Ball!)
    laserGadgetGroup = new THREE.Group();
    laserGadgetGroup.position.set(-0.55, 0.012, 0.05);
    var laserBase = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.062, 0.022, 28), bezelMat);
    laserBase.position.y = 0.011;
    laserBase.userData = { actionType: 'LASER_BTN' };
    addInkOutline(laserBase, 0.045, 0x231e16);
    laserGadgetGroup.add(laserBase);

    var laserCapMat = new THREE.MeshStandardMaterial({
      color: 0xef6a4c,
      emissive: 0xcf5038,
      emissiveIntensity: 0.62,
      roughness: 0.52,
      metalness: 0.15
    });
    laserBtnCapMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.050, 0.028, 28), laserCapMat);
    laserBtnCapMesh.position.y = 0.026;
    laserBtnCapMesh.userData = { actionType: 'LASER_BTN' };
    addInkOutline(laserBtnCapMesh, 0.05, 0x231e16);

    // Crisp Pictogram Badge (`LASER + CLICK PWR`) on the button face
    var laserBadgeDisc = new THREE.Mesh(
      new THREE.CircleGeometry(0.045, 28),
      new THREE.MeshBasicMaterial({ map: createLaserButtonBadgeTexture() })
    );
    laserBadgeDisc.rotation.x = -Math.PI / 2;
    laserBadgeDisc.position.y = 0.015;
    laserBadgeDisc.userData = { actionType: 'LASER_BTN' };
    laserBtnCapMesh.add(laserBadgeDisc);

    // Sculpted 3D Angled Laser Pointer Pen Barrel mounted on the button!
    var laserTurretPivot = new THREE.Group();
    laserTurretPivot.position.set(0, 0.026, -0.018);
    laserTurretPivot.rotation.order = 'YXZ';
    laserTurretPivot.rotation.x = 0.42;
    laserTurretPivot.rotation.y = -0.52;
    laserTurretPivotRef = laserTurretPivot;
    var pointerBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.012, 0.068, 16), chromeMat);
    pointerBarrel.rotation.x = Math.PI / 2;
    pointerBarrel.userData = { actionType: 'LASER_BTN' };
    addInkOutline(pointerBarrel, 0.06, 0x231e16);
    laserTurretPivot.add(pointerBarrel);

    var redLaserMat = new THREE.MeshBasicMaterial({ color: 0xef6a4c });
    var rubyTip = new THREE.Mesh(new THREE.SphereGeometry(0.010, 12, 12), redLaserMat);
    rubyTip.position.set(0, 0, -0.035);
    rubyTip.userData = { actionType: 'LASER_BTN' };
    laserTurretPivot.add(rubyTip);
    laserBtnCapMesh.add(laserTurretPivot);

    laserGadgetGroup.add(laserBtnCapMesh);
    tableRootGroup.add(laserGadgetGroup);
    registerDestructiblePart(laserGadgetGroup, 0.80);

    // High-visibility Laser Dot projected UP onto the vertical Back Wall Plane (`y = 0.21, z = -0.365`) well above the bomb panel!
    laserDotMesh = new THREE.Group();
    var dotHalo = new THREE.Mesh(
      new THREE.RingGeometry(0.022, 0.032, 24),
      new THREE.MeshBasicMaterial({ color: 0xef6a4c, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
    );
    laserDotMesh.add(dotHalo);
    var dotOuter = new THREE.Mesh(
      new THREE.CircleGeometry(0.020, 24),
      new THREE.MeshBasicMaterial({ color: 0xff1133, transparent: true, opacity: 0.92, side: THREE.DoubleSide })
    );
    dotOuter.position.z = 0.001;
    laserDotMesh.add(dotOuter);
    var dotInner = new THREE.Mesh(
      new THREE.CircleGeometry(0.009, 20),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    );
    dotInner.position.z = 0.002;
    laserDotMesh.add(dotInner);
    laserDotMesh.position.set(-0.12, 0.215, -0.365);
    laserDotMesh.visible = false;
    tableRootGroup.add(laserDotMesh);

    // Dynamic 3D Laser Beam (`unit +Z cylinder` oriented from the Laser Turret tip to the Board dot!)
    laserBeamMesh = new THREE.Group();
    var beamGeo = new THREE.CylinderGeometry(0.0028, 0.0038, 1.0, 10);
    beamGeo.rotateX(Math.PI / 2);
    beamGeo.translate(0, 0, 0.5);
    var beamCyl = new THREE.Mesh(
      beamGeo,
      new THREE.MeshBasicMaterial({ color: 0xff1133, transparent: true, opacity: 0.78 })
    );
    laserBeamMesh.add(beamCyl);
    laserBeamMesh.visible = false;
    tableRootGroup.add(laserBeamMesh);

    // 10. RIGHT CRESCENT WING FRONT GADGET: Hand-Inked Salmon Fish-Treat Dispenser (`kibbleGadgetGroup` at `+0.52, 0.012, +0.27` — 36.1cm from Right Fuse & 36.8cm from EXIT!)
    kibbleGadgetGroup = new THREE.Group();
    kibbleGadgetGroup.position.set(0.52, 0.012, 0.27);
    var kibbleBase = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.062, 0.022, 28), bezelMat);
    kibbleBase.position.y = 0.011;
    kibbleBase.userData = { actionType: 'KIBBLE_BTN' };
    addInkOutline(kibbleBase, 0.045, 0x231e16);
    kibbleGadgetGroup.add(kibbleBase);

    var kibbleCapMat = new THREE.MeshStandardMaterial({
      color: 0xf4b829,
      emissive: 0xd49c1f,
      emissiveIntensity: 0.62,
      roughness: 0.52,
      metalness: 0.15
    });
    kibbleBtnCapMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.050, 0.028, 28), kibbleCapMat);
    kibbleBtnCapMesh.position.y = 0.026;
    kibbleBtnCapMesh.userData = { actionType: 'KIBBLE_BTN' };
    addInkOutline(kibbleBtnCapMesh, 0.05, 0x231e16);

    // Crisp Pictogram Badge (`COMIDA + AUTO CLICK`) on the button face
    var fishBadgeDisc = new THREE.Mesh(
      new THREE.CircleGeometry(0.045, 28),
      new THREE.MeshBasicMaterial({ map: createFishButtonBadgeTexture() })
    );
    fishBadgeDisc.rotation.x = -Math.PI / 2;
    fishBadgeDisc.position.y = 0.015;
    fishBadgeDisc.userData = { actionType: 'KIBBLE_BTN' };
    kibbleBtnCapMesh.add(fishBadgeDisc);

    // Sculpted 3D Golden-Salmon Fish Topper sitting right on the dispenser button!
    var fishModelGroup = new THREE.Group();
    fishModelGroup.position.set(0, 0.026, -0.012);
    var salmonMat = new THREE.MeshStandardMaterial({
      color: 0xef6a4c,
      emissive: 0xcf5038,
      emissiveIntensity: 0.35,
      roughness: 0.55
    });
    var fishBody = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 12), salmonMat);
    fishBody.scale.set(1.75, 0.55, 0.90);
    fishBody.userData = { actionType: 'KIBBLE_BTN' };
    addInkOutline(fishBody, 0.06, 0x231e16);
    fishModelGroup.add(fishBody);

    var fishTail = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.024, 3), salmonMat);
    fishTail.rotation.z = Math.PI / 2;
    fishTail.position.set(0.028, 0, 0);
    fishTail.userData = { actionType: 'KIBBLE_BTN' };
    addInkOutline(fishTail, 0.06, 0x231e16);
    fishModelGroup.add(fishTail);
    kibbleBtnCapMesh.add(fishModelGroup);

    kibbleGadgetGroup.add(kibbleBtnCapMesh);
    tableRootGroup.add(kibbleGadgetGroup);
    registerDestructiblePart(kibbleGadgetGroup, 0.80);

    // Tomato-Red Cat Bowl placed at `(0.46, 0.016, -0.19)` near the rear-right corner where Catone walks to eat!
    catBowlGroup = new THREE.Group();
    catBowlGroup.position.set(0.46, 0.016, -0.19);
    var bowlMat = new THREE.MeshStandardMaterial({ color: 0xef6a4c, roughness: 0.55, metalness: 0.15 });
    var bowlOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.066, 0.028, 24), bowlMat);
    addInkOutline(bowlOuter, 0.048, 0x231e16);
    catBowlGroup.add(bowlOuter);

    var bowlInteriorCavity = new THREE.Mesh(
      new THREE.CircleGeometry(0.046, 24),
      new THREE.MeshStandardMaterial({ color: 0x3d3935, roughness: 0.85, metalness: 0.05 })
    );
    bowlInteriorCavity.rotation.x = -Math.PI / 2;
    bowlInteriorCavity.position.y = 0.0145;
    catBowlGroup.add(bowlInteriorCavity);

    kibblePelletsGroup = new THREE.Group();
    var kibblePelletMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.45 });
    for (var kp = 0; kp < 14; kp++) {
      var pellet = new THREE.Mesh(new THREE.SphereGeometry(0.010, 10, 10), kibblePelletMat);
      var ang = (kp / 14) * Math.PI * 2;
      var rad = (kp % 3) * 0.015;
      pellet.position.set(Math.cos(ang) * rad, 0.016, Math.sin(ang) * rad);
      kibblePelletsGroup.add(pellet);
    }
    var bowlFish = new THREE.Mesh(new THREE.SphereGeometry(0.016, 14, 10), salmonMat);
    bowlFish.scale.set(1.6, 0.5, 0.85);
    bowlFish.position.set(0, 0.022, 0);
    kibblePelletsGroup.add(bowlFish);
    kibblePelletsGroup.visible = false;
    catBowlGroup.add(kibblePelletsGroup);
    tableRootGroup.add(catBowlGroup);
    registerDestructiblePart(catBowlGroup, 0.75);

    // 10A-2. LEFT CRESCENT WING FRONT GADGET: Physical 3D Wound Wool Yarn Ball Button (`yarnGadgetGroup` at `-0.52, 0.012, +0.27` — 22cm in front of Laser!)
    yarnGadgetGroup = new THREE.Group();
    yarnGadgetGroup.position.set(-0.52, 0.012, 0.27);
    var yarnBase = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.062, 0.022, 28), bezelMat);
    yarnBase.position.y = 0.011;
    yarnBase.userData = { actionType: 'YARN_BTN' };
    addInkOutline(yarnBase, 0.045, 0x231e16);
    yarnGadgetGroup.add(yarnBase);

    var yarnCapMat = new THREE.MeshStandardMaterial({
      color: 0x76a0e2,
      emissive: 0x3159ab,
      emissiveIntensity: 0.62,
      roughness: 0.52,
      metalness: 0.15
    });
    yarnBtnCapMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.050, 0.028, 28), yarnCapMat);
    yarnBtnCapMesh.position.y = 0.026;
    yarnBtnCapMesh.userData = { actionType: 'YARN_BTN' };
    addInkOutline(yarnBtnCapMesh, 0.05, 0x231e16);

    var yarnBadgeDisc = new THREE.Mesh(
      new THREE.CircleGeometry(0.045, 28),
      new THREE.MeshBasicMaterial({ map: createYarnButtonBadgeTexture() })
    );
    yarnBadgeDisc.rotation.x = -Math.PI / 2;
    yarnBadgeDisc.position.y = 0.015;
    yarnBadgeDisc.userData = { actionType: 'YARN_BTN' };
    yarnBtnCapMesh.add(yarnBadgeDisc);

    // Miniature 3D Wound Wool Yarn Ball Topper sitting on the front edge of the button!
    var miniYarnTopper = new THREE.Group();
    miniYarnTopper.position.set(0, 0.028, -0.015);
    var miniWoolCore = new THREE.Mesh(new THREE.SphereGeometry(0.016, 18, 14), yarnWoolMat);
    miniWoolCore.userData = { actionType: 'YARN_BTN' };
    addInkOutline(miniWoolCore, 0.055, 0x231e16);
    miniYarnTopper.add(miniWoolCore);
    for (var mb = 0; mb < 3; mb++) {
      var miniWrap = new THREE.Mesh(new THREE.TorusGeometry(0.0165, 0.0024, 8, 20), yarnBundleLightMat);
      miniWrap.rotation.set(mb * 0.9, mb * 0.6 + 0.3, mb * -0.5);
      miniWrap.userData = { actionType: 'YARN_BTN' };
      miniYarnTopper.add(miniWrap);
    }
    yarnBtnCapMesh.add(miniYarnTopper);
    yarnGadgetGroup.add(yarnBtnCapMesh);
    tableRootGroup.add(yarnGadgetGroup);
    registerDestructiblePart(yarnGadgetGroup, 0.78);

    // 10A-3. FAR-RIGHT WING EXIT POD AT RIGHT-FUSE Z LEVEL: (`exitXrGadgetGroup` at `+0.66, 0.012, -0.07` — Exact same z = -0.07 as Right Fuse, 26cm to its right & 36.8cm behind Croquetas!)
    exitXrGadgetGroup = new THREE.Group();
    exitXrGadgetGroup.position.set(0.66, 0.012, -0.07);
    exitXrGadgetGroup.rotation.set(0, 0, 0);

    var exitBase = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.052, 0.020, 28), bezelMat);
    exitBase.position.y = 0.010;
    exitBase.userData = { actionType: 'EXIT_XR_BTN' };
    addInkOutline(exitBase, 0.045, 0x231e16);
    exitXrGadgetGroup.add(exitBase);

    var exitCapMat = new THREE.MeshStandardMaterial({
      color: 0xef6a4c,
      emissive: 0x991b1b,
      emissiveIntensity: 0.45,
      roughness: 0.55,
      metalness: 0.15
    });
    exitXrBtnCapMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.040, 0.042, 0.024, 28), exitCapMat);
    exitXrBtnCapMesh.position.y = 0.022;
    exitXrBtnCapMesh.userData = { actionType: 'EXIT_XR_BTN' };
    addInkOutline(exitXrBtnCapMesh, 0.05, 0x231e16);

    var exitBadgeDisc = new THREE.Mesh(
      new THREE.CircleGeometry(0.036, 28),
      new THREE.MeshBasicMaterial({ map: createExitXrButtonBadgeTexture() })
    );
    exitBadgeDisc.rotation.x = -Math.PI / 2;
    exitBadgeDisc.position.y = 0.0125;
    exitBadgeDisc.userData = { actionType: 'EXIT_XR_BTN' };
    exitXrBtnCapMesh.add(exitBadgeDisc);
    exitXrGadgetGroup.add(exitXrBtnCapMesh);
    tableRootGroup.add(exitXrGadgetGroup);

    // 10B. 3D Golden Voltage Coin Particles (`coinParticlesList`) + 3D Floating Clicker Popups (`clickPopupList`)
    var coinMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xca8a04,
      emissiveIntensity: 0.65,
      roughness: 0.18,
      metalness: 0.88
    });
    var coinGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.005, 16);
    for (var cpIdx = 0; cpIdx < 28; cpIdx++) {
      var coinMesh = new THREE.Mesh(coinGeo, coinMat);
      coinMesh.visible = false;
      tableRootGroup.add(coinMesh);
      coinParticlesList.push({
        mesh: coinMesh,
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0,
        maxLife: 0.8
      });
    }

    clickPopupList = [];
    var popPlaneGeo = new THREE.PlaneGeometry(1.0, 0.5);
    for (var popIdx = 0; popIdx < 12; popIdx++) {
      var popCanvas = document.createElement('canvas');
      popCanvas.width = 256;
      popCanvas.height = 128;
      var popCtx = popCanvas.getContext('2d');
      var popTex = new THREE.CanvasTexture(popCanvas);
      var popMat = new THREE.MeshBasicMaterial({
        map: popTex,
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide,
        depthTest: false
      });
      var popSprite = new THREE.Mesh(popPlaneGeo, popMat);
      popSprite.rotation.x = -0.36;
      popSprite.renderOrder = 25;
      popSprite.visible = false;
      tableRootGroup.add(popSprite);
      clickPopupList.push({
        sprite: popSprite,
        canvas: popCanvas,
        ctx: popCtx,
        tex: popTex,
        life: 0,
        maxLife: 1.25,
        baseScale: 0.18
      });
    }

    // 11. Sculpted 3D Ginger Tabby Cat ("Catone") + Guest Star Cat ("Catwho") + 3D Start Screen Billboard!
    catRig = buildSculptedGingerCat();
    catRig.scale.set(0.95, 0.95, 0.95);
    catRig.position.set(0, 0.008, -0.255);
    tableRootGroup.add(catRig);

    catwhoRig = buildSculptedCatwhoCat();
    catwhoRig.scale.set(0.92, 0.92, 0.92);
    catwhoRig.position.set(0.18, 0.008, -0.255);
    catwhoRig.visible = inTitleScreenMode;
    tableRootGroup.add(catwhoRig);

    // 3D Start Screen Billboard positioned at `(0, 0.175, -0.32)` so the 3D Cats move naturally in front of it!
    titleScreenCanvas = document.createElement('canvas');
    titleScreenCanvas.width = 1024;
    titleScreenCanvas.height = 512;
    titleScreenCtx = titleScreenCanvas.getContext('2d');
    titleScreenTex = new THREE.CanvasTexture(titleScreenCanvas);
    titleScreenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.92, 0.36),
      new THREE.MeshBasicMaterial({ map: titleScreenTex, transparent: true, side: THREE.DoubleSide })
    );
    titleScreenMesh.position.set(0, 0.185, -0.32);
    titleScreenMesh.rotation.x = -0.04;
    titleScreenMesh.userData = { actionType: 'TITLE_SCREEN' };
    titleScreenMesh.visible = inTitleScreenMode;
    tableRootGroup.add(titleScreenMesh);

    // 12. Player Virtual Hands (`liveHandLeft` visible only in XR headset; `liveHandRight` follows mouse on PC & right hand in XR)
    liveHandLeft = buildHandModel(0x38bdf8, 0x0284c7, true);
    liveHandLeft.position.set(-0.22, 0.14, 0.18);
    liveHandLeft.visible = false;
    tableRootGroup.add(liveHandLeft);

    liveHandRight = buildHandModel(0x38bdf8, 0x0284c7, false);
    liveHandRight.position.set(0.22, 0.14, 0.18);
    tableRootGroup.add(liveHandRight);

    // 13. Direct Internal Illumination PointLights (`targetGlowLight` & `impactFlashLight`) — Zero Floating Rings!
    targetGlowLight = new THREE.PointLight(0x38bdf8, 2.2, 0.28);
    targetGlowLight.position.set(0, 0.075, 0.088);
    tableRootGroup.add(targetGlowLight);

    impactFlashLight = new THREE.PointLight(0xfacc15, 0.0, 0.34);
    impactFlashLight.position.set(0, 0.08, 0.088);
    tableRootGroup.add(impactFlashLight);

    // 14. Multi-Stage 3D Bomb Explosion VFX System (`explosionGroup`)
    explosionGroup = new THREE.Group();
    explosionGroup.position.set(0, 0.12, 0.08);
    explosionGroup.visible = false;

    fireballCoreMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.062, 24, 20),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.98, depthTest: false })
    );
    fireballCoreMesh.renderOrder = 16;
    explosionGroup.add(fireballCoreMesh);

    fireballOuterMesh = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.095, 1),
      new THREE.MeshBasicMaterial({ color: 0xff4500, transparent: true, opacity: 0.90, depthTest: false })
    );
    fireballOuterMesh.renderOrder = 15;
    explosionGroup.add(fireballOuterMesh);

    shockwaveRingMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.095, 0.016, 12, 36),
      new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.94, depthTest: false })
    );
    shockwaveRingMesh.renderOrder = 15;
    shockwaveRingMesh.rotation.x = Math.PI / 2;
    explosionGroup.add(shockwaveRingMesh);

    explosionLight = new THREE.PointLight(0xff5500, 0.0, 3.5);
    explosionLight.position.set(0, 0.25, 0);
    explosionGroup.add(explosionLight);

    explosionDebrisList = [];
    var shrapnelColors = [0xff4500, 0xfacc15, 0x334155, 0xdc2626, 0xffffff];
    for (var db = 0; db < 44; db++) {
      var dbMat = new THREE.MeshBasicMaterial({ color: shrapnelColors[db % shrapnelColors.length] });
      var dbGeo = db % 2 === 0 ? new THREE.BoxGeometry(0.018, 0.012, 0.024) : new THREE.OctahedronGeometry(0.014, 0);
      var dbMesh = new THREE.Mesh(dbGeo, dbMat);
      explosionGroup.add(dbMesh);
      explosionDebrisList.push({ mesh: dbMesh, vx: 0, vy: 0, vz: 0, rx: 0, ry: 0, rz: 0 });
    }

    explosionSmokeList = [];
    for (var smk = 0; smk < 14; smk++) {
      var smkMat = new THREE.MeshStandardMaterial({
        color: smk % 2 === 0 ? 0x334155 : 0x475569,
        emissive: smk % 3 === 0 ? 0x7c2d12 : 0x0f172a,
        emissiveIntensity: 0.35,
        roughness: 0.9,
        transparent: true,
        opacity: 0.78
      });
      var smkMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.036, 1), smkMat);
      explosionGroup.add(smkMesh);
      explosionSmokeList.push({ mesh: smkMesh, vx: 0, vy: 0, vz: 0, baseScale: 1.0 });
    }

    tableRootGroup.add(explosionGroup);

    setupWebXRControllers();
    setupCanvasPointerInteractions();

    window.addEventListener('resize', function () {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / Math.max(1, window.innerHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    if (renderer && typeof renderer.setAnimationLoop === 'function') {
      renderer.setAnimationLoop(animateStage);
    } else {
      requestAnimationFrame(animateStage);
    }
  }

  // ============================================================================
  // DIRECT PHYSICAL HAND PUSH / BOOP COLLISION (`checkPhysicalHandTouchAt`)
  // ============================================================================
  function getXrInputWorldPositions(idx, outArray) {
    if (!renderer || !renderer.xr || !renderer.xr.isPresenting) return;
    if (typeof renderer.xr.getHand === 'function') {
      var hand = renderer.xr.getHand(idx);
      if (hand && hand.joints) {
        var jointNames = ['index-finger-tip', 'middle-finger-tip', 'wrist'];
        for (var j = 0; j < jointNames.length; j++) {
          var jt = hand.joints[jointNames[j]];
          if (jt && typeof jt.getWorldPosition === 'function') {
            var v = new THREE.Vector3();
            jt.getWorldPosition(v);
            if (v.lengthSq() > 0.0001) outArray.push(v);
          }
        }
      }
    }
    if (typeof renderer.xr.getControllerGrip === 'function') {
      var grip = renderer.xr.getControllerGrip(idx);
      if (grip && typeof grip.getWorldPosition === 'function') {
        var vg = new THREE.Vector3();
        grip.getWorldPosition(vg);
        if (vg.lengthSq() > 0.0001) outArray.push(vg);
      }
    }
    if (xrControllersList[idx] && typeof xrControllersList[idx].getWorldPosition === 'function') {
      var vc = new THREE.Vector3();
      xrControllersList[idx].getWorldPosition(vc);
      if (vc.lengthSq() > 0.0001) outArray.push(vc);
    }
  }

  function isHandTouchingTitleStartZone(localPos) {
    if (!localPos) return false;
    // 1. Front Green Master Bar (`(0, 0.048, +0.235)`)
    if (
      Math.abs(localPos.x) < 0.125 &&
      Math.abs(localPos.y - 0.048) < 0.058 &&
      Math.abs(localPos.z - 0.235) < 0.052
    ) {
      return true;
    }
    // 2. Any of the 4 Color Pads (ONLY on Title Screen — NEVER on the 10/10 Final Scoreboard!)
    for (var i = 0; i < PAD_DEFS.length; i++) {
      var pad = PAD_DEFS[i];
      if (Math.hypot(localPos.x - pad.x, localPos.y - (pad.y + 0.015), localPos.z - pad.z) < 0.052) {
        return true;
      }
    }
    // 3. 3D Title Billboard (`titleScreenMesh` at `(0, 0.185, -0.32)`)
    if (
      Math.abs(localPos.x) < 0.44 &&
      localPos.y >= 0.05 &&
      localPos.y <= 0.36 &&
      localPos.z >= -0.36 &&
      localPos.z <= -0.23
    ) {
      return true;
    }
    return false;
  }

  function isHandTouchingScoreboardReplayZone(localPos) {
    if (!localPos) return false;
    // 1. Elevated 3D Final Scoreboard Panel in front of the cats (`titleScreenMesh` at `(0, 0.255, -0.135)`)
    if (
      Math.abs(localPos.x) < 0.45 &&
      localPos.y >= 0.09 &&
      localPos.y <= 0.44 &&
      localPos.z >= -0.22 &&
      localPos.z <= -0.05
    ) {
      return true;
    }
    // 2. Front Green Master Bar (`(0, 0.048, +0.235)`) — NEVER the 4 Color Pads!
    if (
      Math.abs(localPos.x) < 0.125 &&
      Math.abs(localPos.y - 0.048) < 0.058 &&
      Math.abs(localPos.z - 0.235) < 0.052
    ) {
      return true;
    }
    return false;
  }

  function checkPhysicalHandTouchAt(localPos) {
    if (!localPos) return;

    // 00. Hands-First Far-Right Wing 3D EXIT VR Pod (`exitXrGadgetGroup` at `+0.66, 0.038, -0.07` — Exact same Z as Right Fuse, 26cm to its right & 36.8cm from Croquetas!)
    if (exitXrGadgetGroup && exitXrGadgetGroup.visible) {
      var dExitXr = Math.hypot(localPos.x - 0.66, localPos.y - 0.038, localPos.z - -0.07);
      if (dExitXr < 0.062 && touchCooldowns.exitXr <= 0) {
        touchCooldowns.exitXr = 1.25;
        triggerExitXrOrEndMatch();
        return;
      }
    }

    // Allow touching 3D SOUND & LANG buttons even while on Title Screen or Scoreboard!
    if (audioToggleGroup && audioToggleGroup.visible) {
      var dAudioTop = Math.hypot(localPos.x - -0.415, localPos.y - 0.04, localPos.z - -0.19);
      if (dAudioTop < 0.072 && touchCooldowns.audioBtn <= 0) {
        touchCooldowns.audioBtn = 0.45;
        toggleAudioMute();
        return;
      }
    }
    if (langToggleGroup && langToggleGroup.visible) {
      var dLangTop = Math.hypot(localPos.x - -0.415, localPos.y - 0.04, localPos.z - -0.05);
      if (dLangTop < 0.072 && touchCooldowns.langBtn <= 0) {
        touchCooldowns.langBtn = 0.45;
        toggleLanguage();
        return;
      }
    }

    // 0A. Hands-First Final Scoreboard Dismissal & Replay (ONLY Touch Elevated 3D Scoreboard or Front Green Bar after 2.4s safety lock!)
    if (isEndingOverlayOpen()) {
      if (
        clockSec - endingModalOpenTime >= 2.4 &&
        touchCooldowns.endingClose <= 0 &&
        isHandTouchingScoreboardReplayZone(localPos)
      ) {
        touchCooldowns.endingClose = 1.0;
        startGameFromTitleScreen();
      }
      return;
    }

    // 0B. Hands-First Direct Physical Touch on Green Bar, Color Pads, or 3D Title Billboard to Start
    if (inTitleScreenMode) {
      if (
        touchCooldowns.titleStart <= 0 &&
        isHandTouchingTitleStartZone(localPos)
      ) {
        touchCooldowns.titleStart = 0.75;
        startGameFromTitleScreen();
      }
      return;
    }

    if (circuitDisarmed || bombIsDestroyed) return;
    var spec = getSpec();

    // 0C. Hands-First Direct Physical Finger Touch on the 3D Shop Monitor (`stageRightMesh` — Laser, Treats, Yarn Ball!)
    if (
      stageRightMesh &&
      localPos.x >= 0.24 &&
      localPos.x <= 0.61 &&
      localPos.y >= 0.09 &&
      localPos.y <= 0.34 &&
      localPos.z >= -0.42 &&
      localPos.z <= -0.19 &&
      touchCooldowns.shopMonitor <= 0
    ) {
      touchCooldowns.shopMonitor = 0.55;
      if (localPos.y < 0.175) {
        buyShopUpgrade(3); // Bottom Row: Yarn Ball (`Bola de Lana`)
      } else if (localPos.y < 0.248) {
        buyShopUpgrade(2); // Middle Row: Treats (`Croquetas`)
      } else {
        buyShopUpgrade(1); // Top Row: Laser (`Laser`)
      }
      return;
    }

    // 1. Physical 3D Hand-Shield Blocking or Direct Paw Boop (Catone & Catwho)
    //    Includes generous 17.5cm paw radius AND 15.5cm shield zone around the Red Bomb Button `(0, 0.04, -0.155)` so the Red Bomb Button NEVER blocks slapping the cat's paw!
    var dForbiddenShield = Math.hypot(localPos.x - 0.0, localPos.y - 0.045, localPos.z - -0.155);
    if (catwhoPhase === 'DUO_SABOTAGE' && catwhoRig && touchCooldowns.boop <= 0) {
      var tPawMesh = tipiPawLeftGroup || tipiPawRightGroup;
      var tPx = tipiCurrentPawWorldPos ? tipiCurrentPawWorldPos.x : catwhoRig.position.x + (tPawMesh ? tPawMesh.position.x : 0);
      var tPy = tipiCurrentPawWorldPos ? tipiCurrentPawWorldPos.y : catwhoRig.position.y + (tPawMesh ? tPawMesh.position.y : 0.06);
      var tPz = tipiCurrentPawWorldPos ? tipiCurrentPawWorldPos.z : catwhoRig.position.z + (tPawMesh ? tPawMesh.position.z : 0.12);
      var dTipiPaw = Math.hypot(localPos.x - tPx, localPos.y - tPy, localPos.z - tPz);
      if (dTipiPaw < 0.175 || (catwhoTargetAction === 'PRESS_FORBIDDEN' && dForbiddenShield < 0.155)) {
        touchCooldowns.boop = 0.35;
        boopCatwhoPaw();
        return;
      }
    }
    if (
      catState === 'SWAT_LEFT_FUSE' ||
      catState === 'SWAT_RIGHT_FUSE' ||
      catState === 'PRESS_FORBIDDEN'
    ) {
      var dPaw = Math.hypot(
        localPos.x - catCurrentPawLocalPos.x,
        localPos.y - catCurrentPawLocalPos.y,
        localPos.z - catCurrentPawLocalPos.z
      );
      if ((dPaw < 0.175 || dForbiddenShield < 0.155) && touchCooldowns.boop <= 0) {
        touchCooldowns.boop = 0.35;
        boopCatPaw();
        return;
      }
    }

    // 2. VR Spatial Mechanic: 3D Karate-Chop / Hand-Swipe Wire Severing (`surgeWire`, `trapWire` at `z = -0.088`)
    if (!surgeWireSevered) {
      var dSurge = Math.hypot(localPos.x - -0.118, localPos.y - 0.055, localPos.z - -0.088);
      if (dSurge < 0.056 && touchCooldowns.surgeWire <= 0) {
        touchCooldowns.surgeWire = 0.55;
        cutSurgeWire();
        return;
      }
    }
    if (!trapWireSevered) {
      var dTrap = Math.hypot(localPos.x - 0.118, localPos.y - 0.055, localPos.z - -0.088);
      if (dTrap < 0.052 && touchCooldowns.trapWire <= 0) {
        touchCooldowns.trapWire = 0.55;
        cutTrapWire();
        return;
      }
    }

    // Left Crescent Wing Rear-Mid: Laser Gadget (`-0.55, 0.038, +0.05` — 22cm behind Yarn Ball & 19cm outside Left Fuse!)
    if (laserGadgetGroup && laserGadgetGroup.visible) {
      var dLaser = Math.hypot(localPos.x - -0.55, localPos.y - 0.038, localPos.z - 0.05);
      if (dLaser < 0.070 && touchCooldowns.laser <= 0) {
        touchCooldowns.laser = 0.40;
        pressLaserGadget();
        return;
      }
    }

    // Left Crescent Wing Front: Yarn Ball Gadget (`-0.52, 0.038, +0.27` — 22cm in front of Laser!)
    if (yarnGadgetGroup && yarnGadgetGroup.visible) {
      var dYarnBtn = Math.hypot(localPos.x - -0.52, localPos.y - 0.038, localPos.z - 0.27);
      if (dYarnBtn < 0.070 && touchCooldowns.yarn <= 0) {
        touchCooldowns.yarn = 0.45;
        buyChronoOverclockUpgrade();
        return;
      }
    }

    // Right Crescent Wing Front: Treats / Fish Gadget (`+0.52, 0.038, +0.27` — 36.1cm from Right Fuse & 36.8cm from EXIT!)
    if (kibbleGadgetGroup && kibbleGadgetGroup.visible) {
      var dKibble = Math.hypot(localPos.x - 0.52, localPos.y - 0.038, localPos.z - 0.27);
      if (dKibble < 0.072 && touchCooldowns.kibble <= 0) {
        touchCooldowns.kibble = 0.40;
        pressKibbleGadget();
        return;
      }
    }

    if (audioToggleGroup && audioToggleGroup.visible) {
      var dAudio = Math.hypot(localPos.x - -0.415, localPos.y - 0.04, localPos.z - -0.19);
      if (dAudio < 0.072 && touchCooldowns.audioBtn <= 0) {
        touchCooldowns.audioBtn = 0.45;
        toggleAudioMute();
        return;
      }
    }

    if (langToggleGroup && langToggleGroup.visible) {
      var dLang = Math.hypot(localPos.x - -0.415, localPos.y - 0.04, localPos.z - -0.05);
      if (dLang < 0.072 && touchCooldowns.langBtn <= 0) {
        touchCooldowns.langBtn = 0.45;
        toggleLanguage();
        return;
      }
    }

    // Left & Right Crescent Shoulder Fuses (`±0.40, 0.065, -0.07` — 21cm outside outer color pads & 26cm inside EXIT!)
    if (spec.needsLeftFuse && !fuseLeftLocked) {
      var dFuseL = Math.hypot(localPos.x - -0.40, localPos.y - 0.065, localPos.z - -0.07);
      if (dFuseL < 0.072 && touchCooldowns.fuseLeft <= 0) {
        touchCooldowns.fuseLeft = 0.35;
        pressFuseModule('left');
        return;
      }
    }
    if (spec.needsRightFuse && !fuseRightLocked) {
      var dFuseR = Math.hypot(localPos.x - 0.40, localPos.y - 0.065, localPos.z - -0.07);
      if (dFuseR < 0.072 && touchCooldowns.fuseRight <= 0) {
        touchCooldowns.fuseRight = 0.35;
        pressFuseModule('right');
        return;
      }
    }

    // 4 Wide U-Arc Color Pads (`18.5cm+` apart, `0.048m` clean touch radius)
    for (var i = 0; i < PAD_DEFS.length; i++) {
      var pad = PAD_DEFS[i];
      var dPad = Math.hypot(localPos.x - pad.x, localPos.y - (pad.y + 0.015), localPos.z - pad.z);
      var cdKey = 'pad' + i;
      if (dPad < 0.048 && touchCooldowns[cdKey] <= 0) {
        touchCooldowns[cdKey] = 0.18;
        pressColorPad(i);
        return;
      }
    }

    // Front Lip Master Disarm Bar (`0, 0.048, +0.235` — 25cm+ ahead of the inner color pads!)
    if (
      Math.abs(localPos.x) < 0.115 &&
      Math.abs(localPos.y - 0.048) < 0.052 &&
      Math.abs(localPos.z - 0.235) < 0.042 &&
      touchCooldowns.master <= 0
    ) {
      touchCooldowns.master = 0.22;
      pressMasterDisarm();
      return;
    }
  }

  // ============================================================================
  // WEBXR CONTROLLERS & POINTER INTERACTION
  // ============================================================================
  function handleRayHitAction(hitData, hitUv) {
    if (!hitData || !hitData.actionType) return false;
    if (hitData.actionType === 'TITLE_SCREEN') {
      if (isEndingOverlayOpen() && clockSec - endingModalOpenTime < 2.4) return true;
      startGameFromTitleScreen();
      return true;
    }
    if (hitData.actionType === 'TIPI_BOOP') {
      boopCatwhoPaw();
      return true;
    }
    if (hitData.actionType === 'SHOP_MONITOR') {
      var uvY = hitUv && typeof hitUv.y === 'number' ? hitUv.y : 0.5;
      // Map UV Y coordinate (`0` = bottom, `1` = top of `840x560` canvas) to the 3 Upgrade Shop Rows!
      if (uvY < 0.25) {
        buyShopUpgrade(3);
      } else if (uvY < 0.47) {
        buyShopUpgrade(2);
      } else {
        buyShopUpgrade(1);
      }
      return true;
    }
    if (hitData.actionType === 'COLOR_PAD') {
      pressColorPad(hitData.padIndex);
      return true;
    }
    if (hitData.actionType === 'MASTER_DISARM') {
      pressMasterDisarm();
      return true;
    }
    if (hitData.actionType === 'FUSE') {
      pressFuseModule(hitData.side);
      return true;
    }
    if (hitData.actionType === 'LASER_BTN') {
      pressLaserGadget();
      return true;
    }
    if (hitData.actionType === 'KIBBLE_BTN') {
      pressKibbleGadget();
      return true;
    }
    if (hitData.actionType === 'YARN_BTN') {
      buyChronoOverclockUpgrade();
      return true;
    }
    if (hitData.actionType === 'EXIT_XR_BTN') {
      triggerExitXrOrEndMatch();
      return true;
    }
    if (hitData.actionType === 'AUDIO_BTN') {
      toggleAudioMute();
      return true;
    }
    if (hitData.actionType === 'LANG_BTN') {
      toggleLanguage();
      return true;
    }
    if (hitData.actionType === 'AUTO_UPGRADE') {
      upgradeAutoClickerStation();
      return true;
    }
    if (hitData.actionType === 'CAT_BOOP') {
      boopCatPaw();
      return true;
    }
    if (hitData.actionType === 'SURGE_WIRE') {
      cutSurgeWire();
      return true;
    }
    if (hitData.actionType === 'TRAP_WIRE') {
      cutTrapWire();
      return true;
    }
    if (hitData.actionType === 'FORBIDDEN_BUTTON') {
      // Never detonate the bomb when the player clicks/pinches the Red Bomb Button — always boop/repel the cat's paw!
      boopCatPaw();
      return true;
    }
    return false;
  }

  function getInteractiveMeshes() {
    var list = [];
    if (titleScreenMesh && titleScreenMesh.visible) list.push(titleScreenMesh);
    for (var i = 0; i < colorPadCapMeshes.length; i++) {
      if (colorPadCapMeshes[i]) list.push(colorPadCapMeshes[i]);
    }
    if (masterBarCapMesh) list.push(masterBarCapMesh);
    if (forbiddenDomeMesh) list.push(forbiddenDomeMesh);
    if (leftFuseCoreMesh && leftFuseGroup && leftFuseGroup.visible) list.push(leftFuseCoreMesh);
    if (rightFuseCoreMesh && rightFuseGroup && rightFuseGroup.visible) list.push(rightFuseCoreMesh);
    if (laserBtnCapMesh && laserGadgetGroup && laserGadgetGroup.visible) list.push(laserBtnCapMesh);
    if (kibbleBtnCapMesh && kibbleGadgetGroup && kibbleGadgetGroup.visible) list.push(kibbleBtnCapMesh);
    if (yarnBtnCapMesh && yarnGadgetGroup && yarnGadgetGroup.visible) list.push(yarnBtnCapMesh);
    if (exitXrBtnCapMesh && exitXrGadgetGroup && exitXrGadgetGroup.visible) list.push(exitXrBtnCapMesh);
    if (audioToggleCapMesh && audioToggleGroup && audioToggleGroup.visible) list.push(audioToggleCapMesh);
    if (langToggleCapMesh && langToggleGroup && langToggleGroup.visible) list.push(langToggleCapMesh);
    if (bombClockMesh) list.push(bombClockMesh);
    if (stageRightMesh) list.push(stageRightMesh);
    if (autoClickerStationGroup) list.push(autoClickerStationGroup);
    if (surgeWireIntactMesh && !surgeWireSevered) list.push(surgeWireIntactMesh);
    if (trapWireIntactMesh && !trapWireSevered) list.push(trapWireIntactMesh);
    if (catPawLeftGroup) list.push(catPawLeftGroup);
    if (catPawRightGroup) list.push(catPawRightGroup);
    if (catHeadGroup) list.push(catHeadGroup);
    if (catwhoRig && catwhoRig.visible) {
      if (tipiPawLeftGroup) list.push(tipiPawLeftGroup);
      if (tipiPawRightGroup) list.push(tipiPawRightGroup);
      if (tipiHeadGroup) list.push(tipiHeadGroup);
      if (tipiBodyGroup) list.push(tipiBodyGroup);
    }
    return list;
  }

  function setupWebXRControllers() {
    if (!renderer || !renderer.xr) return;
    xrControllersList = [];
    var rayLineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8 });

    for (var i = 0; i < 2; i++) {
      var ctrl = renderer.xr.getController(i);
      var lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -0.55)
      ]);
      ctrl.add(new THREE.Line(lineGeo, rayLineMat));

      (function (controllerObj) {
        controllerObj.addEventListener('selectstart', function () {
          try {
            var tempMat = new THREE.Matrix4();
            tempMat.identity().extractRotation(controllerObj.matrixWorld);
            var raycaster = new THREE.Raycaster();
            raycaster.ray.origin.setFromMatrixPosition(controllerObj.matrixWorld);
            raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMat);

            var hits = raycaster.intersectObjects(getInteractiveMeshes(), true);
            for (var h = 0; h < hits.length; h++) {
              var cur = hits[h].object;
              while (cur) {
                if (cur.userData && cur.userData.actionType) {
                  if (handleRayHitAction(cur.userData, hits[h].uv)) return;
                }
                cur = cur.parent;
              }
            }
            if (inTitleScreenMode) {
              startGameFromTitleScreen();
            }
          } catch (_) {}
        });
      })(ctrl);

      scene.add(ctrl);
      xrControllersList.push(ctrl);
    }
  }

  function setupCanvasPointerInteractions() {
    if (!renderer || !renderer.domElement) return;
    var domElement = renderer.domElement;

    domElement.addEventListener('pointerdown', function (ev) {
      unlockAndResumeAudio();
      if (!camera || !scene) return;
      var rect = domElement.getBoundingClientRect();
      var ndcX = ((ev.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      var ndcY = -((ev.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;

      var raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      var hits = raycaster.intersectObjects(getInteractiveMeshes(), true);
      for (var h = 0; h < hits.length; h++) {
        var cur = hits[h].object;
        while (cur) {
          if (cur.userData && cur.userData.actionType) {
            if (handleRayHitAction(cur.userData, hits[h].uv)) return;
          }
          cur = cur.parent;
        }
      }

      isOrbitDragging = true;
      lastPointerX = ev.clientX;
      lastPointerY = ev.clientY;
    });

    window.addEventListener('pointermove', function (ev) {
      if (!renderer || !renderer.domElement) return;
      var rect = renderer.domElement.getBoundingClientRect();
      var nx = ((ev.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      var ny = -((ev.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
      cursorWorldTarget.x = Math.max(-0.38, Math.min(0.38, nx * 0.36));
      cursorWorldTarget.z = Math.max(-0.24, Math.min(0.25, 0.10 - ny * 0.24));

      if (!isOrbitDragging) return;
      var dx = ev.clientX - lastPointerX;
      var dy = ev.clientY - lastPointerY;
      lastPointerX = ev.clientX;
      lastPointerY = ev.clientY;
      camAzimuth = Math.max(-0.85, Math.min(0.85, camAzimuth - dx * 0.005));
      camElevation = Math.max(0.24, Math.min(1.15, camElevation + dy * 0.005));
    });

    window.addEventListener('pointerup', function () {
      isOrbitDragging = false;
    });
  }

  // ============================================================================
  // CAT AI, NATURAL CONSTANT-SPEED WALKING & COLLISION-AVOIDANCE ENGINE
  // ============================================================================
  var SCENE_OBSTACLES = [
    { x: -0.40, z: -0.07, r: 0.115 }, // Left Copper Fuse Coil (Crescent Shoulder)
    { x: 0.40, z: -0.07, r: 0.115 },  // Right Copper Fuse Coil (Crescent Shoulder)
    { x: 0.46, z: -0.19, r: 0.115 },  // Red Kibble Bowl
    { x: -0.55, z: 0.05, r: 0.115 },  // Laser Turret Station (Left Crescent Wing)
    { x: 0.52, z: 0.27, r: 0.115 },   // Treats Dispenser Station (Right Crescent Wing)
    { x: 0.66, z: -0.07, r: 0.105 }   // Far-Right Wing EXIT Pod
  ];

  function clampCatOutsideSceneObstacles(posX, posZ, allowOnBoard) {
    var x = posX;
    var z = Math.max(-0.335, Math.min(0.18, posZ));
    // Keep out of the central C4 blocks & Red Forbidden Dome (`(0, -0.015)`) unless stepping onto the front board
    if (!allowOnBoard) {
      var bDx = x - 0.0;
      var bDz = z - -0.015;
      var bDist = Math.hypot(bDx, bDz);
      if (bDist < 0.165) {
        if (bDist < 0.001) {
          z = -0.245;
        } else {
          x = (bDx / bDist) * 0.165;
          z = -0.015 + (bDz / bDist) * 0.165;
        }
      }
      if (Math.abs(x) < 0.215 && z > -0.238) {
        z = -0.238;
      }
    } else {
      // Even when walking to/from LOAF_ON_BOARD, steer around the C4/Forbidden Dome core (`(0, -0.025, r=0.082)`)!
      var cDx = x - 0.0;
      var cDz = z - -0.025;
      var cDist = Math.hypot(cDx, cDz);
      if (cDist < 0.085) {
        var pushSign = x >= 0 ? 1 : -1;
        x = pushSign * Math.max(Math.abs(x), Math.sqrt(Math.max(0.0001, 0.085 * 0.085 - cDz * cDz)));
      }
    }

    for (var i = 0; i < SCENE_OBSTACLES.length; i++) {
      var ob = SCENE_OBSTACLES[i];
      var dx = x - ob.x;
      var dz = z - ob.z;
      var d = Math.hypot(dx, dz);
      if (d < ob.r) {
        if (d < 0.001) {
          z = ob.z - ob.r;
        } else {
          x = ob.x + (dx / d) * ob.r;
          z = ob.z + (dz / d) * ob.r;
        }
      }
    }
    return { x: x, z: Math.max(-0.335, z) };
  }

  function stepCatNaturalLocomotion(curPos, curRotY, goalX, goalY, goalZ, goalRotY, walkSpeed, dt, allowOnBoard, peerPos) {
    // Route smoothly around the central C4/Dome when transitioning between rear walkway (`z < -0.10`) and front board (`z > 0.0`)
    var wpX = goalX;
    var wpZ = goalZ;
    if (allowOnBoard && curPos.z < -0.05 && goalZ > 0.01) {
      wpX = curPos.x >= 0 ? 0.165 : -0.165;
      wpZ = -0.02;
    } else if (!allowOnBoard && curPos.z > -0.12 && goalZ < -0.18) {
      wpX = goalX >= 0 ? 0.195 : -0.195;
      wpZ = -0.19;
    }

    var dx = wpX - curPos.x;
    var dz = wpZ - curPos.z;
    var distToWp = Math.hypot(dx, dz);
    var totalDist = Math.hypot(goalX - curPos.x, goalZ - curPos.z);

    var nextX = curPos.x;
    var nextZ = curPos.z;
    var isWalking = totalDist > 0.022;
    var desiredRotY = goalRotY;

    if (isWalking && distToWp > 0.001) {
      var dirX = dx / distToWp;
      var dirZ = dz / distToWp;

      // Tangential steering around the peer cat if within 0.33m so the two cats NEVER collide!
      if (peerPos) {
        var pDx = curPos.x - peerPos.x;
        var pDz = curPos.z - peerPos.z;
        var pDist = Math.hypot(pDx, pDz);
        if (pDist < 0.33 && pDist > 0.001) {
          var repelWeight = (0.33 - pDist) / 0.33;
          dirX += (pDx / pDist) * repelWeight * 1.45;
          dirZ += (pDz / pDist) * repelWeight * 1.45 - 0.35 * repelWeight;
          var dirLen = Math.hypot(dirX, dirZ) || 1.0;
          dirX /= dirLen;
          dirZ /= dirLen;
        }
      }

      var stepLen = Math.min(distToWp, walkSpeed * dt);
      nextX = curPos.x + dirX * stepLen;
      nextZ = curPos.z + dirZ * stepLen;

      var clamped = clampCatOutsideSceneObstacles(nextX, nextZ, allowOnBoard);
      var actualDx = clamped.x - curPos.x;
      var actualDz = clamped.z - curPos.z;
      nextX = clamped.x;
      nextZ = clamped.z;

      if (Math.hypot(actualDx, actualDz) > 0.0005) {
        var walkHeading = Math.atan2(actualDx, actualDz);
        var blendToGoal = Math.max(0.0, Math.min(1.0, (totalDist - 0.02) / 0.07));
        desiredRotY = goalRotY + (walkHeading - goalRotY) * blendToGoal;
      }
    } else {
      var settled = clampCatOutsideSceneObstacles(goalX, goalZ, allowOnBoard);
      nextX = settled.x;
      nextZ = settled.z;
    }

    // Smooth shortest-angle rotation interpolation
    var rotDiff = desiredRotY - curRotY;
    while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
    while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
    var nextRotY = curRotY + rotDiff * Math.min(1.0, dt * 8.5);

    // Smooth ground elevation transition (0.008 on workbench floor, 0.052 when on top of the front board)
    var boardElevation = nextZ > -0.04 && Math.abs(nextX) < 0.16 ? 0.052 : 0.008;
    var nextY = curPos.y + ((isWalking ? boardElevation : goalY) - curPos.y) * Math.min(1.0, dt * 9.0);

    return {
      x: nextX,
      y: nextY,
      z: nextZ,
      rotY: nextRotY,
      isWalking: isWalking,
      totalDist: totalDist
    };
  }

  function spawnYarnBallWithPhysics() {
    yarnPhys.radius = 0.032;
    yarnPhys.x = -0.442;
    yarnPhys.y = 0.165;
    yarnPhys.z = -0.135;
    yarnPhys.vx = (Math.random() - 0.5) * 0.16;
    yarnPhys.vy = 0.15;
    yarnPhys.vz = 0.18;
    yarnPhys.batCooldown = 0.45;
    if (yarnBallGroup) {
      yarnBallGroup.position.set(yarnPhys.x, yarnPhys.y, yarnPhys.z);
      yarnBallGroup.visible = true;
    }
    if (yarnShadowMesh) {
      yarnShadowMesh.position.set(yarnPhys.x, 0.002, yarnPhys.z);
      yarnShadowMesh.visible = true;
    }
  }

  function updateYarnBallPhysics(dt) {
    if (!yarnBallGroup) return;
    var yarnOn = yarnActiveTimer > 0 && !inTitleScreenMode && !bombIsDestroyed;
    yarnBallGroup.visible = yarnOn;
    if (yarnShadowMesh) yarnShadowMesh.visible = yarnOn;
    if (!yarnOn) return;

    var dtStep = Math.min(0.033, Math.max(0.001, dt));
    var R = yarnPhys.radius || 0.032;

    // 1. Gravity & Elastic Bounce on Wooden Workbench Tabletop (`y = R = 0.032`)
    yarnPhys.vy -= 2.85 * dtStep;
    yarnPhys.y += yarnPhys.vy * dtStep;
    if (yarnPhys.y <= R) {
      yarnPhys.y = R;
      if (yarnPhys.vy < -0.07) {
        yarnPhys.vy = -yarnPhys.vy * 0.60;
      } else {
        yarnPhys.vy = 0.0;
      }
    }

    // 2. Rolling Resistance on Tabletop & Light Air Drag
    var onTable = yarnPhys.y <= R + 0.003;
    var drag = Math.pow(onTable ? 0.45 : 0.86, dtStep);
    yarnPhys.vx *= drag;
    yarnPhys.vz *= drag;

    // 3. Integrate Horizontal Position
    yarnPhys.x += yarnPhys.vx * dtStep;
    yarnPhys.z += yarnPhys.vz * dtStep;

    // 4. Hard Volume Collision Solver — ZERO Overlap with Bomb Console AABB (`x in [-0.295, +0.295], z in [-0.195, +0.235]`)
    var pad = R + 0.012;
    var bombMinX = -0.295 - pad;
    var bombMaxX = 0.295 + pad;
    var bombMinZ = -0.195 - pad;
    var bombMaxZ = 0.235 + pad;
    if (
      yarnPhys.x > bombMinX &&
      yarnPhys.x < bombMaxX &&
      yarnPhys.z > bombMinZ &&
      yarnPhys.z < bombMaxZ
    ) {
      var dLeft = yarnPhys.x - bombMinX;
      var dRight = bombMaxX - yarnPhys.x;
      var dBack = yarnPhys.z - bombMinZ;
      var dFront = bombMaxZ - yarnPhys.z;
      var minPen = Math.min(dLeft, dRight, dBack, dFront);
      if (minPen === dLeft) {
        yarnPhys.x = bombMinX;
        yarnPhys.vx = -Math.abs(yarnPhys.vx) * 0.75 - 0.05;
      } else if (minPen === dBack) {
        yarnPhys.z = bombMinZ;
        yarnPhys.vz = -Math.abs(yarnPhys.vz) * 0.75 - 0.05;
      } else if (minPen === dRight) {
        yarnPhys.x = bombMaxX;
        yarnPhys.vx = Math.abs(yarnPhys.vx) * 0.75 + 0.05;
      } else {
        yarnPhys.z = bombMaxZ;
        yarnPhys.vz = Math.abs(yarnPhys.vz) * 0.75 + 0.05;
      }
    }

    // 5. Hard Cylinder Collision Solver against Gadgets, Fuses, Kibble Bowl & Cat Bodies
    var cylVolumes = [
      { x: -0.550, z: 0.050, r: 0.058 + R },  // Laser Turret Station (Left Crescent Wing)
      { x: 0.520, z: 0.270, r: 0.058 + R },   // Treats Dispenser Station (Right Crescent Wing)
      { x: 0.460, z: -0.190, r: 0.062 + R },  // Red Kibble Bowl
      { x: -0.400, z: -0.070, r: 0.052 + R }, // Left Fuse Coil (Crescent Shoulder)
      { x: 0.400, z: -0.070, r: 0.052 + R },  // Right Fuse Coil (Crescent Shoulder)
      { x: 0.660, z: -0.070, r: 0.052 + R }   // Far-Right Wing EXIT Pod
    ];
    if (catRig) {
      cylVolumes.push({ x: catRig.position.x, z: catRig.position.z + 0.010, r: 0.066 + R, isCat: true });
    }
    if (catwhoRig && catwhoRig.visible) {
      cylVolumes.push({ x: catwhoRig.position.x, z: catwhoRig.position.z + 0.010, r: 0.066 + R, isCat: true });
    }

    for (var c = 0; c < cylVolumes.length; c++) {
      var cv = cylVolumes[c];
      var cdx = yarnPhys.x - cv.x;
      var cdz = yarnPhys.z - cv.z;
      var cdist = Math.hypot(cdx, cdz);
      if (cdist < cv.r) {
        var nx = cdist > 0.0005 ? cdx / cdist : 0.0;
        var nz = cdist > 0.0005 ? cdz / cdist : 1.0;
        yarnPhys.x = cv.x + nx * cv.r;
        yarnPhys.z = cv.z + nz * cv.r;
        var vDotN = yarnPhys.vx * nx + yarnPhys.vz * nz;
        if (vDotN < 0) {
          yarnPhys.vx -= 1.75 * vDotN * nx;
          yarnPhys.vz -= 1.75 * vDotN * nz;
        }
        if (cv.isCat) {
          yarnPhys.vz = Math.max(0.20, Math.abs(yarnPhys.vz));
          yarnPhys.vy = Math.max(yarnPhys.vy, 0.16);
        }
      }
    }

    // 6. Keep Yarn Ball inside the Open Left-Mid Workbench Play Court (`x in [-0.495, -0.392], z in [-0.190, -0.075]`)
    //    100% clear of Bomb Briefcase (`x >= -0.335`), Laser Turret (`z = +0.12`), and in front of Catone (`z = -0.285`)!
    if (yarnPhys.x < -0.495) {
      yarnPhys.x = -0.495;
      yarnPhys.vx = Math.abs(yarnPhys.vx) * 0.80 + 0.05;
    } else if (yarnPhys.x > -0.392) {
      yarnPhys.x = -0.392;
      yarnPhys.vx = -Math.abs(yarnPhys.vx) * 0.80 - 0.05;
    }
    if (yarnPhys.z > -0.075) {
      yarnPhys.z = -0.075;
      yarnPhys.vz = -Math.abs(yarnPhys.vz) * 0.80 - 0.06;
    } else if (yarnPhys.z < -0.190) {
      yarnPhys.z = -0.190;
      yarnPhys.vz = Math.abs(yarnPhys.vz) * 0.80 + 0.06;
    }

    // 7. Physical Cat Paw Batting Impulse when the ball rolls near Catone's reach (`z <= -0.162`) or slows down
    yarnPhys.batCooldown = Math.max(0, yarnPhys.batCooldown - dtStep);
    var horizSpeed = Math.hypot(yarnPhys.vx, yarnPhys.vz);
    if ((yarnPhys.z <= -0.162 || horizSpeed < 0.055) && yarnPhys.batCooldown <= 0) {
      yarnPhys.batCooldown = 0.50 + Math.random() * 0.28;
      yarnPhys.vz = 0.20 + Math.random() * 0.12;
      yarnPhys.vx = (yarnPhys.x < -0.442 ? 1 : -1) * (0.14 + Math.random() * 0.10);
      yarnPhys.vy = 0.17 + Math.random() * 0.10;
      playGameSound('yarn_bat');
    }

    // 8. True Rolling Angular Kinematics (`dTheta = v * dt / R`) + Contact Shadow Update
    yarnBallGroup.position.set(yarnPhys.x, yarnPhys.y, yarnPhys.z);
    if (yarnBallMesh) {
      yarnBallMesh.rotation.z -= (yarnPhys.vx * dtStep) / R;
      yarnBallMesh.rotation.x += (yarnPhys.vz * dtStep) / R;
    }
    if (yarnShadowMesh) {
      yarnShadowMesh.position.set(yarnPhys.x, 0.002, yarnPhys.z);
      var hAbove = Math.max(0, yarnPhys.y - R);
      var shScale = Math.max(0.55, 1.0 - hAbove * 2.2);
      yarnShadowMesh.scale.set(shScale, shScale, 1.0);
    }
  }

  function isEndingOverlayOpen() {
    var endingOverlay = document.getElementById('game-ending-overlay');
    return Boolean(endingOverlay && !endingOverlay.classList.contains('hidden'));
  }

  function updateCatBehavior(dt, spec) {
    if (inTitleScreenMode || circuitDisarmed || bombIsDestroyed || isEndingOverlayOpen()) return;

    if (laserActiveTimer > 0) laserActiveTimer = Math.max(0, laserActiveTimer - dt);
    if (yarnActiveTimer > 0) {
      yarnActiveTimer = Math.max(0, yarnActiveTimer - dt);
      if (yarnActiveTimer <= 0) {
        if (yarnBallGroup) yarnBallGroup.visible = false;
        if (yarnShadowMesh) yarnShadowMesh.visible = false;
      }
    }
    // Only count down kibble eating time once Catone has walked close to the kibble bowl!
    var distToBowl = catRig ? Math.hypot(catRig.position.x - 0.415, catRig.position.z - -0.215) : 0;
    if (kibbleActiveTimer > 0 && (catState !== 'EAT_KIBBLE' || distToBowl < 0.06)) {
      kibbleActiveTimer = Math.max(0, kibbleActiveTimer - dt);
      if (kibbleActiveTimer <= 0 && kibblePelletsGroup) {
        kibblePelletsGroup.visible = false;
      }
    }

    // 1. Update Guest Star Cat ("Catwho") Lifecycle:
    //    HIDDEN -> APPROACHING (natural walk-in) -> DUO_PLAY -> DUO_SABOTAGE -> LEAVING (natural walk-out)!
    if (catwhoPhase === 'HIDDEN') {
      if (laserActiveTimer <= 0 && kibbleActiveTimer <= 0 && yarnActiveTimer <= 0) {
        catwhoCooldown -= dt;
        if (catwhoCooldown <= 0) {
          summonCatwhoDuoWave();
        }
      }
    } else if (catwhoPhase === 'PLAY_YARN') {
      if (yarnActiveTimer <= 0) {
        catwhoPhase = 'LEAVING';
        catwhoTimer = 3.2;
        catwhoCooldown = Math.max(7.5, 13.5 - currentLevelNum * 0.5);
      }
    } else if (catwhoPhase === 'APPROACHING') {
      catwhoTimer -= dt;
      var tipiDistToPlay = catwhoRig
        ? Math.hypot(catwhoRig.position.x - 0.175, catwhoRig.position.z - -0.265)
        : 0;
      if (tipiDistToPlay <= 0.035 || catwhoTimer <= -1.5) {
        catwhoPhase = 'DUO_PLAY';
        catwhoTimer = 3.0;
      }
      return;
    } else if (catwhoPhase === 'DUO_PLAY') {
      catwhoTimer -= dt;
      // Both cats are distracted playing together at a safe distance during DUO_PLAY!
      if (catwhoTimer <= 0) {
        catwhoPhase = 'DUO_SABOTAGE';
        catwhoAttackProgress = 0.0;
        catwhoAttackDuration = Math.max(2.7, 3.9 / Math.max(0.6, spec.catAggression));
        catAttackProgress = 0.0;
        catAttackDuration = Math.max(2.6, 3.8 / Math.max(0.6, spec.catAggression));

        // Mutually Exclusive Target Assignment + Unpredictable Left/Right Paw Selection!
        catAttackPawSide = Math.random() < 0.5 ? 'left' : 'right';
        catwhoAttackPawSide = Math.random() < 0.5 ? 'left' : 'right';
        if (Math.random() < 0.5) {
          catState = 'SWAT_LEFT_FUSE';
          catwhoTargetAction = 'PRESS_FORBIDDEN';
        } else {
          catState = 'PRESS_FORBIDDEN';
          catwhoTargetAction = 'SWAT_RIGHT_FUSE';
        }
        playGameSound('meow');
        spawnClickPopup3D(
          tr('DUAL CAT SABOTAGE!', '¡SABOTAJE DE DOS GATOS!'),
          tr('BOOP BOTH OR USE LASER!', '¡TOCA AMBOS O USA LÁSER!'),
          '#ff1e38',
          0.0,
          0.14,
          -0.12,
          true
        );
      }
      return;
    } else if (catwhoPhase === 'DUO_SABOTAGE') {
      catwhoAttackProgress += dt / Math.max(1.2, catwhoAttackDuration);
      if (catwhoAttackProgress >= 1.0) {
        catwhoAttackProgress = 0.0;
        if (catwhoTargetAction === 'PRESS_FORBIDDEN') {
          triggerForbiddenButtonPenalty();
        } else if (catwhoTargetAction === 'SWAT_RIGHT_FUSE') {
          fuseRightLocked = false;
          fuseRightKnockAnim = 1.0;
          levelTimerSec = Math.max(2.0, levelTimerSec - 5.0);
          playGameSound('pad_wrong');
          pulseXrHaptics(0.9, 120);
        } else if (catwhoTargetAction === 'SWAT_LEFT_FUSE') {
          fuseLeftLocked = false;
          fuseLeftKnockAnim = 1.0;
          levelTimerSec = Math.max(2.0, levelTimerSec - 5.0);
          playGameSound('pad_wrong');
          pulseXrHaptics(0.9, 120);
        }
        catwhoPhase = 'LEAVING';
        catwhoTimer = 3.2;
        catwhoCooldown = Math.max(7.5, 13.5 - currentLevelNum * 0.5);
        updateDomCounters();
      }
    } else if (catwhoPhase === 'LEAVING' || catwhoPhase === 'BOOPED_EXIT') {
      catwhoTimer -= dt;
      var tipiExitX = catwhoRig ? catwhoRig.position.x : 0.8;
      if (tipiExitX >= 0.72 || catwhoTimer <= -1.0) {
        catwhoPhase = 'HIDDEN';
        if (catwhoRig) catwhoRig.visible = false;
      }
    }

    if (catState === 'CHASE_LASER') {
      if (laserActiveTimer <= 0) {
        catState = 'IDLE';
        catStateTimer = 1.6;
      }
      return;
    }

    if (catState === 'PLAY_YARN') {
      if (yarnActiveTimer <= 0) {
        catState = 'IDLE';
        catStateTimer = 1.8;
      }
      return;
    }

    if (catState === 'EAT_KIBBLE') {
      if (kibbleActiveTimer <= 0) {
        catState = 'IDLE';
        catStateTimer = 1.8;
      }
      return;
    }

    if (catState === 'BOOPED_RETREAT') {
      catStateTimer -= dt;
      if (catStateTimer <= 0) {
        catState = 'IDLE';
        catStateTimer = Math.max(1.2, 2.5 / Math.max(0.5, spec.catAggression));
      }
      return;
    }

    if (catState === 'LOAF_ON_BOARD') return;

    if (catState === 'IDLE') {
      if (spec.catAggression <= 0) return;
      catStateTimer -= dt;
      if (catStateTimer <= 0) {
        var roll = Math.random();
        if (spec.canLoaf && roll < 0.24 && catwhoPhase === 'HIDDEN' && clickerCoins >= getFishUpgradeCost()) {
          catState = 'LOAF_ON_BOARD';
          playGameSound('meow');
        } else if (spec.needsLeftFuse && fuseLeftLocked && roll < 0.55) {
          catState = 'SWAT_LEFT_FUSE';
          catAttackPawSide = Math.random() < 0.5 ? 'left' : 'right';
          catAttackProgress = 0.0;
          catAttackDuration = Math.max(2.3, 3.6 / spec.catAggression);
          playGameSound('meow');
        } else if (spec.needsRightFuse && fuseRightLocked && roll < 0.78) {
          catState = 'SWAT_RIGHT_FUSE';
          catAttackPawSide = Math.random() < 0.5 ? 'left' : 'right';
          catAttackProgress = 0.0;
          catAttackDuration = Math.max(2.3, 3.6 / spec.catAggression);
          playGameSound('meow');
        } else {
          catState = 'PRESS_FORBIDDEN';
          catAttackPawSide = Math.random() < 0.5 ? 'left' : 'right';
          catAttackProgress = 0.0;
          catAttackDuration = Math.max(2.4, 3.7 / spec.catAggression);
          playGameSound('meow');
        }
      }
      return;
    }

    catAttackProgress += dt / Math.max(1.0, catAttackDuration);
    if (catAttackProgress >= 1.0) {
      catAttackProgress = 0.0;
      if (catState === 'SWAT_LEFT_FUSE') {
        fuseLeftLocked = false;
        fuseLeftKnockAnim = 1.0;
        playGameSound('pad_wrong');
        pulseXrHaptics(0.85, 110);
      } else if (catState === 'SWAT_RIGHT_FUSE') {
        fuseRightLocked = false;
        fuseRightKnockAnim = 1.0;
        playGameSound('pad_wrong');
        pulseXrHaptics(0.85, 110);
      } else if (catState === 'PRESS_FORBIDDEN') {
        triggerForbiddenButtonPenalty();
      }
      catState = 'IDLE';
      catStateTimer = Math.max(1.6, 2.8 / Math.max(0.5, spec.catAggression));
      updateDomCounters();
    }
  }

  function updateBombExplosionVfx(dt) {
    if (tableShakeIntensity > 0) {
      tableShakeIntensity = Math.max(0, tableShakeIntensity - dt * 0.045);
    }
    if (wireSparksTimer > 0) {
      wireSparksTimer = Math.max(0, wireSparksTimer - dt);
      if (wireSparksGroup) {
        wireSparksGroup.rotation.y += dt * 16.0;
        wireSparksGroup.rotation.z += dt * 12.0;
        var spScale = 0.6 + Math.sin(clockSec * 40.0) * 0.35;
        wireSparksGroup.scale.set(spScale, spScale, spScale);
        if (wireSparksTimer <= 0) wireSparksGroup.visible = false;
      }
    }

    // Animate 3D Gold Voltage Coin Particles popping out of buttons!
    for (var cpIdx = 0; cpIdx < coinParticlesList.length; cpIdx++) {
      var cp = coinParticlesList[cpIdx];
      if (cp.life > 0) {
        cp.life -= dt;
        cp.vy -= 2.4 * dt;
        cp.mesh.position.x += cp.vx * dt;
        cp.mesh.position.y += cp.vy * dt;
        cp.mesh.position.z += cp.vz * dt;
        cp.mesh.rotation.y += dt * 14.0;
        cp.mesh.rotation.x += dt * 8.0;
        if (cp.life <= 0) cp.mesh.visible = false;
      }
    }

    // Animate Frameless Micro-Spark Popups (`clickPopupList`)!
    for (var popIdx = 0; popIdx < clickPopupList.length; popIdx++) {
      var pop = clickPopupList[popIdx];
      if (pop.life > 0) {
        pop.life -= dt;
        pop.sprite.position.y += dt * 0.045;
        pop.sprite.position.x += (pop.vx || 0) * dt;
        var pNorm = 1.0 - pop.life / Math.max(0.1, pop.maxLife);
        var popBounce = pNorm < 0.2 ? 0.85 + (pNorm / 0.2) * 0.22 : 1.07 - (pNorm - 0.2) * 0.25;
        var sX = pop.baseScale * popBounce;
        pop.sprite.scale.set(sX, sX * 0.5, 1);
        pop.sprite.material.opacity = Math.max(0, Math.min(0.95, (pop.life / pop.maxLife) * 1.8));
        if (pop.life <= 0) pop.sprite.visible = false;
      }
    }

    // Animate Physical Structural Destruction of the Bomb Parts (`destructiblePartsList`)!
    if (bombIsDestroyed) {
      for (var p = 0; p < destructiblePartsList.length; p++) {
        var dp = destructiblePartsList[p];
        if (!dp.obj) continue;
        dp.vy -= 3.8 * dt;
        dp.obj.position.x = Math.max(-0.45, Math.min(0.45, dp.obj.position.x + dp.vx * dt));
        dp.obj.position.y += dp.vy * dt;
        dp.obj.position.z = Math.max(-0.26, Math.min(0.25, dp.obj.position.z + dp.vz * dt));
        if (dp.obj.position.y < 0.022) {
          dp.obj.position.y = 0.022;
          dp.vy = Math.abs(dp.vy) * 0.36;
          dp.vx *= 0.72;
          dp.vz *= 0.72;
          dp.rx *= 0.75;
          dp.ry *= 0.75;
          dp.rz *= 0.75;
        }
        dp.obj.rotation.x += dp.rx * dt;
        dp.obj.rotation.y += dp.ry * dt;
        dp.obj.rotation.z += dp.rz * dt;
      }
    }

    if (explosionActiveTimer <= 0) {
      if (explosionGroup) explosionGroup.visible = false;
      return;
    }

    explosionActiveTimer = Math.max(0, explosionActiveTimer - dt);
    var norm = 1.0 - explosionActiveTimer / Math.max(0.1, explosionDuration);
    var sf = explosionScaleFactor;

    if (fireballCoreMesh) {
      var coreS = (0.25 + Math.sin(Math.min(1.0, norm * 2.2) * Math.PI) * 2.0) * sf;
      fireballCoreMesh.scale.set(coreS, coreS, coreS);
      fireballCoreMesh.material.opacity = Math.max(0, 1.0 - norm * 1.45);
      fireballCoreMesh.visible = norm < 0.72;
    }
    if (fireballOuterMesh) {
      var outS = (0.35 + Math.pow(norm, 0.55) * 2.2) * sf;
      fireballOuterMesh.scale.set(outS, outS * 0.85, outS);
      fireballOuterMesh.rotation.y += dt * 5.0;
      fireballOuterMesh.rotation.x += dt * 3.5;
      fireballOuterMesh.material.opacity = Math.max(0, 0.92 - norm * 1.15);
      fireballOuterMesh.visible = norm < 0.85;
    }
    if (shockwaveRingMesh) {
      var ringS = (0.4 + norm * 4.2) * sf;
      shockwaveRingMesh.scale.set(ringS, ringS, 1.0);
      shockwaveRingMesh.material.opacity = Math.max(0, 0.95 - norm * 1.25);
    }
    if (explosionLight) {
      explosionLight.intensity = Math.max(0, (1.0 - norm * 1.3) * 11.0 * sf);
    }

    for (var i = 0; i < explosionDebrisList.length; i++) {
      var d = explosionDebrisList[i];
      d.vy -= 4.2 * dt;
      d.mesh.position.x += d.vx * dt;
      d.mesh.position.y += d.vy * dt;
      d.mesh.position.z += d.vz * dt;
      if (d.mesh.position.y < 0.01) {
        d.mesh.position.y = 0.01;
        d.vy = Math.abs(d.vy) * 0.42;
      }
      d.mesh.rotation.x += d.rx * dt;
      d.mesh.rotation.y += d.ry * dt;
      d.mesh.rotation.z += d.rz * dt;
    }

    for (var s = 0; s < explosionSmokeList.length; s++) {
      var sm = explosionSmokeList[s];
      sm.mesh.position.x += sm.vx * dt;
      sm.mesh.position.y += sm.vy * dt;
      sm.mesh.position.z += sm.vz * dt;
      var smScale = sm.baseScale * (0.35 + norm * 1.05);
      sm.mesh.scale.set(smScale, smScale, smScale);
      sm.mesh.material.opacity = Math.max(0, 0.78 * (1.0 - norm));
    }
  }

  function animateStage(nowMs) {
    if (!renderer || typeof renderer.setAnimationLoop !== 'function') {
      requestAnimationFrame(animateStage);
    }

    var safeNow = typeof nowMs === 'number' ? nowMs : performance.now();
    var dt = Math.min(0.1, Math.max(0.001, (safeNow - lastFrameTimeMs) / 1000));
    lastFrameTimeMs = safeNow;
    clockSec += dt;

    var spec = getSpec();

    for (var ck in touchCooldowns) {
      if (touchCooldowns[ck] > 0) touchCooldowns[ck] = Math.max(0, touchCooldowns[ck] - dt);
    }
    if (actionHandTargetTimer > 0) actionHandTargetTimer = Math.max(0, actionHandTargetTimer - dt);
    if (bombExplodedFlash > 0) bombExplodedFlash = Math.max(0, bombExplodedFlash - dt * 1.5);
    if (clickBarFlashTimer > 0) clickBarFlashTimer = Math.max(0, clickBarFlashTimer - dt * 2.5);
    if (oledToastTimer > 0) oledToastTimer = Math.max(0, oledToastTimer - dt);
    if (impactFlashTimer > 0) {
      impactFlashTimer = Math.max(0, impactFlashTimer - dt);
      if (impactFlashLight) impactFlashLight.intensity = (impactFlashTimer / 0.18) * 2.2;
    } else if (impactFlashLight) {
      impactFlashLight.intensity = 0.0;
    }
    if (fuseLeftKnockAnim > 0) fuseLeftKnockAnim = Math.max(0, fuseLeftKnockAnim - dt * 2.0);
    if (fuseRightKnockAnim > 0) fuseRightKnockAnim = Math.max(0, fuseRightKnockAnim - dt * 2.0);
    if (autoUpgBtnDepress > 0) autoUpgBtnDepress = Math.max(0, autoUpgBtnDepress - dt * 5.0);
    if (autoHammerAnim > 0) autoHammerAnim = Math.max(0, autoHammerAnim - dt * 6.5);

    if (comboDecayTimer > 0) {
      comboDecayTimer -= dt;
      if (comboDecayTimer <= 0) {
        comboCount = 0;
        comboMultiplier = 1;
      }
    }

    updateBombExplosionVfx(dt);
    updateAdaptiveSpyMusic(dt);

    // Skinner-Box Variable Reinforcement: Golden Fever x5 Bonus Window!
    if (goldenFeverTimer > 0) {
      goldenFeverTimer = Math.max(0, goldenFeverTimer - dt);
    } else if (!circuitDisarmed && !bombIsDestroyed && totalClicksCount >= 4) {
      nextGoldenFeverCountdown -= dt;
      if (nextGoldenFeverCountdown <= 0) {
        goldenFeverTimer = 5.5;
        nextGoldenFeverCountdown = 20.0 + Math.random() * 12.0;
        playGameSound('win');
        spawnClickPopup3D(
          tr('GOLDEN FEVER x5!', '¡FIEBRE DORADA x5!'),
          tr('5x POWER & COINS!', '¡5x PODER Y MONEDAS!'),
          '#facc15',
          0.0,
          0.11,
          0.04,
          true
        );
      }
    }

    // Continuous Idle/IPS Loop (`ganancia = ips * dt * multiplicador_prestigio`)
    if (
      !inTitleScreenMode &&
      !circuitDisarmed &&
      !bombIsDestroyed &&
      catState !== 'LOAF_ON_BOARD' &&
      fuseLeftLocked &&
      (upgAutoLevel > 1 || upgCritLevel > 1)
    ) {
      var ipsNow = getAutomaticIps();
      var autoDrain = ipsNow * dt;
      if (bombCurrentCharge > 2.5) {
        bombCurrentCharge = Math.max(2.0, bombCurrentCharge - autoDrain);
      }
      autoClickAccum += dt * Math.min(3.5, 0.7 + (upgAutoLevel - 1 + (upgCritLevel - 1) * 1.5) * 0.35);
      if (autoClickAccum >= 1.0) {
        autoClickAccum -= 1.0;
        var autoCoins = Math.max(
          1,
          Math.round((upgAutoLevel - 1 + (upgCritLevel - 1) * 2) * getPrestigeMultiplier())
        );
        clickerCoins += autoCoins;
        lifetimeTotalCoins += autoCoins;
        spawnClickPopup3D(
          tr('AUTO -' + Math.round(ipsNow) + '/s', 'AUTO -' + Math.round(ipsNow) + '/s'),
          '+$' + autoCoins,
          '#34d399',
          0.0,
          0.06,
          0.08,
          false
        );
        refreshAllDynamicBadges();
        updateDomCounters();
      }
    }

    // Delayed level reset or Game Over after catastrophic C4 countdown explosion so the player sees the full 3D blast!
    var endingOpenNow = isEndingOverlayOpen();
    if (!endingOpenNow && levelResetPendingTimer > 0) {
      levelResetPendingTimer -= dt;
      if (levelResetPendingTimer <= 0) {
        if (clickerCoins <= 0) {
          openFinalScoreboardModal(false, true);
        } else {
          loadLevelByNumber(currentLevelNum);
        }
      }
    } else if (!endingOpenNow && !inTitleScreenMode && !circuitDisarmed && !bombIsDestroyed) {
      levelTimerSec -= dt;
      var curCeil = Math.ceil(levelTimerSec);
      if (curCeil < lastWholeSecBeep && curCeil >= 0) {
        lastWholeSecBeep = curCeil;
        playGameSound('tick');
      }
      if (levelTimerSec <= 0) {
        levelTimerSec = 0;
        checkAndAwardPrestigeRebirth();
        triggerBombExplosion3D(1.35);
        levelResetPendingTimer = 1.85;
      }
    }

    updateCatBehavior(dt, spec);

    // Progressive Sequence Acceleration: Active target button hops faster as bomb defusal progresses!
    if (
      !endingOpenNow &&
      !inTitleScreenMode &&
      !circuitDisarmed &&
      !bombIsDestroyed &&
      !isCircuitReadyToDisarm() &&
      catState !== 'LOAF_ON_BOARD'
    ) {
      seqStepDuration = getCurrentSeqStepDuration();
      seqStepTimer -= dt;
      if (seqStepTimer <= 0) {
        adaptiveSkillFactor = Math.max(0.72, adaptiveSkillFactor - 0.03);
        activeTargetPadIndex = (activeTargetPadIndex + 1 + Math.floor(Math.random() * 3)) % 4;
        seqStepTimer = seqStepDuration;
        playGameSound('tick');
      }
    }

    for (var bc = 0; bc < blastingCapLeds.length; bc++) {
      var blinkFast = levelTimerSec < 12 ? 16.0 : 6.0;
      var ledOn = Math.sin(clockSec * blinkFast + bc) > 0;
      blastingCapLeds[bc].material.color.setHex(circuitDisarmed ? 0x43c25c : ledOn ? 0xef6a4c : 0x4a2219);
    }

    if (!bombIsDestroyed) {
      // Colorfigures Flat-Tone Inactive vs Illuminated Active Plunger State!
      for (var i = 0; i < PAD_DEFS.length; i++) {
        if (padDepress[i] > 0) padDepress[i] = Math.max(0, padDepress[i] - dt * 6.5);
        var cap = colorPadCapMeshes[i];
        var pDef = PAD_DEFS[i];
        var isCritTarget =
          !circuitDisarmed &&
          !isCircuitReadyToDisarm() &&
          catState !== 'LOAF_ON_BOARD' &&
          activeTargetPadIndex === i;
        if (cap) {
          var breathY = isCritTarget ? Math.sin(clockSec * 10.0) * 0.0025 + 0.0035 : 0.0;
          cap.position.y = 0.026 + breathY - padDepress[i] * 0.015;
          var squash = 1.0 + padDepress[i] * 0.08;
          var pulseS = isCritTarget ? 1.04 + Math.sin(clockSec * 10.0) * 0.035 : 1.0;
          cap.scale.set(pulseS * squash, 1.0 - padDepress[i] * 0.12, pulseS * squash);
          // Inactive buttons use warm ceramic/muted tone; the active button lights up in vivid Colorfigures swatch!
          cap.material.color.setHex(isCritTarget ? pDef.hex : 0xdfd9c8);
          cap.material.emissive.setHex(isCritTarget ? pDef.emissiveHex : 0x000000);
          cap.material.emissiveIntensity = isCritTarget
            ? 0.38 + Math.sin(clockSec * 10.0) * 0.15
            : 0.0;
        }
      }

      // Animate Master Stop-Bomb Bar (also glows invitingly in green during Title Screen & Final Scoreboard!)
      if (masterBarDepress > 0) masterBarDepress = Math.max(0, masterBarDepress - dt * 5.0);
      if (masterBarCapMesh) {
        var ready = (isCircuitReadyToDisarm() && !circuitDisarmed) || inTitleScreenMode || endingOpenNow;
        var mBreath = ready ? Math.sin(clockSec * 10.0) * 0.0025 + 0.003 : 0.0;
        masterBarCapMesh.position.y = 0.026 + mBreath - masterBarDepress * 0.015;
        masterBarCapMesh.material.color.setHex(ready || circuitDisarmed ? 0x43c25c : 0xcfc8b8);
        masterBarCapMesh.material.emissiveIntensity = ready
          ? 0.42 + Math.sin(clockSec * 10.0) * 0.16
          : circuitDisarmed
          ? 0.25
          : 0.0;
      }

      if (forbiddenDepress > 0) forbiddenDepress = Math.max(0, forbiddenDepress - dt * 5.0);
      if (forbiddenDomeMesh) {
        forbiddenDomeMesh.position.y = 0.008 - forbiddenDepress * 0.010;
        forbiddenDomeMesh.material.emissiveIntensity =
          catState === 'PRESS_FORBIDDEN' || (catwhoPhase === 'DUO_SABOTAGE' && catwhoTargetAction === 'PRESS_FORBIDDEN')
            ? 0.75 + Math.sin(clockSec * 16.0) * 0.25
            : 0.18;
      }

      if (leftFuseCoreMesh) {
        var needL = spec.needsLeftFuse && !fuseLeftLocked;
        var targetLy = fuseLeftLocked ? 0.026 : 0.068 + Math.sin(clockSec * 8.0) * 0.005;
        leftFuseCoreMesh.position.y += (targetLy - leftFuseCoreMesh.position.y) * 0.25;
        leftFuseCoreMesh.rotation.z = fuseLeftKnockAnim * 0.55;
        leftFuseCoreMesh.material.color.setHex(fuseLeftLocked ? 0x43c25c : 0xf4b829);
        leftFuseCoreMesh.material.emissive.setHex(
          catState === 'SWAT_LEFT_FUSE' || (catwhoPhase === 'DUO_SABOTAGE' && catwhoTargetAction === 'SWAT_LEFT_FUSE')
            ? 0xef6a4c
            : fuseLeftLocked
            ? 0x2e6f56
            : 0xd49c1f
        );
        leftFuseCoreMesh.material.emissiveIntensity =
          needL || catState === 'SWAT_LEFT_FUSE'
            ? 0.45 + Math.sin(clockSec * 11.0) * 0.18
            : 0.08;
      }
      if (rightFuseCoreMesh) {
        var needR = spec.needsRightFuse && !fuseRightLocked;
        var targetRy = fuseRightLocked ? 0.026 : 0.068 + Math.sin(clockSec * 8.0) * 0.005;
        rightFuseCoreMesh.position.y += (targetRy - rightFuseCoreMesh.position.y) * 0.25;
        rightFuseCoreMesh.rotation.z = -fuseRightKnockAnim * 0.55;
        rightFuseCoreMesh.material.color.setHex(fuseRightLocked ? 0x43c25c : 0xf4b829);
        rightFuseCoreMesh.material.emissive.setHex(
          catState === 'SWAT_RIGHT_FUSE' || (catwhoPhase === 'DUO_SABOTAGE' && catwhoTargetAction === 'SWAT_RIGHT_FUSE')
            ? 0xef6a4c
            : fuseRightLocked
            ? 0x2e6f56
            : 0xd49c1f
        );
        rightFuseCoreMesh.material.emissiveIntensity =
          needR || catState === 'SWAT_RIGHT_FUSE' || (catwhoPhase === 'DUO_SABOTAGE' && catwhoTargetAction === 'SWAT_RIGHT_FUSE')
            ? 0.45 + Math.sin(clockSec * 11.0) * 0.18
            : 0.08;
      }

      if (laserBtnDepress > 0) laserBtnDepress = Math.max(0, laserBtnDepress - dt * 5.0);
      if (laserBtnCapMesh) {
        laserBtnCapMesh.position.y = 0.026 - laserBtnDepress * 0.014;
        var canBuyLaser = clickerCoins >= getLaserUpgradeCost();
        laserBtnCapMesh.material.emissiveIntensity = canBuyLaser
          ? 0.38 + Math.sin(clockSec * 7.0) * 0.15
          : 0.10;
      }
      if (laserDotMesh && laserBeamMesh) {
        var laserOn = laserActiveTimer > 0;
        laserDotMesh.visible = laserOn;
        laserBeamMesh.visible = laserOn;
        if (laserOn) {
          // Project the laser UP onto the vertical Back Wall Plane (`y = 0.18..0.26, z = -0.365`) high behind the cats & clear of the bomb panel!
          var lx = -0.10 + Math.sin(clockSec * 3.4) * 0.155 + Math.cos(clockSec * 5.8) * 0.025;
          var ly = 0.215 + Math.sin(clockSec * 5.2) * 0.042;
          var lz = -0.365;
          laserTargetPos.x = lx;
          laserTargetPos.y = ly;
          laserTargetPos.z = lz;
          laserDotMesh.position.set(lx, ly, lz);
          var dotPulse = 0.92 + Math.sin(clockSec * 24.0) * 0.18;
          laserDotMesh.scale.set(dotPulse, dotPulse, 1.0);
          var pivotWorld = { x: -0.55, y: 0.064, z: 0.032 };
          var bDx = lx - pivotWorld.x;
          var bDy = ly - pivotWorld.y;
          var bDz = lz - pivotWorld.z;
          var bLen = Math.max(0.01, Math.hypot(bDx, bDy, bDz));
          var emitterOrigin = {
            x: pivotWorld.x + (bDx / bLen) * 0.035,
            y: pivotWorld.y + (bDy / bLen) * 0.035,
            z: pivotWorld.z + (bDz / bLen) * 0.035
          };
          orientLocalLimbSegment(laserBeamMesh, emitterOrigin, laserTargetPos);
          if (laserTurretPivotRef) {
            laserTurretPivotRef.rotation.y = -Math.atan2(bDx, -bDz);
            laserTurretPivotRef.rotation.x = Math.atan2(bDy, Math.sqrt(bDx * bDx + bDz * bDz));
            laserTurretPivotRef.rotation.z = 0;
          }
        }
      }

      if (kibbleBtnDepress > 0) kibbleBtnDepress = Math.max(0, kibbleBtnDepress - dt * 5.0);
      if (kibbleBtnCapMesh) {
        kibbleBtnCapMesh.position.y = 0.026 - kibbleBtnDepress * 0.014;
        var needTreats = catState === 'LOAF_ON_BOARD';
        var canBuyFish = clickerCoins >= getFishUpgradeCost();
        kibbleBtnCapMesh.material.emissiveIntensity = needTreats
          ? 2.25 + Math.sin(clockSec * 12.0) * 0.65
          : canBuyFish
          ? 1.15 + Math.sin(clockSec * 7.0) * 0.35
          : 0.35;
      }

      if (yarnBtnDepress > 0) yarnBtnDepress = Math.max(0, yarnBtnDepress - dt * 5.0);
      if (yarnBtnCapMesh) {
        yarnBtnCapMesh.position.y = 0.026 - yarnBtnDepress * 0.014;
        var canBuyYarn = clickerCoins >= getChronoUpgradeCost();
        yarnBtnCapMesh.material.emissiveIntensity = canBuyYarn
          ? 0.95 + Math.sin(clockSec * 8.0) * 0.30
          : 0.42;
      }

      if (exitXrBtnDepress > 0) exitXrBtnDepress = Math.max(0, exitXrBtnDepress - dt * 5.0);
      if (exitXrBtnCapMesh) {
        exitXrBtnCapMesh.position.y = 0.022 - exitXrBtnDepress * 0.012;
      }
      if (kibblePelletsGroup) {
        var eatingNow = (catState === 'EAT_KIBBLE' || kibbleActiveTimer > 0) && !inTitleScreenMode;
        kibblePelletsGroup.visible = eatingNow;
        if (eatingNow) {
          var eatRemainFrac = Math.max(0.28, Math.min(1.0, kibbleActiveTimer / 6.0));
          var kScale = (0.85 + Math.sin(clockSec * 18.0) * 0.10) * eatRemainFrac;
          kibblePelletsGroup.scale.set(kScale, kScale, kScale);
          kibblePelletsGroup.position.y = 0.018 + Math.abs(Math.sin(clockSec * 18.0)) * 0.005;
          kibblePelletsGroup.rotation.y = Math.sin(clockSec * 20.0) * 0.32;
        }
      }

      updateYarnBallPhysics(dt);
    }

    // Animate Sculpted 3D Ginger Cat ("Catone") + Connected 2-Bone IK Shoulder->Elbow->Paw Arms!
    if (catRig && catBodyGroup && catHeadGroup && catPawLeftGroup && catPawRightGroup) {
      var targetCatX = 0.0;
      var targetCatY = 0.008;
      var targetCatZ = -0.255;
      var targetCatRotY = 0.0;
      var targetBodyLeanX = 0.06;
      var targetBodyTwistY = 0.0;
      var targetHeadX = 0.0;
      var targetHeadY = 0.174;
      var targetHeadZ = 0.048;
      var targetHeadRotX = 0.08 + Math.sin(clockSec * 2.5) * 0.03;
      var targetHeadRotY = Math.sin(clockSec * 2.0) * 0.22;

      // Resting front paws sit directly on top of the rear steel rim of the bomb briefcase (`y=0.044, z=-0.143`)
      var pawLx = -0.105;
      var pawLy = 0.036;
      var pawLz = 0.112;
      var pawRx = 0.105;
      var pawRy = 0.036;
      var pawRz = 0.112;

      catBlinkTimer = (catBlinkTimer + dt) % 4.2;
      var isBlinking = catBlinkTimer > 4.02 || catState === 'LOAF_ON_BOARD' || catState === 'EAT_KIBBLE';
      if (catEyelidLeft && catEyelidRight) {
        var targetEyeScaleY = isBlinking ? 0.12 : 1.0;
        catEyelidLeft.scale.y += (targetEyeScaleY - catEyelidLeft.scale.y) * 0.35;
        catEyelidRight.scale.y += (targetEyeScaleY - catEyelidRight.scale.y) * 0.35;
      }
      if (catEarLeft && catEarRight) {
        var earFlatten =
          catState === 'SWAT_LEFT_FUSE' || catState === 'SWAT_RIGHT_FUSE' || catState === 'PRESS_FORBIDDEN'
            ? 0.55
            : 0.26 + Math.sin(clockSec * 3.5) * 0.04;
        catEarLeft.rotation.z = earFlatten;
        catEarRight.rotation.z = -earFlatten;
      }

      if (inTitleScreenMode || isEndingOverlayOpen()) {
        // On the Start Screen or Final Scoreboard: Catone walks in the left lane (`x = -0.22` or `-0.32`), never blocking the scoreboard!
        var strollPhase = clockSec * 1.35;
        var baseCatX = isEndingOverlayOpen() ? -0.32 : -0.22;
        targetCatX = baseCatX + Math.sin(strollPhase) * 0.045;
        targetCatY = 0.008;
        targetCatZ = -0.255 + Math.cos(strollPhase * 2.0) * 0.015;
        targetCatRotY = Math.cos(strollPhase) * 0.32 + 0.18;
        targetBodyLeanX = 0.08 + Math.sin(clockSec * 7.8) * 0.025;
        targetHeadRotX = -0.05 + Math.sin(clockSec * 3.2) * 0.04;
        targetHeadRotY = Math.sin(clockSec * 2.4) * 0.24;
        pawLx = -0.075;
        pawLy = 0.020 + Math.max(0, Math.sin(clockSec * 7.8)) * 0.024;
        pawLz = 0.095;
        pawRx = 0.075 + Math.sin(clockSec * 6.5) * 0.020;
        pawRy = 0.062 + Math.sin(clockSec * 6.5) * 0.028;
        pawRz = 0.108;
      } else if (catwhoPhase === 'APPROACHING' && catState === 'IDLE') {
        // Catone walks to his left play spot (`x = -0.175`) and watches Catwho walk in from the right!
        targetCatX = -0.175;
        targetCatY = 0.008;
        targetCatZ = -0.265;
        targetCatRotY = 0.52;
        targetHeadRotY = 0.32;
      } else if (catwhoPhase === 'DUO_PLAY') {
        // Catone (`x = -0.175`) and Catwho (`x = +0.175`) play across a 0.35m gap with zero overlap!
        var playHop = Math.abs(Math.sin(clockSec * 12.0)) * 0.012;
        targetCatX = -0.175;
        targetCatY = 0.008 + playHop;
        targetCatZ = -0.265;
        targetCatRotY = 0.52;
        targetBodyLeanX = 0.05 + Math.sin(clockSec * 12.0) * 0.03;
        targetHeadRotY = 0.22;
        pawLx = -0.075;
        pawLy = 0.030;
        pawLz = 0.095;
        pawRx = 0.065 + Math.sin(clockSec * 14.0) * 0.022;
        pawRy = 0.074 + Math.cos(clockSec * 14.0) * 0.025;
        pawRz = 0.115;
      } else if (catState === 'LOAF_ON_BOARD') {
        targetCatX = 0.0;
        targetCatY = 0.052 + Math.sin(clockSec * 6.0) * 0.003;
        targetCatZ = 0.065;
        targetCatRotY = 0.0;
        targetBodyLeanX = 0.12;
        pawLx = -0.055;
        pawLy = 0.018;
        pawLz = 0.065;
        pawRx = 0.055;
        pawRy = 0.018;
        pawRz = 0.065;
        catCurrentPawLocalPos = { x: 0.0, y: 0.12, z: 0.065 };
      } else if (catState === 'CHASE_LASER') {
        // Cat walks/trots along the Back Wall (`z = -0.325`) toward the laser dot and swats UP at the wall!
        var chaseX = Math.max(-0.18, Math.min(0.18, laserTargetPos.x * 0.92));
        var chaseVelX = chaseX - catRig.position.x;
        var hopPhase = clockSec * 14.0;
        targetCatX = chaseX;
        targetCatY = 0.008;
        targetCatZ = -0.325;
        targetCatRotY = Math.max(-0.62, Math.min(0.62, chaseVelX * 4.0));
        targetBodyLeanX = -0.08 + Math.sin(hopPhase) * 0.04;
        targetBodyTwistY = Math.max(-0.22, Math.min(0.22, chaseVelX * 2.0));
        targetHeadY = 0.178;
        targetHeadZ = 0.044;
        targetHeadRotX = -0.34 - Math.max(0, laserTargetPos.y - 0.12) * 1.4;
        targetHeadRotY = Math.max(-0.42, Math.min(0.42, chaseVelX * 3.2));

        var swatWave = Math.sin(hopPhase);
        var wallPawY = Math.max(0.085, Math.min(0.165, laserTargetPos.y - 0.010));
        if (swatWave >= 0) {
          pawLx = -0.045 + Math.cos(hopPhase) * 0.020;
          pawLy = wallPawY + swatWave * 0.015;
          pawLz = -0.035;
          pawRx = 0.072;
          pawRy = 0.032 + (1.0 - swatWave) * 0.020;
          pawRz = 0.075;
        } else {
          pawLx = -0.072;
          pawLy = 0.032 + (1.0 + swatWave) * 0.020;
          pawLz = 0.075;
          pawRx = 0.045 + Math.cos(hopPhase) * 0.020;
          pawRy = wallPawY - swatWave * 0.015;
          pawRz = -0.035;
        }
        catCurrentPawLocalPos = { x: laserTargetPos.x, y: laserTargetPos.y, z: -0.40 };
      } else if (catState === 'PLAY_YARN') {
        // Catone stands at the rear-left (`x = -0.385, z = -0.285`) behind the Yarn Ball so the ball is 100% visible in front of him!
        var yBallX = yarnBallGroup ? yarnBallGroup.position.x : -0.442;
        var yBallZ = yarnBallGroup ? yarnBallGroup.position.z : -0.135;
        var batPhase = clockSec * 13.0;
        targetCatX = -0.385;
        targetCatY = 0.008 + Math.abs(Math.sin(batPhase)) * 0.008;
        targetCatZ = -0.285;
        targetCatRotY = -0.38 + Math.max(-0.22, Math.min(0.22, (yBallX - -0.442) * 2.2));
        targetBodyLeanX = 0.16 + Math.sin(batPhase) * 0.04;
        targetHeadRotX = 0.26 + Math.cos(batPhase) * 0.07;
        targetHeadRotY = Math.max(-0.32, Math.min(0.32, (yBallX - catRig.position.x) * 3.0));
        if (Math.sin(batPhase) >= 0) {
          pawRx = 0.052 + Math.cos(batPhase) * 0.028;
          pawRy = 0.032 + Math.sin(batPhase) * 0.026;
          pawRz = 0.118;
          pawLx = -0.072;
          pawLy = 0.020;
          pawLz = 0.095;
        } else {
          pawLx = -0.052 + Math.cos(batPhase) * 0.028;
          pawLy = 0.032 - Math.sin(batPhase) * 0.026;
          pawLz = 0.118;
          pawRx = 0.072;
          pawRy = 0.020;
          pawRz = 0.095;
        }
        catCurrentPawLocalPos = { x: yBallX, y: 0.042, z: yBallZ };
      } else if (catState === 'EAT_KIBBLE') {
        // Cat walks right up to `catBowlGroup` at `(0.43, 0.016, -0.17)` and lowers its mouth into the kibble once arrived!
        var chewWave = Math.sin(clockSec * 18.0);
        targetCatX = 0.42;
        targetCatY = 0.008;
        targetCatZ = -0.30;
        targetCatRotY = 0.04;
        targetBodyLeanX = 0.22 + chewWave * 0.03;
        targetBodyTwistY = 0.0;
        targetHeadX = 0.0;
        targetHeadY = 0.118 + Math.abs(chewWave) * 0.010;
        targetHeadZ = 0.088;
        targetHeadRotX = 0.32 + chewWave * 0.12;
        targetHeadRotY = Math.cos(clockSec * 9.0) * 0.06;
        pawLx = -0.056;
        pawLy = 0.014;
        pawLz = 0.136;
        pawRx = 0.056;
        pawRy = 0.014;
        pawRz = 0.136;
        catCurrentPawLocalPos = { x: 0.43, y: 0.035, z: -0.17 };
      } else if (bombIsDestroyed) {
        // Duck-Hunt Style 3D Feline Snicker when the bomb explodes (`bombIsDestroyed`)!
        var snickerWave3D = Math.sin(clockSec * 18.0);
        targetCatX = 0.0;
        targetCatY = 0.016 + Math.abs(snickerWave3D) * 0.014;
        targetCatZ = -0.240;
        targetCatRotY = 0.0;
        targetBodyLeanX = -0.05 + snickerWave3D * 0.04;
        targetBodyTwistY = Math.cos(clockSec * 9.0) * 0.08;
        targetHeadY = 0.178 + Math.abs(snickerWave3D) * 0.010;
        targetHeadRotX = -0.12 + snickerWave3D * 0.08;
        targetHeadRotY = Math.sin(clockSec * 7.0) * 0.14;
        if (catEyelidLeft && catEyelidRight) {
          catEyelidLeft.scale.y = 0.16;
          catEyelidRight.scale.y = 0.16;
        }
        // Right paw raised over muzzle/whiskers stifling a silent cat-chuckle, left paw patting the rim!
        pawRx = 0.028;
        pawRy = 0.145 + snickerWave3D * 0.014;
        pawRz = 0.096;
        pawLx = -0.095;
        pawLy = 0.038 + Math.max(0, -snickerWave3D) * 0.022;
        pawLz = 0.112;
      } else if (catState === 'SWAT_LEFT_FUSE') {
        var pL = Math.min(1.0, catAttackProgress);
        var useLeftArmL = catAttackPawSide === 'left';
        targetCatX = catwhoPhase === 'DUO_SABOTAGE' ? -0.30 : useLeftArmL ? -0.26 : -0.32;
        targetCatZ = -0.245;
        targetBodyLeanX = 0.06 + 0.10 * pL;
        targetBodyTwistY = (useLeftArmL ? -0.18 : -0.26) * pL;
        var reachLx = -0.40 - targetCatX;
        if (useLeftArmL) {
          pawLx = -0.105 + (reachLx - -0.105) * pL;
          pawLy = 0.036 + Math.sin(pL * Math.PI) * 0.042;
          pawLz = 0.112 + (0.175 - 0.112) * pL;
          catCurrentPawLocalPos = {
            x: catRig.position.x + pawLx,
            y: catRig.position.y + pawLy,
            z: catRig.position.z + pawLz
          };
        } else {
          pawRx = 0.105 + (reachLx - 0.105) * pL;
          pawRy = 0.036 + Math.sin(pL * Math.PI) * 0.045;
          pawRz = 0.112 + (0.175 - 0.112) * pL;
          catCurrentPawLocalPos = {
            x: catRig.position.x + pawRx,
            y: catRig.position.y + pawRy,
            z: catRig.position.z + pawRz
          };
        }
      } else if (catState === 'SWAT_RIGHT_FUSE') {
        var pR = Math.min(1.0, catAttackProgress);
        var useRightArmR = catAttackPawSide === 'right';
        targetCatX = useRightArmR ? 0.25 : 0.30;
        targetCatZ = -0.245;
        targetBodyLeanX = 0.06 + 0.10 * pR;
        targetBodyTwistY = (useRightArmR ? 0.18 : 0.26) * pR;
        var reachRx = 0.40 - targetCatX;
        if (useRightArmR) {
          pawRx = 0.105 + (reachRx - 0.105) * pR;
          pawRy = 0.036 + Math.sin(pR * Math.PI) * 0.042;
          pawRz = 0.112 + (0.175 - 0.112) * pR;
          catCurrentPawLocalPos = {
            x: catRig.position.x + pawRx,
            y: catRig.position.y + pawRy,
            z: catRig.position.z + pawRz
          };
        } else {
          pawLx = -0.105 + (reachRx - -0.105) * pR;
          pawLy = 0.036 + Math.sin(pR * Math.PI) * 0.045;
          pawLz = 0.112 + (0.175 - 0.112) * pR;
          catCurrentPawLocalPos = {
            x: catRig.position.x + pawLx,
            y: catRig.position.y + pawLy,
            z: catRig.position.z + pawLz
          };
        }
      } else if (catState === 'PRESS_FORBIDDEN') {
        var pF = Math.min(1.0, catAttackProgress);
        var useLeftArmF = catAttackPawSide === 'left';
        targetCatX = catwhoPhase === 'DUO_SABOTAGE' ? -0.165 : useLeftArmF ? 0.035 : -0.035;
        targetCatZ = -0.255;
        targetBodyLeanX = 0.06 + 0.10 * pF;
        targetBodyTwistY = (useLeftArmF ? 0.12 : -0.12) * pF;
        var reachFx = 0.0 - targetCatX;
        if (useLeftArmF) {
          pawLx = -0.105 + (reachFx - -0.105) * pF;
          pawLy = 0.036 + Math.sin(pF * Math.PI) * 0.045;
          pawLz = 0.112 + (0.105 - 0.112) * pF;
          catCurrentPawLocalPos = {
            x: catRig.position.x + pawLx,
            y: catRig.position.y + pawLy,
            z: catRig.position.z + pawLz
          };
        } else {
          pawRx = 0.105 + (reachFx - 0.105) * pF;
          pawRy = 0.036 + Math.sin(pF * Math.PI) * 0.045;
          pawRz = 0.112 + (0.105 - 0.112) * pF;
          catCurrentPawLocalPos = {
            x: catRig.position.x + pawRx,
            y: catRig.position.y + pawRy,
            z: catRig.position.z + pawRz
          };
        }
      } else {
        targetCatX = catwhoPhase !== 'HIDDEN' ? -0.165 : 0.0;
        targetCatZ = -0.260;
        catCurrentPawLocalPos = { x: targetCatX, y: 0.06, z: -0.16 };
      }

      // Constant-speed natural walking locomotion + obstacle/peer avoidance for Catone!
      var mWalkSpd = catState === 'CHASE_LASER' ? 0.30 : 0.25;
      var mPeerPos = catwhoRig && catwhoRig.visible ? catwhoRig.position : null;
      var mStep = stepCatNaturalLocomotion(
        catRig.position,
        catRig.rotation.y,
        targetCatX,
        targetCatY,
        targetCatZ,
        targetCatRotY,
        mWalkSpd,
        dt,
        catState === 'LOAF_ON_BOARD',
        mPeerPos
      );
      catRig.position.set(mStep.x, mStep.y, mStep.z);
      catRig.rotation.y = mStep.rotY;

      // If Catone is actively walking toward his target (`EAT_KIBBLE`, `LOAF_ON_BOARD`, `IDLE`, etc.),
      // play a natural 4-beat walking gait instead of snapping straight into the final pose!
      if (mStep.isWalking && !inTitleScreenMode) {
        catWalkCyclePhase += dt * 14.0;
        var wSin = Math.sin(catWalkCyclePhase);
        var wCos = Math.cos(catWalkCyclePhase);
        catRig.position.y += Math.abs(wSin) * 0.010;
        targetBodyLeanX = 0.10 + Math.sin(catWalkCyclePhase * 2.0) * 0.025;
        targetBodyTwistY = wSin * 0.10;
        targetHeadX = 0.0;
        targetHeadY = 0.172 + Math.abs(wCos) * 0.005;
        targetHeadZ = 0.052;
        targetHeadRotX = 0.04 + Math.sin(catWalkCyclePhase * 2.0) * 0.03;
        targetHeadRotY = wSin * 0.08;
        pawLx = -0.068;
        pawLy = 0.012 + Math.max(0, wCos) * 0.032;
        pawLz = 0.082 + wSin * 0.042;
        pawRx = 0.068;
        pawRy = 0.012 + Math.max(0, -wCos) * 0.032;
        pawRz = 0.082 - wSin * 0.042;
      }

      catBodyGroup.rotation.x += (targetBodyLeanX - catBodyGroup.rotation.x) * 0.20;
      catBodyGroup.rotation.y += (targetBodyTwistY - catBodyGroup.rotation.y) * 0.20;

      catHeadGroup.position.x += (targetHeadX - catHeadGroup.position.x) * 0.22;
      catHeadGroup.position.y += (targetHeadY - catHeadGroup.position.y) * 0.22;
      catHeadGroup.position.z += (targetHeadZ - catHeadGroup.position.z) * 0.22;
      catHeadGroup.rotation.x += (targetHeadRotX - catHeadGroup.rotation.x) * 0.22;
      catHeadGroup.rotation.y += (targetHeadRotY - catHeadGroup.rotation.y) * 0.22;

      catPawLeftGroup.position.lerp({ x: pawLx, y: pawLy, z: pawLz }, 0.28);
      catPawRightGroup.position.lerp({ x: pawRx, y: pawRy, z: pawRz }, 0.28);

      var leanZOffset = Math.sin(catBodyGroup.rotation.x) * 0.085;
      var leanYOffset = (Math.cos(catBodyGroup.rotation.x) - 1.0) * 0.085;
      var shoulderL = {
        x: -0.072 * Math.cos(catBodyGroup.rotation.y),
        y: 0.088 + leanYOffset,
        z: 0.038 + leanZOffset + 0.072 * Math.sin(catBodyGroup.rotation.y)
      };
      var shoulderR = {
        x: 0.072 * Math.cos(catBodyGroup.rotation.y),
        y: 0.088 + leanYOffset,
        z: 0.038 + leanZOffset - 0.072 * Math.sin(catBodyGroup.rotation.y)
      };

      updateCatArmIK(
        shoulderL,
        catPawLeftGroup.position,
        -1,
        catUpperArmLeft,
        catElbowLeft,
        catForearmLeft,
        catPawLeftGroup
      );
      updateCatArmIK(
        shoulderR,
        catPawRightGroup.position,
        1,
        catUpperArmRight,
        catElbowRight,
        catForearmRight,
        catPawRightGroup
      );

      if (catTailPivot) {
        var tailSpeed = mStep.isWalking ? 11.0 : catState === 'IDLE' ? 3.2 : 9.0;
        catTailPivot.rotation.z = Math.sin(clockSec * tailSpeed) * 0.42;
      }
    }

    // Animate Guest Star Cat ("Catwho" — Black & White Masked Cat) + Natural Walk-In/Walk-Out + Collision Avoidance!
    if (catwhoRig && tipiBodyGroup && tipiHeadGroup && tipiPawLeftGroup && tipiPawRightGroup) {
      var showTipi = inTitleScreenMode || isEndingOverlayOpen() || catwhoPhase !== 'HIDDEN';
      catwhoRig.visible = showTipi;
      if (showTipi) {
        var tCatX = 0.175;
        var tCatY = 0.008;
        var tCatZ = -0.265;
        var tCatRotY = 0.0;
        var tBodyLeanX = 0.06;
        var tBodyTwistY = 0.0;
        var tPawLx = -0.085;
        var tPawLy = 0.036;
        var tPawLz = 0.108;
        var tPawRx = 0.085;
        var tPawRy = 0.036;
        var tPawRz = 0.108;

        tipiBlinkTimer = (tipiBlinkTimer + dt) % 3.8;
        var tBlinking = tipiBlinkTimer > 3.62;
        if (tipiEyelidLeft && tipiEyelidRight) {
          var tEyeScale = tBlinking ? 0.12 : 1.0;
          tipiEyelidLeft.scale.y += (tEyeScale - tipiEyelidLeft.scale.y) * 0.35;
          tipiEyelidRight.scale.y += (tEyeScale - tipiEyelidRight.scale.y) * 0.35;
        }

        if (inTitleScreenMode || isEndingOverlayOpen()) {
          // On the Start Screen or Final Scoreboard: Catwho walks naturally in the right lane (`x = +0.22` or `+0.32`), flanking the scoreboard!
          var tStroll = clockSec * 1.35;
          var baseTipiX = isEndingOverlayOpen() ? 0.32 : 0.22;
          tCatX = baseTipiX - Math.sin(tStroll) * 0.045;
          tCatY = 0.008;
          tCatZ = -0.255 - Math.cos(tStroll * 2.0) * 0.015;
          tCatRotY = -Math.cos(tStroll) * 0.32 - 0.18;
          tBodyLeanX = 0.08 + Math.cos(clockSec * 7.8) * 0.025;
          tPawLx = -0.075 + Math.cos(clockSec * 6.5) * 0.020;
          tPawLy = 0.062 + Math.cos(clockSec * 6.5) * 0.028;
          tPawLz = 0.108;
          tPawRx = 0.075;
          tPawRy = 0.020 + Math.max(0, Math.cos(clockSec * 7.8)) * 0.024;
          tPawRz = 0.095;
        } else if (catwhoPhase === 'APPROACHING') {
          // Catwho walks in naturally from off-stage right (`x = 0.74`) to her play spot (`x = 0.175`)!
          tCatX = 0.175;
          tCatY = 0.008;
          tCatZ = -0.265;
          tCatRotY = -0.52;
        } else if (catwhoPhase === 'DUO_PLAY' || catwhoPhase === 'PLAY_YARN') {
          var tPlayHop = Math.abs(Math.cos(clockSec * 12.0)) * 0.012;
          tCatX = 0.175;
          tCatY = 0.008 + tPlayHop;
          tCatZ = -0.265;
          tCatRotY = -0.52;
          tBodyLeanX = 0.08 + Math.cos(clockSec * 12.0) * 0.03;
          tPawLx = -0.065 - Math.sin(clockSec * 14.0) * 0.025;
          tPawLy = 0.064 + Math.sin(clockSec * 14.0) * 0.025;
          tPawLz = 0.115;
          tPawRx = 0.075;
          tPawRy = 0.030;
          tPawRz = 0.095;
          tipiCurrentPawWorldPos = { x: 0.175 + tPawLx, y: tCatY + tPawLy, z: tCatZ + tPawLz };
        } else if (catwhoPhase === 'DUO_SABOTAGE') {
          var pT = Math.min(1.0, catwhoAttackProgress);
          var tipiUseLeft = catwhoAttackPawSide === 'left';
          tCatX = catwhoTargetAction === 'PRESS_FORBIDDEN' ? 0.170 : 0.290;
          tCatZ = -0.245;
          tBodyLeanX = 0.08 + 0.12 * pT;
          var targetWorldX = catwhoTargetAction === 'PRESS_FORBIDDEN' ? 0.0 : 0.40;
          var targetWorldZ = catwhoTargetAction === 'PRESS_FORBIDDEN' ? 0.105 : 0.175;
          var reachTx = targetWorldX - tCatX;
          tBodyTwistY = (tipiUseLeft ? -0.16 : 0.16) * pT;
          if (tipiUseLeft) {
            tPawLx = -0.085 + (reachTx - -0.085) * pT;
            tPawLy = 0.036 + Math.sin(pT * Math.PI) * 0.045;
            tPawLz = 0.108 + (targetWorldZ - 0.108) * pT;
            tipiCurrentPawWorldPos = {
              x: catwhoRig.position.x + tPawLx,
              y: catwhoRig.position.y + tPawLy,
              z: catwhoRig.position.z + tPawLz
            };
          } else {
            tPawRx = 0.085 + (reachTx - 0.085) * pT;
            tPawRy = 0.036 + Math.sin(pT * Math.PI) * 0.045;
            tPawRz = 0.108 + (targetWorldZ - 0.108) * pT;
            tipiCurrentPawWorldPos = {
              x: catwhoRig.position.x + tPawRx,
              y: catwhoRig.position.y + tPawRy,
              z: catwhoRig.position.z + tPawRz
            };
          }
        } else if (catwhoPhase === 'LEAVING' || catwhoPhase === 'BOOPED_EXIT') {
          // Catwho turns right and walks naturally step-by-step off-stage (`x = 0.78, z = -0.295`)!
          tCatX = 0.78;
          tCatY = 0.008;
          tCatZ = -0.295;
          tCatRotY = 1.48;
        }

        var tWalkSpd = catwhoPhase === 'LEAVING' || catwhoPhase === 'BOOPED_EXIT' ? 0.28 : 0.26;
        var tPeerPos = catRig ? catRig.position : null;
        var tStep = stepCatNaturalLocomotion(
          catwhoRig.position,
          catwhoRig.rotation.y,
          tCatX,
          tCatY,
          tCatZ,
          tCatRotY,
          tWalkSpd,
          dt,
          false,
          tPeerPos
        );
        catwhoRig.position.set(tStep.x, tStep.y, tStep.z);
        catwhoRig.rotation.y = tStep.rotY;

        // Enforce hard minimum Cat-to-Cat separation (`MIN_CAT_DIST = 0.295m`) so they NEVER overlap!
        if (catRig) {
          var sepDx = catwhoRig.position.x - catRig.position.x;
          var sepDz = catwhoRig.position.z - catRig.position.z;
          var sepDist = Math.hypot(sepDx, sepDz);
          if (sepDist < 0.295) {
            var pushOverlap = 0.295 - sepDist;
            var nx = sepDist > 0.001 ? sepDx / sepDist : 1.0;
            var nz = sepDist > 0.001 ? sepDz / sepDist : 0.0;
            catRig.position.x -= nx * pushOverlap * 0.5;
            catRig.position.z -= nz * pushOverlap * 0.5;
            catwhoRig.position.x += nx * pushOverlap * 0.5;
            catwhoRig.position.z += nz * pushOverlap * 0.5;
          }
        }

        // Play natural 4-beat walking gait whenever Catwho is walking in (`APPROACHING`) or walking out (`LEAVING`)!
        if (tStep.isWalking && !inTitleScreenMode) {
          tipiWalkCyclePhase += dt * 14.5;
          var twSin = Math.sin(tipiWalkCyclePhase);
          var twCos = Math.cos(tipiWalkCyclePhase);
          catwhoRig.position.y += Math.abs(twSin) * 0.010;
          tBodyLeanX = 0.10 + Math.sin(tipiWalkCyclePhase * 2.0) * 0.025;
          tBodyTwistY = twSin * 0.10;
          tPawLx = -0.066;
          tPawLy = 0.012 + Math.max(0, twCos) * 0.032;
          tPawLz = 0.080 + twSin * 0.042;
          tPawRx = 0.066;
          tPawRy = 0.012 + Math.max(0, -twCos) * 0.032;
          tPawRz = 0.080 - twSin * 0.042;
        }

        tipiBodyGroup.rotation.x += (tBodyLeanX - tipiBodyGroup.rotation.x) * 0.20;
        tipiBodyGroup.rotation.y += (tBodyTwistY - tipiBodyGroup.rotation.y) * 0.20;

        tipiHeadGroup.rotation.x = 0.06 + Math.sin(clockSec * 3.0) * 0.04;
        tipiHeadGroup.rotation.y = tStep.isWalking
          ? Math.sin(tipiWalkCyclePhase) * 0.08
          : Math.cos(clockSec * 2.4) * 0.20;

        tipiPawLeftGroup.position.lerp({ x: tPawLx, y: tPawLy, z: tPawLz }, 0.28);
        tipiPawRightGroup.position.lerp({ x: tPawRx, y: tPawRy, z: tPawRz }, 0.28);

        var tLeanZ = Math.sin(tipiBodyGroup.rotation.x) * 0.082;
        var tLeanY = (Math.cos(tipiBodyGroup.rotation.x) - 1.0) * 0.082;
        var tShoulderL = {
          x: -0.070 * Math.cos(tipiBodyGroup.rotation.y),
          y: 0.086 + tLeanY,
          z: 0.036 + tLeanZ + 0.070 * Math.sin(tipiBodyGroup.rotation.y)
        };
        var tShoulderR = {
          x: 0.070 * Math.cos(tipiBodyGroup.rotation.y),
          y: 0.086 + tLeanY,
          z: 0.036 + tLeanZ - 0.070 * Math.sin(tipiBodyGroup.rotation.y)
        };

        updateCatArmIK(
          tShoulderL,
          tipiPawLeftGroup.position,
          -1,
          tipiUpperArmLeft,
          tipiElbowLeft,
          tipiForearmLeft,
          tipiPawLeftGroup
        );
        updateCatArmIK(
          tShoulderR,
          tipiPawRightGroup.position,
          1,
          tipiUpperArmRight,
          tipiElbowRight,
          tipiForearmRight,
          tipiPawRightGroup
        );

        if (tipiTailPivot) {
          tipiTailPivot.rotation.z = -Math.sin(clockSec * 7.5) * 0.44;
        }
      }
    }

    // Direct 3D PointLight Illumination on the Active Target (`targetGlowLight` — Zero Rings!)
    if (targetGlowLight) {
      if (circuitDisarmed || bombIsDestroyed) {
        targetGlowLight.intensity = 0.0;
      } else {
        var gPos = { x: 0, y: 0.075, z: 0.088 };
        var gColor = 0x34d399;

        if (catState === 'LOAF_ON_BOARD') {
          gPos = { x: 0.52, y: 0.075, z: 0.27 };
          gColor = 0xfb923c;
        } else if (
          catState === 'SWAT_LEFT_FUSE' ||
          catState === 'SWAT_RIGHT_FUSE' ||
          catState === 'PRESS_FORBIDDEN'
        ) {
          gPos = {
            x: catCurrentPawLocalPos.x,
            y: catCurrentPawLocalPos.y + 0.03,
            z: catCurrentPawLocalPos.z
          };
          gColor = 0xff1e38;
        } else if (spec.needsLeftFuse && !fuseLeftLocked) {
          gPos = { x: -0.40, y: 0.095, z: -0.07 };
          gColor = 0xf59e0b;
        } else if (spec.needsRightFuse && !fuseRightLocked) {
          gPos = { x: 0.40, y: 0.095, z: -0.07 };
          gColor = 0xf59e0b;
        } else if (!isCircuitReadyToDisarm()) {
          var nextPadDef = PAD_DEFS[activeTargetPadIndex];
          gPos = { x: nextPadDef.x, y: 0.072, z: nextPadDef.z };
          gColor = nextPadDef.hex;
        } else {
          gPos = { x: 0.0, y: 0.072, z: 0.235 };
          gColor = 0x10b981;
        }

        targetGlowLight.position.set(gPos.x, gPos.y, gPos.z);
        targetGlowLight.color.setHex(gColor);
        targetGlowLight.intensity = 2.4 + Math.sin(clockSec * 10.0) * 0.85;
      }
    }

    // Camera & Seismic Shake
    var topoScale = state.activeTopology === 'NARROW_DESK' ? 0.65 : 1.0;
    var shakeX = tableShakeIntensity > 0 ? (Math.random() - 0.5) * tableShakeIntensity : 0;
    var shakeY = tableShakeIntensity > 0 ? (Math.random() - 0.5) * tableShakeIntensity : 0;

    if (camera && tableRootGroup && (!renderer.xr || !renderer.xr.isPresenting)) {
      camera.position.x = Math.sin(camAzimuth) * Math.cos(camElevation) * camDistance + shakeX;
      camera.position.y = 0.74 + Math.sin(camElevation) * camDistance + shakeY;
      camera.position.z = Math.cos(camAzimuth) * Math.cos(camElevation) * camDistance;
      camera.lookAt(0, 0.79, -0.05);
      tableRootGroup.position.set(shakeX, 0.73 + shakeY, 0);
      tableRootGroup.scale.set(topoScale, 1.0, topoScale);
      xrTableCalibrated = false;
    } else if (renderer && renderer.xr && renderer.xr.isPresenting && tableRootGroup) {
      var xrCam = renderer.xr.getCamera(camera);
      if (
        xrCam &&
        xrCam.position &&
        !xrTableCalibrated &&
        (Math.abs(xrCam.position.y) > 0.05 || Math.abs(xrCam.position.z) > 0.05)
      ) {
        var comfortY = Math.max(0.55, Math.min(1.25, xrCam.position.y - 0.30));
        var comfortZ = xrCam.position.z - 0.36;
        tableRootGroup.userData.basePos = { x: xrCam.position.x, y: comfortY, z: comfortZ };
        xrTableCalibrated = true;
      }
      var bp = tableRootGroup.userData.basePos || { x: 0, y: 0.73, z: -0.36 };
      tableRootGroup.position.set(bp.x + shakeX, bp.y + shakeY, bp.z);
      tableRootGroup.scale.set(topoScale, 1.0, topoScale);
    }

    // Update Virtual Hands, Holographic Hand Shield & Check Direct Physical Hand Push Collisions in XR
    if (liveHandLeft && liveHandRight) {
      var inXrHeadset = Boolean(xrSessionActive || (renderer && renderer.xr && renderer.xr.isPresenting));
      liveHandLeft.visible = inXrHeadset;
      liveHandRight.visible = true;

      var targetLx = -0.24 + Math.cos(clockSec * 2.0) * 0.01;
      var targetLy = 0.13;
      var targetLz = 0.17;

      var targetRx = cursorWorldTarget.x;
      var targetRy = 0.13;
      var targetRz = cursorWorldTarget.z;

      if (actionHandTargetTimer > 0 && actionHandTargetPos) {
        targetRx = actionHandTargetPos.x;
        targetRy = actionHandTargetPos.y;
        targetRz = actionHandTargetPos.z;
      }

      if (inXrHeadset && tableRootGroup) {
        if (typeof tableRootGroup.updateMatrixWorld === 'function') {
          tableRootGroup.updateMatrixWorld(true);
        }
        var pts0 = [];
        var pts1 = [];
        getXrInputWorldPositions(0, pts0);
        getXrInputWorldPositions(1, pts1);

        var local0 = null;
        var local1 = null;
        for (var p0 = 0; p0 < pts0.length; p0++) {
          tableRootGroup.worldToLocal(pts0[p0]);
          if (p0 === 0) local0 = pts0[0];
          checkPhysicalHandTouchAt(pts0[p0]);
        }
        for (var p1 = 0; p1 < pts1.length; p1++) {
          tableRootGroup.worldToLocal(pts1[p1]);
          if (p1 === 0) local1 = pts1[0];
          checkPhysicalHandTouchAt(pts1[p1]);
        }

        if (local0 && local1) {
          var lVec = local0.x <= local1.x ? local0 : local1;
          var rVec = local0.x <= local1.x ? local1 : local0;
          targetLx = lVec.x;
          targetLy = lVec.y;
          targetLz = lVec.z;
          targetRx = rVec.x;
          targetRy = rVec.y;
          targetRz = rVec.z;
        } else if (local0) {
          targetRx = local0.x;
          targetRy = local0.y;
          targetRz = local0.z;
        } else if (local1) {
          targetRx = local1.x;
          targetRy = local1.y;
          targetRz = local1.z;
        }
      }

      liveHandLeft.position.lerp({ x: targetLx, y: targetLy, z: targetLz }, 0.35);
      liveHandRight.position.lerp({ x: targetRx, y: targetRy, z: targetRz }, 0.35);

      if (handShieldLeftMesh) handShieldLeftMesh.visible = false;
      if (handShieldRightMesh) handShieldRightMesh.visible = false;
    }

    renderBombClockCanvas();
    renderEndingTauntCanvas();
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // ============================================================================
  // DOM BINDINGS, AUDIO MUTE, LANGUAGE TOGGLE & WEBXR ENTRY
  // ============================================================================
  function bindEvents() {
    // Immediately create and attempt to resume the Web Audio graph on Title Screen load,
    // and attach to all pointer/hover/focus/gesture events so Title Screen music starts as early as possible!
    unlockAndResumeAudio();
    var unlockEvents = [
      'pointerdown',
      'pointerup',
      'mousedown',
      'mouseup',
      'touchstart',
      'touchend',
      'click',
      'keydown',
      'focus',
      'pageshow'
    ];
    for (var ue = 0; ue < unlockEvents.length; ue++) {
      window.addEventListener(unlockEvents[ue], unlockAndResumeAudio, { capture: true, passive: true });
    }
    document.addEventListener('visibilitychange', unlockAndResumeAudio, { passive: true });

    var btnNext = document.getElementById('btn-high-five-sync');
    if (btnNext) btnNext.addEventListener('click', performSmartNextStep);

    var btnFuseL = document.getElementById('btn-hold-left');
    if (btnFuseL) btnFuseL.addEventListener('click', function () { pressFuseModule('left'); });

    var btnFuseR = document.getElementById('btn-hold-right');
    if (btnFuseR) btnFuseR.addEventListener('click', function () { pressFuseModule('right'); });

    var btnLaser = document.getElementById('btn-record-echo');
    if (btnLaser) btnLaser.addEventListener('click', pressLaserGadget);

    var btnKibble = document.getElementById('btn-summon-aion3');
    if (btnKibble) btnKibble.addEventListener('click', pressKibbleGadget);

    var btnBoop = document.getElementById('btn-rewind-crown');
    if (btnBoop) btnBoop.addEventListener('click', boopCatPaw);

    var btnReset = document.getElementById('btn-reset-puzzle');
    if (btnReset) btnReset.addEventListener('click', function () { loadLevelByNumber(currentLevelNum); });

    var vaultBtns = document.querySelectorAll('[data-vault-id]');
    for (var vb = 0; vb < vaultBtns.length; vb++) {
      (function (lvlIdx) {
        vaultBtns[lvlIdx].addEventListener('click', function () {
          if (inTitleScreenMode) startGameFromTitleScreen();
          loadLevelByNumber(lvlIdx + 1);
        });
      })(vb);
    }

    var btnAudio = document.getElementById('btn-toggle-audio');
    if (btnAudio) btnAudio.addEventListener('click', toggleAudioMute);

    var btnLang = document.getElementById('btn-toggle-lang');
    if (btnLang) btnLang.addEventListener('click', toggleLanguage);

    var btnStartMain = document.getElementById('btn-start-game-main');
    if (btnStartMain) {
      btnStartMain.addEventListener('click', function () {
        if (navigator.xr && !isXrPresentingNow()) {
          userManuallyExitedXr = false;
          launchXrHeadsetSession(false);
        }
        if (inTitleScreenMode) {
          startGameFromTitleScreen();
        }
      });
    }

    var btnIntroLang = document.getElementById('btn-intro-lang');
    if (btnIntroLang) btnIntroLang.addEventListener('click', toggleLanguage);

    var btnOpenTitle = document.getElementById('btn-open-title');
    if (btnOpenTitle) btnOpenTitle.addEventListener('click', openTitleScreenMode);

    var btnEndGame = document.getElementById('btn-end-game');
    if (btnEndGame) {
      btnEndGame.addEventListener('click', function () {
        openFinalScoreboardModal(false);
      });
    }

    var btnSummonCatwho = document.getElementById('btn-summon-catwho');
    if (btnSummonCatwho) btnSummonCatwho.addEventListener('click', summonCatwhoDuoWave);

    var btnEndingClose = document.getElementById('btn-ending-close');
    if (btnEndingClose) {
      btnEndingClose.addEventListener('click', function () {
        if (navigator.xr && !isXrPresentingNow()) {
          userManuallyExitedXr = false;
          launchXrHeadsetSession(false);
        }
        startGameFromTitleScreen();
      });
    }

    window.addEventListener('keydown', function (ev) {
      if ((inTitleScreenMode || isEndingOverlayOpen()) && (ev.key === ' ' || ev.key === 'Enter')) {
        startGameFromTitleScreen();
        return;
      }
      if (ev.key === '1') pressColorPad(0);
      else if (ev.key === '2') pressColorPad(1);
      else if (ev.key === '3') pressColorPad(2);
      else if (ev.key === '4') pressColorPad(3);
      else if (ev.key === 'q' || ev.key === 'Q') pressFuseModule('left');
      else if (ev.key === 'e' || ev.key === 'E') pressFuseModule('right');
      else if (ev.key === 'u' || ev.key === 'U') upgradeAutoClickerStation();
      else if (ev.key === 'l' || ev.key === 'L') pressLaserGadget();
      else if (ev.key === 'k' || ev.key === 'K') pressKibbleGadget();
      else if (ev.key === 'y' || ev.key === 'Y') buyChronoOverclockUpgrade();
      else if (ev.key === 'b' || ev.key === 'B') boopCatPaw();
      else if (ev.key === 't' || ev.key === 'T') summonCatwhoDuoWave();
      else if (ev.key === 'f' || ev.key === 'F') openFinalScoreboardModal(false);
      else if (ev.key === 'c' || ev.key === 'C') cutSurgeWire();
      else if (ev.key === 'x' || ev.key === 'X') triggerForbiddenButtonPenalty();
      else if (ev.key === 'm' || ev.key === 'M') toggleAudioMute();
      else if (ev.key === 'i' || ev.key === 'I') toggleLanguage();
      else if (ev.key === ' ' || ev.key === 'Enter') pressMasterDisarm();
      else if (ev.key === 'r' || ev.key === 'R') loadLevelByNumber(currentLevelNum);
    });

    var btnEnterXr = document.getElementById('btn-enter-xr');
    var preferredXrMode = 'immersive-ar';
    var arExplicitlySupported = true;

    if (navigator.xr && typeof navigator.xr.isSessionSupported === 'function') {
      navigator.xr
        .isSessionSupported('immersive-ar')
        .then(function (arSupported) {
          arExplicitlySupported = Boolean(arSupported);
          if (arSupported) {
            preferredXrMode = 'immersive-ar';
          } else {
            return navigator.xr.isSessionSupported('immersive-vr').then(function (vrSupported) {
              if (vrSupported) preferredXrMode = 'immersive-vr';
            });
          }
        })
        .catch(function () {});
    }

    function restoreTransparent2DWebGLState() {
      if (scene) {
        scene.background = null;
        scene.fog = null;
      }
      if (renderer) {
        try {
          var gl = renderer.getContext();
          if (gl) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            if (typeof gl.DRAW_FRAMEBUFFER !== 'undefined') {
              gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
            }
            if (typeof gl.READ_FRAMEBUFFER !== 'undefined') {
              gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
            }
            if (typeof gl.drawBuffers === 'function' && typeof gl.BACK !== 'undefined') {
              gl.drawBuffers([gl.BACK]);
            }
          }
          // IMPORTANT: Do NOT call renderer.state.reset() here! Calling renderer.state.reset()
          // wipes Three.js WebGLState texture/framebuffer caches and breaks subsequent XR re-entry!
        } catch (_) {}
        renderer.setRenderTarget(null);
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    }

    function onXrSessionEnded() {
      xrSessionActive = false;
      xrSessionRequestInFlight = false;
      xrExitInProgress = false;
      xrTableCalibrated = false;
      userManuallyExitedXr = true;
      lastXrExitTimeMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
      document.body.classList.remove('xr-presenting');
      if (btnEnterXr) btnEnterXr.textContent = 'AR';
      restoreTransparent2DWebGLState();
      unlockAndResumeAudio();
      // Pause active gameplay into Title Screen mode on exit so the bomb never explodes in the background while in 2D browser mode!
      if (!isEndingOverlayOpen() && !inTitleScreenMode) {
        openTitleScreenMode();
      } else {
        updateXrEntryBannerVisibility();
        updateDomCounters();
      }
      setTimeout(function () {
        restoreTransparent2DWebGLState();
        unlockAndResumeAudio();
        updateXrEntryBannerVisibility();
        updateDomCounters();
      }, 80);
      setTimeout(unlockAndResumeAudio, 280);
    }

    if (renderer && renderer.xr && typeof renderer.xr.addEventListener === 'function') {
      renderer.xr.addEventListener('sessionend', onXrSessionEnded);
    }

    function onXrSessionStarted(xrSession) {
      xrSessionRequestInFlight = false;
      xrExitInProgress = false;
      xrSessionActive = true;
      userManuallyExitedXr = false;
      hasAutoLaunchedXrOnce = true;
      xrTableCalibrated = false;
      document.body.classList.add('xr-presenting');
      if (scene) {
        scene.background = null;
        scene.fog = null;
      }
      if (renderer) {
        renderer.setClearColor(0x000000, 0);
      }
      renderer.xr.setReferenceSpaceType('local-floor');
      try {
        var setSessPromise = renderer.xr.setSession(xrSession);
        if (setSessPromise && typeof setSessPromise.then === 'function') {
          setSessPromise
            .then(function () {
              unlockAndResumeAudio();
              setTimeout(unlockAndResumeAudio, 150);
              setTimeout(unlockAndResumeAudio, 450);
            })
            .catch(function (errSet) {
              console.warn('[BombCat] setSession error:', errSet);
              onXrSessionEnded();
            });
        }
      } catch (errSync) {
        console.warn('[BombCat] setSession sync error:', errSync);
      }
      xrSession.addEventListener('end', onXrSessionEnded);
      xrSession.addEventListener('visibilitychange', unlockAndResumeAudio);
      // Unlock Web Audio on any XR controller/hand input event inside the headset session!
      xrSession.addEventListener('selectstart', unlockAndResumeAudio);
      xrSession.addEventListener('select', unlockAndResumeAudio);
      xrSession.addEventListener('squeezestart', unlockAndResumeAudio);
      xrSession.addEventListener('inputsourceschange', unlockAndResumeAudio);
      unlockAndResumeAudio();
      if (btnEnterXr) btnEnterXr.textContent = 'EXIT';
      updateXrEntryBannerVisibility();
      updateDomCounters();
    }

    function launchXrHeadsetSession(quietFail) {
      // Unlock Web Audio SYNCHRONOUSLY inside the user click gesture BEFORE calling requestSession()!
      unlockAndResumeAudio();
      if (!navigator.xr || !renderer || !renderer.xr) return;
      var activeSessNow = typeof renderer.xr.getSession === 'function' ? renderer.xr.getSession() : null;
      if (activeSessNow || renderer.xr.isPresenting) return;
      // On an explicit user click (`!quietFail`), always clear any stale session flags so re-entering VR NEVER fails!
      if (!quietFail) {
        xrSessionActive = false;
        xrSessionRequestInFlight = false;
        xrExitInProgress = false;
      } else if (xrSessionActive || xrSessionRequestInFlight) {
        return;
      }
      xrSessionRequestInFlight = true;

      // IMPORTANT: Do NOT include 'layers' here — Three.js WebXRManager's createProjectionLayer
      // creates a 4x MSAA renderTarget that corrupts gl.drawBuffers([gl.BACK]) on session exit!
      var sessionInit = {
        optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking']
      };

      var resetGuardTimer = setTimeout(function () {
        xrSessionRequestInFlight = false;
      }, 900);

      // Call requestSession('immersive-ar') SYNCHRONOUSLY inside the click handler so user activation is preserved!
      navigator.xr
        .requestSession(preferredXrMode, sessionInit)
        .then(function (sess) {
          clearTimeout(resetGuardTimer);
          onXrSessionStarted(sess);
        })
        .catch(function (errAr) {
          // Only fall back to 'immersive-vr' if 'immersive-ar' is NOT supported on this device!
          // Never switch a Quest AR passthrough headset into opaque black VR mode just because a gesture check failed!
          if (!arExplicitlySupported && preferredXrMode === 'immersive-ar') {
            navigator.xr
              .requestSession('immersive-vr', sessionInit)
              .then(function (sessVr) {
                clearTimeout(resetGuardTimer);
                onXrSessionStarted(sessVr);
              })
              .catch(function (errVr) {
                clearTimeout(resetGuardTimer);
                xrSessionRequestInFlight = false;
                if (!quietFail) console.warn('[BombCat] WebXR session error:', errAr, errVr);
              });
          } else {
            clearTimeout(resetGuardTimer);
            xrSessionRequestInFlight = false;
            if (!quietFail) console.warn('[BombCat] WebXR AR session error:', errAr);
          }
        });
    }

    if (btnEnterXr) {
      btnEnterXr.textContent = 'AR';
      btnEnterXr.addEventListener('click', function (ev) {
        if (ev && typeof ev.stopPropagation === 'function') ev.stopPropagation();
        if (!navigator.xr) return;
        if (isXrPresentingNow() && renderer && renderer.xr) {
          userManuallyExitedXr = true;
          lastXrExitTimeMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
          var activeSess = renderer.xr.getSession();
          if (activeSess) activeSess.end();
          return;
        }
        userManuallyExitedXr = false;
        launchXrHeadsetSession(false);
      });
    }

    // Auto-start into Augmented Reality (`immersive-ar`) on load (when permitted by Quest Browser)
    // AND on any valid `click` activation event in 2D mode (including re-entry after 1.1s post-exit cooldown!)
    if (navigator.xr) {
      launchXrHeadsetSession(true);
      setTimeout(function () {
        if (!userManuallyExitedXr && !isXrPresentingNow() && !hasAutoLaunchedXrOnce) {
          launchXrHeadsetSession(true);
        }
      }, 240);

      document.addEventListener(
        'click',
        function (ev) {
          if (isXrPresentingNow()) return;
          var nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
          // Ignore synthetic/residual click events within 1.1s of exiting XR
          if (userManuallyExitedXr && nowMs - lastXrExitTimeMs < 1100) return;
          // Do not force XR entry if the user clicked utility buttons like Mute, Lang, or End Match
          var tgt = ev && ev.target && typeof ev.target.closest === 'function'
            ? ev.target.closest('#btn-toggle-audio, #btn-toggle-lang, #btn-intro-lang, #btn-end-game, #btn-open-title')
            : null;
          if (tgt) return;
          userManuallyExitedXr = false;
          launchXrHeadsetSession(false);
        },
        false
      );
    }
  }

  loadIncrementalStateAndOfflineGain();
  try {
    initThreeStage();
  } catch (err) {
    console.error('[BombCat] initThreeStage error:', err);
  }
  loadLevelByNumber(1);
  openTitleScreenMode();
  bindEvents();
})();
