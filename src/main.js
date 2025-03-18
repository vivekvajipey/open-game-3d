import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import { Renderer } from './engine/renderer.js';
import { InputHandler } from './engine/input.js';
import { Physics } from './engine/physics.js';
import { World } from './game/world.js';
import { Character } from './game/character.js';
import { CameraController } from './game/camera.js';

class Game {
    constructor() {
        this.renderer = new Renderer();
        this.scene = this.renderer.scene;
        
        this.world = new World(this.scene);
        this.character = new Character(this.scene);
        this.camera = new CameraController(this.renderer.camera, this.character);
        this.input = new InputHandler();
        this.physics = new Physics();
        
        this.lastTime = 0;
        this.animate = this.animate.bind(this);
        this.animate();
    }
    
    animate(currentTime = 0) {
        requestAnimationFrame(this.animate);
        
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1); // Cap delta time to prevent large jumps
        this.lastTime = currentTime;
        
        if (deltaTime > 0) {
            // Update game state
            this.character.update(this.input.keys, deltaTime);
            this.camera.update(deltaTime);
            
            // Render the scene
            this.renderer.render();
        }
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    console.log('Starting game...');
    const game = new Game();
}); 