import {
  Player,
  LevelData,
  InputState,
  Particle,
  FloatingText,
  TileBlock,
  MovingPlatform,
  Enemy,
  Collectible,
  GameSettings,
} from './types';
import { audio } from './audio';
import { sprites } from './sprites';

export class GameEngine {
  public player: Player;
  public level: LevelData;
  public cameraX: number = 0;
  public cameraY: number = 0;
  public viewWidth: number = 800;
  public viewHeight: number = 450;

  public score: number = 0;
  public coins: number = 0;
  public timeLeft: number = 0;

  public particles: Particle[] = [];
  public floatingTexts: FloatingText[] = [];

  public screenShakeTimer: number = 0;
  public screenShakeIntensity: number = 0;

  public onLevelClear?: (summary: { score: number; coins: number; timeBonus: number; totalScore: number; stars: number }) => void;
  public onGameOver?: () => void;
  public onPlayerHurt?: () => void;

  private isLevelCompleted: boolean = false;
  private isPlayerDead: boolean = false;
  private settings: GameSettings;

  constructor(level: LevelData, settings: GameSettings, initialScore: number = 0, initialCoins: number = 0) {
    this.level = level;
    this.settings = settings;
    this.score = initialScore;
    this.coins = initialCoins;
    this.timeLeft = level.timeLimit;

    this.player = {
      x: level.playerSpawn.x,
      y: level.playerSpawn.y,
      vx: 0,
      vy: 0,
      width: 26,
      height: 32,
      facing: 'right',
      animState: 'idle',
      animTimer: 0,
      animFrame: 0,
      onGround: false,
      isRunning: false,
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      isJumping: false,
      health: 3,
      maxHealth: 3,
      lives: 3,
      invulnerableTimer: 0,
      powerUp: null,
      squashX: 1,
      squashY: 1,
    };
  }

  public updateSettings(settings: GameSettings) {
    this.settings = settings;
  }

  // Restart from active checkpoint or level beginning
  public respawnPlayer() {
    let spawnX = this.level.playerSpawn.x;
    let spawnY = this.level.playerSpawn.y;

    for (const cp of this.level.checkpoints) {
      if (cp.isReached) {
        spawnX = cp.spawnX;
        spawnY = cp.spawnY;
      }
    }

    this.player.x = spawnX;
    this.player.y = spawnY;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.health = this.player.maxHealth;
    this.player.invulnerableTimer = 1.5;
    this.player.powerUp = null;
    this.isPlayerDead = false;
  }

  public triggerScreenShake(intensity: number = 6, duration: number = 0.25) {
    if (!this.settings.screenShake) return;
    this.screenShakeIntensity = intensity;
    this.screenShakeTimer = duration;
  }

  public addFloatingText(x: number, y: number, text: string, color: string = '#facc15') {
    this.floatingTexts.push({
      id: Math.random().toString(),
      x,
      y,
      text,
      color,
      life: 0.8,
      maxLife: 0.8,
    });
  }

