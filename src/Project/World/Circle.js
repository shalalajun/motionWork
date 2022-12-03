import * as THREE from 'three';
import Project from "../Project";

export default class Circle
{
    constructor(x,y)
    {
        this.project = new Project();
        this.scene = this.project.scene;

        this.circle = [];
        this.circleGroup = new THREE.Group();
        this.center = new THREE.Vector3(0,0,0);
        this.radius = 10.0;
        this.angle = 0;
        this.position = new THREE.Vector3(x,y,0);
        this.velocity = new THREE.Vector3(0,0,0);
        this.acceleration = new THREE.Vector3(0,0,0);

        this.width = window.innerWidth;
        this.height =window.innerHeight;

        this.setMesh();
    }

    setMesh()
    {
        this.circleGeometry = new THREE.BoxGeometry(1,1,1);
        this.circleMaterial = new THREE.MeshStandardMaterial({color:'white'});
        this.circle = new THREE.Mesh(this.circleGeometry, this.circleMaterial);
        this.circle.position.copy(this.position);
        this.circleGroup.add(this.circle);
        this.scene.add(this.circleGroup);
    }

    update()
    {
        this.angle += 0.01;
        const px = this.center.x + this.radius * Math.cos(this.angle); 
        const py = this.center.y + this.radius * Math.sin(this.angle); 
        this.position.set(px,py,0);
        this.circle.position.copy(this.position);
    }
} 