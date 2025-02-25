import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Text } from '@react-three/drei';

const ThreeDChart = ({ data }) => {
    const maxSpent = Math.max(...data.map(item => item.spent));
    
    return (
        <Canvas camera={{ position: [0, 0, 50], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            
            {data.map((item, index) => {
                const angle = (index * Math.PI * 2) / data.length;
                const radius = 20 + (item.spent / maxSpent) * 15;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                
                return (
                    <group key={item.category}>
                        <Sphere 
                            position={[x, 0, z]} 
                            scale={1 + (item.spent / maxSpent) * 2}
                        >
                            <meshStandardMaterial color={COLORS[index % COLORS.length]} />
                        </Sphere>
                        <Text
                            position={[x * 1.2, -3, z * 1.2]}
                            fontSize={1}
                            color="#4c1a36"
                            anchorX="center"
                            anchorY="middle"
                        >
                            {item.category}
                        </Text>
                    </group>
                );
            })}
            
            <OrbitControls enableZoom autoRotate />
        </Canvas>
    );
};

const COLORS = ['#4c1a36', '#dfab81', '#395c6b', '#7a9e7e', '#f4e3b1', '#a85751'];

export default ThreeDChart;