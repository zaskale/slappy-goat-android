/**
 * Slappy Goat — polished portrait mobile Flappy-style game (Three.js)
 */
import * as THREE from './lib/three.module.js';

// ─── Config ───────────────────────────────────────────────────────────────────
const CFG = {
  gravity: 27.5,
  flapImpulse: 9.5,
  maxFallSpeed: 15.5,
  maxRiseSpeed: 11.2,
  goatX: -1.35,
  goatRadius: 0.42,
  pipeGap: 2.72,
  pipeWidth: 1.08,
  pipeDepth: 1.0,
  pipeSpeed: 4.25,
  pipeSpawnInterval: 1.62,
  pipeStartX: 7.4,
  groundY: -5.4,
  ceilingY: 5.55,
  // Pipes extend past the visible playfield so tops/bottoms never “float” mid-screen
  pipeTopY: 12.5,
  pipeBotY: -9.5,
  scoreX: -0.35,
  nearMissPad: 0.18,
};

const KEYS = {
  best: 'slappy-goat-best',
  runs: 'slappy-goat-runs',
  settings: 'slappy-goat-settings',
  tutored: 'slappy-goat-tutored',
  owned: 'slappy-goat-owned-rewards',
  inventory: 'slappy-goat-inventory',
  spins: 'slappy-goat-pending-spins',
  unlocked: 'slappy-goat-unlocked-gear',
  equipped: 'slappy-goat-equipped',
  unlockedThemes: 'slappy-goat-unlocked-themes',
};

/** Animated scenery themes (picked from menu) */
const THEMES = {
  meadow: {
    id: 'meadow',
    name: 'Meadow Day',
    emoji: '🌤️',
    blurb: 'Sunny hills & soft clouds',
    skyTop: '#163566',
    skyMid: '#4a7fb5',
    skyBot: '#f5b48a',
    skyDrift: true,
    ground: 0x3d8b4f,
    groundStrip: 0x2d6b3c,
    groundEdge: 0x5cb86e,
    hill: [0x2f6e48, 0x3a8055, 0x265a3a, 0x347850],
    grass: 0x4caf62,
    treeTrunk: 0x6b4423,
    treeLeaf: [0x2d8a4e, 0x3aa35c, 0x247a42],
    sunColor: 0xffe0a0,
    sunGlow: 0xffb060,
    sunVisible: true,
    moonVisible: false,
    starsOpacity: 0.28,
    fireflies: true,
    balloons: true,
    birds: true,
    ambient: 0xffe8d4,
    pipe: { h: 0.45, s: 0.72, l: 0.48, emissive: 0x0a5c48, cap: 0x34e0b5, rim: 0x5eead4 },
  },
  night: {
    id: 'night',
    name: 'Night Pasture',
    emoji: '🌙',
    blurb: 'Moonlit fields & fireflies',
    skyTop: '#050816',
    skyMid: '#1a2744',
    skyBot: '#3a2a4a',
    skyDrift: true,
    ground: 0x1a3d28,
    groundStrip: 0x122a1c,
    groundEdge: 0x2a5a3a,
    hill: [0x153525, 0x1a3f2c, 0x102818, 0x1f4632],
    grass: 0x2a6b40,
    treeTrunk: 0x3a2818,
    treeLeaf: [0x1a4a30, 0x245a3a, 0x163828],
    sunColor: 0xdde8ff,
    sunGlow: 0x88aaff,
    sunVisible: false,
    moonVisible: true,
    starsOpacity: 0.85,
    fireflies: true,
    balloons: false,
    birds: false,
    ambient: 0x6688bb,
    pipe: { h: 0.55, s: 0.55, l: 0.42, emissive: 0x1a3a6a, cap: 0x5b8def, rim: 0x93c5fd },
  },
  sunset: {
    id: 'sunset',
    name: 'Golden Hour',
    emoji: '🌅',
    blurb: 'Warm sky, long shadows',
    skyTop: '#2a1850',
    skyMid: '#c45c3a',
    skyBot: '#ffb070',
    skyDrift: true,
    ground: 0x4a6b38,
    groundStrip: 0x3a552c,
    groundEdge: 0x6a8b48,
    hill: [0x3a5530, 0x4a6538, 0x2a4028, 0x556b3a],
    grass: 0x6a8f40,
    treeTrunk: 0x5a3820,
    treeLeaf: [0x4a6a30, 0x5a7a38, 0x3a5528],
    sunColor: 0xff9060,
    sunGlow: 0xff6040,
    sunVisible: true,
    moonVisible: false,
    starsOpacity: 0.15,
    fireflies: true,
    balloons: true,
    birds: true,
    ambient: 0xffc9a0,
    pipe: { h: 0.08, s: 0.7, l: 0.52, emissive: 0x5a2010, cap: 0xff9a5c, rim: 0xffd166 },
  },
  snow: {
    id: 'snow',
    name: 'Snow Peaks',
    emoji: '❄️',
    blurb: 'Icy hills & pale sky',
    skyTop: '#6a8ab0',
    skyMid: '#a8c4e0',
    skyBot: '#e8f0f8',
    skyDrift: true,
    ground: 0xd8e8f0,
    groundStrip: 0xc0d4e0,
    groundEdge: 0xeef6fc,
    hill: [0xb8c8d8, 0xc8d8e8, 0xa8b8c8, 0xd0dce8],
    grass: 0xc8dce8,
    treeTrunk: 0x5a4030,
    treeLeaf: [0xd8ecf4, 0xe8f4fc, 0xc0d8e8],
    sunColor: 0xfff8e8,
    sunGlow: 0xffe8c0,
    sunVisible: true,
    moonVisible: false,
    starsOpacity: 0.1,
    fireflies: false,
    balloons: true,
    birds: true,
    ambient: 0xdde8ff,
    pipe: { h: 0.55, s: 0.35, l: 0.62, emissive: 0x2a4060, cap: 0x8eb8e0, rim: 0xc8e4ff },
  },
  desert: {
    id: 'desert',
    name: 'Desert Dunes',
    emoji: '🏜️',
    blurb: 'Sand, heat haze & cacti',
    skyTop: '#3a6a9a',
    skyMid: '#7ab0d0',
    skyBot: '#f0c878',
    skyDrift: true,
    ground: 0xc4a060,
    groundStrip: 0xb09050,
    groundEdge: 0xd4b878,
    hill: [0xb89050, 0xc8a060, 0xa88040, 0xd0a868],
    grass: 0x8a9a40,
    treeTrunk: 0x5a6a30,
    treeLeaf: [0x3a8a40, 0x2a7a38, 0x4a9a48],
    sunColor: 0xffe080,
    sunGlow: 0xffc040,
    sunVisible: true,
    moonVisible: false,
    starsOpacity: 0.05,
    fireflies: false,
    balloons: false,
    birds: true,
    ambient: 0xffe0b0,
    pipe: { h: 0.12, s: 0.55, l: 0.48, emissive: 0x4a3010, cap: 0xd4a060, rim: 0xffd090 },
  },
  neon: {
    id: 'neon',
    name: 'Neon Night',
    emoji: '🌃',
    blurb: 'Cyber sky & glow pipes',
    skyTop: '#0a0418',
    skyMid: '#1a0a38',
    skyBot: '#401060',
    skyDrift: true,
    ground: 0x1a1230,
    groundStrip: 0x120c22,
    groundEdge: 0x2a1a48,
    hill: [0x1a1040, 0x221850, 0x140c30, 0x2a1a58],
    grass: 0x3a2a6a,
    treeTrunk: 0x2a1840,
    treeLeaf: [0x8a30d0, 0x40c0ff, 0xff40a0],
    sunColor: 0xff60d0,
    sunGlow: 0x8040ff,
    sunVisible: false,
    moonVisible: true,
    starsOpacity: 0.7,
    fireflies: true,
    balloons: true,
    birds: false,
    ambient: 0x8060c0,
    pipe: { h: 0.85, s: 0.9, l: 0.55, emissive: 0x4a0080, cap: 0xd060ff, rim: 0x60ffe0 },
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk District',
    emoji: '🌆',
    blurb: 'Holo rain · neon grid · max flash',
    requiresUnlock: true,
    skyTop: '#050018',
    skyMid: '#1a0548',
    skyBot: '#ff2d95',
    skyDrift: true,
    ground: 0x0a0618,
    groundStrip: 0x12082a,
    groundEdge: 0xff2d95,
    hill: [0x0c0830, 0x1a0a40, 0x08061c, 0x221050],
    grass: 0x00f0ff,
    treeTrunk: 0x1a1030,
    treeLeaf: [0xff2d95, 0x00f0ff, 0xb400ff],
    sunColor: 0x00f0ff,
    sunGlow: 0xff2d95,
    sunVisible: false,
    moonVisible: true,
    starsOpacity: 0.95,
    fireflies: true,
    balloons: true,
    birds: false,
    ambient: 0xff60c0,
    // Neon multi-hue pipes — each pair picks from neonHues
    pipe: {
      h: 0.92,
      s: 1.0,
      l: 0.58,
      emissive: 0xff0080,
      cap: 0x00f0ff,
      rim: 0xffe066,
      neon: true,
      neonHues: [0.92, 0.55, 0.78, 0.12, 0.0, 0.45], // magenta, cyan, purple, yellow, red, green
      emissiveIntensity: 0.95,
    },
  },
};

/** Collectible junk rewards — one Vegas spin every 5 pipes */
const REWARDS = [
  { id: 'aluminum-can', name: 'Aluminum Can', img: 'assets/rewards/Aluminum Can.png', colorA: '#7ec8e3', colorB: '#2a5a6e',
    desc: 'Still sticky. Still redeemable for 5¢ if you believe hard enough.' },
  { id: 'apple-core', name: 'Apple Core', img: 'assets/rewards/Apple Core.png', colorA: '#c0c8d0', colorB: '#4a5560',
    desc: 'Someone already ate the good part. You got the philosophy.' },
  { id: 'bad-egg', name: 'Bad Egg', img: 'assets/rewards/Bad Egg.png', colorA: '#d4a574', colorB: '#4a3020',
    desc: 'Looks fine. Smells like a war crime. Do not scramble.' },
  { id: 'bag-of-garbage', name: 'Bag of Garbage', img: 'assets/rewards/Bag of Garbage.png', colorA: '#b07040', colorB: '#3a2010',
    desc: 'Spelling optional. Smell mandatory. Peak goat couture.' },
  { id: 'banana', name: 'Banana', img: 'assets/rewards/Banana.png', colorA: '#6bcf6b', colorB: '#2a5a20',
    desc: 'Potassium with commitment issues. Slippery when moral.' },
  { id: 'bee', name: 'Bee', img: 'assets/rewards/Bee.png', colorA: '#d4b896', colorB: '#6a4a28',
    desc: 'Busy, buzzed, and slightly offended you collected it.' },
  { id: 'board-with-nails', name: 'Board with Nails', img: 'assets/rewards/Board with Nails.png', colorA: '#ffd166', colorB: '#8a6020',
    desc: 'Home renovation, but personal. Tetanus: included free.' },
  { id: 'box-of-lo-mein', name: 'Box of Lo Mein', img: 'assets/rewards/Box of Lo Mein.png', colorA: '#c8b8a8', colorB: '#5a4a40',
    desc: 'Cold noodles, warm regret. Still somehow delicious.' },
  { id: 'broken-comb', name: 'Broken Comb', img: 'assets/rewards/Broken Comb.png', colorA: '#e8e0d0', colorB: '#6a6558',
    desc: 'Hair? Never heard of her. Style? Pure chaos.' },
  { id: 'broken-egg', name: 'Broken Egg', img: 'assets/rewards/Broken Egg.png', colorA: '#f0a0c0', colorB: '#603040',
    desc: 'Not sunny-side. Not any side. Just sadness with shell.' },
  { id: 'broken-glass', name: 'Broken Glass', img: 'assets/rewards/Broken Glass.png', colorA: '#5ad46a', colorB: '#c04050',
    desc: 'Sparkly danger confetti. Handle with hooves of caution.' },
  { id: 'broken-iphone', name: 'Broken iPhone', img: 'assets/rewards/Broken iPhone.png', colorA: '#ffb060', colorB: '#8a3020',
    desc: 'Still on 3% battery somehow. Notifications from 2019.' },
  { id: 'broken-pipe', name: 'Broken Pipe', img: 'assets/rewards/Broken Pipe.png', colorA: '#f0a070', colorB: '#6a3020',
    desc: 'Plumbing problems you can hold. Metaphorical and literal.' },
  { id: 'burnt-toast', name: 'Burnt Toast', img: 'assets/rewards/Burnt Toast.png', colorA: '#e8c060', colorB: '#5a3018',
    desc: 'Crispy tragedy. Charcoal notes with a hint of smoke alarm.' },
  { id: 'burrito', name: 'Burrito', img: 'assets/rewards/Burrito.png', colorA: '#d8d0c0', colorB: '#4a4840',
    desc: 'A soft cylinder of secrets. Possibly beans. Possibly destiny.' },
  { id: 'butterfly', name: 'Butterfly', img: 'assets/rewards/Butterfly.png', colorA: '#8a9ab0', colorB: '#2a3040',
    desc: 'Fluttered into your collection. Instant +10 vibe.' },
  { id: 'car-tire', name: 'Car Tire', img: 'assets/rewards/Car Tire.png', colorA: '#e8d8b0', colorB: '#6a5a38',
    desc: 'Round, heavy, and deeply uninterested in rolling for free.' },
  { id: 'caterpillar', name: 'Caterpillar', img: 'assets/rewards/Caterpillar.png', colorA: '#f080c0', colorB: '#602040',
    desc: 'Future butterfly energy. Present: tiny fluff noodle.' },
  { id: 'chair-of-regret', name: 'Chair of Regret', img: 'assets/rewards/Chair of Regret.png', colorA: '#f0f0e8', colorB: '#6a6a50',
    desc: 'Sit and reflect on every life choice. Or just trip over it.' },
  { id: 'chinese-food', name: 'Chinese Food', img: 'assets/rewards/Chinese Food.png', colorA: '#a8d8e8', colorB: '#305060',
    desc: 'Fortune cookie said \'you will collect trash.\' Accurate.' },
  { id: 'cinderblock', name: 'Cinderblock', img: 'assets/rewards/Cinderblock.png', colorA: '#7ec8e3', colorB: '#2a5a6e',
    desc: 'Heavy. Rectangular. Emotionally unavailable. Perfect.' },
  { id: 'coconut', name: 'Coconut', img: 'assets/rewards/Coconut.png', colorA: '#c0c8d0', colorB: '#4a5560',
    desc: 'Hard exterior, soft drama. Requires commitment (and a tool).' },
  { id: 'covid', name: 'COVID', img: 'assets/rewards/COVID.png', colorA: '#d4a574', colorB: '#4a3020',
    desc: 'Please don\'t lick this one. Collectible plague iconography.' },
  { id: 'crumpled-cup', name: 'Crumpled Cup', img: 'assets/rewards/Crumpled Cup.png', colorA: '#b07040', colorB: '#3a2010',
    desc: 'Once held coffee. Now holds disappointment and ants.' },
  { id: 'crumpled-napkin', name: 'Crumpled Napkin', img: 'assets/rewards/Crumpled Napkin.png', colorA: '#6bcf6b', colorB: '#2a5a20',
    desc: 'Wiped something. Nobody wants to know what.' },
  { id: 'crystals', name: 'Crystals', img: 'assets/rewards/Crystals.png', colorA: '#d4b896', colorB: '#6a4a28',
    desc: 'Sparkly rocks that promise healing and deliver dust.' },
  { id: 'dc-motor', name: 'DC Motor', img: 'assets/rewards/DC Motor.png', colorA: '#ffd166', colorB: '#8a6020',
    desc: 'Spins when motivated. Currently unmotivated.' },
  { id: 'diaper', name: 'Diaper', img: 'assets/rewards/Diaper.png', colorA: '#c8b8a8', colorB: '#5a4a40',
    desc: 'Used? Unknown. Sacred? Absolutely. Keep your distance.' },
  { id: 'donut', name: 'Donut', img: 'assets/rewards/Donut.png', colorA: '#e8e0d0', colorB: '#6a6558',
    desc: 'Hole included at no extra charge. Glaze fighting gravity.' },
  { id: 'duct-tape', name: 'Duct Tape', img: 'assets/rewards/Duct Tape.png', colorA: '#f0a0c0', colorB: '#603040',
    desc: 'Fixes everything except the reason you needed duct tape.' },
  { id: 'empty-jug', name: 'Empty Jug', img: 'assets/rewards/Empty Jug.png', colorA: '#5ad46a', colorB: '#c04050',
    desc: 'Full of emptiness. Hydration for ghosts.' },
  { id: 'empty-old-box', name: 'Empty Old Box', img: 'assets/rewards/Empty Old Box.png', colorA: '#ffb060', colorB: '#8a3020',
    desc: 'Former mystery. Current empty. Still collecting dust like a pro.' },
  { id: 'eww-cream', name: 'Eww Cream', img: 'assets/rewards/Eww Cream.png', colorA: '#f0a070', colorB: '#6a3020',
    desc: 'Lotion for people who hate joy. Texture: wrong.' },
  { id: 'expired-milk', name: 'Expired Milk', img: 'assets/rewards/Expired Milk.png', colorA: '#e8c060', colorB: '#5a3018',
    desc: 'Past its prime by several philosophical eras. Solidly liquid.' },
  { id: 'fancy-fries', name: 'Fancy Fries', img: 'assets/rewards/Fancy Fries.png', colorA: '#d8d0c0', colorB: '#4a4840',
    desc: 'Elevated potato. Seasoned like it has a trust fund.' },
  { id: 'flies-in-a-jar', name: 'Flies in a Jar', img: 'assets/rewards/Flies in a Jar.png', colorA: '#8a9ab0', colorB: '#2a3040',
    desc: 'A tiny ecosystem of bad vibes. Do not open. Do open. Chaos either way.' },
  { id: 'fries', name: 'Fries', img: 'assets/rewards/Fries.png', colorA: '#e8d8b0', colorB: '#6a5a38',
    desc: 'Classic. Greasy. Best eaten three hours ago.' },
  { id: 'ginger-root', name: 'Ginger Root', img: 'assets/rewards/Ginger Root.png', colorA: '#f080c0', colorB: '#602040',
    desc: 'Spicy root of courage. Looks like a goblin hand. Respect it.' },
  { id: 'hammer', name: 'Hammer', img: 'assets/rewards/Hammer.png', colorA: '#f0f0e8', colorB: '#6a6a50',
    desc: 'Problem solver. Also problem creator. Depends on the swing.' },
  { id: 'handsaw', name: 'Handsaw', img: 'assets/rewards/Handsaw.png', colorA: '#a8d8e8', colorB: '#305060',
    desc: 'Cuts wood, tension, and occasionally dignity.' },
  { id: 'hardhat', name: 'Hardhat', img: 'assets/rewards/Hardhat.png', colorA: '#7ec8e3', colorB: '#2a5a6e',
    desc: 'Safety first. Style second. Goat third.' },
  { id: 'hot-sauce', name: 'Hot Sauce', img: 'assets/rewards/Hot Sauce.png', colorA: '#c0c8d0', colorB: '#4a5560',
    desc: 'Liquid regret with excellent marketing. Burns twice.' },
  { id: 'house-fly', name: 'House Fly', img: 'assets/rewards/House Fly.png', colorA: '#d4a574', colorB: '#4a3020',
    desc: 'Uninvited guest. Excellent at existing where food is.' },
  { id: 'jar-of-gummy-worms', name: 'Jar of Gummy Worms', img: 'assets/rewards/Jar of Gummy Worms.png', colorA: '#b07040', colorB: '#3a2010',
    desc: 'Candy that stares back. Chewy. Judgy. Immortal.' },
  { id: 'jello-mold', name: 'Jello Mold', img: 'assets/rewards/Jello Mold.png', colorA: '#6bcf6b', colorB: '#2a5a20',
    desc: 'Wiggles with ancient knowledge. Possibly fruit. Possibly not.' },
  { id: 'junk-pile', name: 'Junk Pile', img: 'assets/rewards/Junk Pile.png', colorA: '#d4b896', colorB: '#6a4a28',
    desc: 'The original starter pack. All of life\'s clutter in one heap.' },
  { id: 'just-hangers', name: 'Just Hangers', img: 'assets/rewards/Just Hangers.png', colorA: '#ffd166', colorB: '#8a6020',
    desc: 'No clothes. Only hangers. The void has wireframes.' },
  { id: 'ketchup', name: 'Ketchup', img: 'assets/rewards/Ketchup.png', colorA: '#c8b8a8', colorB: '#5a4a40',
    desc: 'Condiment of champions. Also a mild biohazard if opened in 2009.' },
  { id: 'ladybug', name: 'Ladybug', img: 'assets/rewards/Ladybug.png', colorA: '#e8e0d0', colorB: '#6a6558',
    desc: 'Spotted luck. Tiny friend. Do not name it Gerald (too late).' },
  { id: 'leaky-battery', name: 'Leaky Battery', img: 'assets/rewards/Leaky Battery.png', colorA: '#f0a0c0', colorB: '#603040',
    desc: 'Acidic personality. Powered something once. Now powers dread.' },
  { id: 'lid-with-cheese-sauce', name: 'Lid with Cheese Sauce', img: 'assets/rewards/Lid with Cheese Sauce.png', colorA: '#5ad46a', colorB: '#c04050',
    desc: 'The lid survived. The cheese has other plans.' },
  { id: 'meteor', name: 'Meteor', img: 'assets/rewards/Meteor.png', colorA: '#ffb060', colorB: '#8a3020',
    desc: 'Space rock that chose violence (and your inventory).' },
  { id: 'mexican-street-corn', name: 'Mexican Street Corn', img: 'assets/rewards/Mexican Street Corn.png', colorA: '#f0a070', colorB: '#6a3020',
    desc: 'Elote energy. Mayo, cheese, chili, and zero regrets.' },
  { id: 'moldy-cheese', name: 'Moldy Cheese', img: 'assets/rewards/Moldy Cheese.png', colorA: '#e8c060', colorB: '#5a3018',
    desc: 'Aged beyond age. Blue? Green? Sentient? Yes.' },
  { id: 'moldy-iced-coffee', name: 'Moldy Iced Coffee', img: 'assets/rewards/Moldy Iced Coffee.png', colorA: '#d8d0c0', colorB: '#4a4840',
    desc: 'Cold brew of the damned. Ice long gone. Courage required.' },
  { id: 'mystery-can', name: 'Mystery Can', img: 'assets/rewards/Mystery Can.png', colorA: '#8a9ab0', colorB: '#2a3040',
    desc: 'Label missing. Contents negotiating. Best not to shake.' },
  { id: 'mystery-jar', name: 'Mystery Jar', img: 'assets/rewards/Mystery Jar.png', colorA: '#e8d8b0', colorB: '#6a5a38',
    desc: 'What\'s inside? Science may never know. You might.' },
  { id: 'mystery-liquid', name: 'Mystery Liquid', img: 'assets/rewards/Mystery Liquid.png', colorA: '#f080c0', colorB: '#602040',
    desc: 'Viscosity: suspicious. Color: accusations. Sip? Absolutely not.' },
  { id: 'nail-gun', name: 'Nail Gun', img: 'assets/rewards/Nail Gun.png', colorA: '#f0f0e8', colorB: '#6a6a50',
    desc: 'Fastens things with enthusiasm. Point away from face. And goats.' },
  { id: 'old-brick', name: 'Old Brick', img: 'assets/rewards/Old Brick.png', colorA: '#a8d8e8', colorB: '#305060',
    desc: 'Building block of civilization. Also of goat-related accidents.' },
  { id: 'old-newspaper', name: 'Old Newspaper', img: 'assets/rewards/Old Newspaper.png', colorA: '#7ec8e3', colorB: '#2a5a6e',
    desc: 'Yesterday\'s news, today\'s blanket. Crossword half-solved in crayon.' },
  { id: 'old-pizza', name: 'Old Pizza', img: 'assets/rewards/Old Pizza.png', colorA: '#c0c8d0', colorB: '#4a5560',
    desc: 'Cheese has become geology. Still pizza in its heart.' },
  { id: 'old-sock', name: 'Old Sock', img: 'assets/rewards/Old Sock.png', colorA: '#d4a574', colorB: '#4a3020',
    desc: 'Lone wolf of the laundry. Biological warfare in fabric form.' },
  { id: 'pile-of-concrete', name: 'Pile of Concrete', img: 'assets/rewards/Pile of Concrete.png', colorA: '#b07040', colorB: '#3a2010',
    desc: 'Dreams of being a sidewalk. Currently unemployed rubble.' },
  { id: 'pile-of-fur', name: 'Pile of Fur', img: 'assets/rewards/Pile of Fur.png', colorA: '#6bcf6b', colorB: '#2a5a20',
    desc: 'Whose fur? Unknown. Soft? Debatable. Collectible? Yes.' },
  { id: 'pile-of-rocks', name: 'Pile of Rocks', img: 'assets/rewards/Pile of Rocks.png', colorA: '#d4b896', colorB: '#6a4a28',
    desc: 'Geology starter kit. Skip them, stack them, revere them.' },
  { id: 'pinecone', name: 'Pinecone', img: 'assets/rewards/Pinecone.png', colorA: '#ffd166', colorB: '#8a6020',
    desc: 'Nature\'s grenade. Spiky. Seasonal. Excellent for tossing.' },
  { id: 'plastic-bag', name: 'Plastic Bag', img: 'assets/rewards/Plastic Bag.png', colorA: '#c8b8a8', colorB: '#5a4a40',
    desc: 'Crispy, crinkly, and aerodynamically useless. Peak sidewalk fashion.' },
  { id: 'poo', name: 'Poo', img: 'assets/rewards/Poo.png', colorA: '#e8e0d0', colorB: '#6a6558',
    desc: 'Nature\'s punctuation mark. Do not step. Do not collect. You collected.' },
  { id: 'potato-wedges', name: 'Potato Wedges', img: 'assets/rewards/Potato Wedges.png', colorA: '#f0a0c0', colorB: '#603040',
    desc: 'Chunkier fries. Bolder energy. Same destiny: cold and legendary.' },
  { id: 'power-strip', name: 'Power Strip', img: 'assets/rewards/Power Strip.png', colorA: '#5ad46a', colorB: '#c04050',
    desc: 'More outlets than willpower. Surge protection optional.' },
  { id: 'praying-mantis', name: 'Praying Mantis', img: 'assets/rewards/Praying Mantis.png', colorA: '#ffb060', colorB: '#8a3020',
    desc: 'Patient assassin of the garden. Staring is mutual.' },
  { id: 'radioactive-hotdog', name: 'Radioactive Hotdog', img: 'assets/rewards/Radioactive Hotdog.png', colorA: '#f0a070', colorB: '#6a3020',
    desc: 'Glows with confidence and mild concern. Street food+, scientifically.' },
  { id: 'rubber-chicken', name: 'Rubber Chicken', img: 'assets/rewards/Rubber Chicken.png', colorA: '#e8c060', colorB: '#5a3018',
    desc: 'Comedy prop. Squeaks of judgment. Instant slapstick.' },
  { id: 'rubber-ducky', name: 'Rubber Ducky', img: 'assets/rewards/Rubber Ducky.png', colorA: '#d8d0c0', colorB: '#4a4840',
    desc: 'Squeaks of judgment. Bath time optional. Emotional support: max.' },
  { id: 'rusty-can', name: 'Rusty Can', img: 'assets/rewards/Rusty Can.png', colorA: '#8a9ab0', colorB: '#2a3040',
    desc: 'Oxidized hopes and beans. Opens with a prayer and a tetanus shot.' },
  { id: 'seashell', name: 'Seashell', img: 'assets/rewards/Seashell.png', colorA: '#e8d8b0', colorB: '#6a5a38',
    desc: 'Ocean mail. Whisper it secrets. It already knows.' },
  { id: 'shattered-lightbulb', name: 'Shattered Lightbulb', img: 'assets/rewards/Shattered Lightbulb.png', colorA: '#f080c0', colorB: '#602040',
    desc: 'Idea: failed. Sparkle: achieved. Handle carefully.' },
  { id: 'shrooms-on-a-log', name: 'Shrooms on a Log', img: 'assets/rewards/Shrooms on a Log.png', colorA: '#f0f0e8', colorB: '#6a6a50',
    desc: 'Forest snack aesthetic. For looking, not licking.' },
  { id: 'slushee', name: 'Slushee', img: 'assets/rewards/Slushee.png', colorA: '#a8d8e8', colorB: '#305060',
    desc: 'Frozen sugar chaos. Brain freeze sold separately.' },
  { id: 'soup', name: 'Soup?', img: 'assets/rewards/Soup.png', colorA: '#7ec8e3', colorB: '#2a5a6e',
    desc: 'Is it soup? Was it soup? Will it be soup again? Unclear.' },
  { id: 'spaghetti', name: 'Spaghetti', img: 'assets/rewards/Spaghetti.png', colorA: '#c0c8d0', colorB: '#4a5560',
    desc: 'Noodles unbound. Sauce optional. Gravity fully involved.' },
  { id: 'sponge', name: 'Sponge', img: 'assets/rewards/Sponge.png', colorA: '#d4a574', colorB: '#4a3020',
    desc: 'Absorbs everything: water, vibes, secrets of the sink.' },
  { id: 'sub-sandwich', name: 'Sub Sandwich', img: 'assets/rewards/Sub Sandwich.png', colorA: '#b07040', colorB: '#3a2010',
    desc: 'Footlong ambition. Condiment diplomacy required.' },
  { id: 'suspicious-pizza-slice', name: 'Suspicious Pizza Slice', img: 'assets/rewards/Suspicious Pizza Slice.png', colorA: '#6bcf6b', colorB: '#2a5a20',
    desc: 'Toppings that raise questions. Cheese that answers none.' },
  { id: 'tangled-cables', name: 'Tangled Cables', img: 'assets/rewards/Tangled Cables.png', colorA: '#d4b896', colorB: '#6a4a28',
    desc: 'The final boss of drawers. USB? HDMI? Destiny?' },
  { id: 'tape-measure', name: 'Tape Measure', img: 'assets/rewards/Tape Measure.png', colorA: '#ffd166', colorB: '#8a6020',
    desc: 'Knows your length. Judges your DIY skills silently.' },
  { id: 'tfork', name: 'Tfork', img: 'assets/rewards/Tfork.png', colorA: '#c8b8a8', colorB: '#5a4a40',
    desc: 'Neither spoon nor fork. Pure chaos cutlery.' },
  { id: 'that-sticky-plant', name: 'That Sticky Plant', img: 'assets/rewards/That Sticky Plant.png', colorA: '#e8e0d0', colorB: '#6a6558',
    desc: 'It wants to be your friend. Permanently. On your fur.' },
  { id: 'toilet', name: 'Toilet', img: 'assets/rewards/Toilet.png', colorA: '#f0a0c0', colorB: '#603040',
    desc: 'The full experience. Heavy. Porcelain. Conversation starter.' },
  { id: 'toilet-paper', name: 'Toilet Paper', img: 'assets/rewards/Toilet Paper.png', colorA: '#5ad46a', colorB: '#c04050',
    desc: 'Precious in crisis. Mildly used? Don\'t think about it.' },
  { id: 'toilet-seat', name: 'Toilet Seat', img: 'assets/rewards/Toilet Seat.png', colorA: '#ffb060', colorB: '#8a3020',
    desc: 'Throne fragment. Surprisingly collectible. Deeply cursed.' },
  { id: 'traffic-cone', name: 'Traffic Cone', img: 'assets/rewards/Traffic Cone.png', colorA: '#f0a070', colorB: '#6a3020',
    desc: 'Orange authority. Directs traffic and life decisions poorly.' },
  { id: 'umbrella', name: 'Umbrella', img: 'assets/rewards/Umbrella.png', colorA: '#e8c060', colorB: '#5a3018',
    desc: 'Broken spokes optional. Rain protection: spiritual only.' },
  { id: 'usb-drive', name: 'USB Drive', img: 'assets/rewards/USB Drive.png', colorA: '#d8d0c0', colorB: '#4a4840',
    desc: '16GB of mystery files and one virus named \'final_final2\'.' },
  { id: 'used-candle', name: 'Used Candle', img: 'assets/rewards/Used Candle.png', colorA: '#8a9ab0', colorB: '#2a3040',
    desc: 'Burned out but still romantic. Wax memories included.' },
  { id: 'vintage-keyboard', name: 'Vintage Keyboard', img: 'assets/rewards/Vintage Keyboard.png', colorA: '#e8d8b0', colorB: '#6a5a38',
    desc: 'Clicky history. Missing keys. Full of secrets and crumbs.' },
  { id: 'virus', name: 'Virus', img: 'assets/rewards/Virus.png', colorA: '#f080c0', colorB: '#602040',
    desc: 'Digital menace, physical sticker energy. Wash your hooves.' },
  { id: 'waffle', name: 'Waffle', img: 'assets/rewards/Waffle.png', colorA: '#f0f0e8', colorB: '#6a6a50',
    desc: 'Grid of joy. Syrup optional. Breakfast anytime.' },
  { id: 'wasp', name: 'Wasp', img: 'assets/rewards/Wasp.png', colorA: '#a8d8e8', colorB: '#305060',
    desc: 'Bee\'s angrier cousin. Collect at your own risk (already collected).' },
];


