import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Mesh,
    Group,
    ShaderMaterial,
    DirectionalLight,
    AmbientLight,
    Vector2,
    Color,
    Box3,
    Vector3,
    AdditiveBlending,
    FrontSide,
    PlaneGeometry,
    MeshBasicMaterial,
    DoubleSide,
    TextureLoader,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';
import cloudFragmentShader from './shaders/cloud-fragment.glsl';
import { GLTF, GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OutlinePass } from 'three/examples/jsm/Addons.js';
import { EffectComposer } from 'three/examples/jsm/Addons.js';
import { RenderPass } from 'three/examples/jsm/Addons.js';
import noiseTexture from './textures/noisetexture.jpg';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';

export default class ThreeScene {
    private scene: Scene;
    private camera: PerspectiveCamera;
    private renderer: WebGLRenderer;
    private orbitControls: OrbitControls;
    private boardGroup: Group;
    private shaderMaterials: ShaderMaterial[];
    private composer: EffectComposer;

    constructor(canvas: HTMLCanvasElement) {
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        this.renderer = new WebGLRenderer({ antialias: true, canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.boardGroup = new Group();
        this.shaderMaterials = [];

        this.orbitControls = new OrbitControls(
            this.camera,
            this.renderer.domElement,
        );
        this.orbitControls.dampingFactor = 0.005;
        this.orbitControls.enableDamping = true;
        this.orbitControls.enablePan = true;
        this.orbitControls.enableZoom = true;

        this.composer = new EffectComposer(this.renderer);

        this.init();

        const pixelPass = new RenderPixelatedPass(6, this.scene, this.camera);

        this.composer.addPass(pixelPass);

        //const renderPass = new RenderPass(this.scene, this.camera);
        //this.composer.addPass(renderPass);

        const ambientLight = new AmbientLight(0x404040, 1);
        this.scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        this.animate = this.animate.bind(this);
        this.animate();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    private init(): void {
        this.camera.position.z = 2;
        this.scene.add(this.boardGroup);
        this.drawModel();
        this.drawCloudShader();
    }

    private drawCloudShader(): void {
        const geo = new PlaneGeometry();
        const scale = 1;
        const shaderMat = new ShaderMaterial({
            fragmentShader: cloudFragmentShader,
            vertexShader: vertexShader,
            side: DoubleSide,
            uniforms: {
                //u_resolution: {value: new Vector2(window.innerWidth, window.innerHeight)},
                //uTime: {value: 0.0},
                //u_noiseTexture: {value: new TextureLoader().load('/noisetexture.jpg')},
                //u_cameraPos: {value: new Vector3(0, 1, 0)},
                //u_lightDir: {value: new Vector3(0, 2, 0)}
            },
            transparent: true
        });
        const mat = new MeshBasicMaterial({
            color: 'lightblue',
            side: DoubleSide,
            map: new TextureLoader().load('/noisetexture.jpg')
        })
        this.shaderMaterials.push(shaderMat);
        const mesh = new Mesh(geo, shaderMat);
        mesh.scale.set(scale, scale, scale);
        mesh.position.set(0, 0.5, 0);
        this.scene.add(mesh);
    };

    private drawModel(): void {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('/car.glb', (box) => {
            const { scene } = box as GLTF;
            this.scene.add(scene);

            scene.position.set(0, -1, 0);

            const outlinePass = new OutlinePass(
                new Vector2(window.innerWidth, window.innerHeight),
                this.scene,
                this.camera,
            );
            const color = new Color(0xffc526);
            outlinePass.selectedObjects = [scene];
            outlinePass.edgeStrength = 2.0;
            outlinePass.edgeGlow = 5.0;
            outlinePass.edgeThickness = 0.1;
            outlinePass.hiddenEdgeColor = color;
            outlinePass.visibleEdgeColor = color;
            this.composer.addPass(outlinePass);

            const measureBox = new Box3().setFromObject(scene);
            const size = new Vector3();
            measureBox.getSize(size);

            const scale = 0.3;
            scene.scale.set(scale, scale, scale);

            const shaderMat = new ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: {
                    uTime: { value: 0.0 },
                    uResolution: {
                        value: new Vector2(size.x, size.y),
                    },
                    uGlowColor: { value: color },
                },
                blending: AdditiveBlending,
                side: FrontSide,
                transparent: true,
            });

            scene.traverse((mesh) => {
                if ((mesh as Mesh).isMesh) {
                    const gltfMesh = mesh as Mesh;
                    gltfMesh.material = shaderMat;
                    this.shaderMaterials.push(shaderMat);
                }
            });
        });
    }

    private animate(): void {
        requestAnimationFrame(this.animate);
        this.update();
        this.renderer.render(this.scene, this.camera);
        this.composer.render();
    }

    private update(): void {
        this.shaderMaterials.forEach(
            (shader) => shader.uniforms.uTime && (shader.uniforms.uTime.value += 0.01),
        );
        this.orbitControls.update();
    }

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.composer.setSize(window.innerWidth, window.innerHeight);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
