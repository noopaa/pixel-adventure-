import { LevelData, TileBlock, MovingPlatform, Collectible, Enemy, Checkpoint, PortalGoal } from './types';

// Level Builder Helpers
const BLOCK_SIZE = 32;

function createGround(startX: number, endX: number, y: number, height: number = 160, theme: 'grass' | 'forest' | 'lava' = 'grass'): TileBlock[] {
  const blocks: TileBlock[] = [];
  const count = Math.ceil((endX - startX) / BLOCK_SIZE);
  for (let i = 0; i < count; i++) {
    const x = startX + i * BLOCK_SIZE;
    // Top surface block
    blocks.push({
      id: `ground_top_${x}_${y}`,
      x,
      y,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
      type: 'solid',
      theme,
    });
    // Fill underneath
    for (let subY = y + BLOCK_SIZE; subY < y + height; subY += BLOCK_SIZE) {
      blocks.push({
        id: `ground_sub_${x}_${subY}`,
        x,
        y: subY,
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
        type: 'solid',
        theme,
      });
    }
  }
  return blocks;
}

function createPlatform(x: number, y: number, widthInBlocks: number, theme: 'grass' | 'forest' | 'lava' = 'grass'): TileBlock[] {
  const blocks: TileBlock[] = [];
  for (let i = 0; i < widthInBlocks; i++) {
    blocks.push({
      id: `platform_${x + i * BLOCK_SIZE}_${y}`,
      x: x + i * BLOCK_SIZE,
      y,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
      type: 'solid',
      theme,
    });
  }
  return blocks;
}

function createCrumblingPlatform(x: number, y: number, widthInBlocks: number): TileBlock[] {
  const blocks: TileBlock[] = [];
  for (let i = 0; i < widthInBlocks; i++) {
    blocks.push({
      id: `crumble_${x + i * BLOCK_SIZE}_${y}`,
      x: x + i * BLOCK_SIZE,
      y,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
      type: 'crumbling',
      crumbleTimer: 0,
      isFallen: false,
    });
  }
  return blocks;
}

function createSpikes(x: number, y: number, count: number): TileBlock[] {
  const blocks: TileBlock[] = [];
  for (let i = 0; i < count; i++) {
    blocks.push({
      id: `spike_${x + i * BLOCK_SIZE}_${y}`,
      x: x + i * BLOCK_SIZE,
      y: y + 14, // align spikes to bottom
      width: BLOCK_SIZE,
      height: 18,
      type: 'spike',
    });
  }
  return blocks;
}

function createCoinArc(startX: number, startY: number, count: number, spacing: number = 36, arcHeight: number = 40): Collectible[] {
  const coins: Collectible[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1 || 1);
    const parabola = 4 * t * (1 - t);
    const x = startX + i * spacing;
    const y = startY - parabola * arcHeight;
    coins.push({
      id: `coin_${x}_${Math.round(y)}`,
      type: 'coin',
      x,
      y,
      baseY: y,
      bobOffset: 0,
      width: 20,
      height: 20,
      collected: false,
      animFrame: i % 4,
      animTimer: 0,
    });
  }
  return coins;
}