  public addParticle(x: number, y: number, color: string, type: 'spark' | 'smoke' | 'rubble' | 'star' = 'spark', count: number = 5) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: Math.random() * 3 + 2,
        color,
        alpha: 1,
        life: 0.4 + Math.random() * 0.3,
        maxLife: 0.7,
        type,
      });
    }
  }

  // --- CORE GAME LOOP UPDATE ---
  public update(dt: number, input: InputState) {
    if (this.isLevelCompleted) return;

    // Timer countdown
    this.timeLeft -= dt;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.handlePlayerDeath();
      return;
    }

    // Screen shake update
    if (this.screenShakeTimer > 0) {
      this.screenShakeTimer -= dt;
    }

    // PowerUp timer update
    if (this.player.powerUp) {
      this.player.powerUp.remainingTime -= dt;
      if (this.player.powerUp.remainingTime <= 0) {
        this.player.powerUp = null;
        this.addFloatingText(this.player.x, this.player.y - 20, 'EXPIRED', '#94a3b8');
      }
    }

    // Invulnerability timer
    if (this.player.invulnerableTimer > 0) {
      this.player.invulnerableTimer -= dt;
    }

    // Squash recovery
    this.player.squashX += (1 - this.player.squashX) * 0.2;
    this.player.squashY += (1 - this.player.squashY) * 0.2;

    this.updatePlayerPhysics(dt, input);
    this.updateMovingPlatforms(dt);
    this.updateBlocks(dt);
    this.updateEnemies(dt);
    this.updateCollectibles(dt);
    this.updateCheckpoints();
    this.updateGoal();
    this.updateParticles(dt);
    this.updateFloatingTexts(dt);
    this.updateCamera();
  }

  // --- PLAYER MOVEMENT & COLLISION ---
  private updatePlayerPhysics(dt: number, input: InputState) {
    const p = this.player;

    // Running speed modifier
    const hasSpeed = p.powerUp?.type === 'speed';
    const isRunning = input.run || hasSpeed;
    p.isRunning = isRunning;

    const maxSpeed = hasSpeed ? 6.8 : isRunning ? 5.8 : 3.8;
    const accel = isRunning ? 0.8 : 0.55;
    const friction = p.onGround ? 0.78 : 0.92;

    // Horizontal acceleration
    if (input.left && !input.right) {
      p.vx -= accel;
      p.facing = 'left';
    } else if (input.right && !input.left) {
      p.vx += accel;
      p.facing = 'right';
    } else {
      p.vx *= friction;
      if (Math.abs(p.vx) < 0.1) p.vx = 0;
    }

    p.vx = Math.max(-maxSpeed, Math.min(maxSpeed, p.vx));

    // Gravity
    const gravity = 0.52;
    p.vy += gravity;
    if (p.vy > 12) p.vy = 12;

    // Coyote time & Jump buffer
    if (p.onGround) {
      p.coyoteTimer = 0.12;
    } else {
      p.coyoteTimer = Math.max(0, p.coyoteTimer - dt);
    }

    if (input.jump) {
      p.jumpBufferTimer = 0.12;
    } else {
      p.jumpBufferTimer = Math.max(0, p.jumpBufferTimer - dt);
    }

    // Jump Initiation
    const hasJumpBoost = p.powerUp?.type === 'high_jump';
    const jumpPower = hasJumpBoost ? -13.8 : -11.6;

    if (p.jumpBufferTimer > 0 && p.coyoteTimer > 0) {
      p.vy = jumpPower;
      p.onGround = false;
      p.coyoteTimer = 0;
      p.jumpBufferTimer = 0;
      p.isJumping = true;
      p.squashX = 0.75;
      p.squashY = 1.35;
      audio.playJump();
      this.addParticle(p.x + p.width / 2, p.y + p.height, '#e2e8f0', 'smoke', 4);
    }

    // Variable jump height: release early to cut upward velocity
    if (!input.jump && p.vy < -3) {
      p.vy *= 0.55;
    }

    // --- HORIZONTAL RESOLUTION ---
    p.x += p.vx;
    this.resolveHorizontalCollisions();

    // Clamp inside level width bounds
    if (p.x < 0) {
      p.x = 0;
      p.vx = 0;
    } else if (p.x + p.width > this.level.width) {
      p.x = this.level.width - p.width;
      p.vx = 0;
    }

    // --- VERTICAL RESOLUTION ---
    p.y += p.vy;
    p.onGround = false;
    this.resolveVerticalCollisions();

    // Check pit fall
    if (p.y > this.level.height + 60) {
      this.handlePlayerDeath();
      return;
    }

    // Animation state update
    p.animTimer += dt;
    if (!p.onGround) {
      p.animState = p.vy < 0 ? 'jump' : 'fall';
    } else if (Math.abs(p.vx) > 0.3) {
      p.animState = isRunning ? 'run' : 'walk';
      if (p.animTimer > (isRunning ? 0.08 : 0.13)) {
        p.animTimer = 0;
        p.animFrame = (p.animFrame + 1) % 4;
        if (p.animFrame % 2 === 0) {
          this.addParticle(p.x + (p.facing === 'right' ? 2 : p.width - 2), p.y + p.height, '#cbd5e1', 'smoke', 1);
        }
      }
    } else {
      p.animState = 'idle';
      if (p.animTimer > 0.45) {
        p.animTimer = 0;
        p.animFrame = (p.animFrame + 1) % 2;
      }
    }
  }

  private resolveHorizontalCollisions() {
    const p = this.player;

    for (const b of this.level.blocks) {
      if (b.type === 'spike' || (b.type === 'crumbling' && b.isFallen)) continue;

      if (
        p.x < b.x + b.width &&
        p.x + p.width > b.x &&
        p.y < b.y + b.height - 4 && // small threshold to avoid snagging ground
        p.y + p.height > b.y + 4
      ) {
        if (p.vx > 0) {
          p.x = b.x - p.width;
          p.vx = 0;
        } else if (p.vx < 0) {
          p.x = b.x + b.width;
          p.vx = 0;
        }
      }
    }
  }

  private resolveVerticalCollisions() {
    const p = this.player;

    // 1. Moving Platforms vertical collision
    for (const mp of this.level.movingPlatforms) {
      // Check if landing on top of platform
      const prevBottom = p.y + p.height - p.vy;
      if (
        p.x + p.width > mp.x + 4 &&
        p.x < mp.x + mp.width - 4 &&
        p.vy >= 0 &&
        prevBottom <= mp.y + 8 &&
        p.y + p.height >= mp.y
      ) {
        p.y = mp.y - p.height;
        p.vy = 0;
        p.onGround = true;
        p.onPlatformId = mp.id;
        // Carry player with moving platform
        p.x += mp.vx;
      }
    }

    // 2. Tile Blocks collision
    for (const b of this.level.blocks) {
      if (b.type === 'crumbling' && b.isFallen) continue;

      if (p.x + p.width > b.x + 3 && p.x < b.x + b.width - 3) {
        // Landing on block (Falling downward)
        if (p.vy >= 0 && p.y + p.height >= b.y && p.y + p.height - p.vy <= b.y + 12) {
          if (b.type === 'spike') {
            this.handlePlayerHurt(20);
            return;
          }

          if (b.type === 'spring') {
            p.vy = -16.8;
            p.onGround = false;
            p.squashX = 0.6;
            p.squashY = 1.4;
            audio.playSpring();
            this.triggerScreenShake(4, 0.15);
            this.addFloatingText(p.x, p.y - 10, 'BOING!!', '#f43f5e');
            this.addParticle(b.x + b.width / 2, b.y, '#f43f5e', 'star', 6);
            return;
          }

          if (b.type === 'crumbling') {
            if (b.crumbleTimer === 0) {
              b.crumbleTimer = 0.45; // starts crumbling count
            }
          }

          p.y = b.y - p.height;
          p.vy = 0;
          p.onGround = true;
        }
        // Hitting block with head from underneath (Jumping upward)
        else if (p.vy < 0 && p.y <= b.y + b.height && p.y - p.vy >= b.y + b.height - 12) {
          if (b.type === 'solid' || b.type === 'empty_block') {
            p.y = b.y + b.height;
            p.vy = 0;
            b.bumpOffset = -6;
            audio.playBlockHit();
          } else if (b.type.startsWith('mystery_')) {
            p.y = b.y + b.height;
            p.vy = 0;
            b.bumpOffset = -8;
            this.handleHitMysteryBlock(b);
          } else if (b.type === 'breakable_brick') {
            p.y = b.y + b.height;
            p.vy = 0;
            this.handleBreakBrick(b);
          }
        }
      }
    }
  }

  private handleHitMysteryBlock(block: TileBlock) {
    if (block.isHit) return;
    block.isHit = true;

    if (block.type === 'mystery_coin') {
      this.coins += 1;
      this.score += 200;
      audio.playCoin();
      this.addFloatingText(block.x, block.y - 24, '+200', '#facc15');
      this.addParticle(block.x + 16, block.y - 10, '#facc15', 'spark', 8);
    } else if (block.type === 'mystery_heart') {
      if (this.player.health < this.player.maxHealth) {
        this.player.health++;
        audio.playPowerUp();
        this.addFloatingText(block.x, block.y - 24, '+1 HEART', '#ef4444');
      } else {
        this.score += 500;
        audio.playCoin();
        this.addFloatingText(block.x, block.y - 24, '+500', '#facc15');
      }
      this.addParticle(block.x + 16, block.y - 10, '#ef4444', 'star', 8);
    } else if (block.type === 'mystery_powerup') {
      audio.playPowerUp();
      const pTypes: ('speed' | 'high_jump' | 'shield')[] = 
        this.level.theme === 'grass' ? ['high_jump', 'speed'] :
        this.level.theme === 'forest' ? ['speed', 'high_jump'] : ['shield', 'high_jump'];
      const chosen = pTypes[Math.floor(Math.random() * pTypes.length)];
      
      this.player.powerUp = {
        type: chosen,
        remainingTime: 14,
        duration: 14,
      };

      const label = chosen === 'speed' ? 'SUPER SPEED!' : chosen === 'high_jump' ? 'HIGH JUMP!' : 'STAR SHIELD!';
      const color = chosen === 'speed' ? '#38bdf8' : chosen === 'high_jump' ? '#fde047' : '#a855f7';
      this.addFloatingText(block.x - 10, block.y - 24, label, color);
      this.addParticle(block.x + 16, block.y - 10, color, 'star', 10);
    }

    block.type = 'empty_block';
  }

  private handleBreakBrick(block: TileBlock) {
    audio.playBlockBreak();
    this.score += 50;
    this.triggerScreenShake(3, 0.12);
    this.addParticle(block.x + 16, block.y + 16, '#c2410c', 'rubble', 8);
    // Remove brick from level
    this.level.blocks = this.level.blocks.filter(b => b.id !== block.id);
  }

  // --- MOVING PLATFORMS ---
  private updateMovingPlatforms(dt: number) {
    for (const mp of this.level.movingPlatforms) {
      mp.currentT += (mp.speed * dt * 0.4) * mp.direction;

      if (mp.currentT >= 1) {
        mp.currentT = 1;
        mp.direction = -1;
      } else if (mp.currentT <= 0) {
        mp.currentT = 0;
        mp.direction = 1;
      }

      // Smooth cosine easing
      const easedT = (1 - Math.cos(mp.currentT * Math.PI)) / 2;
      const targetX = mp.startX + (mp.endX - mp.startX) * easedT;
      const targetY = mp.startY + (mp.endY - mp.startY) * easedT;

      mp.vx = targetX - mp.x;
      mp.vy = targetY - mp.y;

      mp.x = targetX;
      mp.y = targetY;
    }
  }

  // --- BLOCKS BUMP & CRUMBLE ---
  private updateBlocks(dt: number) {
    for (const b of this.level.blocks) {
      // Decay bump offset
      if (b.bumpOffset && b.bumpOffset < 0) {
        b.bumpOffset += 24 * dt;
        if (b.bumpOffset > 0) b.bumpOffset = 0;
      }

      // Crumbling platform logic
      if (b.type === 'crumbling') {
        if (b.crumbleTimer && b.crumbleTimer > 0) {
          b.crumbleTimer -= dt;
          if (b.crumbleTimer <= 0) {
            b.isFallen = true;
            b.respawnTimer = 3.5;
            this.addParticle(b.x + 16, b.y + 16, '#fbbf24', 'rubble', 6);
          }
        } else if (b.isFallen && b.respawnTimer && b.respawnTimer > 0) {
          b.respawnTimer -= dt;
          if (b.respawnTimer <= 0) {
            b.isFallen = false;
            b.crumbleTimer = 0;
          }
        }
      }
    }
  }

  // --- ENEMIES BEHAVIOR & INTERACTION ---
  private updateEnemies(dt: number) {
    const p = this.player;

    for (const enemy of this.level.enemies) {
      if (!enemy.isAlive) {
        if (enemy.isSquashed) {
          enemy.squashTimer -= dt;
          if (enemy.squashTimer <= 0) {
            enemy.isSquashed = false;
          }
        }
        continue;
      }

      // Patrol movement
      if (enemy.type === 'bat') {
        enemy.x += enemy.vx;
        enemy.sineOffset = (enemy.sineOffset || 0) + dt * 4;
        enemy.y = enemy.baseY + Math.sin(enemy.sineOffset) * 26;
        if (Math.abs(enemy.x - enemy.startX) > enemy.patrolDistance) {
          enemy.vx *= -1;
          enemy.facing = enemy.vx > 0 ? 'right' : 'left';
        }
      } else {
        // Ground patrols (slime, mushroom, fire_beetle)
        enemy.x += enemy.vx;
        if (Math.abs(enemy.x - enemy.startX) > enemy.patrolDistance) {
          enemy.vx *= -1;
          enemy.facing = enemy.vx > 0 ? 'right' : 'left';
        }

        // Ledge & obstacle detection
        // If approaching a wall or end of bounds, turn around
        if (enemy.x <= 10 || enemy.x + enemy.width >= this.level.width - 10) {
          enemy.vx *= -1;
          enemy.facing = enemy.vx > 0 ? 'right' : 'left';
        }
      }

      // Animation frame toggle
      enemy.animTimer += dt;
      if (enemy.animTimer > 0.18) {
        enemy.animTimer = 0;
        enemy.animFrame = (enemy.animFrame + 1) % 2;
      }

      // Check collision with player
      if (
        p.x < enemy.x + enemy.width - 3 &&
        p.x + p.width > enemy.x + 3 &&
        p.y < enemy.y + enemy.height &&
        p.y + p.height > enemy.y
      ) {
        // Star shield instant defeat!
        if (p.powerUp?.type === 'shield') {
          this.defeatEnemy(enemy, true);
          continue;
        }

        // Check if player jumped on top of enemy (Stomp!)
        // Player is moving downward and player feet are near top of enemy
        const playerBottom = p.y + p.height;
        if (p.vy > 0 && playerBottom - p.vy <= enemy.y + 14) {
          p.vy = -9.2; // bounce player
          p.squashX = 1.3;
          p.squashY = 0.7;
          this.defeatEnemy(enemy, false);
        } else {
          // Side or bottom collision -> damage player!
          this.handlePlayerHurt();
        }
      }
    }
  }

  private defeatEnemy(enemy: Enemy, byShield: boolean = false) {
    enemy.isAlive = false;
    enemy.isSquashed = true;
    enemy.squashTimer = 0.6;
    audio.playStomp();
    this.score += 250;
    this.triggerScreenShake(4, 0.15);
    this.addFloatingText(enemy.x, enemy.y - 16, '+250', '#facc15');
    this.addParticle(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, byShield ? '#c084fc' : '#22c55e', 'spark', 8);
  }

  private handlePlayerHurt(knockbackForce: number = 5) {
    const p = this.player;
    if (p.invulnerableTimer > 0 || this.isPlayerDead) return;

    p.health -= 1;
    p.invulnerableTimer = 1.6;
    p.vy = -6;
    p.vx = (p.facing === 'right' ? -1 : 1) * knockbackForce;
    p.squashX = 0.8;
    p.squashY = 1.2;

    audio.playHurt();
    this.triggerScreenShake(7, 0.25);
    this.addParticle(p.x + p.width / 2, p.y + p.height / 2, '#ef4444', 'spark', 6);
    this.addFloatingText(p.x, p.y - 20, '-1 HP', '#ef4444');

    if (this.onPlayerHurt) {
      this.onPlayerHurt();
    }

    if (p.health <= 0) {
      this.handlePlayerDeath();
    }
  }

  private handlePlayerDeath() {
    if (this.isPlayerDead) return;
    this.isPlayerDead = true;

    this.player.lives -= 1;
    audio.playGameOver();
    this.triggerScreenShake(10, 0.4);
    this.addParticle(this.player.x + 13, this.player.y + 16, '#ef4444', 'rubble', 12);

    if (this.player.lives <= 0) {
      if (this.onGameOver) {
        this.onGameOver();
      }
    } else {
      setTimeout(() => {
        this.respawnPlayer();
      }, 900);
    }
  }

  // --- COLLECTIBLES ---
  private updateCollectibles(dt: number) {
    const p = this.player;

    for (const c of this.level.collectibles) {
      if (c.collected) continue;

      // Bobbing & coin spin animation
      c.animTimer += dt;
      if (c.animTimer > 0.12) {
        c.animTimer = 0;
        c.animFrame = (c.animFrame + 1) % 4;
      }
      c.bobOffset = Math.sin(Date.now() / 250 + c.x) * 3;
      c.y = c.baseY + c.bobOffset;

      if (
        p.x < c.x + c.width &&
        p.x + p.width > c.x &&
        p.y < c.y + c.height &&
        p.y + p.height > c.y
      ) {
        c.collected = true;

        if (c.type === 'coin') {
          this.coins += 1;
          this.score += 100;
          audio.playCoin();
          this.addFloatingText(c.x, c.y - 12, '+100', '#facc15');
          this.addParticle(c.x + 10, c.y + 10, '#facc15', 'spark', 6);
        } else if (c.type === 'heart') {
          if (p.health < p.maxHealth) {
            p.health++;
            audio.playPowerUp();
            this.addFloatingText(c.x, c.y - 12, '+1 HP', '#ef4444');
          } else {
            this.score += 300;
            audio.playCoin();
            this.addFloatingText(c.x, c.y - 12, '+300', '#facc15');
          }
          this.addParticle(c.x + 10, c.y + 10, '#ef4444', 'star', 6);
        } else if (c.type.startsWith('powerup_')) {
          audio.playPowerUp();
          const powerType = c.type === 'powerup_speed' ? 'speed' : c.type === 'powerup_jump' ? 'high_jump' : 'shield';
          p.powerUp = {
            type: powerType,
            remainingTime: 14,
            duration: 14,
          };
          const title = powerType === 'speed' ? 'SPEED BOOST!' : powerType === 'high_jump' ? 'HIGH JUMP!' : 'INVINCIBLE!';
          const color = powerType === 'speed' ? '#38bdf8' : powerType === 'high_jump' ? '#fde047' : '#c084fc';
          this.addFloatingText(c.x - 10, c.y - 16, title, color);
          this.addParticle(c.x + 10, c.y + 10, color, 'star', 8);
        }
      }
    }
  }

  // --- CHECKPOINTS & GOAL ---
  private updateCheckpoints() {
    const p = this.player;

    for (const cp of this.level.checkpoints) {
      if (!cp.isReached) {
        if (
          p.x < cp.x + cp.width &&
          p.x + p.width > cp.x &&
          p.y < cp.y + cp.height &&
          p.y + p.height > cp.y
        ) {
          cp.isReached = true;
          audio.playCheckpoint();
          this.addFloatingText(cp.x - 16, cp.y - 20, 'CHECKPOINT!', '#22c55e');
          this.addParticle(cp.x + 15, cp.y + 20, '#22c55e', 'star', 10);
        }
      }
    }
  }

  private updateGoal() {
    const p = this.player;
    const goal = this.level.goal;

    if (
      p.x < goal.x + goal.width - 6 &&
      p.x + p.width > goal.x + 6 &&
      p.y < goal.y + goal.height &&
      p.y + p.height > goal.y + 8
    ) {
      this.isLevelCompleted = true;
      audio.playLevelClear();
      this.addParticle(goal.x + goal.width / 2, goal.y + goal.height / 2, '#818cf8', 'star', 25);

      const timeBonus = Math.floor(this.timeLeft) * 20;
      const coinBonus = this.coins * 50;
      const totalScore = this.score + timeBonus + coinBonus;

      // Calculate star rating:
      // 1 star: finish level
      // 2 stars: finish with > 50% coins
      // 3 stars: finish with > 80% coins and > 30s remaining
      const totalCoinsInLevel = this.level.collectibles.filter(c => c.type === 'coin').length;
      let stars = 1;
      if (this.coins >= Math.floor(totalCoinsInLevel * 0.5)) stars = 2;
      if (this.coins >= Math.floor(totalCoinsInLevel * 0.8) && this.timeLeft >= 30) stars = 3;

      if (this.onLevelClear) {
        this.onLevelClear({
          score: this.score,
          coins: this.coins,
          timeBonus,
          totalScore,
          stars,
        });
      }
    }
  }

  // --- PARTICLES & FLOATING TEXTS ---
  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life -= dt;
      if (pt.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vy += 0.15; // particle gravity
      pt.alpha = pt.life / pt.maxLife;
    }
  }

  private updateFloatingTexts(dt: number) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }
      ft.y -= 35 * dt; // float upwards
    }
  }

  // --- CAMERA LERP & BOUNDS ---
  private updateCamera() {
    const targetCameraX = this.player.x - this.viewWidth / 2 + (this.player.facing === 'right' ? 40 : -40);
    this.cameraX += (targetCameraX - this.cameraX) * 0.1;
    this.cameraX = Math.max(0, Math.min(this.level.width - this.viewWidth, this.cameraX));

    // Vertical camera with gentle following
    const targetCameraY = this.player.y - this.viewHeight / 2 - 20;
    this.cameraY += (targetCameraY - this.cameraY) * 0.08;
    this.cameraY = Math.max(0, Math.min(this.level.height - this.viewHeight, this.cameraY));
  }

  // --- HIGH FIDELITY RETRO CANVAS RENDERING ---
  public render(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.viewWidth = width;
    this.viewHeight = height;

    ctx.save();

    // Screen Shake apply
    let shakeX = 0;
    let shakeY = 0;
    if (this.screenShakeTimer > 0) {
      shakeX = (Math.random() - 0.5) * this.screenShakeIntensity;
      shakeY = (Math.random() - 0.5) * this.screenShakeIntensity;
      ctx.translate(shakeX, shakeY);
    }

    // 1. Draw Parallax Backgrounds
    this.renderBackground(ctx, width, height);

    // Apply Camera translation
    ctx.translate(-Math.round(this.cameraX), -Math.round(this.cameraY));

    // 2. Render Checkpoints
    this.renderCheckpoints(ctx);

    // 3. Render Goal Portal
    this.renderGoalPortal(ctx);

    // 4. Render Tile Blocks
    this.renderBlocks(ctx);

    // 5. Render Moving Platforms
    this.renderMovingPlatforms(ctx);

    // 6. Render Collectibles
    this.renderCollectibles(ctx);

    // 7. Render Enemies
    this.renderEnemies(ctx);

    // 8. Render Player
    this.renderPlayer(ctx);

    // 9. Render Particles
    this.renderParticles(ctx);

    // 10. Render Floating Texts
    this.renderFloatingTexts(ctx);

    ctx.restore();
  }

  private renderBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const theme = this.level.theme;

    if (theme === 'grass') {
      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(0.7, '#7dd3fc');
      grad.addColorStop(1, '#bae6fd');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Distant rolling green hills (Layer 1 - 0.2 speed)
      ctx.fillStyle = '#86efac';
      ctx.beginPath();
      const offset1 = (this.cameraX * 0.15) % 400;
      for (let x = -offset1 - 400; x < width + 400; x += 300) {
        ctx.arc(x, height - 60, 220, Math.PI, 0, false);
      }
      ctx.fill();

      // Closer rolling hills (Layer 2 - 0.4 speed)
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      const offset2 = (this.cameraX * 0.35) % 300;
      for (let x = -offset2 - 300; x < width + 300; x += 220) {
        ctx.arc(x, height - 30, 160, Math.PI, 0, false);
      }
      ctx.fill();

      // Pixel Clouds (Layer 3 - 0.1 speed)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      const cloudOffset = (this.cameraX * 0.08 + Date.now() * 0.01) % (width + 300);
      this.drawPixelCloud(ctx, (100 - cloudOffset + width * 2) % (width + 300), 50);
      this.drawPixelCloud(ctx, (380 - cloudOffset + width * 2) % (width + 300), 90);
      this.drawPixelCloud(ctx, (680 - cloudOffset + width * 2) % (width + 300), 40);
    } else if (theme === 'forest') {
      // Twilight mystical purple-blue gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#1e1b4b');
      grad.addColorStop(1, '#312e81');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Distant silhouetted giant forest trees
      ctx.fillStyle = '#1e1b4b';
      const offset1 = (this.cameraX * 0.2) % 200;
      for (let x = -offset1 - 200; x < width + 200; x += 140) {
        ctx.fillRect(x + 50, height - 260, 30, 260);
        ctx.beginPath();
        ctx.arc(x + 65, height - 260, 60, 0, Math.PI * 2);
        ctx.fill();
      }

      // Midground trees
      ctx.fillStyle = '#064e3b';
      const offset2 = (this.cameraX * 0.4) % 180;
      for (let x = -offset2 - 180; x < width + 180; x += 110) {
        ctx.fillRect(x + 35, height - 200, 20, 200);
        ctx.beginPath();
        ctx.arc(x + 45, height - 200, 45, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme === 'lava') {
      // Dark fiery volcanic cavern
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#18181b');
      grad.addColorStop(0.5, '#450a0a');
      grad.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Jagged volcanic stalactites from ceiling
      ctx.fillStyle = '#1c1917';
      const offsetCeiling = (this.cameraX * 0.15) % 120;
      for (let x = -offsetCeiling; x < width + 120; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 30, 70);
        ctx.lineTo(x + 60, 0);
        ctx.fill();
      }

      // Magma glow at bottom
      const magmaGrad = ctx.createLinearGradient(0, height - 70, 0, height);
      magmaGrad.addColorStop(0, 'rgba(234, 88, 12, 0)');
      magmaGrad.addColorStop(1, 'rgba(239, 68, 68, 0.7)');
      ctx.fillStyle = magmaGrad;
      ctx.fillRect(0, height - 70, width, 70);
    }
  }

  private drawPixelCloud(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillRect(x, y, 70, 18);
    ctx.fillRect(x + 12, y - 10, 45, 14);
    ctx.fillRect(x + 22, y - 16, 25, 12);
  }

  private renderBlocks(ctx: CanvasRenderingContext2D) {
    const tileGrass = sprites.get('tile_grass');
    const tileForest = sprites.get('tile_forest');
    const tileLava = sprites.get('tile_lava');
    const tileMystery = sprites.get('tile_mystery');
    const tileEmpty = sprites.get('tile_empty');
    const tileBrick = sprites.get('tile_brick');
    const tileSpike = sprites.get('tile_spike');
    const tileSpring = sprites.get('tile_spring');
    const tileCrumbling = sprites.get('tile_crumbling');

    for (const b of this.level.blocks) {
      // Frustum culling
      if (b.x + b.width < this.cameraX - 50 || b.x > this.cameraX + this.viewWidth + 50) continue;

      if (b.type === 'crumbling' && b.isFallen) continue;

      const drawY = b.y + (b.bumpOffset || 0);

      if (b.type === 'solid') {
        const sprite = b.theme === 'forest' ? tileForest : b.theme === 'lava' ? tileLava : tileGrass;
        if (sprite) {
          ctx.drawImage(sprite, b.x, drawY, b.width, b.height);
        } else {
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(b.x, drawY, b.width, b.height);
        }
      } else if (b.type.startsWith('mystery_')) {
        if (tileMystery) {
          ctx.drawImage(tileMystery, b.x, drawY, b.width, b.height);
        }
      } else if (b.type === 'empty_block') {
        if (tileEmpty) {
          ctx.drawImage(tileEmpty, b.x, drawY, b.width, b.height);
        }
      } else if (b.type === 'breakable_brick') {
        if (tileBrick) {
          ctx.drawImage(tileBrick, b.x, drawY, b.width, b.height);
        }
      } else if (b.type === 'spike') {
        if (tileSpike) {
          ctx.drawImage(tileSpike, b.x, b.y, b.width, b.height);
        }
      } else if (b.type === 'spring') {
        if (tileSpring) {
          ctx.drawImage(tileSpring, b.x, b.y, b.width, b.height);
        }
      } else if (b.type === 'crumbling') {
        if (tileCrumbling) {
          let shakeOffset = 0;
          if (b.crumbleTimer && b.crumbleTimer > 0) {
            shakeOffset = (Math.random() - 0.5) * 4;
          }
          ctx.drawImage(tileCrumbling, b.x + shakeOffset, b.y, b.width, b.height);
        }
      }
    }
  }

  private renderMovingPlatforms(ctx: CanvasRenderingContext2D) {
    for (const mp of this.level.movingPlatforms) {
      if (mp.x + mp.width < this.cameraX - 50 || mp.x > this.cameraX + this.viewWidth + 50) continue;

      ctx.fillStyle = mp.theme === 'forest' ? '#1e293b' : mp.theme === 'lava' ? '#451a03' : '#b45309';
      ctx.fillRect(mp.x, mp.y, mp.width, mp.height);

      // Top highlighted trim
      ctx.fillStyle = mp.theme === 'forest' ? '#64748b' : mp.theme === 'lava' ? '#f97316' : '#f59e0b';
      ctx.fillRect(mp.x, mp.y, mp.width, 4);

      // Rivets
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(mp.x + 4, mp.y + 8, 4, 4);
      ctx.fillRect(mp.x + mp.width - 8, mp.y + 8, 4, 4);
    }
  }

  private renderCollectibles(ctx: CanvasRenderingContext2D) {
    for (const c of this.level.collectibles) {
      if (c.collected) continue;
      if (c.x + c.width < this.cameraX - 50 || c.x > this.cameraX + this.viewWidth + 50) continue;

      let sprite: HTMLCanvasElement | null = null;
      if (c.type === 'coin') {
        sprite = sprites.get(`collectible_coin_${c.animFrame}`);
      } else if (c.type === 'heart') {
        sprite = sprites.get('collectible_heart');
      } else if (c.type === 'powerup_speed') {
        sprite = sprites.get('collectible_powerup_speed');
      } else if (c.type === 'powerup_jump') {
        sprite = sprites.get('collectible_powerup_jump');
      } else if (c.type === 'powerup_shield') {
        sprite = sprites.get('collectible_powerup_shield');
      }

      if (sprite) {
        ctx.drawImage(sprite, c.x, c.y, c.width, c.height);
      }
    }
  }

  private renderEnemies(ctx: CanvasRenderingContext2D) {
    for (const enemy of this.level.enemies) {
      if (!enemy.isAlive && !enemy.isSquashed) continue;
      if (enemy.x + enemy.width < this.cameraX - 50 || enemy.x > this.cameraX + this.viewWidth + 50) continue;

      ctx.save();
      ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);

      if (enemy.facing === 'left') {
        ctx.scale(-1, 1);
      }

      let spriteKey = '';
      if (enemy.isSquashed) {
        spriteKey = `enemy_${enemy.type}_squashed`;
      } else {
        spriteKey = `enemy_${enemy.type}_${enemy.animFrame}`;
      }

      const sprite = sprites.get(spriteKey) || sprites.get(`enemy_slime_0`);
      if (sprite) {
        ctx.drawImage(sprite, -enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
      }

      ctx.restore();
    }
  }

  private renderCheckpoints(ctx: CanvasRenderingContext2D) {
    for (const cp of this.level.checkpoints) {
      const spriteKey = cp.isReached ? 'checkpoint_flag_1' : 'checkpoint_flag_0';
      const sprite = sprites.get(spriteKey);
      if (sprite) {
        ctx.drawImage(sprite, cp.x, cp.y, cp.width, cp.height);
      }
    }
  }

  private renderGoalPortal(ctx: CanvasRenderingContext2D) {
    const goal = this.level.goal;
    const sprite = sprites.get('goal_portal');

    ctx.save();
    ctx.translate(goal.x + goal.width / 2, goal.y + goal.height / 2);

    // Rotating mystical cosmic glow
    const angle = Date.now() * 0.002;
    ctx.rotate(angle);

    if (sprite) {
      ctx.drawImage(sprite, -goal.width / 2, -goal.height / 2, goal.width, goal.height);
    }
    ctx.restore();
  }

  private renderPlayer(ctx: CanvasRenderingContext2D) {
    const p = this.player;

    // Invulnerability blink
    if (p.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      return;
    }

    ctx.save();
    ctx.translate(p.x + p.width / 2, p.y + p.height / 2);

    // Flip horizontally when facing left
    if (p.facing === 'left') {
      ctx.scale(-1, 1);
    }

    // Squash & stretch
    ctx.scale(p.squashX, p.squashY);

    // Get current animation sprite
    let spriteKey = 'player_idle_0';
    if (this.isPlayerDead) {
      spriteKey = 'player_hurt';
    } else if (p.invulnerableTimer > 0) {
      spriteKey = 'player_hurt';
    } else if (!p.onGround) {
      spriteKey = p.vy < 0 ? 'player_jump' : 'player_fall';
    } else if (p.animState === 'walk' || p.animState === 'run') {
      spriteKey = `player_walk_${p.animFrame}`;
    } else {
      spriteKey = `player_idle_${p.animFrame}`;
    }

    const sprite = sprites.get(spriteKey);
    if (sprite) {
      ctx.drawImage(sprite, -p.width / 2 - 3, -p.height / 2 - 2, p.width + 6, p.height + 4);
    }

    // Power-up glowing aura
    if (p.powerUp) {
      ctx.strokeStyle = p.powerUp.type === 'speed' ? '#38bdf8' : p.powerUp.type === 'high_jump' ? '#fde047' : '#c084fc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, p.width * 0.8, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  private renderParticles(ctx: CanvasRenderingContext2D) {
    for (const pt of this.particles) {
      ctx.fillStyle = pt.color;
      ctx.globalAlpha = Math.max(0, pt.alpha);
      if (pt.type === 'star') {
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
        ctx.fillRect(pt.x - 1, pt.y - 1, pt.size + 2, pt.size + 2);
      } else {
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
      }
    }
    ctx.globalAlpha = 1;
  }

  private renderFloatingTexts(ctx: CanvasRenderingContext2D) {
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';

    for (const ft of this.floatingTexts) {
      const alpha = Math.max(0, ft.life / ft.maxLife);
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = alpha;
      // Outline
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 3;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.globalAlpha = 1;
  }
}
