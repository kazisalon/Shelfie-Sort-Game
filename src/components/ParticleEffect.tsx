import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ParticleEffectProps {
    visible: boolean;
    onComplete: () => void;
}

/**
 * Particle explosion effect for matches
 */
const ParticleEffect: React.FC<ParticleEffectProps> = ({ visible, onComplete }) => {
    const particles = Array.from({ length: 8 }, () => ({
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        opacity: new Animated.Value(1),
    }));

    useEffect(() => {
        if (visible) {
            // Animate particles exploding outward
            const animations = particles.map((particle, index) => {
                const angle = (index / particles.length) * Math.PI * 2;
                const distance = 50;

                return Animated.parallel([
                    Animated.timing(particle.x, {
                        toValue: Math.cos(angle) * distance,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(particle.y, {
                        toValue: Math.sin(angle) * distance,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(particle.opacity, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]);
            });

            Animated.parallel(animations).start(() => {
                onComplete();
            });
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <View style={styles.container}>
            {particles.map((particle, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.particle,
                        {
                            transform: [
                                { translateX: particle.x },
                                { translateY: particle.y },
                            ],
                            opacity: particle.opacity,
                        },
                    ]}
                >
                    <Text style={styles.emoji}>✨</Text>
                </Animated.View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        zIndex: 9999,
    },
    particle: {
        position: 'absolute',
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: {
        fontSize: 20,
    },
});

export default ParticleEffect;
