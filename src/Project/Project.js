import * as THREE from 'three';
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import World from './World/World.js';
import Resources from './Utils/Resources.js';
import sources from './sources.js'
import Circle from './World/Circle.js';
import CircleInstance from './World/CircleInstance.js';
import GUI from 'lil-gui'; 
import Stats from 'stats.js';




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
        this.resolution = 30;
        this.points = this.resolution * this.resolution;
        
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        this.matrix = new THREE.Matrix4();

        this.circleGeometry = new THREE.BoxGeometry(0.2,0.2,0.2);
        this.circleMaterial = new THREE.MeshStandardMaterial({color:'white'});
        this.circleInstances = new THREE.InstancedMesh(this.circleGeometry, this.circleMaterial, 100);
        
        for(let i=0; i<100; i++)
        {
            this.matrix.setPosition(i, 0, 0);
            this.circleInstances.setMatrixAt( i, this.matrix );
        }

        this.scene.add(this.circleInstances);

        //console.log(circleInstances)

        this.gui = new GUI();
        this.parameter =
        {
            function: 1
        };

        this.gui.add(this.parameter,'function',0,2,1);


        for(let i=0, x=0, z=0; i < this.resolution * this.resolution; i++, x++)
        {
            // const px = this.center.x + this.radius * Math.cos(this.angle + i); 
            // const py = this.center.y + this.radius * Math.sin(this.angle + i);
            if(x == this.resolution)
            {
                x=0;
                z += 1;
            }
            const step = 2 / this.resolution;
            this.scale = 1 * step;
            const px = (x+0.5)*step-1;
            const pz = (z+0.5)*step-1;
            const py = Math.sin(Math.PI * (px+this.angle));
            this.circles[i] = new Circle(px,py,pz);
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
        this.stats.begin();
        //this.circleUpdate();
        this.circleSecond();
        this.camera.update();
        this.renderer.update(); 
        this.stats.end();
        
    }

    circleUpdate()
    {
        this.angle = this.angle + 0.02;
        for(let i=0; i < this.resolution; i++)
        {
            // const px = this.center.x + this.radius * Math.cos(this.angle + i); 
            // const py = this.center.y + this.radius * Math.sin(this.angle + i);
            
            const step = 2 / this.resolution;
            this.scale = 1 * step;
            const px = (i+0.5)*step-1;
            const py = Math.sin(Math.PI * (px+this.angle));
            this.circles[i].circle.position.set(px,py,0);
           
        }
    }

    circleSecond()
    {

        this.angle = this.angle + 0.01;
        for(let i=0, x=0, z=0; i < this.resolution * this.resolution; i++, x++)
        {
            // const px = this.center.x + this.radius * Math.cos(this.angle + i); 
            // const py = this.center.y + this.radius * Math.sin(this.angle + i);
            if(x == this.resolution)
            {
                x=0;
                z += 1;
            }
            const step = 2 / this.resolution;
            this.scale = 1 * step;
            const px = (x+0.5)*step-1;
            const pz = (z+0.5)*step-1;
            let py;
            if(this.parameter.function == 0)
            {
                py = this.wave(this.circles[i].circle.position.x, this.circles[i].circle.position.z, this.angle);   
                
            }else if(this.parameter.function == 1)
            {
                py = this.multiWave(this.circles[i].circle.position.x, this.circles[i].circle.position.z, this.angle);
           
            }else
            {
                py = this.ripple(this.circles[i].circle.position.x, this.circles[i].circle.position.z, this.angle);
            }
              
            this.circles[i].circle.position.set(this.circles[i].circle.position.x,py,pz);
           
        }
    }

    wave(x, z, t)
    {
        return Math.sin(Math.PI * (x+z+t));
    }

    multiWave(x, z, t)
    {
        let y = Math.sin(Math.PI * (x+ 0.5 * t));
        y += 0.5 * Math.sin(2 * Math.PI * (z + t));
        y += Math.sin(Math.PI * (x + z + 0.25 * t));
        return y * (1/2.5);
    }

    ripple(x, z, t)
    {
        //let d = Math.abs(x);
        let d = Math.sqrt(x * x + z * z);
        let dy = Math.sin(Math.PI * (4 * d - t));
        return dy / (1 + 10 * d);
    }

    checkFPS()
    {
       
    }
}