// ─── Junk Exchange: craft gear / themes / weapons from loot ───────────────────
const TRADES = [
  {
    id: 'hat-hardhat',
    name: 'Hard Hat',
    type: 'hat',
    emoji: '⛑️',
    blurb: 'OSHA-approved goat protection. Fashion optional.',
    cost: [{ id: 'hardhat', n: 1 }],
  },
  {
    id: 'hat-cone',
    name: 'Traffic Cone Crown',
    type: 'hat',
    emoji: '🚧',
    blurb: 'You are the roadwork now.',
    cost: [{ id: 'traffic-cone', n: 1 }, { id: 'duct-tape', n: 1 }],
  },
  {
    id: 'hat-baseball',
    name: 'Baseball Cap',
    type: 'hat',
    emoji: '🧢',
    blurb: 'Peak goat athletics. Brim tilted for style.',
    cost: [{ id: 'empty-old-box', n: 1 }, { id: 'duct-tape', n: 1 }],
  },
  {
    id: 'hat-santa',
    name: 'Santa Hat',
    type: 'hat',
    emoji: '🎅',
    blurb: 'Ho-ho-hooves. Festive chaos included.',
    cost: [{ id: 'old-sock', n: 1 }, { id: 'plastic-bag', n: 1 }],
  },
  {
    id: 'glasses-shades',
    name: 'VR Headset',
    type: 'glasses',
    emoji: '🥽',
    blurb: 'Full immersion. Still can\'t see the next pipe.',
    cost: [{ id: 'broken-glass', n: 1 }, { id: 'broken-iphone', n: 1 }],
  },
  {
    id: 'glasses-visor',
    name: 'Cyber Visor',
    type: 'glasses',
    emoji: '🥽',
    blurb: 'HUD optional. Glow mandatory.',
    cost: [{ id: 'broken-iphone', n: 1 }, { id: 'tangled-cables', n: 1 }, { id: 'usb-drive', n: 1 }],
  },
  {
    id: 'body-sweater',
    name: 'Cozy Sweater',
    type: 'body',
    emoji: '🧶',
    blurb: 'Chunky knit that actually covers the goat torso.',
    cost: [{ id: 'old-sock', n: 1 }, { id: 'duct-tape', n: 1 }, { id: 'pile-of-fur', n: 1 }],
  },
  {
    id: 'body-tshirt',
    name: 'Graphic Tee',
    type: 'body',
    emoji: '👕',
    blurb: 'Streetwear for sidewalk royalty.',
    cost: [{ id: 'plastic-bag', n: 1 }, { id: 'old-newspaper', n: 1 }],
  },
  {
    id: 'pants-jeans',
    name: 'Goat Jeans',
    type: 'pants',
    emoji: '👖',
    blurb: 'Four legs, one look. Denim destiny.',
    cost: [{ id: 'board-with-nails', n: 1 }, { id: 'duct-tape', n: 1 }],
  },
  {
    id: 'pants-shorts',
    name: 'Party Shorts',
    type: 'pants',
    emoji: '🩳',
    blurb: 'Loud, short, and unapologetically goat.',
    cost: [{ id: 'banana', n: 1 }, { id: 'spaghetti', n: 1 }],
  },
  {
    id: 'shoes-kicks',
    name: 'Sneakers',
    type: 'shoes',
    emoji: '👟',
    blurb: 'Hoof-approved kicks. Grip optional, drip mandatory.',
    cost: [{ id: 'rubber-ducky', n: 1 }, { id: 'duct-tape', n: 1 }],
  },
  {
    id: 'shoes-boots',
    name: 'Work Boots',
    type: 'shoes',
    emoji: '🥾',
    blurb: 'Heavy-duty stompers. Tetanus not included.',
    cost: [{ id: 'cinderblock', n: 1 }, { id: 'board-with-nails', n: 1 }],
  },
  {
    id: 'weapon-blaster',
    name: 'Pipe Blaster',
    type: 'weapon',
    emoji: '💥',
    blurb: '3 shots per run. Clears the nearest pipe pair.',
    shots: 3,
    projectile: 'bolt',
    cost: [{ id: 'broken-pipe', n: 1 }, { id: 'leaky-battery', n: 1 }, { id: 'aluminum-can', n: 1 }],
  },
  {
    id: 'weapon-laser',
    name: 'Laser Shooter',
    type: 'weapon',
    emoji: '🔴',
    blurb: '3 glowing laser beams per run. Sci-fi sidewalk justice.',
    shots: 3,
    projectile: 'laser',
    cost: [{ id: 'nail-gun', n: 1 }, { id: 'broken-iphone', n: 1 }, { id: 'leaky-battery', n: 1 }],
  },
  {
    id: 'theme-cyberpunk',
    name: 'Cyberpunk District',
    type: 'theme',
    emoji: '🌆',
    blurb: 'Unlock the flashiest world in the game.',
    themeId: 'cyberpunk',
    cost: [
      { id: 'virus', n: 1 },
      { id: 'covid', n: 1 },
      { id: 'broken-iphone', n: 1 },
      { id: 'tangled-cables', n: 1 },
      { id: 'usb-drive', n: 1 },
    ],
  },
];

const GEAR_SLOTS = ['hat', 'glasses', 'body', 'pants', 'shoes', 'weapon'];
const SLOT_LABELS = {
  hat: 'Hat',
  glasses: 'Glasses',
  body: 'Top',
  pants: 'Pants',
  shoes: 'Shoes',
  weapon: 'Weapon',
};

// Map legacy clothing/weapon ids after inventory updates
const LEGACY_GEAR = {
  'hat-ducky': 'hat-baseball',
  'hat-pinecone': 'hat-santa',
  'clothing-tape-scarf': null,
  'clothing-cape': 'body-sweater',
  'clothing-gold-chain': 'body-tshirt',
  'weapon-nailgun': 'weapon-laser',
};

function tradeById(id) {
  return TRADES.find((t) => t.id === id);
}

const FLAVOR = {
  0: ['Even goats fall sometimes.', 'Warm-up bleat.', 'The ground is lava-ish.'],
  1: ['A humble hop.', 'Getting the hang of it.', 'Baby goat energy.'],
  5: ['Not bad, kid.', 'Spin energy incoming.', 'Solid leaps.'],
  10: ['Goat mode engaged.', 'The pipes fear you… almost.', 'Nice rhythm!'],
  15: ['Junk magnet activated.', 'Farmyard legend status rising.', 'Slick flying.'],
  25: ['Unstoppable hooves.', 'Is this parkour?', 'Chef’s kiss leap.'],
  30: ['Dumpster royalty.', 'Main character energy.', 'Pipe? What pipe?'],
  50: ['Absolute unit. Absolute trash collector.', 'Speedrun any% vibes.', 'The sky is yours.'],
};

// ─── Settings ─────────────────────────────────────────────────────────────────
const settings = loadSettings();
function loadSettings() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEYS.settings) || '{}');
    let theme = THEMES[raw.theme] ? raw.theme : 'meadow';
    const fireSide = raw.fireSide === 'left' ? 'left' : 'right';
    // Premium themes may be selected only if unlocked (checked at boot after unlock load)
    return {
      sfx: raw.sfx !== false,
      music: raw.music !== false,
      haptics: raw.haptics !== false,
      theme,
      fireSide,
    };
  } catch {
    return { sfx: true, music: true, haptics: true, theme: 'meadow', fireSide: 'right' };
  }
}
function saveSettings() {
  localStorage.setItem(KEYS.settings, JSON.stringify(settings));
}
function activeTheme() {
  return THEMES[settings.theme] || THEMES.meadow;
}

// ─── DOM ──────────────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const canvas = $('game-canvas');
const startScreen = $('start-screen');
const gameoverScreen = $('gameover-screen');
const settingsScreen = $('settings-screen');
const sceneryScreen = $('scenery-screen');
const sceneryList = $('scenery-list');
const rewardsScreen = $('rewards-screen');
const rewardDetailScreen = $('reward-detail-screen');
const spinScreen = $('spin-screen');
const pauseScreen = $('pause-screen');
const hud = $('hud');
const scoreEl = $('score-value');
const scorePill = $('score-pill');
const spinsPill = $('spins-pill');
const spinsValueEl = $('spins-value');
const finalScoreEl = $('final-score');
const bestScoreEl = $('best-score');
const bestStartEl = $('best-start');
const runsStartEl = $('runs-start');
const lootStartEl = $('loot-start');
const pendingSpinsHint = $('pending-spins-hint');
const newRecordEl = $('new-record');
const readyHint = $('ready-hint');
const flashEl = $('flash');
const edgeGlow = $('edge-glow');
const confettiEl = $('confetti');
const floatScoreEl = $('float-score');
const toastEl = $('toast');
const tutorialEl = $('tutorial');
const flavorEl = $('flavor');
const gameoverTitle = $('gameover-title');
const gameoverSpins = $('gameover-spins');
const claimSpinsBtn = $('claim-spins-btn');
const playBtn = $('play-btn');
const retryBtn = $('retry-btn');
const pauseBtn = $('pause-btn');
const resumeBtn = $('resume-btn');
const pauseQuit = $('pause-quit');
const settingsBtn = $('settings-btn');
const settingsClose = $('settings-close');
const sceneryBtn = $('scenery-btn');
const sceneryClose = $('scenery-close');
const rewardsBtn = $('rewards-btn');
const rewardsClose = $('rewards-close');
const rewardsGrid = $('rewards-grid');
const rewardsCount = $('rewards-count');
const pendingSpinsLabel = $('pending-spins-label');
const spinFromRewards = $('spin-from-rewards');
const detailVisual = $('detail-visual');
const detailName = $('detail-name');
const detailDesc = $('detail-desc');
const detailStatus = $('detail-status');
const detailClose = $('detail-close');
const slotStrip = $('slot-strip');
const spinBtn = $('spin-btn');
const spinDone = $('spin-done');
const spinResult = $('spin-result');
const spinResultVisual = $('spin-result-visual');
const spinResultName = $('spin-result-name');
const spinResultDesc = $('spin-result-desc');
const spinResultTag = $('spin-result-tag');
const spinRemaining = $('spin-remaining');
const shareBtn = $('share-btn');
const menuBtn = $('menu-btn');
const optSfx = $('opt-sfx');
const optMusic = $('opt-music');
const optHaptics = $('opt-haptics');
const optFireLeft = $('opt-fire-left');
const optFireRight = $('opt-fire-right');
const tradeScreen = $('trade-screen');
const tradeShopList = $('trade-shop-list');
const tradeLoadout = $('trade-loadout');
const tradeClose = $('trade-close');
const tradeBtn = $('trade-btn');
const tradeTabShop = $('trade-tab-shop');
const tradeTabLoadout = $('trade-tab-loadout');
const fireBtn = $('fire-btn');
const fireCountEl = $('fire-count');

// ─── Rewards / inventory / gear state ─────────────────────────────────────────
/** @returns {Record<string, number>} */
function loadInventory() {
  try {
    const raw = localStorage.getItem(KEYS.inventory);
    if (raw) {
      const obj = JSON.parse(raw);
      if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        const out = {};
        for (const [k, v] of Object.entries(obj)) out[k] = Math.max(0, Number(v) || 0);
        return out;
      }
    }
    // Migrate legacy owned-id array → count 1 each
    const arr = JSON.parse(localStorage.getItem(KEYS.owned) || '[]');
    const out = {};
    if (Array.isArray(arr)) for (const id of arr) out[id] = (out[id] || 0) + 1;
    return out;
  } catch {
    return {};
  }
}
function saveInventory() {
  localStorage.setItem(KEYS.inventory, JSON.stringify(inventory));
  // Keep legacy key in sync for older builds
  localStorage.setItem(KEYS.owned, JSON.stringify(Object.keys(inventory).filter((k) => inventory[k] > 0)));
}
function invCount(id) {
  return inventory[id] || 0;
}
function uniqueOwnedCount() {
  return Object.values(inventory).filter((n) => n > 0).length;
}
function hasReward(id) {
  return invCount(id) > 0;
}
function addReward(id, n = 1) {
  inventory[id] = invCount(id) + n;
  saveInventory();
}
function canAfford(cost) {
  return cost.every((c) => invCount(c.id) >= c.n);
}
function spendCost(cost) {
  if (!canAfford(cost)) return false;
  for (const c of cost) {
    inventory[c.id] = invCount(c.id) - c.n;
    if (inventory[c.id] <= 0) delete inventory[c.id];
  }
  saveInventory();
  return true;
}

