import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Linking,
} from 'react-native';
import { useUserStore } from '../store/gameStore';

const SUPPORT_EMAIL = 'support@shelfiesort.com';
const PRIVACY_POLICY_URL = 'https://shelfiesort.com/privacy';
const TERMS_URL = 'https://shelfiesort.com/terms';
const APP_VERSION = '1.0.0';

interface SettingsScreenProps {
    onClose: () => void;
    playerName: string;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose, playerName }) => {
    const { progress } = useUserStore();

    const openPrivacyPolicy = () => {
        Linking.openURL(PRIVACY_POLICY_URL);
    };

    const openTerms = () => {
        Linking.openURL(TERMS_URL);
    };

    const sendFeedback = () => {
        Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Shelfie Sort Feedback`);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <Text style={styles.headerSubtitle}>Customize your experience</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Player Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Player Info</Text>
                    <View style={styles.card}>
                        <Text style={styles.cardLabel}>Name</Text>
                        <Text style={styles.cardValue}>{playerName}</Text>
                    </View>
                </View>

                {/* Quick Stats */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Stats</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{progress.currentLevel}</Text>
                            <Text style={styles.statLabel}>Current Level</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{progress.totalMatches}</Text>
                            <Text style={styles.statLabel}>Total Matches</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{progress.coins}</Text>
                            <Text style={styles.statLabel}>Coins</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>

                    <View style={styles.card}>
                        <Text style={styles.appTitle}>🎮 SHELFIE SORT</Text>
                        <Text style={styles.version}>Version {APP_VERSION}</Text>
                        <Text style={styles.aboutText}>
                            A fun and addictive match-3 puzzle game where you organize items on shelves.
                            Match 3 identical items to clear them and progress through challenging levels!
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>🎨 Game Features</Text>
                        <Text style={styles.featureText}>• Dynamic themes every 5 levels</Text>
                        <Text style={styles.featureText}>• Progressive difficulty</Text>
                        <Text style={styles.featureText}>• Satisfying audio & haptics</Text>
                        <Text style={styles.featureText}>• Infinite levels to master</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>👨‍💻 Developer</Text>
                        <Text style={styles.developerText}>
                            Created with ❤️ by Shelfie Sort Studios
                        </Text>
                        <Text style={styles.developerText}>
                            Professional mobile game development
                        </Text>
                    </View>
                </View>

                {/* Legal Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Legal</Text>

                    <TouchableOpacity style={styles.linkCard} onPress={openPrivacyPolicy}>
                        <Text style={styles.linkText}>📄 Privacy Policy</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkCard} onPress={openTerms}>
                        <Text style={styles.linkText}>📋 Terms of Service</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* Support Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>

                    <TouchableOpacity style={styles.linkCard} onPress={sendFeedback}>
                        <Text style={styles.linkText}>✉️ Send Feedback</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>📧 Contact Us</Text>
                        <Text style={styles.contactText}>{SUPPORT_EMAIL}</Text>
                    </View>
                </View>

                {/* Copyright */}
                <View style={styles.footer}>
                    <Text style={styles.copyright}>
                        © 2025 Shelfie Sort. All rights reserved.
                    </Text>
                    <Text style={styles.copyright}>
                        Made with passion for puzzle lovers 🎯
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1,
        backgroundColor: '#1A1A2E',
        zIndex: 1000,
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#16213E',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        zIndex: 10,
    },
    closeText: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
        marginTop: 4,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 15,
        letterSpacing: 1,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 20,
        borderRadius: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    cardLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 5,
    },
    cardValue: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    appTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    version: {
        fontSize: 14,
        color: '#FFD700',
        textAlign: 'center',
        marginBottom: 15,
    },
    aboutText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 22,
        textAlign: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    featureText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 6,
        lineHeight: 20,
    },
    developerText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 6,
        textAlign: 'center',
    },
    linkCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 18,
        borderRadius: 15,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    linkText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    arrow: {
        fontSize: 24,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    contactText: {
        fontSize: 14,
        color: '#FFD700',
        textAlign: 'center',
    },
    footer: {
        paddingVertical: 30,
        alignItems: 'center',
    },
    copyright: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
        marginBottom: 5,
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    statItem: {
        flex: 1,
        paddingVertical: 18,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
});

export default SettingsScreen;