// ==========================================
// LEVEL 1: GREEN MEADOWS
// ==========================================
function buildLevel1(): LevelData {
  const blocks: TileBlock[] = [
    // Starting meadow
    ...createGround(0, 700, 560, 160, 'grass'),
    
    // First question blocks & bricks
    { id: 'b_q1', x: 260, y: 440, width: BLOCK_SIZE, height: BLOCK_SIZE, type: 'mystery_coin' },
    { id: 'b_br1', x: 292, y: 440, width: BLOCK_SIZE, height: BLOCK_SIZE, type: 'breakable_brick' },
    { id: 'b_q2', x: 324, y: 440, width: BLOCK_SIZE, height: BLOCK_SIZE, type: 'mystery_heart' },
    { id: 'b_br2', x: 356, y: 440, width: BLOCK_SIZE, height: BLOCK_SIZE, type: 'breakable_brick' },
    { id: 'b_q3', x: 388, y: 440, width: BLOCK_SIZE, height: BLOCK_SIZE, type: 'mystery_coin' },

    // Stepping stones
    ...createPlatform(480, 480, 4, 'grass'),
    ...createPlatform(580, 400, 3, 'grass'),

    // Gap 1 (700 to 860)
    // Island 2
    ...createGround(860, 1500, 560, 160, 'grass'),
    ...createPlatform(960, 450, 4, 'grass'),
    { id: 'b_q_jump', x: 1024, y: 330, width: BLOCK_SIZE, height: BLOCK_SIZE, type: 'mystery_powerup' }, // High Jump powerup!
    ...createPlatform(1160, 390, 5, 'grass'),
    ...createPlatform(1340, 460, 3, 'grass'),

    // Mid checkpoint hill (1500 to 2100)
    ...createGround(1540, 2100, 560, 160, 'grass'),
    ...createPlatform(1600, 490, 6, 'grass'),
    ...createPlatform(1760, 410, 4, 'grass'),
    { id: 'b_q4', x: 1824, y: 290, width: BLOCK_SIZE, height: BLOCK_SIZE, type: 'mystery_coin' },
    { id: 'b_q5', x: 1856, y: 290, width: BLOCK_SIZE, height: BLOCK_SIZE, type: 'mystery_coin' },

    // Gap 2 with Moving Platform (2100 to 2500)
    // Final stretch with Goal Portal (2500 to 3300)
    ...createGround(2500, 3300, 560, 160, 'grass'),
    ...createPlatform(2600, 460, 4, 'grass'),
    ...createPlatform(2760, 390, 4, 'grass'),
    ...createPlatform(2940, 460, 4, 'grass'),
    // High victory arches
    ...createPlatform(3080, 490, 6, 'grass'),
  ];

  const movingPlatforms: MovingPlatform[] = [
    {
      id: 'mp_meadow_1',
      startX: 2120,
      startY: 520,
      endX: 2420,
      endY: 520,
      x: 2120,
      y: 520,
      width: 80,
      height: 20,
      vx: 0,
      vy: 0,
      speed: 1.5,
      currentT: 0,
      direction: 1,
      theme: 'grass',
    },
  ];

  const collectibles: Collectible[] = [
    ...createCoinArc(120, 510, 4, 30, 20),
    ...createCoinArc(490, 430, 3, 30, 15),
    ...createCoinArc(590, 350, 3, 30, 15),
    ...createCoinArc(730, 480, 4, 32, 50), // over gap 1
    ...createCoinArc(980, 400, 3, 30, 15),
    ...createCoinArc(1180, 340, 4, 30, 20),
    ...createCoinArc(1780, 360, 3, 30, 15),
    ...createCoinArc(2150, 460, 5, 40, 40), // over moving platform
    ...createCoinArc(2620, 410, 3, 30, 15),
    ...createCoinArc(2780, 340, 3, 30, 15),
    ...createCoinArc(2960, 410, 3, 30, 15),
  ];

  const enemies: Enemy[] = [
    // Slimes on ground & platforms
    {
      id: 'slime_1',
      type: 'slime',
      x: 450,
      y: 532,
      width: 28,
      height: 28,
      startX: 320,
      startY: 532,
      patrolDistance: 200,
      vx: 1.2,
      vy: 0,
      facing: 'right',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      baseY: 532,
    },
    {
      id: 'slime_2',
      type: 'slime',
      x: 1000,
      y: 422,
      width: 28,
      height: 28,
      startX: 960,
      startY: 422,
      patrolDistance: 110,
      vx: 1.0,
      vy: 0,
      facing: 'right',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      baseY: 422,
    },
    {
      id: 'mush_1',
      type: 'mushroom',
      x: 1300,
      y: 530,
      width: 28,
      height: 30,
      startX: 1200,
      startY: 530,
      patrolDistance: 180,
      vx: 1.4,
      vy: 0,
      facing: 'right',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      baseY: 530,
    },
    {
      id: 'slime_3',
      type: 'slime',
      x: 1900,
      y: 532,
      width: 28,
      height: 28,
      startX: 1700,
      startY: 532,
      patrolDistance: 220,
      vx: 1.3,
      vy: 0,
      facing: 'right',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      baseY: 532,
    },
    {
      id: 'mush_2',
      type: 'mushroom',
      x: 2800,
      y: 530,
      width: 28,
      height: 30,
      startX: 2650,
      startY: 530,
      patrolDistance: 240,
      vx: 1.5,
      vy: 0,
      facing: 'left',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      baseY: 530,
    },
  ];

  const checkpoints: Checkpoint[] = [
    {
      id: 'cp_meadow_1',
      x: 1620,
      y: 430,
      width: 30,
      height: 60,
      spawnX: 1620,
      spawnY: 400,
      isReached: false,
    },
  ];

  const goal: PortalGoal = {
    x: 3180,
    y: 440,
    width: 48,
    height: 56,
    animTimer: 0,
  };

  return {
    id: 1,
    name: 'Green Meadows',
    subtitle: 'Chapter 1: The Sunny Beginning',
    theme: 'grass',
    width: 3350,
    height: 720,
    timeLimit: 120,
    playerSpawn: { x: 80, y: 480 },
    blocks,
    movingPlatforms,
    collectibles,
    enemies,
    checkpoints,
    goal,
  };
}

