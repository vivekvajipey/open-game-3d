import * as THREE from 'three';

export class CameraController {
    constructor(camera, character) {
        this.camera = camera;
        this.character = character;
        
        // Camera settings
        this.distance = 5;        // Distance behind character
        this.height = 2;          // Height above character
        this.smoothness = 5;      // Lower = smoother
    }
    
    update(deltaTime) {
        const characterPosition = this.character.getPosition();
        const characterRotation = this.character.getRotation();
        
        // Calculate ideal camera position (behind and above the character)
        const idealOffset = new THREE.Vector3(0, this.height, this.distance);
        idealOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), characterRotation.y);
        
        const idealPosition = new THREE.Vector3();
        idealPosition.copy(characterPosition).add(idealOffset);
        
        // Smoothly interpolate current camera position toward ideal position
        this.camera.position.lerp(idealPosition, deltaTime * this.smoothness);
        
        // Look at the character
        this.camera.lookAt(
            characterPosition.x,
            characterPosition.y + 1,  // Look slightly above feet
            characterPosition.z
        );
    }
} 