function loadUnlockedGear() {
  try {
    const arr = JSON.parse(localStorage.getItem(KEYS.unlocked) || '[]');
    const set = new Set();
    if (Array.isArray(arr)) {
      for (const id of arr) {
        if (Object.prototype.hasOwnProperty.call(LEGACY_GEAR, id)) {
          const mapped = LEGACY_GEAR[id];
          if (mapped) set.add(mapped);
        } else {
          set.add(id);
        }
      }
    }
    return set;
  } catch {
    return new Set();
  }
}
function saveUnlockedGear() {
  localStorage.setItem(KEYS.unlocked, JSON.stringify([...unlockedGear]));
}

function loadUnlockedThemes() {
  try {
    const arr = JSON.parse(localStorage.getItem(KEYS.unlockedThemes) || '[]');
    const set = new Set(Array.isArray(arr) ? arr : []);
    // Free themes always available
    for (const t of Object.values(THEMES)) {
      if (!t.requiresUnlock) set.add(t.id);
    }
    return set;
  } catch {
    const set = new Set();
    for (const t of Object.values(THEMES)) {
      if (!t.requiresUnlock) set.add(t.id);
    }
    return set;
  }
}
function saveUnlockedThemes() {
  localStorage.setItem(KEYS.unlockedThemes, JSON.stringify([...unlockedThemes]));
}

function loadEquipped() {
  const blank = { hat: null, glasses: null, body: null, pants: null, shoes: null, weapon: null };
  try {
    const raw = JSON.parse(localStorage.getItem(KEYS.equipped) || '{}');
    const mapId = (id) => {
      if (!id) return null;
      if (Object.prototype.hasOwnProperty.call(LEGACY_GEAR, id)) return LEGACY_GEAR[id];
      return id;
    };
    // migrate old single clothing slot
    let body = mapId(raw.body) || mapId(raw.clothing) || null;
    return {
      hat: mapId(raw.hat),
      glasses: mapId(raw.glasses),
      body,
      pants: mapId(raw.pants),
      shoes: mapId(raw.shoes),
      weapon: mapId(raw.weapon),
    };
  } catch {
    return blank;
  }
}
function saveEquipped() {
  localStorage.setItem(KEYS.equipped, JSON.stringify(equipped));
}

function loadSpins() {
  return Math.max(0, Number(localStorage.getItem(KEYS.spins) || 0));
}
function saveSpins() {
  localStorage.setItem(KEYS.spins, String(pendingSpins));
}

let inventory = loadInventory();
let unlockedGear = loadUnlockedGear();
let unlockedThemes = loadUnlockedThemes();
let equipped = loadEquipped();
let pendingSpins = loadSpins();
let spinsEarnedThisRun = 0;
let spinning = false;
let spinReturnTo = 'menu'; // 'menu' | 'gameover' | 'rewards'
let weaponShots = 0;
let tradeTab = 'shop'; // 'shop' | 'loadout'

// ─── State ────────────────────────────────────────────────────────────────────
const State = { MENU: 'menu', PLAYING: 'playing', PAUSED: 'paused', DEAD: 'dead' };

let state = State.MENU;
let score = 0;
let best = Number(localStorage.getItem(KEYS.best) || 0);
let runs = Number(localStorage.getItem(KEYS.runs) || 0);
let time = 0;
let pipeTimer = 0;
let shake = 0;
let readyTimer = 0;
let hitStop = 0;
let camTargetY = 0;
let nearMissCooldown = 0;
let perfectStreak = 0;
let runStarted = false;
let showTutorial = !localStorage.getItem(KEYS.tutored);

const goat = {
  y: 0,
  vy: 0,
  rot: 0,
  mesh: null,
  earL: null,
  earR: null,
  legFL: null,
  legFR: null,
  legBL: null,
  legBR: null,
  flapPhase: 0,
  squash: 1,
};

/** @type {PipePair[]} */
let pipes = [];
/** @type {THREE.Object3D[]} */
let clouds = [];
/** @type {THREE.Points[]} */
let particles = [];
/** In-flight weapon bolts */
let projectiles = [];
/** @type {THREE.Mesh[]} */
let hills = [];
/** @type {THREE.Object3D[]} */
let grass = [];
/** @type {THREE.Object3D[]} */
let trees = [];
/** @type {THREE.Object3D[]} */
let birds = [];
/** @type {THREE.Object3D[]} */
let balloons = [];
/** @type {THREE.Points|null} */
let stars = null;
/** @type {THREE.Points|null} */
let fireflies = null;
/** @type {THREE.Object3D[]} */
let cityBuildings = [];
/** @type {THREE.Group|null} */
let rocketGroup = null;
let rocketTimer = 8;
let rocketState = 'idle'; // idle | lifting | flying
let rocketTex = null;
/** @type {THREE.Object3D[]} */
let cyberCars = [];
/** @type {THREE.Object3D[]} */
let cyberBeacons = [];
/** @type {THREE.Object3D[]} */
let cyberFireworks = [];
let fireworkTimer = 2;
/** @type {THREE.Mesh|null} */
let skyMesh = null;
/** @type {THREE.Mesh|null} */
let sunMesh = null;
/** @type {THREE.Mesh|null} */
let sunGlow = null;
/** @type {THREE.DirectionalLight|null} */
let sunLight = null;
/** @type {THREE.Mesh|null} */
let moonMesh = null;
/** @type {THREE.Mesh|null} */
let moonGlow = null;
/** @type {THREE.AmbientLight|null} */
let ambientLight = null;
/** @type {THREE.Mesh|null} */
let groundMesh = null;
/** @type {THREE.Mesh|null} */
let groundStrip = null;
/** @type {THREE.Mesh|null} */
let groundEdge = null;

// ─── Three.js ─────────────────────────────────────────────────────────────────
const isMobile =
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
  (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
  window.innerHeight > window.innerWidth;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: !isMobile,
  alpha: false,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.75 : 2));
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 13);
camera.lookAt(0, 0, 0);

function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const portrait = h >= w;
  camera.aspect = w / h;
  if (portrait) {
    camera.fov = 64;
    camera.position.z = 13.2;
  } else {
    camera.fov = 48;
    camera.position.z = 12;
  }
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, portrait ? 1.75 : 2));
}
window.addEventListener('resize', onResize);
window.addEventListener('orientationchange', () => setTimeout(onResize, 80));
onResize();

// ─── World builders ───────────────────────────────────────────────────────────
function createSky() {
  const geo = new THREE.SphereGeometry(40, 28, 20);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new THREE.Color('#163566') },
      midColor: { value: new THREE.Color('#4a7fb5') },
      bottomColor: { value: new THREE.Color('#f5b48a') },
      offset: { value: 0.0 },
      exponent: { value: 0.72 },
      time: { value: 0 },
    },
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 midColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      uniform float time;
      varying vec3 vWorldPos;
      void main() {
        float h = normalize(vWorldPos + offset).y;
        float t = max(pow(max(h, 0.0), exponent), 0.0);
        float low = smoothstep(-0.35, 0.15, h);
        vec3 col = mix(bottomColor, midColor, low);
        col = mix(col, topColor, t);
        // Soft drifting bands so the sky feels alive
        float band = sin(vWorldPos.x * 0.08 + time * 0.12) * 0.5 + 0.5;
        col += vec3(0.04, 0.03, 0.02) * band * (1.0 - t);
        float haze = sin(vWorldPos.y * 0.15 + time * 0.08) * 0.03;
        col += haze;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  skyMesh = new THREE.Mesh(geo, mat);
  scene.add(skyMesh);
}

function createStars() {
  const n = isMobile ? 80 : 140;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 50;
    pos[i * 3 + 1] = 2 + Math.random() * 18;
    pos[i * 3 + 2] = -12 - Math.random() * 18;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xfff4d8,
    size: 0.08,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    sizeAttenuation: true,
  });
  stars = new THREE.Points(geo, mat);
  scene.add(stars);
}

function createLights() {
  ambientLight = new THREE.AmbientLight(0xffe8d4, 0.55);
  scene.add(ambientLight);
  scene.add(new THREE.HemisphereLight(0x87b5e8, 0xc4783a, 0.65));

  const sun = new THREE.DirectionalLight(0xfff0dd, 1.35);
  sun.position.set(6, 10, 8);
  sun.castShadow = true;
  const map = isMobile ? 512 : 1024;
  sun.shadow.mapSize.set(map, map);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 40;
  sun.shadow.camera.left = -12;
  sun.shadow.camera.right = 12;
  sun.shadow.camera.top = 12;
  sun.shadow.camera.bottom = -12;
  sun.shadow.bias = -0.001;
  scene.add(sun);
  sunLight = sun;

  const rim = new THREE.DirectionalLight(0xff8a4c, 0.48);
  rim.position.set(-8, 2, -4);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0xffc9a0, 0.28);
  fill.position.set(0, -6, 4);
  scene.add(fill);

  sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.4, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xffe0a0, transparent: true, opacity: 0.95 })
  );
  sunMesh.position.set(6.5, 3.6, -18);
  scene.add(sunMesh);

  sunGlow = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 20, 20),
    new THREE.MeshBasicMaterial({
      color: 0xffb060,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    })
  );
  sunGlow.position.copy(sunMesh.position);
  scene.add(sunGlow);

  moonMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 18, 18),
    new THREE.MeshBasicMaterial({ color: 0xe8eef8, transparent: true, opacity: 0.95 })
  );
  moonMesh.position.set(-5.5, 4.2, -18);
  moonMesh.visible = false;
  scene.add(moonMesh);

  moonGlow = new THREE.Mesh(
    new THREE.SphereGeometry(2.0, 18, 18),
    new THREE.MeshBasicMaterial({
      color: 0x88aaff,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    })
  );
  moonGlow.position.copy(moonMesh.position);
  moonGlow.visible = false;
  scene.add(moonGlow);
}

function createGround() {
  const group = new THREE.Group();
  groundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 24),
    new THREE.MeshStandardMaterial({ color: 0x3d8b4f, roughness: 0.92 })
  );
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.set(0, CFG.groundY, 0);
  groundMesh.receiveShadow = true;
  group.add(groundMesh);

  groundStrip = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 4),
    new THREE.MeshStandardMaterial({ color: 0x2d6b3c, roughness: 1 })
  );
  groundStrip.rotation.x = -Math.PI / 2;
  groundStrip.position.set(0, CFG.groundY + 0.01, 6);
  groundStrip.receiveShadow = true;
  group.add(groundStrip);

  groundEdge = new THREE.Mesh(
    new THREE.BoxGeometry(80, 0.15, 0.4),
    new THREE.MeshStandardMaterial({
      color: 0x5cb86e,
      emissive: 0x1a4a28,
      emissiveIntensity: 0.3,
      roughness: 0.7,
    })
  );
  groundEdge.position.set(0, CFG.groundY + 0.08, 0);
  group.add(groundEdge);
  scene.add(group);

  // Grass tufts
  const gMat = new THREE.MeshStandardMaterial({ color: 0x4caf62, roughness: 0.9, flatShading: true });
  for (let i = 0; i < (isMobile ? 18 : 28); i++) {
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.28 + Math.random() * 0.2, 4), gMat);
    blade.position.set(-18 + Math.random() * 36, CFG.groundY + 0.14, -1 + Math.random() * 5);
    blade.rotation.z = (Math.random() - 0.5) * 0.3;
    scene.add(blade);
    grass.push(blade);
  }
}

function createHills() {
  const colors = [0x2f6e48, 0x3a8055, 0x265a3a, 0x347850, 0x3d7a52];
  for (let i = 0; i < 10; i++) {
    const w = 4 + Math.random() * 5;
    const h = 1.2 + Math.random() * 2.2;
    const hill = new THREE.Mesh(
      new THREE.SphereGeometry(1, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        roughness: 0.95,
        flatShading: true,
      })
    );
    hill.scale.set(w, h, w * 0.6);
    hill.position.set(-18 + i * 4.8 + Math.random(), CFG.groundY, -6 - Math.random() * 5);
    hill.userData.baseY = hill.position.y;
    hill.userData.phase = Math.random() * Math.PI * 2;
    hill.userData.layer = i % 3; // parallax layer
    hill.receiveShadow = true;
    scene.add(hill);
    hills.push(hill);
  }
}

function createTrees() {
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.9 });
  const leafColors = [0x2d8a4e, 0x3aa35c, 0x247a42, 0x4caf62];
  for (let i = 0; i < (isMobile ? 8 : 12); i++) {
    const g = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.12, 0.7 + Math.random() * 0.4, 6),
      trunkMat
    );
    trunk.position.y = 0.35;
    g.add(trunk);
    const leafMat = new THREE.MeshStandardMaterial({
      color: leafColors[i % leafColors.length],
      roughness: 0.85,
      flatShading: true,
    });
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.45 + Math.random() * 0.2, 8, 6), leafMat);
    canopy.position.y = 0.85 + Math.random() * 0.15;
    canopy.scale.y = 0.85;
    g.add(canopy);
    if (Math.random() > 0.4) {
      const canopy2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 7, 5), leafMat);
      canopy2.position.set(0.2, 0.7, 0.1);
      g.add(canopy2);
    }
    g.position.set(
      -20 + Math.random() * 40,
      CFG.groundY,
      -3.5 - Math.random() * 3.5
    );
    g.userData.phase = Math.random() * Math.PI * 2;
    g.userData.sway = 0.04 + Math.random() * 0.04;
    scene.add(g);
    trees.push(g);
  }
}

function createClouds() {
  for (let i = 0; i < (isMobile ? 12 : 16); i++) {
    const group = new THREE.Group();
    const opacity = 0.55 + Math.random() * 0.4;
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      transparent: true,
      opacity,
    });
    const parts = 3 + Math.floor(Math.random() * 4);
    for (let j = 0; j < parts; j++) {
      const r = 0.4 + Math.random() * 0.65;
      const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), cloudMat);
      puff.position.set(
        (j - parts / 2) * 0.55 + (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.25,
        (Math.random() - 0.5) * 0.3
      );
      puff.scale.y = 0.6 + Math.random() * 0.25;
      group.add(puff);
    }
    const layer = i % 3; // near / mid / far
    const z = layer === 0 ? -5 - Math.random() * 2 : layer === 1 ? -8 - Math.random() * 3 : -12 - Math.random() * 4;
    group.position.set(-20 + Math.random() * 40, 1.2 + Math.random() * 4.2 + layer * 0.4, z);
    group.userData.speed = (0.25 + Math.random() * 0.5) * (layer === 0 ? 1.3 : layer === 1 ? 0.85 : 0.5);
    group.userData.baseY = group.position.y;
    group.userData.phase = Math.random() * Math.PI * 2;
    group.userData.layer = layer;
    scene.add(group);
    clouds.push(group);
  }
}

function createBirds() {
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2a2a32, roughness: 0.7 });
  const wingMat = new THREE.MeshStandardMaterial({ color: 0x3a3a48, roughness: 0.65, flatShading: true });
  for (let i = 0; i < (isMobile ? 4 : 6); i++) {
    const bird = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), bodyMat);
    body.scale.set(1.4, 0.7, 0.7);
    bird.add(body);
    const wingL = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.28, 4), wingMat);
    wingL.rotation.z = Math.PI / 2;
    wingL.position.set(0, 0.02, 0.12);
    bird.add(wingL);
    const wingR = wingL.clone();
    wingR.position.z = -0.12;
    bird.add(wingR);
    bird.userData.wingL = wingL;
    bird.userData.wingR = wingR;
    bird.userData.speed = 1.1 + Math.random() * 1.4;
    bird.userData.phase = Math.random() * Math.PI * 2;
    bird.userData.baseY = 1.5 + Math.random() * 3.2;
    bird.userData.amp = 0.25 + Math.random() * 0.35;
    bird.position.set(-15 + Math.random() * 30, bird.userData.baseY, -7 - Math.random() * 5);
    bird.scale.setScalar(0.85 + Math.random() * 0.4);
    scene.add(bird);
    birds.push(bird);
  }
}

function createBalloons() {
  const colors = [0xff6b6b, 0xffd166, 0x5eead4, 0xa78bfa, 0xff8a4c];
  for (let i = 0; i < (isMobile ? 3 : 5); i++) {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: colors[i % colors.length],
      roughness: 0.35,
      metalness: 0.15,
      emissive: colors[i % colors.length],
      emissiveIntensity: 0.12,
    });
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 10), mat);
    ball.scale.y = 1.15;
    g.add(ball);
    const knot = new THREE.Mesh(
      new THREE.ConeGeometry(0.05, 0.08, 6),
      new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.8 })
    );
    knot.position.y = -0.32;
    g.add(knot);
    // string
    const string = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.7, 4),
      new THREE.MeshBasicMaterial({ color: 0xdddddd })
    );
    string.position.y = -0.7;
    g.add(string);

    g.position.set(-12 + Math.random() * 24, 0.5 + Math.random() * 3.5, -9 - Math.random() * 4);
    g.userData.baseY = g.position.y;
    g.userData.phase = Math.random() * Math.PI * 2;
    g.userData.speed = 0.12 + Math.random() * 0.18;
    g.userData.drift = 0.15 + Math.random() * 0.2;
    scene.add(g);
    balloons.push(g);
  }
}

function createFireflies() {
  const n = isMobile ? 28 : 42;
  const pos = new Float32Array(n * 3);
  const phases = [];
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 28;
    pos[i * 3 + 1] = -2 + Math.random() * 7;
    pos[i * 3 + 2] = -4 - Math.random() * 8;
    phases.push(Math.random() * Math.PI * 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xffe08a,
    size: 0.12,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  fireflies = new THREE.Points(geo, mat);
  fireflies.userData.phases = phases;
  fireflies.userData.base = pos.slice();
  scene.add(fireflies);
}

// ─── Goat ─────────────────────────────────────────────────────────────────────

function createCyberpunkCity() {
  // Procedural neon skyline for Cyberpunk District
  const palette = [0x0a0618, 0x12082a, 0x1a0a38, 0x0c1030, 0x180628];
  const neon = [0xff2d95, 0x00f0ff, 0xb400ff, 0xffe066, 0x40ffaa];
  for (let i = 0; i < 18; i++) {
    const g = new THREE.Group();
    const w = 0.7 + Math.random() * 1.4;
    const d = 0.6 + Math.random() * 1.1;
    const h = 1.8 + Math.random() * 5.5;
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({
        color: palette[i % palette.length],
        roughness: 0.7,
        metalness: 0.45,
        emissive: 0x100818,
        emissiveIntensity: 0.25,
      })
    );
    body.position.y = h / 2;
    g.add(body);

    // rooftop antenna / spire
    if (Math.random() > 0.35) {
      const spire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.06, 0.4 + Math.random() * 0.8, 6),
        new THREE.MeshStandardMaterial({
          color: 0x333344,
          emissive: neon[i % neon.length],
          emissiveIntensity: 0.7,
        })
      );
      spire.position.y = h + 0.25;
      g.add(spire);
      const light = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 6, 6),
        new THREE.MeshBasicMaterial({ color: neon[i % neon.length] })
      );
      light.position.y = h + 0.55;
      g.add(light);
    }

    // window grid
    const cols = 2 + Math.floor(Math.random() * 3);
    const rows = 3 + Math.floor(Math.random() * 6);
    const winMat = new THREE.MeshBasicMaterial({
      color: neon[(i + 2) % neon.length],
      transparent: true,
      opacity: 0.55 + Math.random() * 0.35,
    });
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() < 0.2) continue;
        const win = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.04), winMat);
        win.position.set(
          -w * 0.3 + (c / Math.max(1, cols - 1)) * w * 0.6,
          0.35 + (r / Math.max(1, rows - 1)) * (h - 0.6),
          d / 2 + 0.02
        );
        g.add(win);
      }
    }

    // neon edge strip
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.95, 0.05, 0.05),
      new THREE.MeshBasicMaterial({ color: neon[i % neon.length] })
    );
    strip.position.set(0, h * (0.3 + Math.random() * 0.5), d / 2 + 0.03);
    g.add(strip);

    g.position.set(-22 + i * 2.6 + Math.random() * 0.6, CFG.groundY, -7.5 - Math.random() * 4);
    g.userData.baseY = g.position.y;
    g.userData.phase = Math.random() * Math.PI * 2;
    g.userData.layer = i % 3;
    g.userData.neon = neon[i % neon.length];
    g.visible = false;
    scene.add(g);
    cityBuildings.push(g);
  }

  // Distant flashing beacon lights
  const beaconColors = [0xff2d95, 0x00f0ff, 0xffe066, 0xb400ff, 0x40ffaa];
  for (let i = 0; i < 14; i++) {
    const light = new THREE.Mesh(
      new THREE.SphereGeometry(0.08 + Math.random() * 0.06, 8, 6),
      new THREE.MeshBasicMaterial({
        color: beaconColors[i % beaconColors.length],
        transparent: true,
        opacity: 0.85,
      })
    );
    light.position.set(
      -18 + Math.random() * 36,
      CFG.groundY + 2.5 + Math.random() * 5.5,
      -11 - Math.random() * 5
    );
    light.userData.phase = Math.random() * Math.PI * 2;
    light.userData.speed = 2 + Math.random() * 5;
    light.userData.baseScale = light.scale.x;
    light.visible = false;
    scene.add(light);
    cyberBeacons.push(light);
  }

  // Horizontal flying vehicles (cyber cars / drones)
  for (let i = 0; i < 6; i++) {
    const car = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1a1028,
      metalness: 0.6,
      roughness: 0.35,
      emissive: 0x200830,
      emissiveIntensity: 0.4,
    });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.16, 0.28), bodyMat);
    car.add(body);
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.12, 0.22),
      new THREE.MeshStandardMaterial({
        color: 0x40e0ff,
        emissive: 0x1080a0,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.85,
      })
    );
    cabin.position.set(-0.05, 0.12, 0);
    car.add(cabin);
    // neon underglow
    const glow = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.04, 0.32),
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xff2d95 : 0x00f0ff,
        transparent: true,
        opacity: 0.55,
      })
    );
    glow.position.y = -0.1;
    car.add(glow);
    // thruster trail points (simple cones)
    const thruster = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.22, 6),
      new THREE.MeshBasicMaterial({ color: 0xff8040, transparent: true, opacity: 0.8 })
    );
    thruster.rotation.z = Math.PI / 2;
    thruster.position.set(-0.42, 0, 0);
    car.add(thruster);
    car.userData.thruster = thruster;
    car.userData.speed = 1.8 + Math.random() * 2.4;
    car.userData.baseY = CFG.groundY + 2.2 + Math.random() * 3.8;
    car.userData.phase = Math.random() * Math.PI * 2;
    car.userData.dir = Math.random() > 0.5 ? 1 : -1;
    car.position.set(
      -20 + Math.random() * 40,
      car.userData.baseY,
      -9 - Math.random() * 4
    );
    if (car.userData.dir < 0) car.rotation.y = Math.PI;
    car.visible = false;
    scene.add(car);
    cyberCars.push(car);
  }
}

