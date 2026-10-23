// Procedural 16-bit Pixel Art Sprite Generator & Cache

type PixelMatrix = (string | null)[][];

function createCachedCanvas(matrix: PixelMatrix, pixelScale: number = 2): HTMLCanvasElement {
  const height = matrix.length;
  const width = matrix[0].length;
  const canvas = document.createElement('canvas');
  canvas.width = width * pixelScale;
  canvas.height = height * pixelScale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = matrix[y][x];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * pixelScale, y * pixelScale, pixelScale, pixelScale);
      }
    }
  }

  return canvas;
}

export class SpriteSheet {
  private cache: Map<string, HTMLCanvasElement> = new Map();

  constructor() {
    this.generateAllSprites();
  }

  public get(key: string): HTMLCanvasElement | null {
    return this.cache.get(key) || null;
  }

  private register(key: string, matrix: PixelMatrix, scale = 2) {
    this.cache.set(key, createCachedCanvas(matrix, scale));
  }

  private generateAllSprites() {
    this.generatePlayerSprites();
    this.generateEnemySprites();
    this.generateCollectibleSprites();
    this.generateBlockSprites();
    this.generateSpecialSprites();
  }

  // --- PIXEL: THE ADVENTURER ---
  private generatePlayerSprites() {
    // Color Palette:
    // H: #1d4ed8 (Blue Hat), H2: #1e3a8a (Hat Dark), F: #ef4444 (Red Feather)
    // S: #ffedd5 (Skin Light), S2: #fbcfe8 (Cheek), B: #78350f (Brown Hair)
    // Y: #facc15 (Scarf Gold), Y2: #ca8a04 (Scarf Shadow)
    // T: #0284c7 (Cyan/Blue Tunic), T2: #0369a1 (Tunic Dark)
    // P: #334155 (Slate Pants)
    // K: #713f12 (Boots Brown), W: #ffffff (Eye white), E: #0f172a (Eye pupil)
    const H = '#2563eb', H2 = '#1d4ed8', F = '#ef4444';
    const S = '#fde047', SK = '#fed7aa', B = '#854d0e';
    const Y = '#facc15', Y2 = '#eab308';
    const T = '#06b6d4', T2 = '#0891b2';
    const P = '#1e293b';
    const K = '#7c2d12';
    const W = '#ffffff', E = '#020617';
    const _ = null;

    // Player Idle Frame 1 (16x16)
    const idle1: PixelMatrix = [
      [_, _, _, _, H, H, H, H, H, F, _, _, _, _, _, _],
      [_, _, _, H, H, H, H, H, H, H, _, _, _, _, _, _],
      [_, _, H, H, H, H, H, H, H, H, H, _, _, _, _, _],
      [_, _, B, B, SK, SK, SK, SK, SK, _, _, _, _, _, _],
      [_, _, B, SK, W, E, SK, W, E, SK, _, _, _, _, _, _],
      [_, _, _, SK, SK, SK, SK, S, SK, _, _, _, _, _, _],
      [_, _, _, Y, Y, Y, Y, Y, Y, _, _, _, _, _, _, _],
      [_, _, Y, Y, T, T, T, T, Y, Y, _, _, _, _, _, _],
      [_, _, _, T, T, T, T, T, T, _, _, _, _, _, _, _],
      [_, _, _, T, T, T, T, T, T, _, _, _, _, _, _, _],
      [_, _, _, T2, T, T, T, T2, _, _, _, _, _, _, _, _],
      [_, _, _, _, P, P, P, P, _, _, _, _, _, _, _, _],
      [_, _, _, _, P, _, _, P, _, _, _, _, _, _, _, _],
      [_, _, _, _, P, _, _, P, _, _, _, _, _, _, _, _],
      [_, _, _, K, K, _, _, K, K, _, _, _, _, _, _, _],
      [_, _, K, K, K, _, _, K, K, K, _, _, _, _, _, _],
    ];

    // Player Idle Frame 2 (gentle dip)
    const idle2: PixelMatrix = [
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, H, H, H, H, H, F, _, _, _, _, _, _],
      [_, _, _, H, H, H, H, H, H, H, _, _, _, _, _, _],
      [_, _, H, H, H, H, H, H, H, H, H, _, _, _, _, _],
      [_, _, B, B, SK, SK, SK, SK, SK, _, _, _, _, _, _],
      [_, _, B, SK, W, E, SK, W, E, SK, _, _, _, _, _, _],
      [_, _, _, SK, SK, SK, SK, S, SK, _, _, _, _, _, _],
      [_, _, Y, Y, Y, Y, Y, Y, Y, Y, _, _, _, _, _, _],
      [_, _, _, T, T, T, T, T, T, _, _, _, _, _, _, _],
      [_, _, _, T, T, T, T, T, T, _, _, _, _, _, _, _],
      [_, _, _, T2, T, T, T, T2, _, _, _, _, _, _, _, _],
      [_, _, _, _, P, P, P, P, _, _, _, _, _, _, _, _],
      [_, _, _, _, P, _, _, P, _, _, _, _, _, _, _, _],
      [_, _, _, K, K, _, _, K, K, _, _, _, _, _, _, _],
      [_, _, K, K, K, _, _, K, K, K, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];

    // Walk Frame 1 (stride left foot forward)
    const walk1: PixelMatrix = [
      [_, _, _, _, H, H, H, H, H, F, _, _, _, _, _, _],
      [_, _, _, H, H, H, H, H, H, H, _, _, _, _, _, _],
      [_, _, H, H, H, H, H, H, H, H, H, _, _, _, _, _],
      [_, _, B, B, SK, SK, SK, SK, SK, _, _, _, _, _, _],
      [_, _, B, SK, W, E, SK, W, E, SK, _, _, _, _, _, _],
      [_, _, _, SK, SK, SK, SK, S, SK, _, _, _, _, _, _],
      [_, _, Y, Y, Y, Y, Y, Y, _, _, _, _, _, _, _, _],
      [_, Y, Y, T, T, T, T, T, _, _, _, _, _, _, _, _],
      [_, _, _, T, T, T, T, T, _, _, _, _, _, _, _, _],
      [_, _, _, T, T, T, T, T, _, _, _, _, _, _, _, _],
      [_, _, _, _, P, P, P, _, _, _, _, _, _, _, _, _],
      [_, _, _, P, _, _, _, P, _, _, _, _, _, _, _, _],
      [_, _, P, P, _, _, _, P, P, _, _, _, _, _, _, _],
      [_, _, K, K, _, _, _, _, K, K, _, _, _, _, _, _],
      [_, K, K, K, _, _, _, _, K, K, K, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];

    // Walk Frame 2 (passing)
    const walk2: PixelMatrix = [
      [_, _, _, _, H, H, H, H, H, F, _, _, _, _, _, _],
      [_, _, _, H, H, H, H, H, H, H, _, _, _, _, _, _],
      [_, _, H, H, H, H, H, H, H, H, H, _, _, _, _, _],
      [_, _, B, B, SK, SK, SK, SK, SK, _, _, _, _, _, _],
      [_, _, B, SK, W, E, SK, W, E, SK, _, _, _, _, _, _],
      [_, _, _, SK, SK, SK, SK, S, SK, _, _, _, _, _, _],
      [_, _, Y, Y, Y, Y, Y, Y, _, _, _, _, _, _, _, _],
      [_, _, _, T, T, T, T, T, _, _, _, _, _, _, _, _],
      [_, _, _, T, T, T, T, T, _, _, _, _, _, _, _, _],
      [_, _, _, T, T, T, T, T, _, _, _, _, _, _, _, _],
      [_, _, _, _, P, P, P, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, P, P, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, P, P, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, K, K, K, _, _, _, _, _, _, _, _, _, _],
      [_, _, K, K, K, K, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];

    // Walk Frame 3 (stride right foot forward)
    const walk3: PixelMatrix = [
      [_, _, _, _, H, H, H, H, H, F, _, _, _, _, _, _],
      [_, _, _, H, H, H, H, H, H, H, _, _, _, _, _, _],
      [_, _, H, H, H, H, H, H, H, H, H, _, _, _, _, _],
      [_, _, B, B, SK, SK, SK, SK, SK, _, _, _, _, _, _],
      [_, _, B, SK, W, E, SK, W, E, SK, _, _, _, _, _, _],
      [_, _, _, SK, SK, SK, SK, S, SK, _, _, _, _, _, _],
      [_, _, _, Y, Y, Y, Y, Y, _, _, _, _, _, _, _, _],
      [_, _, Y, T, T, T, T, T, Y, _, _, _, _, _, _, _],
      [_, _, _, T, T, T, T, T, _, _, _, _, _, _, _, _],
      [_, _, _, T, T, T, T, T, _, _, _, _, _, _, _, _],
      [_, _, _, _, P, P, P, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, P, _, P, _, _, _, _, _, _, _, _, _],
      [_, _, _, P, P, _, _, P, P, _, _, _, _, _, _, _],
      [_, _, _, K, K, _, _, K, K, _, _, _, _, _, _, _],
      [_, _, _, K, K, K, _, K, K, K, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];

    // Jump Frame (Stretched, dynamic leaping pose)
    const jump: PixelMatrix = [
      [_, _, _, _, H, H, H, H, H, F, _, _, _, _, _, _],
      [_, _, _, H, H, H, H, H, H, H, _, _, _, _, _, _],
      [_, _, H, H, H, H, H, H, H, H, H, _, _, _, _, _],
      [_, _, B, B, SK, SK, SK, SK, SK, _, _, _, _, _, _],
      [_, _, B, SK, W, E, SK, W, E, SK, _, _, _, _, _, _],
      [_, _, _, SK, SK, SK, SK, S, SK, _, _, _, _, _, _],
      [_, Y, Y, Y, Y, Y, Y, Y, _, _, _, _, _, _, _, _],
      [Y, Y, _, T, T, T, T, T, _, _, _, _, _, _, _, _],
      [_, _, _, T, T, T, T, T, _, _, _, _, _, _, _, _],
      [_, _, _, T, T, T, T, T, _, _, _, _, _, _, _, _],
      [_, _, _, _, P, P, P, P, _, _, _, _, _, _, _, _],
      [_, _, _, P, P, _, _, P, P, _, _, _, _, _, _, _],
      [_, _, K, K, _, _, _, _, K, K, _, _, _, _, _, _],
      [_, K, K, _, _, _, _, _, _, K, K, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];

    // Fall Frame (arms slightly out, scarf flying)
    const fall: PixelMatrix = [
      [_, _, _, _, H, H, H, H, H, F, _, _, _, _, _, _],
      [_, _, _, H, H, H, H, H, H, H, _, _, _, _, _, _],
      [_, _, H, H, H, H, H, H, H, H, H, _, _, _, _, _],
      [_, _, B, B, SK, SK, SK, SK, SK, _, _, _, _, _, _],
      [_, _, B, SK, W, E, SK, W, E, SK, _, _, _, _, _, _],
      [_, _, _, SK, SK, SK, SK, S, SK, _, _, _, _, _, _],
      [_, _, _, Y, Y, Y, Y, Y, Y, Y, Y, _, _, _, _, _],
      [_, _, _, T, T, T, T, T, T, _, _, _, _, _, _, _],
      [_, _, _, T, T, T, T, T, T, _, _, _, _, _, _, _],
      [_, _, _, T, T, T, T, T, T, _, _, _, _, _, _, _],
      [_, _, _, _, P, P, P, P, _, _, _, _, _, _, _, _],
      [_, _, _, _, P, _, _, P, _, _, _, _, _, _, _, _],
      [_, _, _, P, P, _, _, P, P, _, _, _, _, _, _, _],
      [_, _, _, K, K, _, _, K, K, _, _, _, _, _, _, _],
      [_, _, K, K, _, _, _, _, K, K, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];

    // Hurt Frame (eyes clenched '><', flash pink tint)
    const hurt: PixelMatrix = [
      [_, _, _, _, '#fb7185', '#fb7185', '#fb7185', '#fb7185', '#fb7185', '#ef4444', _, _, _, _, _, _],
      [_, _, _, '#fb7185', '#fb7185', '#fb7185', '#fb7185', '#fb7185', '#fb7185', '#fb7185', _, _, _, _, _, _],
      [_, _, '#fb7185', '#fb7185', '#fb7185', '#fb7185', '#fb7185', '#fb7185', '#fb7185', '#fb7185', '#fb7185', _, _, _, _, _],
      [_, _, B, B, SK, SK, SK, SK, SK, _, _, _, _, _, _],
      [_, _, B, SK, E, _, SK, _, E, SK, _, _, _, _, _, _],
      [_, _, _, SK, _, E, SK, E, _, SK, _, _, _, _, _, _],
      [_, _, _, Y, Y, Y, Y, Y, Y, _, _, _, _, _, _, _],
      [_, _, Y, Y, '#f43f5e', '#f43f5e', '#f43f5e', '#f43f5e', Y, Y, _, _, _, _, _, _],
      [_, _, _, '#f43f5e', '#f43f5e', '#f43f5e', '#f43f5e', '#f43f5e', '#f43f5e', _, _, _, _, _, _, _],
      [_, _, _, '#f43f5e', '#f43f5e', '#f43f5e', '#f43f5e', '#f43f5e', '#f43f5e', _, _, _, _, _, _, _],
      [_, _, _, _, P, P, P, P, _, _, _, _, _, _, _, _],
      [_, _, _, _, P, _, _, P, _, _, _, _, _, _, _, _],
      [_, _, _, K, K, _, _, K, K, _, _, _, _, _, _, _],
      [_, _, K, K, K, _, _, K, K, K, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];

    this.register('player_idle_0', idle1, 2);
    this.register('player_idle_1', idle2, 2);
    this.register('player_walk_0', walk1, 2);
    this.register('player_walk_1', walk2, 2);
    this.register('player_walk_2', walk3, 2);
    this.register('player_walk_3', walk2, 2);
    this.register('player_jump', jump, 2);
    this.register('player_fall', fall, 2);
    this.register('player_hurt', hurt, 2);
  }

  // --- ENEMIES ---
  private generateEnemySprites() {
    const _ = null;

    // 1. Green Slime
    const G1 = '#22c55e', G2 = '#16a34a', G3 = '#15803d', GL = '#86efac';
    const W = '#ffffff', B = '#052e16';

    const slimeIdle: PixelMatrix = [
      [_, _, _, _, _, G1, G1, G1, G1, _, _, _, _, _],
      [_, _, _, G1, G1, GL, GL, G1, G1, G1, _, _, _, _],
      [_, _, G1, GL, GL, G1, G1, G1, G1, G1, G1, _, _, _],
      [_, G1, G1, G1, G1, G1, G1, G1, G1, G1, G1, G1, _, _],
      [_, G1, W, B, G1, G1, G1, W, B, G1, G1, G1, _, _],
      [G1, G1, W, B, G1, G1, G1, W, B, G1, G1, G1, G1, _],
      [G1, G1, G1, G1, G1, G1, G1, G1, G1, G1, G1, G1, G1, _],
      [G2, G2, G2, G2, G2, G2, G2, G2, G2, G2, G2, G2, G2, G2],
      [G3, G3, G3, G3, G3, G3, G3, G3, G3, G3, G3, G3, G3, G3],
    ];

    const slimeSquash: PixelMatrix = [
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, G1, G1, GL, GL, G1, G1, G1, G1, _, _, _, _],
      [_, _, G1, G1, GL, G1, G1, G1, G1, G1, G1, G1, G1, _, _, _],
      [_, G1, G1, W, B, G1, G1, G1, W, B, G1, G1, G1, G1, _, _],
      [G1, G1, G1, W, B, G1, G1, G1, W, B, G1, G1, G1, G1, G1, _],
      [G2, G2, G2, G2, G2, G2, G2, G2, G2, G2, G2, G2, G2, G2, G2, G2],
      [G3, G3, G3, G3, G3, G3, G3, G3, G3, G3, G3, G3, G3, G3, G3, G3],
    ];

    const slimeFlat: PixelMatrix = [
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, G1, G1, GL, G1, G1, G1, G1, G1, G1, G1, _, _, _, _],
      [G1, G1, G1, G1, G1, G1, G1, G1, G1, G1, G1, G1, G1, G1, G1, G1],
      [G3, G3, G3, G3, G3, G3, G3, G3, G3, G3, G3, G3, G3, G3, G3, G3],
    ];

    this.register('enemy_slime_0', slimeIdle, 2);
    this.register('enemy_slime_1', slimeSquash, 2);
    this.register('enemy_slime_squashed', slimeFlat, 2);

    // 2. Walking Mushroom
    const R1 = '#ef4444', R2 = '#dc2626', RW = '#ffffff';
    const SK = '#fef08a', MB = '#713f12';

    const mush1: PixelMatrix = [
      [_, _, _, _, R1, R1, R1, R1, R1, R1, _, _, _, _],
      [_, _, R1, R1, RW, RW, R1, R1, RW, RW, R1, R1, _, _],
      [_, R1, R1, RW, RW, RW, R1, R1, RW, RW, RW, R1, R1, _],
      [R1, R1, R1, R1, RW, RW, R1, R1, RW, RW, R1, R1, R1, R1],
      [R2, R2, R2, R2, R2, R2, R2, R2, R2, R2, R2, R2, R2, R2],
      [_, _, _, SK, SK, SK, SK, SK, SK, SK, SK, _, _, _],
      [_, _, _, SK, MB, SK, SK, SK, SK, MB, SK, _, _, _],
      [_, _, _, SK, MB, SK, SK, SK, SK, MB, SK, _, _, _],
      [_, _, _, SK, SK, SK, SK, SK, SK, SK, SK, _, _, _],
      [_, _, MB, MB, MB, _, _, _, _, MB, MB, MB, _, _],
      [_, MB, MB, MB, MB, _, _, _, _, MB, MB, MB, MB, _],
    ];

    const mush2: PixelMatrix = [
      [_, _, _, _, R1, R1, R1, R1, R1, R1, _, _, _, _],
      [_, _, R1, R1, RW, RW, R1, R1, RW, RW, R1, R1, _, _],
      [_, R1, R1, RW, RW, RW, R1, R1, RW, RW, RW, R1, R1, _],
      [R1, R1, R1, R1, RW, RW, R1, R1, RW, RW, R1, R1, R1, R1],
      [R2, R2, R2, R2, R2, R2, R2, R2, R2, R2, R2, R2, R2, R2],
      [_, _, _, SK, SK, SK, SK, SK, SK, SK, SK, _, _, _],
      [_, _, _, SK, MB, SK, SK, SK, SK, MB, SK, _, _, _],
      [_, _, _, SK, MB, SK, SK, SK, SK, MB, SK, _, _, _],
      [_, _, _, SK, SK, SK, SK, SK, SK, SK, SK, _, _, _],
      [_, _, _, MB, MB, MB, MB, MB, MB, MB, _, _, _, _],
      [_, _, MB, MB, MB, MB, MB, MB, MB, MB, _, _, _, _],
    ];

    this.register('enemy_mushroom_0', mush1, 2);
    this.register('enemy_mushroom_1', mush2, 2);
    this.register('enemy_mushroom_squashed', slimeFlat, 2);

    // 3. Flying Bat
    const BP = '#581c87', BD = '#3b0764', RE = '#ef4444';
    const batWingsUp: PixelMatrix = [
      [BP, _, _, _, _, _, _, _, _, _, _, _, _, BP],
      [BP, BP, _, _, _, BD, BD, BD, BD, _, _, _, BP, BP],
      [BP, BP, BP, _, BD, RE, BD, BD, RE, BD, _, BP, BP, BP],
      [_, BP, BP, BP, BD, BD, BD, BD, BD, BD, BP, BP, BP, _],
      [_, _, BP, BP, BD, W, BD, BD, W, BD, BP, BP, _, _],
      [_, _, _, BP, BD, BD, BD, BD, BD, BD, BP, _, _, _],
      [_, _, _, _, _, BD, BD, BD, BD, _, _, _, _, _],
      [_, _, _, _, _, _, BD, BD, _, _, _, _, _, _],
    ];

    const batWingsDown: PixelMatrix = [
      [_, _, _, _, _, BD, BD, BD, BD, _, _, _, _, _],
      [_, _, _, _, BD, RE, BD, BD, RE, BD, _, _, _, _],
      [_, _, _, _, BD, BD, BD, BD, BD, BD, _, _, _, _],
      [BP, BP, BP, _, BD, W, BD, BD, W, BD, _, BP, BP, BP],
      [BP, BP, BP, BP, BD, BD, BD, BD, BD, BD, BP, BP, BP, BP],
      [_, BP, BP, _, _, BD, BD, BD, BD, _, _, BP, BP, _],
      [_, _, BP, _, _, _, BD, BD, _, _, _, _, BP, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];

    this.register('enemy_bat_0', batWingsUp, 2);
    this.register('enemy_bat_1', batWingsDown, 2);

    // 4. Lava Beetle / Fire Crawler
    const OB = '#18181b', LM = '#ea580c', LF = '#f97316', YE = '#fde047';
    const beetle1: PixelMatrix = [
      [_, _, _, _, OB, OB, OB, OB, OB, _, _, _, _],
      [_, _, _, OB, LM, LM, LF, LM, LM, OB, _, _, _],
      [_, _, OB, LM, YE, LF, YE, LF, LM, LM, OB, _, _],
      [_, OB, OB, LM, LF, LM, LF, LM, LM, OB, OB, _],
      [OB, OB, OB, OB, LM, LM, LM, LM, OB, OB, OB, OB],
      [OB, YE, OB, OB, OB, OB, OB, OB, OB, OB, YE, OB],
      [_, OB, _, OB, _, _, _, _, OB, _, OB, _, _],
      [OB, _, _, _, OB, _, _, OB, _, _, _, OB, _],
    ];

    const beetle2: PixelMatrix = [
      [_, _, _, _, OB, OB, OB, OB, OB, _, _, _, _],
      [_, _, _, OB, LM, LM, LF, LM, LM, OB, _, _, _],
      [_, _, OB, LM, YE, LF, YE, LF, LM, LM, OB, _, _],
      [_, OB, OB, LM, LF, LM, LF, LM, LM, OB, OB, _],
      [OB, OB, OB, OB, LM, LM, LM, LM, OB, OB, OB, OB],
      [OB, YE, OB, OB, OB, OB, OB, OB, OB, OB, YE, OB],
      [_, _, OB, _, OB, _, _, OB, _, OB, _, _, _],
      [_, OB, _, _, _, OB, OB, _, _, _, OB, _, _],
    ];

    this.register('enemy_fire_beetle_0', beetle1, 2);
    this.register('enemy_fire_beetle_1', beetle2, 2);
    this.register('enemy_fire_beetle_squashed', slimeFlat, 2);
  }

  // --- COLLECTIBLES ---
  private generateCollectibleSprites() {
    const _ = null;
    const Y1 = '#fef08a', Y2 = '#facc15', Y3 = '#eab308', Y4 = '#ca8a04';
    const W = '#ffffff';

    // Coin 4-frame rotation
    const coin0: PixelMatrix = [
      [_, _, _, Y2, Y2, Y2, Y2, _, _, _],
      [_, _, Y2, Y1, Y1, Y1, Y1, Y2, _, _],
      [_, Y2, Y1, W, Y1, Y1, Y1, Y1, Y2, _],
      [Y2, Y1, Y1, Y1, Y3, Y3, Y1, Y1, Y1, Y2],
      [Y2, Y1, Y1, Y3, Y4, Y4, Y3, Y1, Y1, Y2],
      [Y2, Y1, Y1, Y3, Y4, Y4, Y3, Y1, Y1, Y2],
      [Y2, Y1, Y1, Y1, Y3, Y3, Y1, Y1, Y1, Y2],
      [_, Y2, Y1, Y1, Y1, Y1, Y1, Y1, Y2, _],
      [_, _, Y2, Y3, Y3, Y3, Y3, Y2, _, _],
      [_, _, _, Y4, Y4, Y4, Y4, _, _, _],
    ];

    const coin1: PixelMatrix = [
      [_, _, _, Y2, Y2, Y2, _, _, _, _],
      [_, _, Y2, Y1, Y1, Y2, _, _, _, _],
      [_, Y2, Y1, W, Y1, Y1, Y2, _, _, _],
      [Y2, Y1, Y1, Y3, Y3, Y1, Y1, Y2, _, _],
      [Y2, Y1, Y3, Y4, Y3, Y1, Y1, Y2, _, _],
      [Y2, Y1, Y3, Y4, Y3, Y1, Y1, Y2, _, _],
      [Y2, Y1, Y1, Y3, Y3, Y1, Y1, Y2, _, _],
      [_, Y2, Y1, Y1, Y1, Y1, Y2, _, _, _],
      [_, _, Y2, Y3, Y3, Y2, _, _, _, _],
      [_, _, _, Y4, Y4, _, _, _, _, _],
    ];

    const coin2: PixelMatrix = [
      [_, _, _, Y2, Y2, _, _, _, _, _],
      [_, _, _, Y1, Y2, _, _, _, _, _],
      [_, _, Y2, W, Y2, _, _, _, _, _],
      [_, _, Y2, Y3, Y2, _, _, _, _, _],
      [_, _, Y2, Y4, Y2, _, _, _, _, _],
      [_, _, Y2, Y4, Y2, _, _, _, _, _],
      [_, _, Y2, Y3, Y2, _, _, _, _, _],
      [_, _, Y2, Y1, Y2, _, _, _, _, _],
      [_, _, _, Y3, Y2, _, _, _, _, _],
      [_, _, _, Y4, Y4, _, _, _, _, _],
    ];

    const coin3: PixelMatrix = [
      [_, _, _, _, Y2, Y2, Y2, _, _, _],
      [_, _, _, Y2, Y1, Y1, Y2, _, _, _],
      [_, _, Y2, Y1, Y1, W, Y1, Y2, _, _],
      [_, Y2, Y1, Y1, Y3, Y3, Y1, Y1, Y2, _],
      [_, Y2, Y1, Y1, Y3, Y4, Y3, Y1, Y2, _],
      [_, Y2, Y1, Y1, Y3, Y4, Y3, Y1, Y2, _],
      [_, Y2, Y1, Y1, Y3, Y3, Y1, Y1, Y2, _],
      [_, _, Y2, Y1, Y1, Y1, Y1, Y2, _, _],
      [_, _, _, Y2, Y3, Y3, Y2, _, _, _],
      [_, _, _, _, Y4, Y4, _, _, _, _],
    ];

    this.register('collectible_coin_0', coin0, 2);
    this.register('collectible_coin_1', coin1, 2);
    this.register('collectible_coin_2', coin2, 2);
    this.register('collectible_coin_3', coin3, 2);

    // Heart (Health)
    const R = '#ef4444', RD = '#b91c1c', RL = '#fca5a5';
    const heart: PixelMatrix = [
      [_, R, R, _, _, R, R, _],
      [R, RL, R, R, R, R, R, R],
      [R, R, R, R, R, R, R, R],
      [R, R, R, R, R, R, R, R],
      [_, R, R, R, R, R, R, _],
      [_, _, R, R, R, R, _, _],
      [_, _, _, R, RD, _, _, _],
      [_, _, _, _, RD, _, _, _],
    ];
    this.register('collectible_heart', heart, 3);

    // PowerUp: Speed Gem (Cyan/Electric)
    const C1 = '#38bdf8', C2 = '#0284c7', C3 = '#0369a1';
    const gemSpeed: PixelMatrix = [
      [_, _, _, C1, C1, _, _, _],
      [_, _, C1, W, C1, C1, _, _],
      [_, C1, C1, W, C1, C1, C1, _],
      [C1, C1, C1, C1, C1, C1, C1, C1],
      [C2, C2, C2, C2, C2, C2, C2, C2],
      [_, C2, C2, C2, C2, C2, C2, _],
      [_, _, C3, C3, C3, C3, _, _],
      [_, _, _, C3, C3, _, _, _],
    ];
    this.register('collectible_powerup_speed', gemSpeed, 3);

    // PowerUp: High Jump Feather
    const F1 = '#fde047', F2 = '#f59e0b', K = '#78350f';
    const featherJump: PixelMatrix = [
      [_, _, _, _, _, _, F1, F1],
      [_, _, _, _, _, F1, W, F1],
      [_, _, _, _, F1, F1, F1, _],
      [_, _, _, F1, F2, F1, _, _],
      [_, _, F1, F2, F1, _, _, _],
      [_, F1, F2, F1, _, _, _, _],
      [F2, F2, F1, _, _, _, _, _],
      [K, F2, _, _, _, _, _, _],
    ];
    this.register('collectible_powerup_jump', featherJump, 3);

    // PowerUp: Shield Star
    const starShield: PixelMatrix = [
      [_, _, _, _, Y1, Y1, _, _, _, _],
      [_, _, _, Y1, W, Y1, Y1, _, _, _],
      [Y2, Y2, Y1, Y1, Y1, Y1, Y1, Y1, Y2, Y2],
      [_, Y2, Y1, Y1, Y1, Y1, Y1, Y1, Y2, _],
      [_, _, Y2, Y1, Y1, Y1, Y1, Y2, _, _],
      [_, _, Y2, Y1, Y1, Y1, Y1, Y2, _, _],
      [_, Y2, Y1, Y2, _, _, Y2, Y1, Y2, _],
      [Y2, Y2, _, _, _, _, _, _, Y2, Y2],
    ];
    this.register('collectible_powerup_shield', starShield, 3);
  }

  // --- BLOCKS & TILES ---
  private generateBlockSprites() {
    const _ = null;

    // Grass Top Block (16x16)
    const GT = '#22c55e', GH = '#4ade80', GD = '#15803d';
    const D1 = '#78350f', D2 = '#92400e', D3 = '#451a03';

    const grassBlock: PixelMatrix = [
      [GH, GH, GH, GH, GH, GH, GH, GH, GH, GH, GH, GH, GH, GH, GH, GH],
      [GT, GT, GT, GT, GT, GT, GT, GT, GT, GT, GT, GT, GT, GT, GT, GT],
      [GT, GT, GD, GT, GT, GT, GD, GT, GT, GT, GD, GT, GT, GT, GD, GT],
      [GD, GD, _, GD, GD, GD, _, GD, GD, GD, _, GD, GD, GD, _, GD],
      [D1, D1, D2, D1, D1, D2, D1, D1, D2, D1, D1, D2, D1, D1, D2, D1],
      [D1, D2, D2, D1, D1, D1, D2, D1, D1, D2, D2, D1, D1, D1, D2, D1],
      [D2, D2, D1, D1, D3, D1, D1, D2, D2, D2, D1, D1, D3, D1, D1, D2],
      [D1, D1, D1, D3, D3, D3, D1, D1, D1, D1, D1, D3, D3, D3, D1, D1],
      [D1, D2, D1, D1, D3, D1, D1, D2, D1, D2, D1, D1, D3, D1, D1, D2],
      [D2, D2, D1, D1, D1, D1, D2, D2, D2, D2, D1, D1, D1, D1, D2, D2],
      [D1, D1, D2, D2, D1, D2, D1, D1, D1, D1, D2, D2, D1, D2, D1, D1],
      [D1, D3, D3, D1, D1, D1, D1, D3, D1, D3, D3, D1, D1, D1, D1, D3],
      [D3, D3, D1, D1, D2, D2, D3, D3, D3, D3, D1, D1, D2, D2, D3, D3],
      [D1, D1, D1, D2, D2, D1, D1, D1, D1, D1, D1, D2, D2, D1, D1, D1],
      [D2, D2, D1, D1, D1, D1, D2, D2, D2, D2, D1, D1, D1, D1, D2, D2],
      [D3, D3, D3, D3, D3, D3, D3, D3, D3, D3, D3, D3, D3, D3, D3, D3],
    ];
    this.register('tile_grass', grassBlock, 2);

    // Forest Moss Stone Block
    const M1 = '#15803d', M2 = '#166534', S1 = '#475569', S2 = '#334155', S3 = '#1e293b';
    const forestBlock: PixelMatrix = [
      [M1, M1, M1, M1, M1, M1, M1, M1, M1, M1, M1, M1, M1, M1, M1, M1],
      [M2, M2, M1, M2, M2, M1, M2, M2, M1, M2, M2, M1, M2, M2, M1, M2],
      [S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1],
      [S1, S2, S2, S1, S1, S2, S2, S1, S1, S2, S2, S1, S1, S2, S2, S1],
      [S2, S2, S3, S2, S2, S2, S3, S2, S2, S2, S3, S2, S2, S2, S3, S2],
      [S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3],
      [S1, S1, S1, S2, S2, S1, S1, S1, S1, S1, S1, S2, S2, S1, S1, S1],
      [S2, S2, S2, S2, S3, S2, S2, S2, S2, S2, S2, S2, S3, S2, S2, S2],
      [S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1],
      [S2, S3, S3, S2, S2, S3, S3, S2, S2, S3, S3, S2, S2, S3, S3, S2],
      [S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3],
      [S1, S2, S2, S1, S1, S2, S2, S1, S1, S2, S2, S1, S1, S2, S2, S1],
      [S2, S2, S3, S2, S2, S2, S3, S2, S2, S2, S3, S2, S2, S2, S3, S2],
      [S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1],
      [S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3],
      [S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3, S3],
    ];
    this.register('tile_forest', forestBlock, 2);

    // Lava Basalt Rock Block
    const L1 = '#f97316', L2 = '#ea580c', B1 = '#27272a', B2 = '#18181b', B3 = '#09090b';
    const lavaBlock: PixelMatrix = [
      [L1, L1, L2, L1, L1, L2, L1, L1, L1, L2, L1, L1, L2, L1, L1, L1],
      [B1, B1, L2, B1, B1, L2, B1, B1, B1, L2, B1, B1, L2, B1, B1, B1],
      [B1, B2, B2, B1, B1, B2, B2, B1, B1, B2, B2, B1, B1, B2, B2, B1],
      [B2, B2, B3, B2, B2, B2, B3, B2, B2, B2, B3, B2, B2, B2, B3, B2],
      [B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3],
      [B1, B1, L1, L2, B1, B1, B1, B1, B1, B1, L1, L2, B1, B1, B1, B1],
      [B2, B2, B2, L2, B2, B2, B2, B2, B2, B2, B2, L2, B2, B2, B2, B2],
      [B1, B1, B1, B1, B1, B1, B1, B1, B1, B1, B1, B1, B1, B1, B1, B1],
      [B2, B3, B3, B2, B2, B3, B3, B2, B2, B3, B3, B2, B2, B3, B3, B2],
      [B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3],
      [B1, B2, B2, B1, B1, B2, B2, B1, B1, B2, B2, B1, B1, B2, B2, B1],
      [B2, B2, B3, B2, B2, B2, B3, B2, B2, B2, B3, B2, B2, B2, B3, B2],
      [B1, B1, B1, B1, B1, B1, B1, B1, B1, B1, B1, B1, B1, B1, B1, B1],
      [B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3],
      [B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3],
      [B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3, B3],
    ];
    this.register('tile_lava', lavaBlock, 2);

    // Mystery '?' Block (Golden with animated question mark)
    const MY1 = '#fef08a', MY2 = '#eab308', MY3 = '#a16207', MW = '#ffffff', MB = '#713f12';
    const mysteryBlock: PixelMatrix = [
      [MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1],
      [MY1, MW, MW, MY2, MY2, MY2, MY2, MY2, MY2, MY2, MY2, MY2, MY2, MW, MW, MY3],
      [MY1, MW, MB, MB, MB, MB, MB, MB, MB, MB, MB, MB, MB, MB, MW, MY3],
      [MY1, MY2, MB, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MB, MY2, MY3],
      [MY1, MY2, MB, MY1, MY1, MW, MW, MW, MW, MY1, MY1, MY1, MY1, MB, MY2, MY3],
      [MY1, MY2, MB, MY1, MW, MW, MY2, MY2, MW, MW, MY1, MY1, MY1, MB, MY2, MY3],
      [MY1, MY2, MB, MY1, MY1, MY1, MY1, MY2, MW, MW, MY1, MY1, MY1, MB, MY2, MY3],
      [MY1, MY2, MB, MY1, MY1, MY1, MW, MW, MW, MY1, MY1, MY1, MY1, MB, MY2, MY3],
      [MY1, MY2, MB, MY1, MY1, MY1, MW, MW, MY1, MY1, MY1, MY1, MY1, MB, MY2, MY3],
      [MY1, MY2, MB, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MB, MY2, MY3],
      [MY1, MY2, MB, MY1, MY1, MY1, MW, MW, MY1, MY1, MY1, MY1, MY1, MB, MY2, MY3],
      [MY1, MY2, MB, MY1, MY1, MY1, MW, MW, MY1, MY1, MY1, MY1, MY1, MB, MY2, MY3],
      [MY1, MY2, MB, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MY1, MB, MY2, MY3],
      [MY1, MW, MB, MB, MB, MB, MB, MB, MB, MB, MB, MB, MB, MB, MW, MY3],
      [MY1, MW, MW, MY3, MY3, MY3, MY3, MY3, MY3, MY3, MY3, MY3, MY3, MW, MW, MY3],
      [MY3, MY3, MY3, MY3, MY3, MY3, MY3, MY3, MY3, MY3, MY3, MY3, MY3, MY3, MY3, MY3],
    ];
    this.register('tile_mystery', mysteryBlock, 2);

    // Empty Spent Block (Bronze metallic with rivet corners)
    const EM1 = '#94a3b8', EM2 = '#64748b', EM3 = '#334155', ED = '#1e293b';
    const emptyBlock: PixelMatrix = [
      [EM1, EM1, EM1, EM1, EM1, EM1, EM1, EM1, EM1, EM1, EM1, EM1, EM1, EM1, EM1, EM1],
      [EM1, ED, ED, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, ED, ED, EM3],
      [EM1, ED, ED, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, ED, ED, EM3],
      [EM1, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM3],
      [EM1, EM2, EM2, EM2, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM2, EM2, EM2, EM3],
      [EM1, EM2, EM2, EM2, EM3, EM2, EM2, EM2, EM2, EM2, EM2, EM3, EM2, EM2, EM2, EM3],
      [EM1, EM2, EM2, EM2, EM3, EM2, EM2, EM2, EM2, EM2, EM2, EM3, EM2, EM2, EM2, EM3],
      [EM1, EM2, EM2, EM2, EM3, EM2, EM2, EM2, EM2, EM2, EM2, EM3, EM2, EM2, EM2, EM3],
      [EM1, EM2, EM2, EM2, EM3, EM2, EM2, EM2, EM2, EM2, EM2, EM3, EM2, EM2, EM2, EM3],
      [EM1, EM2, EM2, EM2, EM3, EM2, EM2, EM2, EM2, EM2, EM2, EM3, EM2, EM2, EM2, EM3],
      [EM1, EM2, EM2, EM2, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM2, EM2, EM2, EM3],
      [EM1, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM3],
      [EM1, ED, ED, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, ED, ED, EM3],
      [EM1, ED, ED, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, EM2, ED, ED, EM3],
      [EM1, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3],
      [EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3, EM3],
    ];
    this.register('tile_empty', emptyBlock, 2);

    // Breakable Brick
    const BR1 = '#ea580c', BR2 = '#c2410c', BR3 = '#7c2d12', BM = '#451a03';
    const brickBlock: PixelMatrix = [
      [BR1, BR1, BR1, BR1, BR1, BR1, BR1, BR1, BR1, BR1, BR1, BR1, BR1, BR1, BR1, BR1],
      [BR1, BR2, BR2, BR2, BR2, BR2, BR2, BM, BR1, BR2, BR2, BR2, BR2, BR2, BR2, BM],
      [BR1, BR2, BR2, BR2, BR2, BR2, BR2, BM, BR1, BR2, BR2, BR2, BR2, BR2, BR2, BM],
      [BR3, BR3, BR3, BR3, BR3, BR3, BR3, BM, BR3, BR3, BR3, BR3, BR3, BR3, BR3, BM],
      [BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM],
      [BR1, BR2, BR2, BM, BR1, BR2, BR2, BR2, BR2, BR2, BR2, BM, BR1, BR2, BR2, BM],
      [BR1, BR2, BR2, BM, BR1, BR2, BR2, BR2, BR2, BR2, BR2, BM, BR1, BR2, BR2, BM],
      [BR3, BR3, BR3, BM, BR3, BR3, BR3, BR3, BR3, BR3, BR3, BM, BR3, BR3, BR3, BM],
      [BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM],
      [BR1, BR2, BR2, BR2, BR2, BR2, BR2, BM, BR1, BR2, BR2, BR2, BR2, BR2, BR2, BM],
      [BR1, BR2, BR2, BR2, BR2, BR2, BR2, BM, BR1, BR2, BR2, BR2, BR2, BR2, BR2, BM],
      [BR3, BR3, BR3, BR3, BR3, BR3, BR3, BM, BR3, BR3, BR3, BR3, BR3, BR3, BR3, BM],
      [BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM],
      [BR1, BR2, BR2, BM, BR1, BR2, BR2, BR2, BR2, BR2, BR2, BM, BR1, BR2, BR2, BM],
      [BR3, BR3, BR3, BM, BR3, BR3, BR3, BR3, BR3, BR3, BR3, BM, BR3, BR3, BR3, BM],
      [BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM],
    ];
    this.register('tile_brick', brickBlock, 2);

    // Sharp Spikes
    const SP1 = '#cbd5e1', SP2 = '#94a3b8', SP3 = '#475569';
    const spikeBlock: PixelMatrix = [
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, SP1, _, _, _, _, _, _, _, SP1, _, _, _, _],
      [_, _, SP1, SP2, _, _, _, _, _, _, SP1, SP2, _, _, _, _],
      [_, _, SP1, SP2, _, _, _, _, _, _, SP1, SP2, _, _, _, _],
      [_, SP1, SP1, SP2, SP3, _, _, _, _, SP1, SP1, SP2, SP3, _, _, _],
      [_, SP1, SP1, SP2, SP3, _, _, _, _, SP1, SP1, SP2, SP3, _, _, _],
      [SP1, SP1, SP1, SP2, SP3, SP3, _, _, SP1, SP1, SP1, SP2, SP3, SP3, _, _],
      [SP1, SP1, SP1, SP2, SP3, SP3, _, _, SP1, SP1, SP1, SP2, SP3, SP3, _, _],
      [SP3, SP3, SP3, SP3, SP3, SP3, SP3, SP3, SP3, SP3, SP3, SP3, SP3, SP3, SP3, SP3],
    ];
    this.register('tile_spike', spikeBlock, 2);

    // Spring Pad
    const SB = '#e2e8f0', SR = '#ef4444', SC = '#fbbf24';
    const springNormal: PixelMatrix = [
      [SR, SR, SR, SR, SR, SR, SR, SR, SR, SR, SR, SR, SR, SR, SR, SR],
      [SR, SC, SC, SC, SC, SC, SC, SC, SC, SC, SC, SC, SC, SC, SC, SR],
      [_, _, _, SB, SB, SB, SB, SB, SB, SB, SB, SB, SB, _, _, _],
      [_, _, _, _, _, _, SB, SB, SB, SB, _, _, _, _, _, _],
      [_, _, _, SB, SB, SB, SB, SB, SB, SB, SB, SB, SB, _, _, _],
      [_, _, _, _, _, _, SB, SB, SB, SB, _, _, _, _, _, _],
      [_, _, _, SB, SB, SB, SB, SB, SB, SB, SB, SB, SB, _, _, _],
      [SB, SB, SB, SB, SB, SB, SB, SB, SB, SB, SB, SB, SB, SB, SB, SB],
    ];
    this.register('tile_spring', springNormal, 2);

    // Crumbling Platform
    const CR1 = '#fbbf24', CR2 = '#d97706', CR3 = '#78350f', CK = '#451a03';
    const crumblingBlock: PixelMatrix = [
      [CR1, CR1, CR1, CR1, CR1, CR1, CR1, CR1, CR1, CR1, CR1, CR1, CR1, CR1, CR1, CR1],
      [CR1, CR2, CR2, CK, CR2, CR2, CR2, CK, CK, CR2, CR2, CR2, CK, CR2, CR2, CR3],
      [CR2, CR2, CK, CR2, CR2, CR2, CK, CR2, CR2, CK, CR2, CR2, CK, CR2, CR2, CR3],
      [CR2, CK, CR2, CR2, CR2, CK, CR2, CR2, CR2, CR2, CK, CR2, CK, CR2, CR2, CR3],
      [CR3, CK, CR2, CR2, CK, CR2, CR2, CR2, CR2, CR2, CR2, CK, CK, CR2, CR2, CR3],
      [CR3, CR3, CK, CK, CR2, CR2, CR2, CR2, CR2, CR2, CR2, CK, CR2, CR2, CR3, CR3],
      [CR3, CR3, CR3, CR3, CR3, CR3, CR3, CR3, CR3, CR3, CR3, CR3, CR3, CR3, CR3, CR3],
    ];
    this.register('tile_crumbling', crumblingBlock, 2);
  }

  // --- SPECIAL SPRITES (PORTAL & CHECKPOINT) ---
  private generateSpecialSprites() {
    const _ = null;

    // Checkpoint Flag - Unactive & Active
    const ST = '#64748b', GD = '#facc15', FL1 = '#ef4444', FL2 = '#22c55e', W = '#ffffff';

    const flagUnreached: PixelMatrix = [
      [_, _, GD, GD, _, _, _, _, _, _, _, _],
      [_, _, GD, GD, _, _, _, _, _, _, _, _],
      [_, _, ST, ST, FL1, FL1, FL1, FL1, FL1, FL1, _, _],
      [_, _, ST, ST, FL1, W, W, FL1, FL1, FL1, FL1, _],
      [_, _, ST, ST, FL1, W, W, FL1, FL1, FL1, FL1, _],
      [_, _, ST, ST, FL1, FL1, FL1, FL1, FL1, FL1, _, _],
      [_, _, ST, ST, _, _, _, _, _, _, _, _],
      [_, _, ST, ST, _, _, _, _, _, _, _, _],
      [_, _, ST, ST, _, _, _, _, _, _, _, _],
      [_, _, ST, ST, _, _, _, _, _, _, _, _],
      [_, ST, ST, ST, ST, _, _, _, _, _, _, _],
      [ST, ST, ST, ST, ST, ST, _, _, _, _, _, _],
    ];

    const flagReached: PixelMatrix = [
      [_, _, GD, GD, _, _, _, _, _, _, _, _],
      [_, _, GD, GD, FL2, FL2, FL2, FL2, FL2, FL2, _, _],
      [_, _, ST, ST, FL2, W, W, FL2, FL2, FL2, FL2, _],
      [_, _, ST, ST, FL2, W, W, FL2, FL2, FL2, FL2, _],
      [_, _, ST, ST, FL2, FL2, FL2, FL2, FL2, FL2, _, _],
      [_, _, ST, ST, _, _, _, _, _, _, _, _],
      [_, _, ST, ST, _, _, _, _, _, _, _, _],
      [_, _, ST, ST, _, _, _, _, _, _, _, _],
      [_, _, ST, ST, _, _, _, _, _, _, _, _],
      [_, _, ST, ST, _, _, _, _, _, _, _, _],
      [_, ST, ST, ST, ST, _, _, _, _, _, _, _],
      [ST, ST, ST, ST, ST, ST, _, _, _, _, _, _],
    ];

    this.register('checkpoint_flag_0', flagUnreached, 2.5);
    this.register('checkpoint_flag_1', flagReached, 2.5);

    // Goal Portal Frame (Swirling Mystical Arcane Gate)
    const P1 = '#818cf8', P2 = '#6366f1', P3 = '#4f46e5', P4 = '#312e81', GL = '#c7d2fe';
    const portal1: PixelMatrix = [
      [_, _, _, _, P1, P1, GL, GL, P1, P1, _, _, _, _],
      [_, _, P1, P2, P2, GL, GL, GL, P2, P2, P1, _, _, _],
      [_, P1, P2, P3, P3, P1, P1, P3, P3, P2, P1, _, _],
      [P1, P2, P3, P4, P4, P2, P2, P4, P4, P3, P2, P1],
      [P1, P2, P3, P4, GL, P3, P3, GL, P4, P3, P2, P1],
      [GL, GL, P3, P4, P3, GL, GL, P3, P4, P3, GL, GL],
      [GL, GL, P3, P4, P3, GL, GL, P3, P4, P3, GL, GL],
      [P1, P2, P3, P4, GL, P3, P3, GL, P4, P3, P2, P1],
      [P1, P2, P3, P4, P4, P2, P2, P4, P4, P3, P2, P1],
      [_, P1, P2, P3, P3, P1, P1, P3, P3, P2, P1, _, _],
      [_, _, P1, P2, P2, GL, GL, GL, P2, P2, P1, _, _, _],
      [_, _, _, _, P1, P1, GL, GL, P1, P1, _, _, _, _],
    ];

    this.register('goal_portal', portal1, 3.5);
  }
}

export const sprites = new SpriteSheet();
