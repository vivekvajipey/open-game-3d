import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';

export class Character {
    constructor(scene) {
        // Character properties
        this.moveSpeed = 5;
        this.turnSpeed = 2;
        this.jumpForce = 10;
        this.gravity = 20;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isGrounded = true;
        
        // Create character mesh (simple cube for now)
        this.mesh = this.createCharacterMesh();
        this.mesh.castShadow = true;
        scene.add(this.mesh);
    }
    
    createCharacterMesh() {
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshLambertMaterial({ color: 0x3333ff });
        const mesh = new THREE.Mesh(geometry, material);
        
        // Raise the character so it sits on the ground
        mesh.position.y = 1;
        
        return mesh;
    }
    
    update(keys, deltaTime) {
        // Handle jumping
        if (keys.space && this.isGrounded) {
            this.velocity.y = this.jumpForce;
            this.isGrounded = false;
        }
        
        // Apply gravity
        if (!this.isGrounded) {
            this.velocity.y -= this.gravity * deltaTime;
        }
        
        // Move the character based on input
        const moveDir = new THREE.Vector3(0, 0, 0);
        
        if (keys.w) moveDir.z = -1;
        if (keys.s) moveDir.z = 1;
        if (keys.a) moveDir.x = -1;
        if (keys.d) moveDir.x = 1;
        
        if (moveDir.length() > 0) {
            moveDir.normalize();
            
            // Rotate character to face movement direction (for forward/backward)
            if (keys.w || keys.s) {
                const targetRotation = Math.atan2(moveDir.x, moveDir.z);
                this.mesh.rotation.y = THREE.MathUtils.lerp(
                    this.mesh.rotation.y,
                    targetRotation,
                    this.turnSpeed * deltaTime
                );
            }
        }
        
        // Apply movement in the direction the character is facing
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.mesh.quaternion);
        forward.multiplyScalar(moveDir.z * this.moveSpeed * deltaTime);
        
        const right = new THREE.Vector3(1, 0, 0);
        right.applyQuaternion(this.mesh.quaternion);
        right.multiplyScalar(moveDir.x * this.moveSpeed * deltaTime);
        
        this.mesh.position.add(forward);
        this.mesh.position.add(right);
        
        // Apply vertical movement (jumping/falling)
        this.mesh.position.y += this.velocity.y * deltaTime;
        
        // Ground collision
        if (this.mesh.position.y < 1) {
            this.mesh.position.y = 1;
            this.velocity.y = 0;
            this.isGrounded = true;
        }
    }
    
    getPosition() {
        return this.mesh.position;
    }
    
    getRotation() {
        return this.mesh.rotation;
    }
} 