function spawnFirework(x, y, z) {
  const colors = [0xff2d95, 0x00f0ff, 0xffe066, 0xb400ff, 0xffffff, 0x40ffaa];
  const col = colors[Math.floor(Math.random() * colors.length)];
  const count = 28;
  const positions = new Float32Array(count * 3);
  const velocities = [];
  const cols = new Float32Array(count * 3);
  const c = new THREE.Color(col);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    const a = Math.random() * Math.PI * 2;
    const elev = (Math.random() - 0.3) * Math.PI;
    const sp = 2.5 + Math.random() * 4;
    velocities.push({
      x: Math.cos(a) * Math.cos(elev) * sp,
      y: Math.sin(elev) * sp + 1.5,
      z: Math.sin(a) * Math.cos(elev) * sp * 0.5,
    });
    cols[i * 3] = c.r;
    cols[i * 3 + 1] = c.g;
    cols[i * 3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.22,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const pts = new THREE.Points(geo, mat);
  pts.userData = { life: 1.1, maxLife: 1.1, velocities, drag: 1.2 };
  scene.add(pts);
  cyberFireworks.push(pts);
}

function updateCyberFireworks(dt) {
  for (let i = cyberFireworks.length - 1; i >= 0; i--) {
    const p = cyberFireworks[i];
    p.userData.life -= dt;
    const t = p.userData.life / p.userData.maxLife;
    p.material.opacity = Math.max(0, t);
    p.material.size = 0.08 + 0.2 * t;
    const pos = p.geometry.attributes.position;
    const vels = p.userData.velocities;
    for (let j = 0; j < vels.length; j++) {
      pos.array[j * 3] += vels[j].x * dt;
      pos.array[j * 3 + 1] += vels[j].y * dt;
      pos.array[j * 3 + 2] += vels[j].z * dt;
      vels[j].y -= 6 * dt;
      vels[j].x *= 1 - 0.8 * dt;
      vels[j].z *= 1 - 0.8 * dt;
    }
    pos.needsUpdate = true;
    if (p.userData.life <= 0) {
      scene.remove(p);
      p.geometry.dispose();
      p.material.dispose();
      cyberFireworks.splice(i, 1);
    }
  }
}

function createRocket() {
  const g = new THREE.Group();
  const loader = new THREE.TextureLoader();
  rocketTex = loader.load(
    'assets/background/Rocket.png',
    () => {
      /* ok */
    },
    undefined,
    () => console.warn('Rocket texture failed to load')
  );
  rocketTex.colorSpace = THREE.SRGBColorSpace;

  const mat = new THREE.MeshBasicMaterial({
    map: rocketTex,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  // Tall plane matching rocket aspect (~342x910)
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2.9), mat);
  plane.position.y = 1.45;
  g.add(plane);

  // engine glow (under rocket)
  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(0.22, 0.7, 8),
    new THREE.MeshBasicMaterial({
      color: 0xff8a30,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    })
  );
  flame.position.y = -0.15;
  flame.rotation.x = Math.PI;
  g.add(flame);
  g.userData.flame = flame;

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 10, 8),
    new THREE.MeshBasicMaterial({
      color: 0xff6020,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    })
  );
  glow.position.y = -0.2;
  g.add(glow);
  g.userData.glow = glow;

  g.position.set(6, CFG.groundY - 0.2, -9);
  g.visible = false;
  g.userData.vy = 0;
  g.userData.baseX = 6;
  scene.add(g);
  rocketGroup = g;
}

function setCyberpunkDecorVisible(on) {
  for (const b of cityBuildings) b.visible = on;
  for (const c of cyberCars) c.visible = on;
  for (const b of cyberBeacons) b.visible = on;
  if (!on) {
    if (rocketGroup) {
      rocketGroup.visible = false;
      rocketState = 'idle';
      rocketTimer = 6 + Math.random() * 8;
    }
    for (const fw of cyberFireworks) {
      scene.remove(fw);
      fw.geometry.dispose();
      fw.material.dispose();
    }
    cyberFireworks = [];
  }
}

function updateRocket(dt, theme) {
  if (!rocketGroup) return;
  const cyber = theme.id === 'cyberpunk';
  if (!cyber) {
    rocketGroup.visible = false;
    return;
  }

  const flame = rocketGroup.userData.flame;
  const glow = rocketGroup.userData.glow;

  if (rocketState === 'idle') {
    rocketTimer -= dt;
    rocketGroup.visible = false;
    if (rocketTimer <= 0) {
      // Spawn on ground mid/right, then lift off
      const x = 2 + Math.random() * 6;
      rocketGroup.position.set(x, CFG.groundY - 0.15, -8.5 - Math.random() * 2);
      rocketGroup.userData.vy = 0;
      rocketGroup.userData.baseX = x;
      rocketGroup.rotation.z = 0;
      rocketGroup.visible = true;
      rocketState = 'lifting';
      rocketTimer = 0;
      if (flame) flame.visible = true;
      if (glow) glow.visible = true;
    }
    return;
  }

  rocketGroup.visible = true;
  // Pulse flame
  if (flame) {
    flame.scale.y = 0.85 + Math.sin(time * 28) * 0.25 + Math.random() * 0.1;
    flame.scale.x = 0.9 + Math.sin(time * 22) * 0.15;
    flame.material.opacity = 0.65 + Math.sin(time * 30) * 0.2;
  }
  if (glow) {
    glow.scale.setScalar(0.9 + Math.sin(time * 18) * 0.2);
    glow.material.opacity = 0.25 + Math.sin(time * 20) * 0.12;
  }

  if (rocketState === 'lifting') {
    rocketTimer += dt;
    // charge for a moment with small shake
    rocketGroup.position.x = rocketGroup.userData.baseX + Math.sin(time * 40) * 0.03;
    if (rocketTimer > 0.85) {
      rocketState = 'flying';
      rocketGroup.userData.vy = 1.2;
    }
    // ground smoke puffs
    if (Math.random() < 0.35) {
      try {
        spawnBurst(
          rocketGroup.position.x,
          CFG.groundY + 0.2,
          4,
          [0xff8a4c, 0xffd166, 0x888888],
          2.2,
          0.35
        );
      } catch (e) {
        /* ignore */
      }
    }
    return;
  }

  if (rocketState === 'flying') {
    rocketGroup.userData.vy += 4.5 * dt;
    rocketGroup.position.y += rocketGroup.userData.vy * dt;
    rocketGroup.position.x += Math.sin(time * 1.4) * 0.15 * dt;
    rocketGroup.rotation.z = Math.sin(time * 2) * 0.04;
    // trail
    if (Math.random() < 0.5) {
      try {
        spawnBurst(
          rocketGroup.position.x,
          rocketGroup.position.y - 0.3,
          3,
          [0xff6020, 0xffd166, 0xffffff],
          1.8,
          0.28
        );
      } catch (e) {
        /* ignore */
      }
    }
    if (rocketGroup.position.y > 12) {
      rocketGroup.visible = false;
      rocketState = 'idle';
      rocketTimer = 10 + Math.random() * 14;
    }
  }
}

function updateCity(dt, playing) {
  const scrollMul = playing ? 1 : 0.35;
  for (const b of cityBuildings) {
    if (!b.visible) continue;
    const layer = b.userData.layer ?? 1;
    const spd = (0.35 + layer * 0.22) * scrollMul * (playing ? 1.5 : 1);
    b.position.x -= spd * dt;
    b.traverse((obj) => {
      if (obj.isMesh && obj.material && obj.material.opacity !== undefined && obj.geometry?.type === 'BoxGeometry') {
        if (obj.material.opacity < 0.95 && obj.material.color) {
          if (Math.random() < 0.004) obj.material.opacity = 0.2 + Math.random() * 0.75;
        }
      }
    });
    if (b.position.x < -26) b.position.x += 48;
  }

  // Flashing distant beacons
  for (const light of cyberBeacons) {
    if (!light.visible) continue;
    const flash = 0.35 + 0.65 * Math.abs(Math.sin(time * light.userData.speed + light.userData.phase));
    // occasional hard strobe
    const strobe = Math.sin(time * light.userData.speed * 3.5 + light.userData.phase) > 0.92 ? 1.4 : 1;
    light.material.opacity = Math.min(1, flash * strobe);
    const s = light.userData.baseScale * (0.85 + flash * 0.5);
    light.scale.setScalar(s);
    light.position.x -= 0.15 * scrollMul * dt;
    if (light.position.x < -22) light.position.x += 44;
  }

  // Flying vehicles
  for (const car of cyberCars) {
    if (!car.visible) continue;
    const dir = car.userData.dir || 1;
    car.position.x += car.userData.speed * dir * dt * (playing ? 1.15 : 0.7);
    car.position.y = car.userData.baseY + Math.sin(time * 1.8 + car.userData.phase) * 0.25;
    if (car.userData.thruster) {
      car.userData.thruster.scale.x = 0.8 + Math.sin(time * 24 + car.userData.phase) * 0.35;
      car.userData.thruster.material.opacity = 0.55 + Math.sin(time * 20) * 0.3;
    }
    // soft trail particles
    if (Math.random() < 0.12) {
      try {
        spawnBurst(
          car.position.x - dir * 0.4,
          car.position.y,
          2,
          [0xff2d95, 0x00f0ff, 0xff8040],
          1.2,
          0.25
        );
      } catch (e) {
        /* ignore */
      }
    }
    if (dir > 0 && car.position.x > 24) {
      car.position.x = -24;
      car.userData.baseY = CFG.groundY + 2.2 + Math.random() * 3.8;
    } else if (dir < 0 && car.position.x < -24) {
      car.position.x = 24;
      car.userData.baseY = CFG.groundY + 2.2 + Math.random() * 3.8;
    }
  }

  // Fireworks
  if (cyberBeacons.length && cyberBeacons[0].visible) {
    fireworkTimer -= dt;
    if (fireworkTimer <= 0) {
      fireworkTimer = 1.6 + Math.random() * 2.8;
      spawnFirework(
        -10 + Math.random() * 20,
        CFG.groundY + 3.5 + Math.random() * 4,
        -10 - Math.random() * 3
      );
    }
  }
  updateCyberFireworks(dt);
}

function createGoat() {
  const group = new THREE.Group();
  const fur = new THREE.MeshStandardMaterial({ color: 0xf2e6d0, roughness: 0.88, metalness: 0.02 });
  const furDark = new THREE.MeshStandardMaterial({ color: 0xd4c4a8, roughness: 0.9 });
  const furBelly = new THREE.MeshStandardMaterial({ color: 0xfff8ee, roughness: 0.85 });
  const hornMat = new THREE.MeshStandardMaterial({ color: 0xc4a574, roughness: 0.55, metalness: 0.15 });
  const hoofMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.6 });
  const noseMat = new THREE.MeshStandardMaterial({ color: 0x2a1f1a, roughness: 0.45 });
  fur.emissive = new THREE.Color(0xffcc88);
  fur.emissiveIntensity = 0.05;

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.4, 22, 18), fur);
  body.scale.set(1.15, 0.95, 0.85);
  body.castShadow = true;
  group.add(body);

  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), furBelly);
  belly.position.set(0.02, -0.18, 0.12);
  belly.scale.set(1.05, 0.7, 0.75);
  group.add(belly);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.22, 10), fur);
  neck.position.set(0.28, 0.12, 0);
  neck.rotation.z = -0.55;
  neck.castShadow = true;
  group.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 18, 14), fur);
  head.position.set(0.42, 0.28, 0);
  head.scale.set(1.05, 0.95, 0.88);
  head.castShadow = true;
  group.add(head);

  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), furDark);
  snout.position.set(0.62, 0.2, 0);
  snout.scale.set(1.15, 0.75, 0.85);
  group.add(snout);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), noseMat);
  nose.position.set(0.74, 0.2, 0);
  nose.scale.set(0.7, 0.65, 1.1);
  group.add(nose);

  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), eyeWhiteMat);
  eyeL.position.set(0.52, 0.36, 0.16);
  eyeL.scale.set(1, 0.85, 0.7);
  group.add(eyeL);
  const eyeR = eyeL.clone();
  eyeR.position.set(0.52, 0.36, -0.16);
  group.add(eyeR);

  const pupilMat = new THREE.MeshStandardMaterial({ color: 0x1a1420, roughness: 0.2 });
  const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), pupilMat);
  pupilL.position.set(0.58, 0.37, 0.18);
  pupilL.scale.set(0.55, 1.4, 0.55);
  group.add(pupilL);
  const pupilR = pupilL.clone();
  pupilR.position.set(0.58, 0.37, -0.18);
  group.add(pupilR);

  const shine = new THREE.Mesh(
    new THREE.SphereGeometry(0.012, 6, 6),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  shine.position.set(0.6, 0.4, 0.19);
  group.add(shine);
  const shineR = shine.clone();
  shineR.position.set(0.6, 0.4, -0.19);
  group.add(shineR);

  function makeHorn(side) {
    const hornGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const t = i / 4;
      const r = 0.055 * (1 - t * 0.55);
      const seg = new THREE.Mesh(new THREE.SphereGeometry(r, 7, 5), hornMat);
      seg.position.set(0.08 + t * 0.06 - t * t * 0.12, t * 0.28, side * (0.08 + t * 0.12));
      hornGroup.add(seg);
    }
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.1, 6), hornMat);
    tip.position.set(-0.02, 0.32, side * 0.22);
    tip.rotation.z = 0.5;
    tip.rotation.x = side * -0.4;
    hornGroup.add(tip);
    hornGroup.position.set(0.38, 0.42, side * 0.1);
    return hornGroup;
  }
  group.add(makeHorn(1));
  group.add(makeHorn(-1));

  const earL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), furDark);
  earL.scale.set(0.55, 1.1, 0.35);
  earL.position.set(0.32, 0.4, 0.28);
  earL.rotation.z = 0.35;
  earL.rotation.x = 0.4;
  earL.castShadow = true;
  group.add(earL);
  const earR = earL.clone();
  earR.position.set(0.32, 0.4, -0.28);
  earR.rotation.x = -0.4;
  group.add(earR);

  const beard = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.22, 8), furDark);
  beard.position.set(0.58, 0.02, 0);
  beard.rotation.z = 0.15;
  group.add(beard);

  function makeLeg(x, z) {
    const leg = new THREE.Group();
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.22, 7), furDark);
    upper.position.y = -0.11;
    leg.add(upper);
    const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.16, 7), furDark);
    lower.position.y = -0.28;
    leg.add(lower);
    const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.08), hoofMat);
    hoof.position.y = -0.38;
    leg.add(hoof);
    leg.position.set(x, -0.28, z);
    group.add(leg);
    return leg;
  }

  const legFL = makeLeg(0.18, 0.16);
  const legFR = makeLeg(0.18, -0.16);
  const legBL = makeLeg(-0.18, 0.14);
  const legBR = makeLeg(-0.18, -0.14);

  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), fur);
  tail.position.set(-0.42, 0.08, 0);
  tail.scale.set(0.7, 0.9, 0.7);
  group.add(tail);
  const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 7, 5), furDark);
  tailTip.position.set(-0.5, 0.02, 0);
  group.add(tailTip);

  group.position.set(CFG.goatX, 0, 0);
  scene.add(group);

  goat.mesh = group;
  goat.earL = earL;
  goat.earR = earR;
  goat.legFL = legFL;
  goat.legFR = legFR;
  goat.legBL = legBL;
  goat.legBR = legBR;
  goat.parts = attachGoatCosmetics(group);
  applyLoadoutVisuals();
}

