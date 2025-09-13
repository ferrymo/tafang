// 游戏配置文件
export const GAME_CONFIG = {
    // 画布尺寸
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    
    // 游戏初始数据
    INITIAL_HEALTH: 100,
    INITIAL_MONEY: 500,
    INITIAL_WAVE: 1,
    WAVE_REWARD: 100,
    
    // 游戏路径
    GAME_PATH: [
        {x: 0, y: 300},
        {x: 150, y: 300},
        {x: 150, y: 150},
        {x: 350, y: 150},
        {x: 350, y: 450},
        {x: 550, y: 450},
        {x: 550, y: 100},
        {x: 700, y: 100},
        {x: 700, y: 350},
        {x: 800, y: 350}
    ],
    
    // 波次配置
    WAVE_CONFIG: {
        1: {enemies: 10, enemyType: 'basic', interval: 1000},
        2: {enemies: 15, enemyType: 'fast', interval: 800},
        3: {enemies: 20, enemyType: 'tank', interval: 1200}
    },
    
    // 防御塔配置
    TOWER_CONFIG: {
        basic: {
            damage: 25,
            range: 100,
            fireRate: 1000,
            cost: 50,
            color: '#FF8A50',
            size: 15
        },
        rapid: {
            damage: 15,
            range: 80,
            fireRate: 400,
            cost: 100,
            color: '#50B7FF',
            size: 12
        },
        heavy: {
            damage: 60,
            range: 120,
            fireRate: 2000,
            cost: 200,
            color: '#A050FF',
            size: 20
        }
    },
    
    // 敌人配置
    ENEMY_CONFIG: {
        basic: {
            health: 50,
            speed: 1,
            reward: 10,
            damage: 1,
            score: 10,
            color: '#FF6B6B',
            size: 12
        },
        fast: {
            health: 30,
            speed: 2,
            reward: 15,
            damage: 1,
            score: 15,
            color: '#4ECDC4',
            size: 10
        },
        tank: {
            health: 150,
            speed: 0.5,
            reward: 25,
            damage: 3,
            score: 25,
            color: '#45B7D1',
            size: 18
        }
    },
    
    // 子弹配置
    BULLET_CONFIG: {
        basic: {
            color: '#FFD700',
            size: 3,
            speed: 5
        },
        rapid: {
            color: '#00BFFF',
            size: 2,
            speed: 7
        },
        heavy: {
            color: '#FF4500',
            size: 5,
            speed: 3
        }
    },
    
    // 粒子配置
    PARTICLE_CONFIG: {
        explosion: {
            color: '#FF6B35',
            minSize: 3,
            maxSize: 9,
            speedRange: 6,
            life: 40
        },
        hit: {
            color: '#FFD700',
            minSize: 2,
            maxSize: 5,
            speedRange: 4,
            life: 25
        },
        smoke: {
            color: '#888888',
            minSize: 2,
            maxSize: 6,
            speedRange: 2,
            life: 60
        }
    },
    
    // 游戏常量
    CONSTANTS: {
        PATH_COLLISION_DISTANCE: 40,
        TOWER_COLLISION_DISTANCE: 50,
        TOWER_PLACEMENT_MARGIN: 30,
        BULLET_HIT_DISTANCE: 5,
        ENEMY_WAYPOINT_DISTANCE: 5
    }
};