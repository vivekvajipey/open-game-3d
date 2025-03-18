import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Character {
    constructor(scene) {
        // Character properties
        this.moveSpeed = 5;
        this.turnSpeed = 2;
        this.jumpForce = 10;
        this.gravity = 20;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isGrounded = true;
        this.modelLoaded = false;
        
        // Create a group to hold the character model
        this.group = new THREE.Group();
        this.group.position.y = 1; // start at ground level
        scene.add(this.group);
        
        // Create a temporary cube while model loads
        this.createTempCube();
        
        // Load glTF model
        console.log('Attempting to load model from: assets/models/runner.glb');
        
        // Set a timeout for model loading
        this.modelLoadTimeout = setTimeout(() => {
            if (!this.modelLoaded) {
                console.warn('Model load timed out - using cube character instead');
            }
        }, 5000); // 5 second timeout
        
        this.loadModel();
    }
    
    createTempCube() {
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshLambertMaterial({ color: 0x3333ff });
        this.tempMesh = new THREE.Mesh(geometry, material);
        this.tempMesh.castShadow = true;
        this.group.add(this.tempMesh);
    }
    
    loadModel() {
        try {
            const loader = new GLTFLoader();
            console.log('GLTFLoader created successfully');
            
            loader.load(
                'assets/models/runner.glb', 
                // onLoad callback
                (gltf) => {
                    console.log('Model loaded successfully:', gltf);
                    this.modelLoaded = true;
                    clearTimeout(this.modelLoadTimeout);
                    
                    // Remove temp cube once model is loaded
                    if (this.tempMesh) {
                        this.group.remove(this.tempMesh);
                        this.tempMesh.geometry.dispose();
                        this.tempMesh.material.dispose();
                        this.tempMesh = null;
                    }
                    
                    const model = gltf.scene;
                    
                    // Set shadows for all meshes
                    model.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                        }
                    });
                    
                    // Adjust model orientation and scale if needed
                    model.rotation.y = Math.PI; // Might need to adjust based on your model
                    model.scale.set(1, 1, 1); // Adjust scale as needed for your model
                    
                    this.group.add(model);
                    this.model = model;
                },
                // onProgress callback
                (xhr) => {
                    if (xhr.total) {
                        console.log(`${Math.round(xhr.loaded / xhr.total * 100)}% loaded`);
                    } else {
                        console.log(`${xhr.loaded} bytes loaded`);
                    }
                },
                // onError callback
                (error) => {
                    console.error('Error loading model:', error);
                    // Keep the temp cube visible if model fails to load
                    this.createFallbackCharacter();
                }
            );
        } catch (err) {
            console.error('Exception when creating GLTFLoader or loading model:', err);
            this.createFallbackCharacter();
        }
    }
    
    createFallbackCharacter() {
        console.log('Creating fallback character (colored cube)');
        // We can keep using the temp mesh created earlier
        // Optionally, we could enhance it here with additional features
        
        // Mark as loaded to prevent further attempts
        this.modelLoaded = true;
        clearTimeout(this.modelLoadTimeout);
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
                this.group.rotation.y = THREE.MathUtils.lerp(
                    this.group.rotation.y,
                    targetRotation,
                    this.turnSpeed * deltaTime
                );
            }
        }
        
        // Apply movement in the direction the character is facing
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.group.quaternion);
        forward.multiplyScalar(moveDir.z * this.moveSpeed * deltaTime);
        
        const right = new THREE.Vector3(1, 0, 0);
        right.applyQuaternion(this.group.quaternion);
        right.multiplyScalar(moveDir.x * this.moveSpeed * deltaTime);
        
        this.group.position.add(forward);
        this.group.position.add(right);
        
        // Apply vertical movement (jumping/falling)
        this.group.position.y += this.velocity.y * deltaTime;
        
        // Ground collision
        if (this.group.position.y < 1) {
            this.group.position.y = 1;
            this.velocity.y = 0;
            this.isGrounded = true;
        }
    }
    
    getPosition() {
        return this.group.position;
    }
    
    getRotation() {
        return this.group.rotation;
    }
} 