/** Procedural cosmetics / weapon meshes parented to the goat */
function attachGoatCosmetics(group) {
  const parts = {};
  const yellow = new THREE.MeshStandardMaterial({ color: 0xf5c542, roughness: 0.55, metalness: 0.2, emissive: 0x664400, emissiveIntensity: 0.15 });
  const orange = new THREE.MeshStandardMaterial({ color: 0xff6a1a, roughness: 0.5, metalness: 0.15, emissive: 0x662200, emissiveIntensity: 0.12 });
  const blackG = new THREE.MeshStandardMaterial({ color: 0x1a1a22, roughness: 0.35, metalness: 0.35 });
  const cyan = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.25, metalness: 0.6, emissive: 0x00a0ff, emissiveIntensity: 0.55 });
  const magenta = new THREE.MeshStandardMaterial({ color: 0xff2d95, roughness: 0.3, metalness: 0.5, emissive: 0xaa0060, emissiveIntensity: 0.4 });
  const silver = new THREE.MeshStandardMaterial({ color: 0xc0c8d0, roughness: 0.35, metalness: 0.75 });
  const gunMat = new THREE.MeshStandardMaterial({ color: 0x3a3a44, roughness: 0.45, metalness: 0.55 });
  const gunAccent = new THREE.MeshStandardMaterial({ color: 0xff8a4c, roughness: 0.4, metalness: 0.4, emissive: 0x662200, emissiveIntensity: 0.25 });
  const redKnit = new THREE.MeshStandardMaterial({ color: 0xc43c3c, roughness: 0.85, metalness: 0.05, emissive: 0x401010, emissiveIntensity: 0.08 });
  const creamKnit = new THREE.MeshStandardMaterial({ color: 0xf0e0d0, roughness: 0.9 });
  const teeBlue = new THREE.MeshStandardMaterial({ color: 0x3a7bd5, roughness: 0.7, metalness: 0.05, emissive: 0x102040, emissiveIntensity: 0.1 });
  const denim = new THREE.MeshStandardMaterial({ color: 0x3a4f7a, roughness: 0.75, metalness: 0.1 });
  const sneaker = new THREE.MeshStandardMaterial({ color: 0xffe033, roughness: 0.45, metalness: 0.12, emissive: 0x554400, emissiveIntensity: 0.12 });
  const sneakerAccent = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0.2 });
  const capRed = new THREE.MeshStandardMaterial({ color: 0xd43030, roughness: 0.55, metalness: 0.1 });
  const capNavy = new THREE.MeshStandardMaterial({ color: 0x1a2a4a, roughness: 0.55 });
  const santaRed = new THREE.MeshStandardMaterial({ color: 0xd42030, roughness: 0.7, emissive: 0x400810, emissiveIntensity: 0.12 });
  const santaWhite = new THREE.MeshStandardMaterial({ color: 0xf8f8f8, roughness: 0.9 });
  const laserBody = new THREE.MeshStandardMaterial({ color: 0x1a2030, roughness: 0.35, metalness: 0.7, emissive: 0x001830, emissiveIntensity: 0.3 });
  const laserGlow = new THREE.MeshStandardMaterial({ color: 0xff2060, roughness: 0.25, metalness: 0.5, emissive: 0xff1040, emissiveIntensity: 0.85 });

  // ── Hard hat ──────────────────────────────────────────────────────────────
  {
    const g = new THREE.Group();
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), yellow);
    dome.position.y = 0.02;
    g.add(dome);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.04, 16), yellow);
    brim.position.y = -0.02;
    g.add(brim);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.42), orange);
    stripe.position.y = 0.08;
    g.add(stripe);
    g.position.set(0.4, 0.58, 0);
    g.visible = false;
    group.add(g);
    parts['hat-hardhat'] = g;
  }

  // Traffic cone
  {
    const g = new THREE.Group();
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.32, 10), orange);
    cone.position.y = 0.12;
    g.add(cone);
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.28), blackG);
    g.add(base);
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 6, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }));
    band.rotation.x = Math.PI / 2;
    band.position.y = 0.1;
    g.add(band);
    g.position.set(0.4, 0.58, 0);
    g.visible = false;
    group.add(g);
    parts['hat-cone'] = g;
  }

  // Baseball cap
  {
    const g = new THREE.Group();
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), capRed);
    crown.position.y = 0.02;
    crown.scale.set(1.05, 0.85, 1.05);
    g.add(crown);
    // brim (flat disc half)
    const brim = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.28), capNavy);
    brim.position.set(0.16, -0.02, 0);
    brim.rotation.z = -0.12;
    g.add(brim);
    const button = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), silver);
    button.position.y = 0.14;
    g.add(button);
    g.position.set(0.4, 0.56, 0);
    g.rotation.z = -0.08;
    g.visible = false;
    group.add(g);
    parts['hat-baseball'] = g;
  }

  // Santa hat
  {
    const g = new THREE.Group();
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.42, 12), santaRed);
    cone.position.y = 0.16;
    cone.rotation.z = 0.35;
    cone.position.x = -0.06;
    g.add(cone);
    const trim = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 8, 16), santaWhite);
    trim.rotation.x = Math.PI / 2;
    trim.position.y = -0.02;
    g.add(trim);
    const pom = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), santaWhite);
    pom.position.set(-0.18, 0.38, 0);
    g.add(pom);
    g.position.set(0.4, 0.55, 0);
    g.userData.soft = { type: 'santa', pom, basePom: { x: -0.18, y: 0.38, z: 0 }, swing: 0, vel: 0 };
    g.visible = false;
    group.add(g);
    parts['hat-santa'] = g;
  }

  // VR headset (white) — oversized so it reads clearly from the side camera
  {
    const g = new THREE.Group();
    const whiteShell = new THREE.MeshStandardMaterial({
      color: 0xf5f5f8,
      roughness: 0.35,
      metalness: 0.25,
      emissive: 0x222228,
      emissiveIntensity: 0.1,
    });
    const darkLens = new THREE.MeshStandardMaterial({
      color: 0x101018,
      roughness: 0.15,
      metalness: 0.55,
      emissive: 0x050510,
      emissiveIntensity: 0.25,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: 0xe8e8ee,
      roughness: 0.4,
      metalness: 0.3,
    });
    // Main headset body (chunky)
    const shell = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.26, 0.62), whiteShell);
    shell.position.set(0.04, 0, 0);
    g.add(shell);
    // Front faceplate
    const face = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.58), whiteShell);
    face.position.set(0.16, 0, 0);
    g.add(face);
    // Dual dark lenses
    const lensL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.06, 14), darkLens);
    lensL.rotation.z = Math.PI / 2;
    lensL.position.set(0.2, 0, 0.14);
    g.add(lensL);
    const lensR = lensL.clone();
    lensR.position.z = -0.14;
    g.add(lensR);
    // Top strap mount
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.52), accent);
    brow.position.set(0.02, 0.14, 0);
    g.add(brow);
    // Side straps
    for (const z of [0.28, -0.28]) {
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 0.08), whiteShell);
      strap.position.set(-0.16, 0, z);
      g.add(strap);
    }
    // Rear band
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.045, 8, 16, Math.PI * 1.2), whiteShell);
    band.rotation.y = Math.PI / 2;
    band.position.set(-0.16, 0, 0);
    g.add(band);
    // Status LED
    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0x40ffaa })
    );
    led.position.set(0.18, 0.1, 0);
    g.add(led);
    // Sit on face, pushed out so it isn't buried in the head mesh
    g.position.set(0.62, 0.36, 0);
    g.scale.setScalar(1.15);
    g.visible = false;
    group.add(g);
    parts['glasses-shades'] = g;
  }

  // Cyber visor
  {
    const g = new THREE.Group();
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.42), cyan);
    g.add(visor);
    const rim = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.46), magenta);
    rim.position.x = -0.04;
    g.add(rim);
    const glow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.38), new THREE.MeshBasicMaterial({ color: 0x66ffff }));
    glow.position.x = 0.04;
    g.add(glow);
    g.position.set(0.7, 0.36, 0);
    g.visible = false;
    group.add(g);
    parts['glasses-visor'] = g;
  }

  // ── Body: cozy sweater (covers torso + belly) ─────────────────────────────
  {
    const g = new THREE.Group();
    // Main torso shell — slightly larger than body sphere (r0.4 * scale)
    const torso = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 16), redKnit);
    torso.scale.set(1.22, 1.02, 0.95);
    torso.position.set(0, -0.02, 0);
    g.add(torso);
    // Belly panel
    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 12), creamKnit);
    belly.scale.set(1.0, 0.65, 0.7);
    belly.position.set(0.02, -0.18, 0.14);
    g.add(belly);
    // Collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.045, 8, 16), creamKnit);
    collar.rotation.x = Math.PI / 2.3;
    collar.position.set(0.22, 0.14, 0);
    g.add(collar);
    // Sleeves on shoulders (front)
    for (const z of [0.22, -0.22]) {
      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.28, 10), redKnit);
      sleeve.position.set(0.12, -0.08, z);
      sleeve.rotation.x = z > 0 ? 0.5 : -0.5;
      sleeve.rotation.z = 0.35;
      g.add(sleeve);
    }
    // Cuff stripes
    const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 6, 16), creamKnit);
    stripe.rotation.x = Math.PI / 2;
    stripe.position.set(-0.05, -0.28, 0);
    stripe.scale.set(1.1, 1, 0.9);
    g.add(stripe);
    g.visible = false;
    group.add(g);
    parts['body-sweater'] = g;
  }

  // ── Body: graphic tee ─────────────────────────────────────────────────────
  {
    const g = new THREE.Group();
    const torso = new THREE.Mesh(new THREE.SphereGeometry(0.41, 18, 14), teeBlue);
    torso.scale.set(1.2, 0.78, 0.92);
    torso.position.set(0.02, 0.02, 0);
    g.add(torso);
    // short sleeves
    for (const z of [0.24, -0.24]) {
      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.16, 8), teeBlue);
      sleeve.position.set(0.1, 0.02, z);
      sleeve.rotation.x = z > 0 ? 0.65 : -0.65;
      g.add(sleeve);
    }
    // graphic print on side facing camera
    const print = new THREE.Mesh(
      new THREE.CircleGeometry(0.12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffe066 })
    );
    print.position.set(0.05, 0.02, 0.36);
    g.add(print);
    const print2 = new THREE.Mesh(
      new THREE.CircleGeometry(0.06, 8),
      new THREE.MeshBasicMaterial({ color: 0xff4060 })
    );
    print2.position.set(0.05, 0.02, 0.38);
    g.add(print2);
    // hem
    const hem = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.4, 0.06, 16), blackG);
    hem.position.set(0, -0.22, 0);
    hem.scale.set(1.05, 1, 0.85);
    g.add(hem);
    g.visible = false;
    group.add(g);
    parts['body-tshirt'] = g;
  }

  // ── Pants: denim on all four legs (parented to leg groups) ─────────────────
  {
    const g = new THREE.Group(); // container for visibility toggle only
    g.visible = false;
    const pantMeshes = [];
    const legs = [
      { leg: goat.legFL, x: 0.18, z: 0.16 },
      { leg: goat.legFR, x: 0.18, z: -0.16 },
      { leg: goat.legBL, x: -0.18, z: 0.14 },
      { leg: goat.legBR, x: -0.18, z: -0.14 },
    ];
    for (const { leg } of legs) {
      if (!leg) continue;
      const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.058, 0.24, 10), denim);
      upper.position.y = -0.1;
      leg.add(upper);
      pantMeshes.push(upper);
      const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.048, 0.14, 8), denim);
      lower.position.y = -0.26;
      leg.add(lower);
      pantMeshes.push(lower);
      // cuff
      const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 6, 10), blackG);
      cuff.rotation.x = Math.PI / 2;
      cuff.position.y = -0.33;
      leg.add(cuff);
      pantMeshes.push(cuff);
    }
    // waistband around body bottom
    const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.4, 0.1, 16), denim);
    waist.position.set(0, -0.32, 0);
    waist.scale.set(1.05, 1, 0.82);
    g.add(waist);
    pantMeshes.push(waist);
    g.userData.pantMeshes = pantMeshes;
    for (const m of pantMeshes) m.visible = false;
    group.add(g);
    parts['pants-jeans'] = g;
  }

  // ── Pants: party shorts (short, bright, only upper legs) ──────────────────
  {
    const g = new THREE.Group();
    g.visible = false;
    const pantMeshes = [];
    const shortMat = new THREE.MeshStandardMaterial({
      color: 0xff5a9a,
      roughness: 0.65,
      metalness: 0.05,
      emissive: 0x401028,
      emissiveIntensity: 0.12,
    });
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xffe066,
      roughness: 0.55,
      emissive: 0x665500,
      emissiveIntensity: 0.15,
    });
    const legs = [goat.legFL, goat.legFR, goat.legBL, goat.legBR];
    for (const leg of legs) {
      if (!leg) continue;
      // Short upper only — no lower pant leg
      const short = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.16, 10), shortMat);
      short.position.y = -0.08;
      leg.add(short);
      pantMeshes.push(short);
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.072, 0.014, 6, 12), stripeMat);
      band.rotation.x = Math.PI / 2;
      band.position.y = -0.15;
      leg.add(band);
      pantMeshes.push(band);
    }
    // Loud waistband
    const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.41, 0.09, 16), shortMat);
    waist.position.set(0, -0.3, 0);
    waist.scale.set(1.05, 1, 0.82);
    g.add(waist);
    pantMeshes.push(waist);
    const waistStripe = new THREE.Mesh(new THREE.CylinderGeometry(0.405, 0.42, 0.035, 16), stripeMat);
    waistStripe.position.set(0, -0.27, 0);
    waistStripe.scale.set(1.05, 1, 0.82);
    g.add(waistStripe);
    pantMeshes.push(waistStripe);
    g.userData.pantMeshes = pantMeshes;
    for (const m of pantMeshes) m.visible = false;
    group.add(g);
    parts['pants-shorts'] = g;
  }

  // ── Shoes: sneakers on each hoof (oversized yellow kicks) ─────────────────
  {
    const g = new THREE.Group();
    g.visible = false;
    const shoeMeshes = [];
    const legs = [goat.legFL, goat.legFR, goat.legBL, goat.legBR];
    for (const leg of legs) {
      if (!leg) continue;
      const shoe = new THREE.Group();
      shoe.visible = false;
      // Big chunky sole
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.07, 0.16), blackG);
      sole.position.set(0.03, -0.42, 0);
      shoe.add(sole);
      // Tall yellow upper
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.15), sneaker);
      upper.position.set(0.03, -0.34, 0);
      shoe.add(upper);
      // White stripe accent
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.09, 0.16), sneakerAccent);
      stripe.position.set(0.04, -0.34, 0);
      shoe.add(stripe);
      // Rounded toe
      const toe = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), sneaker);
      toe.scale.set(1.2, 0.75, 1.05);
      toe.position.set(0.1, -0.35, 0);
      shoe.add(toe);
      // Heel tab
      const heel = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.14), sneaker);
      heel.position.set(-0.05, -0.32, 0);
      shoe.add(heel);
      shoe.scale.setScalar(1.25);
      leg.add(shoe);
      shoeMeshes.push(shoe);
    }
    g.userData.shoeMeshes = shoeMeshes;
    group.add(g);
    parts['shoes-kicks'] = g;
  }

  // ── Shoes: chunky work boots ──────────────────────────────────────────────
  {
    const g = new THREE.Group();
    g.visible = false;
    const shoeMeshes = [];
    const bootMat = new THREE.MeshStandardMaterial({
      color: 0x5a3820,
      roughness: 0.7,
      metalness: 0.15,
    });
    const bootDark = new THREE.MeshStandardMaterial({
      color: 0x2a1a10,
      roughness: 0.65,
      metalness: 0.2,
    });
    const steel = new THREE.MeshStandardMaterial({
      color: 0xa0a8b0,
      roughness: 0.35,
      metalness: 0.8,
    });
    const legs = [goat.legFL, goat.legFR, goat.legBL, goat.legBR];
    for (const leg of legs) {
      if (!leg) continue;
      const boot = new THREE.Group();
      boot.visible = false;
      // tall shaft covering lower leg
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.065, 0.2, 10), bootMat);
      shaft.position.y = -0.3;
      boot.add(shaft);
      // sole
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 0.11), bootDark);
      sole.position.set(0.02, -0.41, 0);
      boot.add(sole);
      // toe box
      const toe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.1), steel);
      toe.position.set(0.06, -0.37, 0);
      boot.add(toe);
      // lace panel
      const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.08), bootMat);
      tongue.position.set(0.02, -0.3, 0);
      boot.add(tongue);
      leg.add(boot);
      shoeMeshes.push(boot);
    }
    g.userData.shoeMeshes = shoeMeshes;
    group.add(g);
    parts['shoes-boots'] = g;
  }

  // Pipe blaster
  {
    const g = new THREE.Group();
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.35, 8), gunMat);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0.15, 0, 0);
    g.add(barrel);
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.1), gunMat);
    g.add(body);
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.04, 0.06, 8), gunAccent);
    tip.rotation.z = Math.PI / 2;
    tip.position.set(0.34, 0, 0);
    g.add(tip);
    g.position.set(0.15, -0.05, 0.28);
    g.rotation.y = -0.2;
    g.visible = false;
    group.add(g);
    parts['weapon-blaster'] = g;
  }

  // Laser shooter
  {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.1), laserBody);
    g.add(body);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.32, 10), laserBody);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0.2, 0.02, 0);
    g.add(barrel);
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.34, 8), laserGlow);
    core.rotation.z = Math.PI / 2;
    core.position.set(0.2, 0.02, 0);
    g.add(core);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), laserGlow);
    tip.position.set(0.38, 0.02, 0);
    g.add(tip);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.07), blackG);
    handle.position.set(-0.04, -0.1, 0);
    g.add(handle);
    g.position.set(0.18, -0.02, 0.28);
    g.visible = false;
    group.add(g);
    parts['weapon-laser'] = g;
  }

  return parts;
}

function setPartVisible(mesh, on) {
  if (!mesh) return;
  mesh.visible = on;
  // pants/shoes store extra meshes parented to legs
  if (mesh.userData.pantMeshes) {
    for (const m of mesh.userData.pantMeshes) m.visible = on;
  }
  if (mesh.userData.shoeMeshes) {
    for (const m of mesh.userData.shoeMeshes) m.visible = on;
  }
}

function applyLoadoutVisuals() {
  if (!goat.parts) return;
  for (const [id, mesh] of Object.entries(goat.parts)) {
    const trade = tradeById(id);
    if (!trade) {
      setPartVisible(mesh, false);
      continue;
    }
    const slot = trade.type;
    setPartVisible(mesh, equipped[slot] === id);
  }
}

/** Soft motion for hats / loose bits */
function updateClothingPhysics(dt) {
  if (!goat.parts) return;
  const accel = THREE.MathUtils.clamp(-goat.vy * 0.08 + goat.flapPhase * 0.35, -0.9, 0.9);
  const target = accel + Math.sin(time * 3.2) * 0.04;

  for (const mesh of Object.values(goat.parts)) {
    if (!mesh.visible || !mesh.userData.soft) continue;
    const s = mesh.userData.soft;
    const k = 16;
    const d = 6.5;
    s.vel += (target * 1.1 - s.swing) * k * dt;
    s.vel *= Math.max(0, 1 - d * dt);
    s.swing += s.vel * dt;
    s.swing = THREE.MathUtils.clamp(s.swing, -1.0, 1.0);

    if (s.type === 'santa' && s.pom) {
      s.pom.position.x = s.basePom.x + s.swing * 0.08;
      s.pom.position.y = s.basePom.y + Math.abs(s.swing) * 0.04;
      s.pom.position.z = s.basePom.z + Math.sin(time * 5) * 0.02;
    }
  }
}

function equippedWeaponTrade() {
  if (!equipped.weapon) return null;
  return tradeById(equipped.weapon);
}

function applyFireBtnSide() {
  if (!fireBtn) return;
  const side = settings.fireSide === 'left' ? 'left' : 'right';
  fireBtn.classList.toggle('fire-left', side === 'left');
  fireBtn.classList.toggle('fire-right', side === 'right');
}

function refreshWeaponHUD() {
  if (!fireBtn) return;
  applyFireBtnSide();
  const w = equippedWeaponTrade();
  if (state === State.PLAYING && w && weaponShots > 0) {
    show(fireBtn);
    fireBtn.classList.remove('spent');
    if (fireCountEl) fireCountEl.textContent = String(weaponShots);
  } else if (state === State.PLAYING && w) {
    show(fireBtn);
    fireBtn.classList.add('spent');
    if (fireCountEl) fireCountEl.textContent = '0';
  } else {
    hide(fireBtn);
    fireBtn.classList.remove('spent');
  }
}

// ─── Pipes ────────────────────────────────────────────────────────────────────
class PipePair {
  constructor(x, gapCenter, gapSize = CFG.pipeGap) {
    this.x = x;
    this.gapCenter = gapCenter;
    this.scored = false;
    this.nearMissed = false;
    this.group = new THREE.Group();

    const halfGap = gapSize / 2;
    // Extend well past top/bottom of the camera so pipes never start mid-frame
    const gapTop = gapCenter + halfGap;
    const gapBot = gapCenter - halfGap;
    const topH = Math.max(1.2, CFG.pipeTopY - gapTop);
    const botH = Math.max(1.2, gapBot - CFG.pipeBotY);

    this.top = this.makePipe(topH, true);
    this.bot = this.makePipe(botH, false);
    // Centers so the gap-facing ends sit exactly on the gap edge
    this.top.position.y = gapTop + topH / 2;
    this.bot.position.y = gapBot - botH / 2;
    this.group.add(this.top);
    this.group.add(this.bot);
    this.group.position.x = x;
    this.group.userData.neon = !!(this.top.userData.neon || this.bot.userData.neon);
    scene.add(this.group);

    this.gapTop = gapTop;
    this.gapBot = gapBot;
    this.halfW = (CFG.pipeWidth / 2) * 0.92;
  }

  makePipe(height, isTop) {
    const g = new THREE.Group();
    const radius = CFG.pipeWidth / 2;
    const segs = isMobile ? 16 : 22;
    const theme = activeTheme();
    const p = theme.pipe;
    const isNeon = !!p.neon;
    // Pick a neon hue from palette (or base hue with small shift)
    const hues = p.neonHues && p.neonHues.length ? p.neonHues : [p.h];
    const hue = hues[Math.floor(Math.random() * hues.length)];
    const hue2 = hues[Math.floor(Math.random() * hues.length)];
    const hueShift = isNeon ? 0 : (Math.random() - 0.5) * 0.05;
    const h = hue + hueShift;
    const emisIntensity = isNeon ? (p.emissiveIntensity ?? 0.95) : 0.2;
    const emisColor = isNeon
      ? new THREE.Color().setHSL(h, 1, 0.45)
      : new THREE.Color(p.emissive);

    const shaftMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(h, isNeon ? 0.95 : p.s, isNeon ? 0.45 : p.l),
      roughness: isNeon ? 0.18 : 0.34,
      metalness: isNeon ? 0.55 : 0.26,
      emissive: emisColor,
      emissiveIntensity: emisIntensity,
    });

    // Circular tube body — long enough to leave the frame
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, height, segs),
      shaftMat
    );
    shaft.castShadow = !isNeon;
    shaft.receiveShadow = true;
    shaft.userData.pipePart = 'shaft';
    g.add(shaft);

    // Neon outer halo (additive-ish via emissive shell)
    if (isNeon) {
      const halo = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 1.08, radius * 1.08, height * 0.98, segs, 1, true),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(h, 1, 0.55),
          transparent: true,
          opacity: 0.22,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      halo.userData.pipePart = 'halo';
      g.add(halo);
    }

    const stripe = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.18, radius * 0.18, height * 0.92, 8),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(hue2, Math.min(1, p.s + 0.1), Math.min(0.75, p.l + 0.15)),
        roughness: isNeon ? 0.15 : 0.3,
        metalness: isNeon ? 0.5 : 0.35,
        emissive: isNeon ? new THREE.Color().setHSL(hue2, 1, 0.4) : new THREE.Color(p.emissive),
        emissiveIntensity: isNeon ? 1.1 : 0.35,
      })
    );
    stripe.position.x = -radius * 0.55;
    stripe.userData.pipePart = 'stripe';
    g.add(stripe);

    // Rounded lip / cap at the gap edge only
    const capH = 0.42;
    const capColor = isNeon ? new THREE.Color().setHSL(hue2, 1, 0.55) : new THREE.Color(p.cap);
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 1.28, radius * 1.22, capH, segs),
      new THREE.MeshStandardMaterial({
        color: capColor,
        roughness: isNeon ? 0.15 : 0.28,
        metalness: isNeon ? 0.5 : 0.3,
        emissive: isNeon ? capColor.clone() : new THREE.Color(p.emissive),
        emissiveIntensity: isNeon ? 0.85 : 0.28,
      })
    );
    cap.position.y = isTop ? -height / 2 + capH / 2 : height / 2 - capH / 2;
    cap.castShadow = !isNeon;
    cap.userData.pipePart = 'cap';
    g.add(cap);

    const rimColor = isNeon ? new THREE.Color().setHSL(h, 1, 0.6) : new THREE.Color(p.rim);
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 1.08, isNeon ? 0.07 : 0.055, 8, segs),
      new THREE.MeshStandardMaterial({
        color: rimColor,
        emissive: rimColor,
        emissiveIntensity: isNeon ? 1.2 : 0.55,
        roughness: 0.15,
        metalness: isNeon ? 0.4 : 0.2,
      })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = isTop ? -height / 2 + 0.04 : height / 2 - 0.04;
    rim.userData.pipePart = 'rim';
    g.add(rim);

    // Extra neon ring under lip
    if (isNeon) {
      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 1.18, 0.035, 6, segs),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(hue2, 1, 0.6),
          transparent: true,
          opacity: 0.75,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      ring2.rotation.x = Math.PI / 2;
      ring2.position.y = isTop ? -height / 2 + 0.12 : height / 2 - 0.12;
      ring2.userData.pipePart = 'ring2';
      g.add(ring2);
    }

    const mouth = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.72, radius * 0.72, 0.06, segs),
      new THREE.MeshStandardMaterial({
        color: isNeon ? 0x050510 : 0x0a1210,
        roughness: 0.9,
        metalness: 0.05,
        emissive: isNeon ? new THREE.Color().setHSL(h, 1, 0.15) : new THREE.Color(0x041510),
        emissiveIntensity: isNeon ? 0.6 : 0.4,
      })
    );
    mouth.position.y = isTop ? -height / 2 + 0.01 : height / 2 - 0.01;
    mouth.userData.pipePart = 'mouth';
    g.add(mouth);

    g.userData.neon = isNeon;
    g.userData.neonHue = h;
    g.userData.neonHue2 = hue2;
    return g;
  }

  collides(goatY, goatR) {
    const dx = Math.abs(this.x - CFG.goatX);
    if (dx > this.halfW + goatR * 0.75) return false;
    if (goatY + goatR * 0.7 > this.gapTop) return true;
    if (goatY - goatR * 0.7 < this.gapBot) return true;
    return false;
  }

  isNearMiss(goatY, goatR) {
    const dx = Math.abs(this.x - CFG.goatX);
    if (dx > this.halfW + goatR * 0.9 || dx < this.halfW * 0.2) return false;
    const topDist = this.gapTop - (goatY + goatR * 0.55);
    const botDist = goatY - goatR * 0.55 - this.gapBot;
    return (topDist > 0 && topDist < CFG.nearMissPad) || (botDist > 0 && botDist < CFG.nearMissPad);
  }

  isPerfect(goatY) {
    return Math.abs(goatY - this.gapCenter) < 0.22;
  }

  dispose() {
    scene.remove(this.group);
    this.group.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
  }
}

function spawnPipe(gapSize = CFG.pipeGap) {
  const margin = 1.35;
  const halfGap = gapSize / 2;
  const minC = CFG.groundY + halfGap + margin;
  const maxC = CFG.ceilingY - halfGap - margin;
  // Gentle sine bias so gaps aren't pure noise
  const wave = Math.sin(time * 0.55 + score * 0.4) * 0.35;
  let gapCenter = minC + Math.random() * (maxC - minC);
  gapCenter = THREE.MathUtils.clamp(gapCenter + wave * (maxC - minC) * 0.15, minC, maxC);
  pipes.push(new PipePair(CFG.pipeStartX, gapCenter, gapSize));
}

// ─── Particles ────────────────────────────────────────────────────────────────
function toColor(c) {
  if (c instanceof THREE.Color) return c;
  return new THREE.Color(c);
}

