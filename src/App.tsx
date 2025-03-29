import { useRef } from 'react';
import ThreeScene from './Three/Scene';

function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const createThreeScene = (ref: HTMLCanvasElement) => {
        if (!canvasRef.current) {
            new ThreeScene(ref);
            canvasRef.current = ref;
        }
    };

    return (
        <canvas
            ref={(ref) => createThreeScene(ref as HTMLCanvasElement)}
        ></canvas>
    );
}

export default App;
