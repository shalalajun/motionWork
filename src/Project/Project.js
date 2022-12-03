import * as THREE from 'three';
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import World from './World/World.js';
import Resources from './Utils/Resources.js';
import sources from './sources.js'
import Circle from './World/Circle.js';




let instance = null;

export default class Project
{
    constructor(canvas)
    {

        if(instance)
        {
            return instance;
        }

        instance = this;

        window.project = this;
        this.canvas =canvas;
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();
       // this.circle = new Circle();
        this.circles = [];
        this.circleGroup = new THREE.Group();

        this.center = new THREE.Vector3(0,0,0);
        this.radius = 2.0;
        this.angle = 0;
        this.resolution = 50;
       

        for(let i=0; i < this.resolution; i++)
        {
            // const px = this.center.x + this.radius * Math.cos(this.angle + i); 
            // const py = this.center.y + this.radius * Math.sin(this.angle + i);
            
            const step = 2 / this.resolution;
            this.scale = 1 * step;
            const px = (i+0.5)*step-1;
            const py = px * px;
            this.circles[i] = new Circle(px,py);
            this.circles[i].circle.scale.set(this.scale,this.scale,this.scale);
           
        }
        console.log(this.circles);
        this.sizes.on('resize',()=>
        {
            this.resize();
        })

        this.time.on('tick',()=>
        {
           this.update();
        })
    }

    resize()
    {
        this.camera.resize();
        this.renderer.resize();
        
    }

    update()
    {
        this.camera.update();
        this.renderer.update(); 
        
    }
}