function spawnBurst(x, y, count, colors, speed = 4, life = 0.5) {
  const positions = new Float32Array(count * 3);
  const velocities = [];
  const cols = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = x + (Math.random() - 0.5) * 0.15;
    positions[i * 3 + 1] = y + (Math.random() - 0.5) * 0.15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
    const a = Math.random() * Math.PI * 2;
    const sp = speed * (0.4 + Math.random());
    velocities.push({
      x: Math.cos(a) * sp * (Math.random() > 0.3 ? 1 : -0.4),
      y: Math.sin(a) * sp,
      z: (Math.random() - 0.5) * sp * 0.5,
    });
    const c = toColor(colors[i % colors.length]);
    cols[i * 3] = c.r;
    cols[i * 3 + 1] = c.g;
    cols[i * 3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const pts = new THREE.Points(geo, mat);
  pts.userData = { life, maxLife: life, velocities };
  scene.add(pts);
  particles.push(pts);
}

function spawnFlapParticles(x, y) {
  // Short-lived burst only on tap — no continuous trail
  const count = 14;
  const positions = new Float32Array(count * 3);
  const velocities = [];
  const cols = new Float32Array(count * 3);
  const cWarm = [new THREE.Color(0xffd166), new THREE.Color(0xff8a4c), new THREE.Color(0xfff1c1)];
  for (let i = 0; i < count; i++) {
    positions[i * 3] = x + (Math.random() - 0.5) * 0.12;
    positions[i * 3 + 1] = y + (Math.random() - 0.5) * 0.1;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
    // Spray mostly downward / backward so it reads as a flap puff
    velocities.push({
      x: -1.2 - Math.random() * 2.2,
      y: -1.5 - Math.random() * 2.5,
      z: (Math.random() - 0.5) * 1.4,
    });
    const c = cWarm[i % cWarm.length];
    cols[i * 3] = c.r;
    cols[i * 3 + 1] = c.g;
    cols[i * 3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.16,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const pts = new THREE.Points(geo, mat);
  pts.userData = { life: 0.32, maxLife: 0.32, velocities, drag: 3.5 };
  scene.add(pts);
  particles.push(pts);
}

function spawnScoreSpark(x, y) {
  spawnBurst(x, y, 10, [new THREE.Color(0x5eead4), new THREE.Color(0xa7f3d0)], 2.8, 0.45);
}

function spawnDeathBurst(x, y) {
  spawnBurst(
    x,
    y,
    32,
    [new THREE.Color(0xff6b6b), new THREE.Color(0xff8a4c), new THREE.Color(0xffd166)],
    6.5,
    0.75
  );
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.userData.life -= dt;
    const t = p.userData.life / p.userData.maxLife;
    p.material.opacity = Math.max(0, t);
    p.material.size = 0.06 + 0.14 * t;
    const pos = p.geometry.attributes.position;
    const vels = p.userData.velocities;
    const drag = p.userData.drag || 0;
    for (let j = 0; j < vels.length; j++) {
      pos.array[j * 3] += vels[j].x * dt;
      pos.array[j * 3 + 1] += vels[j].y * dt;
      pos.array[j * 3 + 2] += vels[j].z * dt;
      vels[j].y -= 9 * dt;
      if (drag) {
        vels[j].x *= 1 - drag * dt;
        vels[j].z *= 1 - drag * dt;
      }
    }
    pos.needsUpdate = true;
    if (p.userData.life <= 0) {
      scene.remove(p);
      p.geometry.dispose();
      p.material.dispose();
      particles.splice(i, 1);
    }
  }
}

function clearProjectiles() {
  for (const p of projectiles) disposeProjectile(p);
  projectiles = [];
}

/** Projectile: 'bolt' (default) or 'laser' beam */
function spawnProjectile(x0, y0, x1, y1, onHit, style = 'bolt') {
  if (style === 'laser') {
    spawnLaserBeam(x0, y0, x1, y1, onHit);
    return;
  }
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 12, 10),
    new THREE.MeshBasicMaterial({ color: 0xffe080 })
  );
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 12, 10),
    new THREE.MeshBasicMaterial({
      color: 0xff6a20,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    })
  );
  core.scale.set(1.6, 0.7, 0.7);
  glow.scale.set(1.8, 0.9, 0.9);
  core.position.set(x0, y0, 0.5);
  glow.position.set(x0, y0, 0.45);
  scene.add(glow);
  scene.add(core);
  projectiles.push({
    kind: 'bolt',
    mesh: core,
    glow,
    t: 0,
    dur: 0.18 + Math.min(0.12, Math.abs(x1 - x0) * 0.03),
    x0,
    y0,
    x1,
    y1,
    onHit,
  });
}

function spawnLaserBeam(x0, y0, x1, y1, onHit) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.max(0.4, Math.hypot(dx, dy));
  const angle = Math.atan2(dy, dx);

  // Outer glow cylinder (along X, then rotate)
  const outer = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.09, len, 12, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xff2080,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    })
  );
  // Inner hot core
  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.03, len, 10, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  // Cylinder is Y-up; rotate to point along path
  const midX = (x0 + x1) / 2;
  const midY = (y0 + y1) / 2;
  for (const m of [outer, core]) {
    m.position.set(midX, midY, 0.55);
    m.rotation.z = angle - Math.PI / 2;
  }
  // Muzzle flare
  const flare = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 12, 10),
    new THREE.MeshBasicMaterial({
      color: 0xff60a0,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  flare.position.set(x0, y0, 0.55);
  // Impact spark
  const impact = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 12, 10),
    new THREE.MeshBasicMaterial({
      color: 0xffe0ff,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  impact.position.set(x1, y1, 0.55);

  scene.add(outer);
  scene.add(core);
  scene.add(flare);
  scene.add(impact);

  projectiles.push({
    kind: 'laser',
    mesh: core,
    glow: outer,
    flare,
    impact,
    t: 0,
    dur: 0.16,
    x0,
    y0,
    x1,
    y1,
    onHit,
    hitFired: false,
  });
}

function disposeProjectile(p) {
  const objs = [p.mesh, p.glow, p.flare, p.impact].filter(Boolean);
  for (const o of objs) {
    scene.remove(o);
    try {
      o.geometry?.dispose?.();
      o.material?.dispose?.();
    } catch (e) {
      /* ignore */
    }
  }
}

function updateProjectiles(dt) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.t += dt;
    const u = Math.min(1, p.t / p.dur);

    if (p.kind === 'laser') {
      // Beam stays locked on path; pulse + fade
      const pulse = 0.75 + Math.sin(p.t * 60) * 0.25;
      if (p.mesh) {
        p.mesh.scale.set(pulse, 1, pulse);
        p.mesh.material.opacity = 0.95 * (1 - u * 0.3);
      }
      if (p.glow) {
        p.glow.scale.set(1.1 * pulse, 1, 1.1 * pulse);
        p.glow.material.opacity = 0.5 * (1 - u * 0.5);
      }
      if (p.flare) {
        p.flare.scale.setScalar(1 + Math.sin(p.t * 40) * 0.35);
        p.flare.material.opacity = 0.9 * (1 - u);
      }
      if (p.impact) {
        p.impact.scale.setScalar(0.8 + u * 1.4 + Math.sin(p.t * 50) * 0.2);
        p.impact.material.opacity = 0.95 * (1 - u * 0.2);
      }
      // Hit early so pipe dies while beam still visible
      if (!p.hitFired && u >= 0.2) {
        p.hitFired = true;
        if (typeof p.onHit === 'function') {
          try {
            p.onHit();
          } catch (e) {
            console.warn('laser onHit', e);
          }
        }
      }
      if (u >= 1) {
        disposeProjectile(p);
        projectiles.splice(i, 1);
      }
      continue;
    }

    // bolt
    const e = 1 - (1 - u) * (1 - u);
    const x = p.x0 + (p.x1 - p.x0) * e;
    const y = p.y0 + (p.y1 - p.y0) * e + Math.sin(u * Math.PI) * 0.15;
    p.mesh.position.set(x, y, 0.5);
    p.glow.position.set(x, y, 0.45);
    p.mesh.rotation.z = Math.atan2(p.y1 - p.y0, p.x1 - p.x0);
    p.glow.rotation.z = p.mesh.rotation.z;
    if (Math.random() < 0.55) {
      try {
        spawnBurst(x, y, 3, [0xffe080, 0xff8a4c, 0xffffff], 2.5, 0.22);
      } catch (err) {
        /* ignore */
      }
    }
    if (u >= 1) {
      const cb = p.onHit;
      disposeProjectile(p);
      projectiles.splice(i, 1);
      if (typeof cb === 'function') {
        try {
          cb();
        } catch (err) {
          console.warn('projectile onHit', err);
        }
      }
    }
  }
}

// ─── Audio ────────────────────────────────────────────────────────────────────
let audioCtx = null;
let musicNodes = null;
let musicGain = null;

function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playTone({ freq = 440, type = 'sine', dur = 0.1, gain = 0.08, slide = 0, delay = 0 }) {
  if (!settings.sfx) return;
  try {
    const ctx = ensureAudio();
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  } catch {
    /* optional */
  }
}

function sfxFlap() {
  playTone({ freq: 540, type: 'triangle', dur: 0.07, gain: 0.055, slide: 300 });
  playTone({ freq: 720, type: 'sine', dur: 0.05, gain: 0.03, slide: 120, delay: 0.02 });
}

function sfxScore() {
  playTone({ freq: 660, type: 'sine', dur: 0.08, gain: 0.05 });
  playTone({ freq: 880, type: 'sine', dur: 0.1, gain: 0.04, delay: 0.055 });
  playTone({ freq: 1175, type: 'triangle', dur: 0.08, gain: 0.025, delay: 0.1 });
}

function sfxPerfect() {
  playTone({ freq: 784, type: 'sine', dur: 0.08, gain: 0.045 });
  playTone({ freq: 988, type: 'sine', dur: 0.1, gain: 0.04, delay: 0.06 });
  playTone({ freq: 1319, type: 'triangle', dur: 0.12, gain: 0.03, delay: 0.12 });
}

function sfxNear() {
  playTone({ freq: 420, type: 'triangle', dur: 0.05, gain: 0.03, slide: 80 });
}

function sfxHit() {
  playTone({ freq: 160, type: 'sawtooth', dur: 0.18, gain: 0.07, slide: -80 });
  playTone({ freq: 90, type: 'square', dur: 0.22, gain: 0.04, slide: -40 });
  playTone({ freq: 55, type: 'sine', dur: 0.28, gain: 0.05 });
}

function sfxMilestone() {
  [523, 659, 784, 1047].forEach((f, i) => {
    playTone({ freq: f, type: 'triangle', dur: 0.14, gain: 0.04, delay: i * 0.07 });
  });
}

function sfxGoatBleat() {
  if (!settings.sfx) return;
  try {
    const ctx = ensureAudio();
    const t0 = ctx.currentTime;
    const dur = 0.4 + Math.random() * 0.1;
    const base = 280 + Math.random() * 90;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.001, t0);
    master.gain.exponentialRampToValueAtTime(0.12, t0 + 0.04);
    master.gain.exponentialRampToValueAtTime(0.04, t0 + 0.18);
    master.gain.exponentialRampToValueAtTime(0.11, t0 + 0.24);
    master.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    master.connect(ctx.destination);

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 14 + Math.random() * 4;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 22;
    lfo.connect(lfoGain);

    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(base, t0);
    osc1.frequency.linearRampToValueAtTime(base * 0.92, t0 + dur);
    lfoGain.connect(osc1.frequency);

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(base * 1.5, t0);

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(900, t0);
    bp.Q.value = 4.5;

    const g1 = ctx.createGain();
    g1.gain.value = 0.32;
    const g2 = ctx.createGain();
    g2.gain.value = 0.2;
    osc1.connect(g1);
    osc2.connect(g2);
    g1.connect(bp);
    g2.connect(bp);
    bp.connect(master);

    lfo.start(t0);
    osc1.start(t0);
    osc2.start(t0);
    lfo.stop(t0 + dur + 0.05);
    osc1.stop(t0 + dur + 0.05);
    osc2.stop(t0 + dur + 0.05);
  } catch {
    /* optional */
  }
}

function startMusic() {
  if (!settings.music || musicNodes) return;
  try {
    const ctx = ensureAudio();
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.0;
    musicGain.connect(ctx.destination);
    musicGain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 1.2);

    // Soft pentatonic pad arpeggio
    const notes = [196, 220, 262, 294, 330, 392];
    const oscs = [];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = 0.0;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.08 + i * 0.03;
      const lg = ctx.createGain();
      lg.gain.value = 0.012;
      lfo.connect(lg);
      lg.connect(g.gain);
      osc.connect(g);
      g.connect(musicGain);
      osc.start();
      lfo.start();
      // gentle pulse
      const pulse = () => {
        if (!musicNodes) return;
        const t = ctx.currentTime;
        const peak = 0.018 + (i % 3) * 0.004;
        g.gain.cancelScheduledValues(t);
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(peak, t + 0.4);
        g.gain.linearRampToValueAtTime(0.004, t + 2.2 + (i % 4) * 0.3);
        setTimeout(pulse, 2400 + i * 180);
      };
      setTimeout(pulse, i * 200);
      oscs.push(osc, lfo);
    });
    musicNodes = oscs;
  } catch {
    musicNodes = null;
  }
}

function stopMusic(fade = true) {
  if (!musicGain || !audioCtx) {
    musicNodes = null;
    return;
  }
  try {
    const t = audioCtx.currentTime;
    if (fade) musicGain.gain.linearRampToValueAtTime(0.0001, t + 0.4);
    else musicGain.gain.value = 0;
  } catch {
    /* */
  }
  // leave oscillators; gain silent. Recreate on next start if needed.
}

function setMusicEnabled(on) {
  if (on) {
    if (musicNodes && musicGain && audioCtx) {
      musicGain.gain.linearRampToValueAtTime(0.045, audioCtx.currentTime + 0.5);
    } else {
      musicNodes = null;
      startMusic();
    }
  } else {
    stopMusic(true);
  }
}

// ─── Haptics ──────────────────────────────────────────────────────────────────
async function haptic(style = 'light') {
  if (!settings.haptics) return;
  try {
    if (window.Capacitor?.Plugins?.Haptics) {
      const H = window.Capacitor.Plugins.Haptics;
      if (style === 'heavy') await H.impact({ style: 'HEAVY' });
      else if (style === 'medium') await H.impact({ style: 'MEDIUM' });
      else if (style === 'success') await H.notification({ type: 'SUCCESS' });
      else await H.impact({ style: 'LIGHT' });
      return;
    }
  } catch {
    /* fall through */
  }
  if (navigator.vibrate) {
    if (style === 'heavy') navigator.vibrate([18, 30, 28]);
    else if (style === 'medium') navigator.vibrate(14);
    else if (style === 'success') navigator.vibrate([10, 40, 14]);
    else navigator.vibrate(8);
  }
}

// ─── Wake lock ────────────────────────────────────────────────────────────────
let wakeLock = null;
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
  } catch {
    /* optional */
  }
}
function releaseWakeLock() {
  try {
    wakeLock?.release();
  } catch {
    /* */
  }
  wakeLock = null;
}

// ─── UI helpers ───────────────────────────────────────────────────────────────
function show(el) {
  if (el) el.classList.remove('hidden');
}
function hide(el) {
  if (el) el.classList.add('hidden');
}

function flavorFor(n) {
  const keys = Object.keys(FLAVOR)
    .map(Number)
    .sort((a, b) => b - a);
  for (const k of keys) {
    if (n >= k) {
      const arr = FLAVOR[k];
      return arr[Math.floor(Math.random() * arr.length)];
    }
  }
  return '';
}

function rewardById(id) {
  return REWARDS.find((r) => r.id === id);
}

function rewardImgSrc(reward) {
  if (!reward?.img) return '';
  // Encode path segments so spaces/special chars work in WebView
  return reward.img.split('/').map(encodeURIComponent).join('/');
}

function fillRewardVisual(el, reward) {
  if (!el || !reward) return;
  el.textContent = '';
  el.style.setProperty('--rv-a', reward.colorA);
  el.style.setProperty('--rv-b', reward.colorB);
  el.setAttribute('aria-label', reward.name);
  const img = document.createElement('img');
  img.src = rewardImgSrc(reward);
  img.alt = reward.name;
  img.draggable = false;
  img.loading = 'lazy';
  img.className = 'reward-img';
  el.appendChild(img);
}

function updateSpinsUI() {
  if (spinsValueEl) spinsValueEl.textContent = String(pendingSpins);
  if (spinsPill) {
    if (pendingSpins > 0 && state === State.PLAYING) show(spinsPill);
    else if (state === State.PLAYING && spinsEarnedThisRun > 0) show(spinsPill);
    else if (state !== State.PLAYING) hide(spinsPill);
  }
  if (pendingSpinsLabel) {
    pendingSpinsLabel.textContent =
      pendingSpins > 0 ? `${pendingSpins} spin${pendingSpins === 1 ? '' : 's'} ready` : 'No spins ready';
  }
  if (spinFromRewards) {
    if (pendingSpins > 0) show(spinFromRewards);
    else hide(spinFromRewards);
  }
  if (pendingSpinsHint) {
    if (pendingSpins > 0) {
      pendingSpinsHint.textContent = `🎰 ${pendingSpins} spin${pendingSpins === 1 ? '' : 's'} waiting — open View Rewards`;
      show(pendingSpinsHint);
    } else hide(pendingSpinsHint);
  }
  if (gameoverSpins && claimSpinsBtn) {
    if (pendingSpins > 0) {
      gameoverSpins.textContent = `You have ${pendingSpins} Vegas spin${pendingSpins === 1 ? '' : 's'} to claim!`;
      show(gameoverSpins);
      show(claimSpinsBtn);
    } else {
      hide(gameoverSpins);
      hide(claimSpinsBtn);
    }
  }
  if (spinRemaining) {
    spinRemaining.textContent =
      pendingSpins > 0 ? `${pendingSpins} spin${pendingSpins === 1 ? '' : 's'} left` : 'No spins left';
  }
}

function grantSpin() {
  pendingSpins += 1;
  spinsEarnedThisRun += 1;
  saveSpins();
  updateSpinsUI();
  showToast('🎰 Spin earned!', 1000);
  edgeGlow.classList.add('active');
  setTimeout(() => edgeGlow.classList.remove('active'), 900);
  sfxMilestone();
  haptic('success');
}

function buildRewardsGrid() {
  if (!rewardsGrid) return;
  rewardsGrid.innerHTML = '';
  const ownedCount = uniqueOwnedCount();
  if (rewardsCount) rewardsCount.textContent = `${ownedCount} / ${REWARDS.length}`;
  updateSpinsUI();

  REWARDS.forEach((reward) => {
    const owned = hasReward(reward.id);
    const qty = invCount(reward.id);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'reward-card ' + (owned ? 'owned' : 'locked');
    card.innerHTML = `
      <div class="reward-visual" style="--rv-a:${reward.colorA};--rv-b:${reward.colorB}"></div>
      <span class="reward-card-name">${owned ? reward.name : '???'}</span>
      ${owned && qty > 1 ? `<span class="reward-qty">×${qty}</span>` : ''}
    `;
    fillRewardVisual(card.querySelector('.reward-visual'), reward);
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      openRewardDetail(reward);
    });
    rewardsGrid.appendChild(card);
  });
}

function openRewardDetail(reward) {
  const owned = hasReward(reward.id);
  const qty = invCount(reward.id);
  fillRewardVisual(detailVisual, reward);
  if (!owned) {
    detailVisual.style.filter = 'grayscale(1) blur(4px) brightness(0.55)';
    detailName.textContent = '???';
    detailDesc.textContent = 'Locked junk. Earn Vegas spins by passing pipes (every 5).';
    detailStatus.textContent = 'Not collected yet';
  } else {
    detailVisual.style.filter = '';
    detailName.textContent = reward.name;
    detailDesc.textContent = reward.desc;
    detailStatus.textContent = qty > 1 ? `Collected ×${qty} — trade extras at Junk Exchange` : 'Collected ✓ — trade at Junk Exchange';
  }
  hide(rewardsScreen);
  show(rewardDetailScreen);
}

function openRewardsScreen(from = 'menu') {
  buildRewardsGrid();
  if (from === 'menu') hide(startScreen);
  if (from === 'gameover') hide(gameoverScreen);
  hide(settingsScreen);
  hide(sceneryScreen);
  hide(rewardDetailScreen);
  hide(spinScreen);
  show(rewardsScreen);
}

function openSpinScreen(from = 'menu') {
  if (pendingSpins <= 0) {
    showToast('No spins yet — pass 5 pipes!', 1200);
    return;
  }
  spinReturnTo = from;
  spinning = false;
  hide(spinResult);
  show(spinBtn);
  hide(spinDone);
  spinBtn.disabled = false;
  spinBtn.textContent = 'SPIN';
  buildSlotStrip();
  slotStrip.style.transition = 'none';
  slotStrip.style.transform = 'translateY(0)';
  updateSpinsUI();

  hide(startScreen);
  hide(gameoverScreen);
  hide(rewardsScreen);
  hide(rewardDetailScreen);
  hide(settingsScreen);
  hide(sceneryScreen);
  show(spinScreen);
}

function buildSlotStrip() {
  // Long strip for spin animation — shuffled rewards repeated
  const items = [];
  for (let i = 0; i < 24; i++) {
    items.push(REWARDS[Math.floor(Math.random() * REWARDS.length)]);
  }
  slotStrip.innerHTML = '';
  items.forEach((r) => {
    const wrap = document.createElement('div');
    wrap.className = 'slot-item';
    wrap.dataset.id = r.id;
    const vis = document.createElement('div');
    vis.className = 'reward-visual';
    fillRewardVisual(vis, r);
    wrap.appendChild(vis);
    slotStrip.appendChild(wrap);
  });
  slotStrip._items = items;
}

function sfxSpinTick() {
  playTone({ freq: 380 + Math.random() * 200, type: 'square', dur: 0.04, gain: 0.03 });
}
function sfxSpinWin() {
  playTone({ freq: 523, type: 'sine', dur: 0.1, gain: 0.06 });
  playTone({ freq: 659, type: 'sine', dur: 0.12, gain: 0.05, delay: 0.08 });
  playTone({ freq: 784, type: 'triangle', dur: 0.16, gain: 0.045, delay: 0.16 });
  playTone({ freq: 1047, type: 'sine', dur: 0.2, gain: 0.04, delay: 0.28 });
}

function runVegasSpin() {
  if (spinning || pendingSpins <= 0) return;
  spinning = true;
  spinBtn.disabled = true;
  hide(spinResult);
  hide(spinDone);

  // Pick winner
  const winner = REWARDS[Math.floor(Math.random() * REWARDS.length)];
  const prevCount = invCount(winner.id);
  const isNew = prevCount === 0;

  // Ensure winner appears near end of strip
  const items = slotStrip._items || [];
  const targetIndex = items.length - 4;
  if (items[targetIndex]) {
    items[targetIndex] = winner;
    const node = slotStrip.children[targetIndex];
    if (node) {
      node.dataset.id = winner.id;
      const vis = node.querySelector('.reward-visual');
      fillRewardVisual(vis, winner);
    }
  }

  // Item height ~80px (72 + 8 gap)
  const itemH = 80;
  // Center window is 92px; first item starts with 12px padding
  const pad = 12;
  const windowCenter = 46;
  const targetY = -(targetIndex * itemH + pad + 36 - windowCenter);

  slotStrip.style.transition = 'none';
  slotStrip.style.transform = 'translateY(0px)';
  void slotStrip.offsetWidth;

  const duration = 3200 + Math.random() * 800;
  slotStrip.style.transition = `transform ${duration}ms cubic-bezier(0.12, 0.75, 0.12, 1)`;
  slotStrip.style.transform = `translateY(${targetY}px)`;

  // Tick sounds while spinning
  let ticks = 0;
  const tickTimer = setInterval(() => {
    sfxSpinTick();
    ticks += 1;
    if (ticks > 28) clearInterval(tickTimer);
  }, 90);

  setTimeout(() => {
    clearInterval(tickTimer);
    spinning = false;
    pendingSpins = Math.max(0, pendingSpins - 1);
    saveSpins();

    addReward(winner.id, 1);

    fillRewardVisual(spinResultVisual, winner);
    spinResultName.textContent = winner.name;
    spinResultDesc.textContent = winner.desc;
    spinResultTag.textContent = isNew ? '✨ NEW COLLECTIBLE!' : `Duplicate · now ×${invCount(winner.id)}`;
    spinResultTag.classList.toggle('dup', !isNew);
    show(spinResult);
    sfxSpinWin();
    haptic('success');
    if (isNew) burstConfetti();

    updateSpinsUI();
    if (pendingSpins > 0) {
      spinBtn.disabled = false;
      spinBtn.textContent = 'SPIN AGAIN';
      show(spinBtn);
      show(spinDone);
    } else {
      hide(spinBtn);
      show(spinDone);
      spinDone.textContent = 'Nice';
    }
  }, duration + 40);
}

