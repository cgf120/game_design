<template>
  <div class="relative w-full aspect-square flex items-center justify-center">
    <!-- Background Mandala/Array -->
    <div class="absolute inset-0 opacity-10 animate-spin-slow pointer-events-none">
       <svg viewBox="0 0 100 100" class="w-full h-full fill-current text-white">
          <circle cx="50" cy="50" r="48" stroke="currentColor" stroke-width="0.5" fill="none" stroke-dasharray="2 2" />
          <path d="M50 5 L93 50 L50 95 L7 50 Z" stroke="currentColor" stroke-width="0.2" fill="none" />
       </svg>
    </div>

    <!-- The Chart -->
    <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-lg">
      <!-- Connections (Generating Cycle: Metal->Water->Wood->Fire->Earth->Metal) -->
      <!-- Points: calculated for pentagon. Center 50,50. Radius 35. -->
      <!-- 0: Metal (Top) - Actually traditionally Metal is West? 
           Let's use standard Wuxia/TCM arrangement:
           Top: Fire (S), Bottom: Water (N), Left: Wood (E), Right: Metal (W), Center: Earth
           Wait, standard 2D map:
           Top(Fire), Right(Earth?), Bottom(Water?), Left(Wood)?
           Actually generating cycle circle:
           Wood -> Fire -> Earth -> Metal -> Water -> Wood
           Let's arrange them in a circle clockwise.
           Top: Wood?
           Let's pick an aesthetically pleasing one.
           Top: Fire (Red). Right-Top: Earth (Yellow). Right-Bottom: Metal (Gold). Left-Bottom: Water (Blue). Left-Top: Wood (Green).
           Cycle: Fire -> Earth -> Metal -> Water -> Wood -> Fire.
           Yes, this works.
       -->
       
       <defs>
          <linearGradient id="line-grad" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
             <stop offset="0%" stop-color="#ffffff" stop-opacity="0.1" />
             <stop offset="100%" stop-color="#ffffff" stop-opacity="0.1" />
          </linearGradient>
       </defs>

       <!-- Connecting Lines (Pentagon) -->
       <polygon :points="polygonPoints" fill="none" stroke="url(#line-grad)" stroke-width="0.5" />
       <!-- Generating Cycle (Circle lines) -->
       <!-- <circle cx="50" cy="50" r="35" fill="none" stroke="#333" stroke-width="0.5" stroke-dasharray="2 2" /> -->

       <!-- Nodes -->
       <g v-for="(node, index) in nodes" :key="node.key">
          <!-- Connector Line to next node (optional subtle arc) -->
          
          <!-- Node Group -->
          <g :transform="`translate(${node.x}, ${node.y})`">
             <!-- Outer Glow for non-zero roots -->
             <circle v-if="node.value > 0" r="6" :fill="node.color" class="opacity-20 animate-pulse" />
             
             <!-- Core Circle -->
             <circle r="4" :fill="node.value > 0 ? node.color : '#333'" :stroke="node.color" stroke-width="0.5" />
             
             <!-- Symbol/Text -->
             <text y="1.5" text-anchor="middle" font-size="4" fill="#000" font-weight="bold" class="pointer-events-none select-none">
                 {{ node.label }}
             </text>
             
             <!-- Value Label (Outside) -->
             <text :y="node.textY" :x="node.textX" text-anchor="middle" font-size="3" :fill="node.color" class="font-mono opacity-80 current-value">
                 {{ node.value }}
             </text>
          </g>
       </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SpiritRoot } from '../../core/models/player';

const props = defineProps<{
    roots: SpiritRoot
}>();

// Radius of the ring
const R = 35;
const CX = 50;
const CY = 50;

// Order: Fire(Top) -> Earth -> Metal -> Water -> Wood
// Angles (Degrees, -90 is Top)
// 0: -90 (Fire)
// 1: -18 (Earth)
// 2: 54 (Metal)
// 3: 126 (Water)
// 4: 198 (Wood)

interface RootNode {
    key: keyof SpiritRoot;
    label: string;
    color: string;
    value: number;
    angle: number;
    x: number;
    y: number;
    textX: number;
    textY: number;
}

const definitions = [
    { key: 'fire', label: '火', color: '#ef4444', angle: -90 },   // Top
    { key: 'earth', label: '土', color: '#d97706', angle: -18 },  // Top Right
    { key: 'metal', label: '金', color: '#f59e0b', angle: 54 },   // Bottom Right
    { key: 'water', label: '水', color: '#3b82f6', angle: 126 },  // Bottom Left
    { key: 'wood', label: '木', color: '#10b981', angle: 198 },   // Top Left
];

const nodes = computed<RootNode[]>(() => {
    return definitions.map(def => {
        const rad = def.angle * (Math.PI / 180);
        const x = CX + R * Math.cos(rad);
        const y = CY + R * Math.sin(rad);
        
        // Text offset
        const textOffset = 8;
        const tx = textOffset * Math.cos(rad);
        const ty = textOffset * Math.sin(rad) + 1.5; // slight correction for visual balance

        return {
            key: def.key as keyof SpiritRoot,
            label: def.label,
            color: def.color,
            value: props.roots[def.key as keyof SpiritRoot] || 0,
            angle: def.angle,
            x,
            y,
            textX: tx,
            textY: ty
        };
    });
});

const polygonPoints = computed(() => {
    return nodes.value.map(n => `${n.x},${n.y}`).join(' ');
});

</script>

<style scoped>
.animate-spin-slow {
    animation: spin 60s linear infinite;
}
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.current-value {
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}
</style>