// ==========================================
// LEVEL 2: MYSTIC FOREST
// ==========================================
function buildLevel2(): LevelData {
  const blocks: TileBlock[] = [
    // Entrance
    ...createGround(0, 500, 560, 160, 'forest'),
    { id: 'f_q1', x: 220, y: 440, width: BLOCK_SIZE, height: BLOCK_SIZE, type: 'mystery_coin' },
    { id: 'f_br1', x: 252, y: 440, width: BLOCK_SIZE, height: BLOCK_SIZE, type: 'breakable_brick' },
    { id: 'f_q_speed', x: 284, y: 440, width: BLOCK_SIZE, height: BLOCK_SIZE, type: 'mystery_powerup' }, // Speed Boost powerup

    // Pit 1 with spikes on bottom
    ...createSpikes(500, 680, 8),
    // Crumbling mushroom bridges over pit 1
    ...createCrumblingPlatform(540, 480, 3),
    ...createCrumblingPlatform(680, 430, 3),

    // Mid Forest Plateau
    ...createGround(800, 1400, 560, 160, 'forest'),
    ...createPlatform(900, 450, 4, 'forest'),
    ...createPlatform(1080, 380, 4, 'forest'),
    { id: 'f_spring_1', x: 1220, y: 536, width: BLOCK_SIZE, height: 24, type: 'spring' },
    ...createPlatform(1200, 260, 4, 'forest'), // High treetop platform reached by spring
    { id: 'f_q_heart', x: 1248, y: 160, width: BLOCK_SIZE, height: BLOCK_SIZE, type: 'mystery_heart' },

    // First Checkpoint clearing
    ...createGround(1400, 1850, 560, 160, 'forest'),

    // Pit 2 with 2 Moving Platforms (1850 to 2550)
    ...createSpikes(1880, 680, 18),
    ...createPlatform(2150, 460, 2, 'forest'), // center resting stone

    // Section 3: Deep Forest (2550 to 3300)
    ...createGround(2550, 3300, 560, 160, 'forest'),
    ...createPlatform(2660, 480, 3, 'forest'),
    ...createCrumblingPlatform(2800, 430, 3),
    ...createCrumblingPlatform(2940, 380, 3),
    ...createPlatform(3080, 320, 5, 'forest'),
    { id: 'f_q_jump2', x: 3144, y: 200, width: BLOCK_SIZE, height: BLOCK_SIZE, type: 'mystery_powerup' },

    // Final Canopy Bridge leading to elder tree portal (3300 to 4000)
    ...createSpikes(3300, 680, 10),
    ...createCrumblingPlatform(3360, 460, 4),
    ...createGround(3520, 4100, 560, 160, 'forest'),
    ...createPlatform(3650, 470, 5, 'forest'),
    ...createPlatform(3850, 420, 4, 'forest'),
  ];

  const movingPlatforms: MovingPlatform[] = [
    {
      id: 'mp_forest_1',
      startX: 1880,
      startY: 500,
      endX: 2100,
      endY: 500,
      x: 1880,
      y: 500,
      width: 75,
      height: 20,
      vx: 0,
      vy: 0,
      speed: 1.8,
      currentT: 0,
      direction: 1,
      theme: 'forest',
    },
    {
      id: 'mp_forest_2',
      startX: 2250,
      startY: 520,
      endX: 2500,
      endY: 380,
      x: 2250,
      y: 520,
      width: 75,
      height: 20,
      vx: 0,
      vy: 0,
      speed: 1.6,
      currentT: 0,
      direction: 1,
      theme: 'forest',
    },
  ];

  const collectibles: Collectible[] = [
    ...createCoinArc(100, 500, 3, 30, 15),
    ...createCoinArc(550, 420, 3, 30, 20),
    ...createCoinArc(690, 370, 3, 30, 20),
    ...createCoinArc(920, 390, 3, 30, 15),
    ...createCoinArc(1100, 320, 3, 30, 15),
    ...createCoinArc(1210, 200, 4, 30, 25), // high canopy coins
    ...createCoinArc(1950, 440, 4, 35, 30),
    ...createCoinArc(2350, 400, 4, 35, 30),
    ...createCoinArc(2680, 420, 3, 30, 15),
    ...createCoinArc(2810, 370, 3, 30, 15),
    ...createCoinArc(2950, 320, 3, 30, 15),
    ...createCoinArc(3100, 260, 4, 30, 20),
    ...createCoinArc(3670, 410, 3, 30, 15),
  ];

  const enemies: Enemy[] = [
    // Bats swooping
    {
      id: 'bat_1',
      type: 'bat',
      x: 620,
      y: 350,
      width: 28,
      height: 18,
      startX: 520,
      startY: 350,
      baseY: 350,
      patrolDistance: 220,
      vx: 1.4,
      vy: 0,
      facing: 'right',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      sineOffset: 0,
    },
    {
      id: 'mush_forest_1',
      type: 'mushroom',
      x: 980,
      y: 530,
      width: 28,
      height: 30,
      startX: 850,
      startY: 530,
      patrolDistance: 200,
      vx: 1.5,
      vy: 0,
      facing: 'right',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      baseY: 530,
    },
    {
      id: 'bat_2',
      type: 'bat',
      x: 2020,
      y: 380,
      width: 28,
      height: 18,
      startX: 1900,
      startY: 380,
      baseY: 380,
      patrolDistance: 260,
      vx: 1.6,
      vy: 0,
      facing: 'right',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      sineOffset: Math.PI / 2,
    },
    {
      id: 'slime_forest_1',
      type: 'slime',
      x: 2750,
      y: 532,
      width: 28,
      height: 28,
      startX: 2600,
      startY: 532,
      patrolDistance: 220,
      vx: 1.4,
      vy: 0,
      facing: 'right',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      baseY: 532,
    },
    {
      id: 'bat_3',
      type: 'bat',
      x: 3450,
      y: 360,
      width: 28,
      height: 18,
      startX: 3340,
      startY: 360,
      baseY: 360,
      patrolDistance: 240,
      vx: 1.7,
      vy: 0,
      facing: 'left',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      sineOffset: Math.PI,
    },
    {
      id: 'mush_forest_2',
      type: 'mushroom',
      x: 3750,
      y: 530,
      width: 28,
      height: 30,
      startX: 3600,
      startY: 530,
      patrolDistance: 180,
      vx: 1.6,
      vy: 0,
      facing: 'left',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      baseY: 530,
    },
  ];

  const checkpoints: Checkpoint[] = [
    {
      id: 'cp_forest_1',
      x: 1450,
      y: 495,
      width: 30,
      height: 60,
      spawnX: 1450,
      spawnY: 480,
      isReached: false,
    },
    {
      id: 'cp_forest_2',
      x: 2600,
      y: 495,
      width: 30,
      height: 60,
      spawnX: 2600,
      spawnY: 480,
      isReached: false,
    },
  ];

  const goal: PortalGoal = {
    x: 3940,
    y: 360,
    width: 48,
    height: 56,
    animTimer: 0,
  };

  return {
    id: 2,
    name: 'Mystic Forest',
    subtitle: 'Chapter 2: Shadows and Shifting Branches',
    theme: 'forest',
    width: 4100,
    height: 720,
    timeLimit: 140,
    playerSpawn: { x: 80, y: 480 },
    blocks,
    movingPlatforms,
    collectibles,
    enemies,
    checkpoints,
    goal,
  };
}