function closeSpinScreen() {
  hide(spinScreen);
  if (spinReturnTo === 'gameover') {
    show(gameoverScreen);
    updateSpinsUI();
  } else if (spinReturnTo === 'rewards') {
    openRewardsScreen('menu');
  } else {
    show(startScreen);
    updateMenuStats();
  }
}

function updateMenuStats() {
  bestStartEl.textContent = String(best);
  runsStartEl.textContent = String(runs);
  if (lootStartEl) lootStartEl.textContent = `${uniqueOwnedCount()}/${REWARDS.length}`;
  updateSpinsUI();
}

function setScore(n) {
  score = n;
  scoreEl.textContent = String(score);
  scorePill.classList.remove('pop');
  // force reflow for re-trigger
  void scorePill.offsetWidth;
  scorePill.classList.add('pop');
  setTimeout(() => scorePill.classList.remove('pop'), 140);
}

function showFloat(text, perfect = false) {
  floatScoreEl.textContent = text;
  floatScoreEl.classList.toggle('perfect', perfect);
  hide(floatScoreEl);
  void floatScoreEl.offsetWidth;
  show(floatScoreEl);
  setTimeout(() => hide(floatScoreEl), 700);
}

function showToast(text, ms = 1100) {
  toastEl.textContent = text;
  hide(toastEl);
  void toastEl.offsetWidth;
  show(toastEl);
  setTimeout(() => hide(toastEl), ms);
}

function flash(kind = 'active') {
  flashEl.className = '';
  flashEl.classList.add(kind === 'active' ? 'active' : kind);
  setTimeout(() => {
    flashEl.className = '';
  }, kind === 'score' || kind === 'near' ? 70 : 90);
}

function burstConfetti() {
  confettiEl.innerHTML = '';
  show(confettiEl);
  const colors = ['#ffd166', '#ff8a4c', '#5eead4', '#fff', '#fb7185', '#a78bfa'];
  for (let i = 0; i < 42; i++) {
    const s = document.createElement('span');
    s.style.left = `${Math.random() * 100}%`;
    s.style.background = colors[i % colors.length];
    s.style.animationDuration = `${1.4 + Math.random() * 1.4}s`;
    s.style.animationDelay = `${Math.random() * 0.25}s`;
    s.style.width = `${6 + Math.random() * 6}px`;
    s.style.height = `${8 + Math.random() * 10}px`;
    confettiEl.appendChild(s);
  }
  setTimeout(() => {
    hide(confettiEl);
    confettiEl.innerHTML = '';
  }, 2800);
}

function syncSettingsUI() {
  optSfx.checked = settings.sfx;
  optMusic.checked = settings.music;
  optHaptics.checked = settings.haptics;
  const side = settings.fireSide === 'left' ? 'left' : 'right';
  if (optFireLeft) optFireLeft.classList.toggle('selected', side === 'left');
  if (optFireRight) optFireRight.classList.toggle('selected', side === 'right');
  applyFireBtnSide();
}

function applyTheme(themeId, { toast = false } = {}) {
  if (!THEMES[themeId]) themeId = 'meadow';
  if (THEMES[themeId].requiresUnlock && !unlockedThemes.has(themeId)) {
    showToast('🔒 Craft this at Junk Exchange', 1200);
    return;
  }
  settings.theme = themeId;
  saveSettings();
  const t = activeTheme();

  if (skyMesh?.material?.uniforms) {
    const u = skyMesh.material.uniforms;
    u.topColor.value.set(t.skyTop);
    u.midColor.value.set(t.skyMid);
    u.bottomColor.value.set(t.skyBot);
  }

  if (groundMesh) groundMesh.material.color.setHex(t.ground);
  if (groundStrip) groundStrip.material.color.setHex(t.groundStrip);
  if (groundEdge) {
    groundEdge.material.color.setHex(t.groundEdge);
    groundEdge.material.emissive.setHex(t.groundEdge);
    groundEdge.material.emissiveIntensity = 0.25;
  }

  hills.forEach((h, i) => {
    h.material.color.setHex(t.hill[i % t.hill.length]);
  });
  grass.forEach((g) => g.material.color.setHex(t.grass));

  trees.forEach((tree, i) => {
    tree.traverse((obj) => {
      if (!obj.isMesh || !obj.material) return;
      // trunk is cylinder; canopy is sphere
      if (obj.geometry?.type === 'CylinderGeometry') {
        obj.material.color.setHex(t.treeTrunk);
      } else {
        obj.material.color.setHex(t.treeLeaf[i % t.treeLeaf.length]);
      }
    });
  });

  if (sunMesh) {
    sunMesh.visible = t.sunVisible;
    sunMesh.material.color.setHex(t.sunColor);
  }
  if (sunGlow) {
    sunGlow.visible = t.sunVisible;
    sunGlow.material.color.setHex(t.sunGlow);
  }
  if (moonMesh) {
    moonMesh.visible = t.moonVisible;
    moonMesh.material.color.setHex(t.sunColor);
  }
  if (moonGlow) {
    moonGlow.visible = t.moonVisible;
    moonGlow.material.color.setHex(t.sunGlow);
  }
  if (ambientLight) ambientLight.color.setHex(t.ambient);

  if (stars) stars.material.opacity = t.starsOpacity;
  if (fireflies) fireflies.visible = t.fireflies;
  balloons.forEach((b) => {
    b.visible = t.balloons;
  });
  birds.forEach((b) => {
    b.visible = t.birds;
  });

  const isCyber = t.id === 'cyberpunk';
  setCyberpunkDecorVisible(isCyber);
  // Dim natural props in cyberpunk so the city reads
  trees.forEach((tr) => {
    tr.visible = !isCyber;
  });
  grass.forEach((g) => {
    g.visible = !isCyber;
  });
  hills.forEach((h, i) => {
    h.material.color.setHex(t.hill[i % t.hill.length]);
    if (!h.userData.baseScaleY) h.userData.baseScaleY = h.scale.y;
    // Low dark land under skyline in cyberpunk
    h.scale.y = isCyber ? h.userData.baseScaleY * 0.45 : h.userData.baseScaleY;
  });

  // Live pipes recolor to match theme (keep neon multi-hue if present)
  const p = t.pipe;
  for (const pipe of pipes) {
    // Force rebuild-ish: recolor by part tags when switching themes mid-run
    if (p.neon) {
      // leave individual neon hues; boost emissive if materials support it
      pipe.group.traverse((obj) => {
        if (!obj.isMesh || !obj.material) return;
        if (obj.material.emissiveIntensity !== undefined && obj.userData.pipePart === 'shaft') {
          obj.material.emissiveIntensity = p.emissiveIntensity ?? 0.95;
        }
      });
    } else {
      pipe.group.traverse((obj) => {
        if (!obj.isMesh || !obj.material?.color) return;
        if (obj.userData.pipePart === 'shaft') {
          obj.material.color.setHSL(p.h, p.s, p.l);
          if (obj.material.emissive) obj.material.emissive.setHex(p.emissive);
          if (obj.material.emissiveIntensity !== undefined) obj.material.emissiveIntensity = 0.2;
        }
      });
    }
  }

  buildSceneryList();
  if (toast) showToast(`${t.emoji} ${t.name}`, 1000);
}

function buildSceneryList() {
  if (!sceneryList) return;
  sceneryList.innerHTML = '';
  Object.values(THEMES).forEach((t) => {
    const locked = t.requiresUnlock && !unlockedThemes.has(t.id);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className =
      'theme-card' +
      (settings.theme === t.id ? ' selected' : '') +
      (locked ? ' locked' : '');
    btn.dataset.theme = t.id;
    btn.innerHTML = `
      <span class="theme-emoji">${t.emoji}</span>
      <span class="theme-meta">
        <span class="theme-name">${t.name}${locked ? ' 🔒' : ''}</span>
        <span class="theme-blurb">${locked ? 'Craft at Junk Exchange' : t.blurb}</span>
      </span>
      <span class="theme-check" aria-hidden="true">${settings.theme === t.id ? '✓' : locked ? '🔒' : ''}</span>
    `;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (locked) {
        showToast('🔒 Unlock at Junk Exchange', 1100);
        return;
      }
      applyTheme(t.id, { toast: true });
      haptic('light');
    });
    sceneryList.appendChild(btn);
  });
}

// ─── Junk Exchange UI ─────────────────────────────────────────────────────────
function costLineHTML(cost) {
  return cost
    .map((c) => {
      const r = rewardById(c.id);
      const have = invCount(c.id);
      const ok = have >= c.n;
      const name = r ? r.name : c.id;
      const img = r ? rewardImgSrc(r) : '';
      return `<span class="cost-chip ${ok ? 'ok' : 'short'}">
        ${img ? `<img src="${img}" alt="" class="cost-img" />` : ''}
        <span>${name}${c.n > 1 ? ` ×${c.n}` : ''}</span>
        <span class="cost-have">${have}/${c.n}</span>
      </span>`;
    })
    .join('');
}

function setTradeTab(tab) {
  tradeTab = tab;
  if (tradeTabShop) tradeTabShop.classList.toggle('active', tab === 'shop');
  if (tradeTabLoadout) tradeTabLoadout.classList.toggle('active', tab === 'loadout');
  if (tradeShopList) tradeShopList.classList.toggle('hidden', tab !== 'shop');
  if (tradeLoadout) tradeLoadout.classList.toggle('hidden', tab !== 'loadout');
  if (tab === 'shop') buildTradeShop();
  else buildTradeLoadout();
}

function buildTradeShop() {
  if (!tradeShopList) return;
  tradeShopList.innerHTML = '';
  TRADES.forEach((trade) => {
    const owned = unlockedGear.has(trade.id) || (trade.type === 'theme' && trade.themeId && unlockedThemes.has(trade.themeId));
    const afford = canAfford(trade.cost);
    const card = document.createElement('div');
    card.className = 'trade-card' + (owned ? ' owned' : '') + (!owned && afford ? ' afford' : '');
    const typeLabel =
      trade.type === 'theme' ? 'Theme' : trade.type === 'weapon' ? 'Weapon' : SLOT_LABELS[trade.type] || trade.type;
    card.innerHTML = `
      <div class="trade-card-top">
        <span class="trade-emoji">${trade.emoji}</span>
        <div class="trade-meta">
          <span class="trade-name">${trade.name}</span>
          <span class="trade-type">${typeLabel}</span>
        </div>
      </div>
      <p class="trade-blurb">${trade.blurb}</p>
      <div class="trade-cost">${costLineHTML(trade.cost)}</div>
      <button type="button" class="btn ${owned ? 'ghost' : afford ? 'primary' : 'ghost'} trade-craft-btn" ${owned || !afford ? 'disabled' : ''}>
        ${owned ? 'Unlocked ✓' : afford ? 'Craft' : 'Need more loot'}
      </button>
    `;
    const btn = card.querySelector('.trade-craft-btn');
    if (!owned) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        craftTrade(trade);
      });
    }
    tradeShopList.appendChild(card);
  });
}

function craftTrade(trade) {
  if (unlockedGear.has(trade.id) || (trade.type === 'theme' && trade.themeId && unlockedThemes.has(trade.themeId))) {
    showToast('Already unlocked!', 900);
    return;
  }
  if (!canAfford(trade.cost)) {
    showToast('Not enough junk!', 900);
    return;
  }
  if (!spendCost(trade.cost)) return;

  if (trade.type === 'theme' && trade.themeId) {
    unlockedThemes.add(trade.themeId);
    saveUnlockedThemes();
    unlockedGear.add(trade.id);
    saveUnlockedGear();
    applyTheme(trade.themeId, { toast: false });
    showToast(`${trade.emoji} ${trade.name} unlocked!`, 1400);
  } else {
    unlockedGear.add(trade.id);
    saveUnlockedGear();
    // Auto-equip new gear
    if (GEAR_SLOTS.includes(trade.type)) {
      equipped[trade.type] = trade.id;
      saveEquipped();
      applyLoadoutVisuals();
    }
    showToast(`${trade.emoji} Crafted ${trade.name}!`, 1400);
  }
  sfxMilestone();
  haptic('success');
  burstConfetti();
  buildTradeShop();
  buildTradeLoadout();
  updateMenuStats();
  buildRewardsGrid();
}

function buildTradeLoadout() {
  if (!tradeLoadout) return;
  tradeLoadout.innerHTML = '';
  GEAR_SLOTS.forEach((slot) => {
    const section = document.createElement('div');
    section.className = 'loadout-section';
    const options = TRADES.filter((t) => t.type === slot && unlockedGear.has(t.id));
    let optsHTML = `<button type="button" class="loadout-opt ${!equipped[slot] ? 'selected' : ''}" data-id="">None</button>`;
    options.forEach((t) => {
      optsHTML += `<button type="button" class="loadout-opt ${equipped[slot] === t.id ? 'selected' : ''}" data-id="${t.id}">
        <span>${t.emoji}</span> ${t.name}
      </button>`;
    });
    if (options.length === 0) {
      optsHTML += `<p class="hint tiny">Craft a ${SLOT_LABELS[slot].toLowerCase()} in the Craft tab.</p>`;
    }
    section.innerHTML = `
      <h3 class="loadout-title">${SLOT_LABELS[slot]}</h3>
      <div class="loadout-opts">${optsHTML}</div>
    `;
    section.querySelectorAll('.loadout-opt').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id || null;
        equipped[slot] = id || null;
        saveEquipped();
        applyLoadoutVisuals();
        buildTradeLoadout();
        haptic('light');
        showToast(id ? `Equipped ${tradeById(id)?.name || ''}` : `${SLOT_LABELS[slot]} cleared`, 800);
      });
    });
    tradeLoadout.appendChild(section);
  });

  // Theme note
  const note = document.createElement('p');
  note.className = 'hint tiny';
  note.textContent = 'Themes: equip Cyberpunk from Scenery after crafting it.';
  tradeLoadout.appendChild(note);
}

function openTradeScreen() {
  hide(startScreen);
  hide(settingsScreen);
  hide(sceneryScreen);
  hide(rewardsScreen);
  hide(rewardDetailScreen);
  setTradeTab(tradeTab || 'shop');
  show(tradeScreen);
}

function closeTradeScreen() {
  hide(tradeScreen);
  show(startScreen);
  updateMenuStats();
  applyLoadoutVisuals();
}

function destroyPipePair(pipe) {
  if (!pipe) return;
  const idx = pipes.indexOf(pipe);
  if (idx < 0) return;
  if (!pipe.scored) {
    pipe.scored = true;
    onScore(pipe);
  }
  try {
    pipe.dispose();
  } catch (e) {
    /* ignore dispose errors */
  }
  pipes.splice(idx, 1);
}

function fireWeapon() {
  if (state !== State.PLAYING) return;
  const w = equippedWeaponTrade();
  if (!w) {
    showToast('No weapon equipped', 800);
    return;
  }
  if (weaponShots <= 0) {
    showToast('Out of shots!', 800);
    haptic('medium');
    return;
  }

  // Prefer nearest pipe ahead; else nearest any on-screen pipe
  let target = null;
  let bestX = Infinity;
  for (const p of pipes) {
    if (p.x > CFG.goatX - 0.5 && p.x < bestX) {
      bestX = p.x;
      target = p;
    }
  }
  if (!target) {
    for (const p of pipes) {
      if (p.x > -8 && p.x < 10 && Math.abs(p.x - CFG.goatX) < bestX) {
        bestX = Math.abs(p.x - CFG.goatX);
        target = p;
      }
    }
  }
  if (!target) {
    showToast('No pipes in range!', 800);
    return;
  }

  weaponShots -= 1;
  refreshWeaponHUD();

  const muzzleX = CFG.goatX + 0.55;
  const muzzleY = goat.y - 0.02;
  const style = w.projectile === 'laser' ? 'laser' : 'bolt';
  const flashCols = style === 'laser' ? [0xff2080, 0xffffff, 0xff60c0] : [0xffe080, 0xff8a4c, 0xffffff];
  spawnBurst(muzzleX, muzzleY, 10, flashCols, 5, 0.28);
  if (style === 'laser') {
    playTone({ freq: 880, type: 'sawtooth', dur: 0.07, gain: 0.05 });
    playTone({ freq: 1320, type: 'square', dur: 0.1, gain: 0.035, delay: 0.02 });
    playTone({ freq: 220, type: 'triangle', dur: 0.12, gain: 0.04, delay: 0.04 });
  } else {
    playTone({ freq: 220, type: 'sawtooth', dur: 0.08, gain: 0.06 });
    playTone({ freq: 140, type: 'square', dur: 0.1, gain: 0.04, delay: 0.03 });
  }
  haptic('medium');

  const hitPipe = target;
  const aimX = target.x;
  const aimY = target.gapCenter;

  spawnProjectile(
    muzzleX,
    muzzleY,
    aimX,
    aimY,
    () => {
      const stillThere = pipes.indexOf(hitPipe) >= 0;
      const ix = stillThere ? hitPipe.x : aimX;
      const iy = stillThere ? hitPipe.gapCenter : aimY;

      spawnDeathBurst(ix, iy);
      spawnScoreSpark(ix, iy);
      shake = Math.max(shake, 0.4);
      flash('score');
      if (style === 'laser') {
        playTone({ freq: 240, type: 'sawtooth', dur: 0.1, gain: 0.05 });
        playTone({ freq: 90, type: 'square', dur: 0.14, gain: 0.04, delay: 0.04 });
      } else {
        playTone({ freq: 180, type: 'sawtooth', dur: 0.12, gain: 0.07 });
        playTone({ freq: 90, type: 'square', dur: 0.18, gain: 0.05, delay: 0.05 });
        playTone({ freq: 520, type: 'triangle', dur: 0.08, gain: 0.04, delay: 0.1 });
      }
      haptic('heavy');

      if (stillThere) destroyPipePair(hitPipe);

      if (weaponShots <= 0) showToast('Weapon spent!', 900);
    },
    style
  );
}

// ─── Game flow ────────────────────────────────────────────────────────────────
function clearPipesAndParticles() {
  for (const p of pipes) p.dispose();
  pipes = [];
  for (const p of particles) {
    scene.remove(p);
    p.geometry.dispose();
    p.material.dispose();
  }
  particles = [];
  clearProjectiles();
}

function resetWorld() {
  clearPipesAndParticles();
  goat.y = 0.5;
  goat.vy = 0;
  goat.rot = 0;
  goat.flapPhase = 0;
  goat.squash = 1;
  if (goat.mesh) {
    goat.mesh.position.set(CFG.goatX, goat.y, 0);
    goat.mesh.rotation.set(0, 0, 0);
    goat.mesh.scale.set(1, 1, 1);
    goat.mesh.visible = true;
  }
  pipeTimer = 0.85;
  shake = 0;
  hitStop = 0;
  camTargetY = 0;
  nearMissCooldown = 0;
  perfectStreak = 0;
  runStarted = false;
  setScore(0);
  const portrait = window.innerHeight >= window.innerWidth;
  camera.position.set(0, 0, portrait ? 13.2 : 12);
  edgeGlow.classList.remove('active');
  hide(toastEl);
  hide(floatScoreEl);
}

function hideAllMenus() {
  hide(startScreen);
  hide(gameoverScreen);
  hide(pauseScreen);
  hide(settingsScreen);
  hide(sceneryScreen);
  hide(rewardsScreen);
  hide(rewardDetailScreen);
  hide(spinScreen);
  hide(tradeScreen);
  hide(readyHint);
  hide(tutorialEl);
  hide(fireBtn);
}

function goMenu() {
  state = State.MENU;
  resetWorld();
  hide(hud);
  hideAllMenus();
  show(startScreen);
  updateMenuStats();
  applyLoadoutVisuals();
  releaseWakeLock();
}

function startGame() {
  ensureAudio();
  startMusic();
  state = State.PLAYING;
  resetWorld();
  spinsEarnedThisRun = 0;
  const w = equippedWeaponTrade();
  weaponShots = w && w.shots ? w.shots : 0;
  hideAllMenus();
  show(hud);
  hide(spinsPill);
  show(readyHint);
  readyTimer = 1.35;
  goat.vy = CFG.flapImpulse * 0.3;
  runStarted = false;
  if (showTutorial) show(tutorialEl);
  applyLoadoutVisuals();
  refreshWeaponHUD();
  requestWakeLock();
  haptic('light');
}

function pauseGame() {
  if (state !== State.PLAYING) return;
  state = State.PAUSED;
  hide(readyHint);
  show(pauseScreen);
}

function resumeGame() {
  if (state !== State.PAUSED) return;
  state = State.PLAYING;
  hide(pauseScreen);
  clock.getDelta(); // drop stalled dt
}

function die() {
  if (state !== State.PLAYING) return;
  state = State.DEAD;
  sfxHit();
  haptic('heavy');
  spawnDeathBurst(CFG.goatX, goat.y);
  shake = 0.62;
  hitStop = 0.12;
  flash('hit');
  hide(tutorialEl);
  hide(readyHint);
  hide(floatScoreEl);

  runs += 1;
  localStorage.setItem(KEYS.runs, String(runs));

  let isNew = false;
  if (score > best) {
    best = score;
    localStorage.setItem(KEYS.best, String(best));
    isNew = true;
  }

  finalScoreEl.textContent = String(score);
  bestScoreEl.textContent = String(best);
  flavorEl.textContent = flavorFor(score);
  updateSpinsUI();

  if (isNew) {
    show(newRecordEl);
    gameoverTitle.textContent = 'New Best!';
    burstConfetti();
    sfxMilestone();
    haptic('success');
  } else {
    hide(newRecordEl);
    gameoverTitle.textContent = 'Game Over';
  }

  setTimeout(() => {
    hide(hud);
    show(gameoverScreen);
    releaseWakeLock();
  }, 480);
}

/** Only leaps during active play — menus require Play / Play Again buttons. */
function flap() {
  if (state === State.PAUSED) {
    resumeGame();
    return;
  }
  if (state !== State.PLAYING) return;

  goat.vy = CFG.flapImpulse;
  goat.flapPhase = 1;
  goat.squash = 1.18;
  sfxFlap();
  haptic('light');
  spawnFlapParticles(CFG.goatX - 0.2, goat.y - 0.1);
  runStarted = true;

  if (readyTimer > 0) {
    readyTimer = 0;
    hide(readyHint);
  }
  if (showTutorial) {
    showTutorial = false;
    localStorage.setItem(KEYS.tutored, '1');
    hide(tutorialEl);
  }
}

