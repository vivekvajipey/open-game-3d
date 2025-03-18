import * as THREE from 'three';

export class Physics {
    constructor() {
        this.gravity = 20; // Gravity force
    }

    // Apply gravity to an object
    applyGravity(object, velocity, deltaTime, isGrounded) {
        if (!isGrounded) {
            velocity.y -= this.gravity * deltaTime;
        }
        return velocity;
    }

    // Check if object is on the ground
    checkGroundCollision(position, height, groundY = 0) {
        return position.y <= groundY + height;
    }

    // Simple collision detection with the ground
    resolveGroundCollision(position, velocity, height, groundY = 0) {
        if (position.y < groundY + height) {
            position.y = groundY + height;
            velocity.y = 0;
            return true; // Is grounded
        }
        return false; // Is not grounded
    }
} 