// ==========================================
// LEVEL 3: LAVA CAVERN
// ==========================================
function buildLevel3(): LevelData {
  const blocks: TileBlock[] = [
    // Entrance stronghold
    ...createGround(0, 480, 560, 160, 'lava'),
    { id: 'l_q1', x: 180, y: 440, width: BLOCK_SIZE, height: BLOCK_SIZE, type: 'mystery_coin' },
    { id: 'l_q2', x: 212, y: 440, width: BLOCK_SIZE, height: BLOCK_SIZE, type: 'mystery_coin' },
    { id: 'l_q_shield', x: 244, y: 440, width: BLOCK_SIZE, height: BLOCK_SIZE, type: 'mystery_powerup' }, // Shield star!

    // Magma Lake 1 with spikes and crumbling basalt
    ...createSpikes(480, 680, 16),
    ...createCrumblingPlatform(520, 480, 2),
    ...createPlatform(640, 420, 3, 'lava'),
    ...createCrumblingPlatform(790, 440, 2),
    ...createCrumblingPlatform(910, 400, 2),

    // Mid Fortress 1 (1020 to 1600)
    ...createGround(1020, 1600, 560, 160, 'lava'),
    ...createPlatform(1120, 470, 4, 'lava'),
    ...createPlatform(1280, 390, 4, 'lava'),
    { id: 'l_spring_1', x: 1440, y: 536, width: BLOCK_SIZE, height: 24, type: 'spring' },
    ...createPlatform(1420, 240, 3, 'lava'), // secret high treasure ledge
    { id: 'l_q_heart', x: 1452, y: 140, width: BLOCK_SIZE, height: BLOCK_SIZE, type: 'mystery_heart' },

    // Giant Lava Chasm (1600 to 2500) with 2 moving magma slabs and spikes
    ...createSpikes(1600, 680, 28),
    ...createPlatform(2020, 450, 3, 'lava'), // central island

    // Checkpoint 2 Plateau (2500 to 3100)
    ...createGround(2500, 3100, 560, 160, 'lava'),
    ...createPlatform(2620, 460, 4, 'lava'),
    ...createPlatform(2800, 380, 3, 'lava'),
    ...createCrumblingPlatform(2940, 420, 3),

    // Climax gauntlet over the Great Caldera (3100 to 4100)
    ...createSpikes(3100, 680, 32),
    ...createCrumblingPlatform(3200, 460, 2),
    ...createCrumblingPlatform(3460, 420, 2),
    ...createPlatform(3700, 360, 3, 'lava'),
    { id: 'l_spring_2', x: 3732, y: 336, width: BLOCK_SIZE, height: 24, type: 'spring' },
    ...createCrumblingPlatform(3920, 300, 3),

    // Victory Sanctum (4100 to 4600)
    ...createGround(4100, 4600, 560, 160, 'lava'),
    ...createPlatform(4220, 480, 6, 'lava'),
    ...createPlatform(4360, 400, 4, 'lava'),
  ];

  const movingPlatforms: MovingPlatform[] = [
    {
      id: 'mp_lava_1',
      startX: 1640,
      startY: 480,
      endX: 1980,
      endY: 480,
      x: 1640,
      y: 480,
      width: 75,
      height: 20,
      vx: 0,
      vy: 0,
      speed: 2.0,
      currentT: 0,
      direction: 1,
      theme: 'lava',
    },
    {
      id: 'mp_lava_2',
      startX: 2150,
      startY: 450,
      endX: 2460,
      endY: 450,
      x: 2150,
      y: 450,
      width: 75,
      height: 20,
      vx: 0,
      vy: 0,
      speed: 2.2,
      currentT: 0,
      direction: 1,
      theme: 'lava',
    },
    // Vertical moving slab in the caldera
    {
      id: 'mp_lava_3',
      startX: 3320,
      startY: 520,
      endX: 3320,
      endY: 340,
      x: 3320,
      y: 520,
      width: 75,
      height: 20,
      vx: 0,
      vy: 0,
      speed: 1.8,
      currentT: 0,
      direction: 1,
      theme: 'lava',
    },
  ];

  const collectibles: Collectible[] = [
    ...createCoinArc(100, 500, 3, 30, 15),
    ...createCoinArc(530, 430, 2, 30, 15),
    ...createCoinArc(650, 370, 3, 30, 15),
    ...createCoinArc(800, 390, 2, 30, 15),
    ...createCoinArc(1140, 420, 3, 30, 15),
    ...createCoinArc(1300, 340, 3, 30, 15),
    ...createCoinArc(1430, 180, 3, 30, 20), // secret ledge coins
    ...createCoinArc(1700, 430, 4, 35, 30),
    ...createCoinArc(2220, 400, 4, 35, 30),
    ...createCoinArc(2640, 410, 3, 30, 15),
    ...createCoinArc(2820, 330, 3, 30, 15),
    ...createCoinArc(3330, 300, 3, 30, 15),
    ...createCoinArc(3710, 290, 3, 30, 15),
    ...createCoinArc(4240, 420, 4, 30, 20),
  ];

  const enemies: Enemy[] = [
    // Fire Beetles & Bats
    {
      id: 'beetle_1',
      type: 'fire_beetle',
      x: 350,
      y: 532,
      width: 28,
      height: 28,
      startX: 240,
      startY: 532,
      patrolDistance: 160,
      vx: 1.6,
      vy: 0,
      facing: 'right',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      baseY: 532,
    },
    {
      id: 'bat_lava_1',
      type: 'bat',
      x: 720,
      y: 320,
      width: 28,
      height: 18,
      startX: 600,
      startY: 320,
      baseY: 320,
      patrolDistance: 240,
      vx: 1.8,
      vy: 0,
      facing: 'right',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      sineOffset: 0,
    },
    {
      id: 'beetle_2',
      type: 'fire_beetle',
      x: 1220,
      y: 532,
      width: 28,
      height: 28,
      startX: 1080,
      startY: 532,
      patrolDistance: 220,
      vx: 1.7,
      vy: 0,
      facing: 'left',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      baseY: 532,
    },
    {
      id: 'bat_lava_2',
      type: 'bat',
      x: 1800,
      y: 360,
      width: 28,
      height: 18,
      startX: 1700,
      startY: 360,
      baseY: 360,
      patrolDistance: 260,
      vx: 2.0,
      vy: 0,
      facing: 'right',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      sineOffset: Math.PI / 3,
    },
    {
      id: 'beetle_3',
      type: 'fire_beetle',
      x: 2750,
      y: 532,
      width: 28,
      height: 28,
      startX: 2600,
      startY: 532,
      patrolDistance: 200,
      vx: 1.8,
      vy: 0,
      facing: 'right',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      baseY: 532,
    },
    {
      id: 'bat_lava_3',
      type: 'bat',
      x: 3550,
      y: 310,
      width: 28,
      height: 18,
      startX: 3400,
      startY: 310,
      baseY: 310,
      patrolDistance: 280,
      vx: 2.1,
      vy: 0,
      facing: 'left',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      sineOffset: Math.PI / 2,
    },
    {
      id: 'beetle_4',
      type: 'fire_beetle',
      x: 4300,
      y: 532,
      width: 28,
      height: 28,
      startX: 4180,
      startY: 532,
      patrolDistance: 160,
      vx: 1.9,
      vy: 0,
      facing: 'left',
      isAlive: true,
      isSquashed: false,
      squashTimer: 0,
      animTimer: 0,
      animFrame: 0,
      baseY: 532,
    },
  ];

  const checkpoints: Checkpoint[] = [
    {
      id: 'cp_lava_1',
      x: 1060,
      y: 495,
      width: 30,
      height: 60,
      spawnX: 1060,
      spawnY: 480,
      isReached: false,
    },
    {
      id: 'cp_lava_2',
      x: 2540,
      y: 495,
      width: 30,
      height: 60,
      spawnX: 2540,
      spawnY: 480,
      isReached: false,
    },
  ];

  const goal: PortalGoal = {
    x: 4420,
    y: 340,
    width: 48,
    height: 56,
    animTimer: 0,
  };

  return {
    id: 3,
    name: 'Lava Cavern',
    subtitle: 'Chapter 3: The Molten Core',
    theme: 'lava',
    width: 4580,
    height: 720,
    timeLimit: 150,
    playerSpawn: { x: 80, y: 480 },
    blocks,
    movingPlatforms,
    collectibles,
    enemies,
    checkpoints,
    goal,
  };
}

export function getLevelData(levelId: number): LevelData {
  switch (levelId) {
    case 1:
      return buildLevel1();
    case 2:
      return buildLevel2();
    case 3:
      return buildLevel3();
    default:
      return buildLevel1();
  }
}