// ─── Input ────────────────────────────────────────────────────────────────────
function isInteractiveTarget(t) {
  return t && (t.tagName === 'BUTTON' || t.tagName === 'INPUT' || t.closest?.('button,label,input'));
}

// Block page rubber-banding, but allow scrolling inside menus/lists
document.addEventListener(
  'touchmove',
  (e) => {
    const scrollable = e.target?.closest?.(
      '.rewards-grid, .scenery-list, .scrollable, .trade-list, .panel.rewards-panel, .panel.scenery-panel, .panel.trade-panel'
    );
    if (scrollable) {
      // If the element (or a parent list) can actually scroll, let it
      let el = scrollable;
      while (el && el !== document.body) {
        const style = window.getComputedStyle(el);
        const oy = style.overflowY;
        if (
          (oy === 'auto' || oy === 'scroll' || oy === 'overlay') &&
          el.scrollHeight > el.clientHeight + 1
        ) {
          return; // allow native scroll
        }
        el = el.parentElement;
      }
    }
    e.preventDefault();
  },
  { passive: false }
);
document.addEventListener('gesturestart', (e) => e.preventDefault());

window.addEventListener('keydown', (e) => {
  if (e.code === 'Escape') {
    if (state === State.PLAYING) pauseGame();
    else if (state === State.PAUSED) resumeGame();
    return;
  }
  // Space only leaps while playing — does not start a run
  if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
    e.preventDefault();
    if (state === State.PAUSED) resumeGame();
    else if (state === State.PLAYING) flap();
  }
  if ((e.code === 'KeyF' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') && state === State.PLAYING) {
    e.preventDefault();
    fireWeapon();
  }
});

canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  if (state === State.PLAYING) flap();
});

playBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  startGame();
});
retryBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  startGame();
});
pauseBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  pauseGame();
});
resumeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  resumeGame();
});
pauseQuit.addEventListener('click', (e) => {
  e.stopPropagation();
  goMenu();
});
menuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  goMenu();
});
settingsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  syncSettingsUI();
  hide(startScreen);
  hide(sceneryScreen);
  hide(rewardsScreen);
  show(settingsScreen);
});
settingsClose.addEventListener('click', (e) => {
  e.stopPropagation();
  hide(settingsScreen);
  show(startScreen);
});
sceneryBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  buildSceneryList();
  hide(startScreen);
  hide(settingsScreen);
  hide(rewardsScreen);
  hide(tradeScreen);
  show(sceneryScreen);
});
if (tradeBtn) {
  tradeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openTradeScreen();
  });
}
if (tradeClose) {
  tradeClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeTradeScreen();
  });
}
if (tradeTabShop) {
  tradeTabShop.addEventListener('click', (e) => {
    e.stopPropagation();
    setTradeTab('shop');
  });
}
if (tradeTabLoadout) {
  tradeTabLoadout.addEventListener('click', (e) => {
    e.stopPropagation();
    setTradeTab('loadout');
  });
}
if (fireBtn) {
  const onFirePress = (e) => {
    e.stopPropagation();
    e.preventDefault();
    fireWeapon();
  };
  // pointerdown is more reliable than click on mobile WebViews
  fireBtn.addEventListener('pointerdown', onFirePress);
  fireBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
  });
}
sceneryClose.addEventListener('click', (e) => {
  e.stopPropagation();
  hide(sceneryScreen);
  show(startScreen);
});
rewardsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  openRewardsScreen('menu');
});
rewardsClose.addEventListener('click', (e) => {
  e.stopPropagation();
  hide(rewardsScreen);
  show(startScreen);
  updateMenuStats();
});
detailClose.addEventListener('click', (e) => {
  e.stopPropagation();
  hide(rewardDetailScreen);
  openRewardsScreen('menu');
});
spinFromRewards.addEventListener('click', (e) => {
  e.stopPropagation();
  openSpinScreen('rewards');
});
claimSpinsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  openSpinScreen('gameover');
});
spinBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (pendingSpins <= 0) {
    closeSpinScreen();
    return;
  }
  // Rebuild strip for each spin so animation always starts fresh
  buildSlotStrip();
  runVegasSpin();
});
spinDone.addEventListener('click', (e) => {
  e.stopPropagation();
  closeSpinScreen();
});

optSfx.addEventListener('change', () => {
  settings.sfx = optSfx.checked;
  saveSettings();
  if (settings.sfx) sfxScore();
});
optMusic.addEventListener('change', () => {
  settings.music = optMusic.checked;
  saveSettings();
  ensureAudio();
  setMusicEnabled(settings.music);
});
optHaptics.addEventListener('change', () => {
  settings.haptics = optHaptics.checked;
  saveSettings();
  if (settings.haptics) haptic('medium');
});

function setFireSide(side) {
  settings.fireSide = side === 'left' ? 'left' : 'right';
  saveSettings();
  syncSettingsUI();
  refreshWeaponHUD();
  haptic('light');
  showToast(settings.fireSide === 'left' ? 'Shoot button: left' : 'Shoot button: right', 900);
}
if (optFireLeft) {
  optFireLeft.addEventListener('click', (e) => {
    e.stopPropagation();
    setFireSide('left');
  });
}
if (optFireRight) {
  optFireRight.addEventListener('click', (e) => {
    e.stopPropagation();
    setFireSide('right');
  });
}

shareBtn.addEventListener('click', async (e) => {
  e.stopPropagation();
  const text = `I scored ${score} in Slappy Goat! 🐐 Best: ${best} · Loot ${uniqueOwnedCount()}/${REWARDS.length}`;
  try {
    if (navigator.share) await navigator.share({ title: 'Slappy Goat', text });
    else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      showToast('Score copied!', 900);
    }
  } catch {
    /* user cancel */
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && state === State.PLAYING) pauseGame();
  if (!document.hidden && settings.music) startMusic();
});

// ─── Update ───────────────────────────────────────────────────────────────────
const clock = new THREE.Clock();

function updateGoat(dt) {
  if (!goat.mesh) return;

  // squash recovery
  goat.squash = THREE.MathUtils.lerp(goat.squash, 1, 1 - Math.pow(0.0008, dt));
  const sx = 1 + (goat.squash - 1) * 0.35;
  const sy = 1 / sx;
  goat.mesh.scale.set(sx, sy, 1);

  if (state === State.MENU || state === State.PAUSED) {
    if (state === State.MENU) {
      goat.y = Math.sin(time * 2.2) * 0.35 + 0.3;
      goat.rot = Math.sin(time * 2.2) * 0.12;
      goat.mesh.position.y = goat.y;
      goat.mesh.rotation.z = goat.rot;
      const idle = Math.sin(time * 5) * 0.25;
      goat.earL.rotation.z = 0.35 + idle;
      goat.earR.rotation.z = 0.35 + idle;
      goat.legFL.rotation.x = idle * 0.6;
      goat.legFR.rotation.x = -idle * 0.6;
      goat.legBL.rotation.x = -idle * 0.5;
      goat.legBR.rotation.x = idle * 0.5;
      goat.mesh.rotation.y = Math.sin(time * 1.2) * 0.12;
    }
    return;
  }

  if (state === State.PLAYING) {
    goat.vy -= CFG.gravity * dt;
    goat.vy = Math.max(-CFG.maxFallSpeed, Math.min(CFG.maxRiseSpeed, goat.vy));
    goat.y += goat.vy * dt;

    const targetRot = THREE.MathUtils.clamp(goat.vy * 0.06, -0.95, 0.55);
    goat.rot = THREE.MathUtils.lerp(goat.rot, targetRot, 1 - Math.pow(0.001, dt));

    goat.mesh.position.y = goat.y;
    goat.mesh.rotation.z = goat.rot;
    goat.mesh.rotation.y = 0.08;

    if (goat.flapPhase > 0) goat.flapPhase = Math.max(0, goat.flapPhase - dt * 4.2);
    const leap = goat.flapPhase > 0 ? Math.sin(goat.flapPhase * Math.PI) : Math.sin(time * 7) * 0.1;
    goat.earL.rotation.z = 0.35 + leap * 0.7;
    goat.earR.rotation.z = 0.35 + leap * 0.7;
    goat.earL.rotation.x = 0.4 - leap * 0.5;
    goat.earR.rotation.x = -0.4 + leap * 0.5;
    goat.legFL.rotation.x = -leap * 1.1;
    goat.legFR.rotation.x = -leap * 1.0;
    goat.legBL.rotation.x = leap * 0.9;
    goat.legBR.rotation.x = leap * 0.85;

    if (goat.y - CFG.goatRadius < CFG.groundY) {
      goat.y = CFG.groundY + CFG.goatRadius;
      die();
      return;
    }
    if (goat.y + CFG.goatRadius > CFG.ceilingY) {
      goat.y = CFG.ceilingY - CFG.goatRadius;
      goat.vy = Math.min(goat.vy, 0);
    }

    camTargetY = THREE.MathUtils.clamp(goat.y * 0.12, -0.55, 0.55);
  }

  if (state === State.DEAD && goat.mesh) {
    goat.vy -= CFG.gravity * dt * 0.85;
    goat.y += goat.vy * dt;
    goat.rot = THREE.MathUtils.lerp(goat.rot, -1.2, 1 - Math.pow(0.01, dt));
    goat.mesh.position.y = goat.y;
    goat.mesh.rotation.z = goat.rot;
    goat.mesh.rotation.x += dt * 4;
    if (goat.y < CFG.groundY - 2) goat.mesh.visible = false;
  }

  updateClothingPhysics(dt);
}

function onScore(pipe) {
  setScore(score + 1);
  const perfect = pipe.isPerfect(goat.y);
  if (perfect) {
    perfectStreak += 1;
    showFloat(perfectStreak >= 2 ? `Perfect x${perfectStreak}!` : 'Perfect!', true);
    sfxPerfect();
    haptic('success');
    spawnScoreSpark(CFG.goatX + 0.4, goat.y);
    flash('score');
  } else {
    perfectStreak = 0;
    showFloat('+1');
    sfxScore();
    haptic('medium');
    spawnScoreSpark(CFG.goatX + 0.3, goat.y);
  }

  // Every 5 pipes → Vegas spin token
  if (score > 0 && score % 5 === 0) {
    grantSpin();
    sfxGoatBleat();
  }
}

function updatePipes(dt) {
  if (state !== State.PLAYING) return;

  const speedBoost = Math.min(1.42, 1 + score * 0.018);
  const gapScale = Math.max(0.88, 1 - score * 0.004); // gently tightens
  const interval = (CFG.pipeSpawnInterval * (0.5 + gapScale * 0.5)) / Math.min(1.28, 1 + score * 0.014);

  // Only spawn after first flap so player isn't blindsided
  if (runStarted) {
    pipeTimer -= dt;
    if (pipeTimer <= 0) {
      spawnPipe(CFG.pipeGap * gapScale);
      pipeTimer = interval;
    }
  }

  nearMissCooldown = Math.max(0, nearMissCooldown - dt);

  for (let i = pipes.length - 1; i >= 0; i--) {
    const p = pipes[i];
    p.x -= CFG.pipeSpeed * speedBoost * dt;
    p.group.position.x = p.x;

    // Cyberpunk neon pulse on emissive parts
    if (p.group.userData?.neon || p.top?.userData?.neon) {
      const pulse = 0.75 + 0.35 * Math.sin(time * 4.5 + p.x * 0.4);
      const pulse2 = 0.55 + 0.4 * Math.sin(time * 6.2 + p.x * 0.55);
      for (const side of [p.top, p.bot]) {
        if (!side) continue;
        side.traverse((obj) => {
          if (!obj.isMesh || !obj.material) return;
          const part = obj.userData.pipePart;
          if (part === 'shaft' && obj.material.emissiveIntensity !== undefined) {
            obj.material.emissiveIntensity = 0.7 + pulse * 0.55;
          } else if (part === 'rim' && obj.material.emissiveIntensity !== undefined) {
            obj.material.emissiveIntensity = 0.9 + pulse2 * 0.6;
          } else if (part === 'halo' && obj.material.opacity !== undefined) {
            obj.material.opacity = 0.12 + pulse * 0.18;
          } else if (part === 'ring2' && obj.material.opacity !== undefined) {
            obj.material.opacity = 0.45 + pulse2 * 0.4;
          } else if (part === 'stripe' && obj.material.emissiveIntensity !== undefined) {
            obj.material.emissiveIntensity = 0.8 + pulse2 * 0.5;
          }
        });
      }
    }

    if (!p.nearMissed && nearMissCooldown <= 0 && p.isNearMiss(goat.y, CFG.goatRadius)) {
      p.nearMissed = true;
      nearMissCooldown = 0.35;
      sfxNear();
      haptic('light');
      flash('near');
    }

    if (!p.scored && p.x < CFG.scoreX) {
      p.scored = true;
      onScore(p);
    }

    if (p.collides(goat.y, CFG.goatRadius)) {
      die();
      return;
    }

    if (p.x < -12) {
      p.dispose();
      pipes.splice(i, 1);
    }
  }
}

function updateEnvironment(dt) {
  const playing = state === State.PLAYING;
  const scrollMul = playing ? 1 : 0.35;
  const theme = activeTheme();

  // Soft pulse around the selected theme palette
  if (skyMesh?.material?.uniforms) {
    const u = skyMesh.material.uniforms;
    u.time.value = time;
    if (theme.skyDrift) {
      const pulse = Math.sin(time * 0.08) * 0.5 + 0.5;
      const baseTop = new THREE.Color(theme.skyTop);
      const baseMid = new THREE.Color(theme.skyMid);
      const baseBot = new THREE.Color(theme.skyBot);
      u.topColor.value.copy(baseTop).lerp(baseMid, pulse * 0.12);
      u.midColor.value.copy(baseMid).lerp(baseBot, pulse * 0.1);
      u.bottomColor.value.copy(baseBot).offsetHSL(0, 0, Math.sin(time * 0.05) * 0.03);
    }
  }

  const bodyAng = time * 0.04;
  const sx = 5.5 + Math.sin(bodyAng) * 3.5;
  const sy = 3.2 + Math.cos(bodyAng * 0.7) * 1.2;
  if (sunMesh && sunGlow && theme.sunVisible) {
    sunMesh.position.set(sx, sy, -18);
    sunGlow.position.copy(sunMesh.position);
    sunGlow.scale.setScalar(1 + Math.sin(time * 1.5) * 0.08);
    if (sunLight) sunLight.position.set(sx * 0.8, 8 + sy * 0.4, 8);
  }
  if (moonMesh && moonGlow && theme.moonVisible) {
    const mx = -5.2 + Math.sin(bodyAng * 0.7) * 2.2;
    const my = 3.8 + Math.cos(bodyAng * 0.5) * 0.8;
    moonMesh.position.set(mx, my, -18);
    moonGlow.position.copy(moonMesh.position);
    moonGlow.scale.setScalar(1 + Math.sin(time * 1.2) * 0.06);
    if (sunLight) sunLight.position.set(mx * 0.5, 6 + my * 0.3, 6);
  }

  for (const c of clouds) {
    const spd = c.userData.speed * (playing ? 1.35 : 0.55);
    c.position.x -= spd * dt;
    c.position.y =
      c.userData.baseY +
      Math.sin(time * 0.7 + c.userData.phase) * 0.22 +
      Math.sin(time * 0.25 + c.userData.phase * 2) * 0.08;
    // gentle scale "breathing"
    const breathe = 1 + Math.sin(time * 0.5 + c.userData.phase) * 0.04;
    c.scale.set(breathe, breathe * 0.95, breathe);
    if (c.position.x < -24) {
      c.position.x = 24 + Math.random() * 5;
      c.userData.baseY = 1.2 + Math.random() * 4.2;
    }
  }

  // Hills always scroll gently (faster when playing)
  for (const h of hills) {
    const layer = h.userData.layer ?? 1;
    const spd = (0.25 + layer * 0.2) * scrollMul * (playing ? 1.6 : 1);
    h.position.x -= spd * dt;
    h.position.y = h.userData.baseY + Math.sin(time * 0.35 + h.userData.phase) * 0.06;
    if (h.position.x < -24) h.position.x += 50;
  }

  for (const g of grass) {
    if (playing) {
      g.position.x -= CFG.pipeSpeed * 0.85 * dt;
      if (g.position.x < -20) g.position.x += 40;
    }
    g.rotation.z = Math.sin(time * 3.2 + g.position.x) * 0.12;
  }

  for (const t of trees) {
    t.position.x -= 0.7 * scrollMul * (playing ? 1.5 : 1) * dt;
    t.rotation.z = Math.sin(time * 1.8 + t.userData.phase) * t.userData.sway;
    if (t.position.x < -22) {
      t.position.x += 44;
      t.position.z = -3.5 - Math.random() * 3.5;
    }
  }

  for (const b of birds) {
    if (!b.visible) continue;
    b.position.x -= b.userData.speed * (playing ? 1.15 : 0.7) * dt;
    b.position.y =
      b.userData.baseY + Math.sin(time * 1.6 + b.userData.phase) * b.userData.amp;
    const flap = Math.sin(time * 10 + b.userData.phase);
    b.userData.wingL.rotation.x = flap * 0.7;
    b.userData.wingR.rotation.x = -flap * 0.7;
    b.rotation.z = Math.sin(time * 1.6 + b.userData.phase) * 0.12;
    if (b.position.x < -20) {
      b.position.x = 18 + Math.random() * 6;
      b.userData.baseY = 1.5 + Math.random() * 3.2;
      b.position.z = -7 - Math.random() * 5;
    }
  }

  for (const bl of balloons) {
    if (!bl.visible) continue;
    bl.position.x -= bl.userData.speed * (playing ? 1.1 : 0.5) * dt;
    bl.position.y =
      bl.userData.baseY +
      Math.sin(time * 0.9 + bl.userData.phase) * 0.35 +
      time * 0.02 * Math.sin(bl.userData.phase);
    bl.position.z += Math.sin(time * 0.4 + bl.userData.phase) * 0.002;
    bl.rotation.z = Math.sin(time * 0.7 + bl.userData.phase) * 0.08;
    if (bl.position.x < -18) {
      bl.position.x = 16 + Math.random() * 8;
      bl.userData.baseY = 0.5 + Math.random() * 3.5;
      bl.position.y = bl.userData.baseY;
    }
  }

  if (stars) {
    const baseOp = theme.starsOpacity;
    stars.material.opacity = baseOp * (0.75 + Math.sin(time * 1.1) * 0.2);
    stars.rotation.z = time * 0.012;
  }

  if (fireflies && fireflies.visible) {
    const pos = fireflies.geometry.attributes.position;
    const base = fireflies.userData.base;
    const phases = fireflies.userData.phases;
    for (let i = 0; i < phases.length; i++) {
      const ph = phases[i];
      pos.array[i * 3] = base[i * 3] + Math.sin(time * 0.7 + ph) * 0.6 - time * 0.15 * scrollMul;
      let x = pos.array[i * 3];
      if (x < -14) {
        base[i * 3] += 28;
        x += 28;
        pos.array[i * 3] = x;
      }
      pos.array[i * 3 + 1] = base[i * 3 + 1] + Math.sin(time * 1.4 + ph * 2) * 0.35;
      pos.array[i * 3 + 2] = base[i * 3 + 2] + Math.cos(time * 0.6 + ph) * 0.25;
    }
    pos.needsUpdate = true;
    fireflies.material.opacity = 0.35 + Math.sin(time * 2.2) * 0.25;
    fireflies.material.size = 0.1 + Math.sin(time * 3) * 0.03;
  }

  updateCity(dt, playing);
  updateRocket(dt, theme);

  // Camera
  if (shake > 0) {
    shake = Math.max(0, shake - dt);
    const mag = shake * 0.38;
    camera.position.x = (Math.random() - 0.5) * mag;
    camera.position.y = camTargetY + (Math.random() - 0.5) * mag;
  } else {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.14);
    const ty = state === State.PLAYING ? camTargetY : 0;
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, 0.08);
  }

  if (readyTimer > 0) {
    readyTimer -= dt;
    if (readyTimer <= 0) hide(readyHint);
  }
}

function frame() {
  requestAnimationFrame(frame);
  let dt = Math.min(clock.getDelta(), 0.05);

  if (state === State.PAUSED) {
    renderer.render(scene, camera);
    return;
  }

  if (hitStop > 0) {
    hitStop -= dt;
    dt *= 0.15; // brief slow-mo
  }

  time += dt;
  updateGoat(dt);
  updatePipes(dt);
  updateEnvironment(dt);
  updateParticles(dt);
  updateProjectiles(dt);
  renderer.render(scene, camera);
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
createSky();
createStars();
createLights();
createGround();
createHills();
createTrees();
createClouds();
createBirds();
createBalloons();
createFireflies();
createCyberpunkCity();
createRocket();
createGoat();
// Drop premium theme if somehow selected without unlock
if (THEMES[settings.theme]?.requiresUnlock && !unlockedThemes.has(settings.theme)) {
  settings.theme = 'meadow';
  saveSettings();
}
// Drop equipped items that are no longer unlocked
for (const slot of GEAR_SLOTS) {
  if (equipped[slot] && !unlockedGear.has(equipped[slot])) equipped[slot] = null;
}
saveEquipped();
applyTheme(settings.theme);
applyLoadoutVisuals();

syncSettingsUI();
buildSceneryList();
updateMenuStats();
goMenu();
frame();

// Optional deep-link for docs/automation: ?screen=menu|rewards|trade|scenery|play
// Add &docs=1 for solid opaque UI (clean screenshots without blur ghosting)
(() => {
  try {
    const params = new URLSearchParams(location.search);
    const docs = params.get('docs') === '1';
    const screen = params.get('screen') || 'menu';
    if (docs) {
      document.body.classList.add('docs-capture');
      if (screen === 'play') document.body.classList.add('docs-play');
      else document.body.classList.add('docs-ui');
    }
    if (!screen || screen === 'menu') return;
    setTimeout(() => {
      if (screen === 'rewards') openRewardsScreen('menu');
      else if (screen === 'trade' || screen === 'loadout') {
        openTradeScreen();
        if (screen === 'loadout') setTradeTab('loadout');
      } else if (screen === 'scenery') {
        hide(startScreen);
        buildSceneryList();
        show(sceneryScreen);
      } else if (screen === 'play') {
        startGame();
        // Let a frame or two render; hide tutorial chrome for a clean shot
        hide(tutorialEl);
        hide(readyHint);
      }
    }, docs ? 800 : 400);
  } catch {
    /* ignore */
  }
})();

// Warm audio graph on first gesture anywhere
window.addEventListener(
  'pointerdown',
  () => {
    ensureAudio();
    if (settings.music) startMusic();
  },
  { once: true }
);

console.info('%cSlappy Goat', 'color:#ff8a4c;font-weight:bold;font-size:14px', 'polished build');
