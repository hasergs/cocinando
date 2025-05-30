import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Linking, ScrollView, Platform, Animated } from 'react-native';
import { useRouter } from 'expo-router';

export default function LandingPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();
  
  // Referencias para scroll a secciones
  const scrollViewRef = useRef<ScrollView>(null);
  const featuresRef = useRef<View>(null);
  const howItWorksRef = useRef<View>(null);
  const pricingRef = useRef<View>(null);
  const contactRef = useRef<View>(null);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const priceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Countdown logic
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3); // Solo 3 días para crear urgencia

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Inicializar animaciones
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(priceAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de pulso para elementos destacados
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();

    // Animación de glow/resplandor
    const glow = () => {
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]).start(() => glow());
    };
    glow();

    // Animación de shake/vibración para urgencia
    const shake = () => {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 3,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -3,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.delay(8000), // Pausa de 8 segundos
      ]).start(() => shake());
    };
    
    // Iniciar shake después de 3 segundos
    setTimeout(shake, 3000);
  }, []);

  // Funciones de navegación del header
  const scrollToSection = (ref: React.RefObject<View>) => {
    if (ref.current && scrollViewRef.current) {
      ref.current.measureLayout(
        scrollViewRef.current.getScrollableNode?.() || scrollViewRef.current,
        (x: number, y: number) => {
          scrollViewRef.current?.scrollTo({ y: y - 70, animated: true });
        },
        () => {}
      );
    }
  };

  const handleGetStarted = () => {
    router.push('/login');
  };

  const handleLearnMore = () => {
    scrollToSection(featuresRef);
  };

  const handleSubmit = () => {
    if (email) {
      setSubmitted(true);
      // Aquí irá la lógica para guardar el email
    }
  };

  const handleAccessApp = () => {
    router.push('/login');
  };

  const handleSelectPlan = (planType: string) => {
    console.log(`Plan seleccionado: ${planType}`);
    router.push('/login');
  };

  const handleDownloadAndroid = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=chefsnap.app');
  };

  // Manejar scroll
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);
  };

  return (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.container} 
      contentContainerStyle={{ flexGrow: 1 }}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section Minimalista */}
      <Animated.View style={[
        styles.heroSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}>
        {/* Imagen de fondo */}
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1556909114-4e3d7f6d72b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' }} 
          style={styles.heroBackground} 
          resizeMode="cover" 
        />
        <View style={styles.heroOverlay} />
        
        <View style={styles.heroContent}>
          {/* Badge de Oferta con efectos */}
          <Animated.View style={[
            styles.offerBadge,
            { 
              transform: [
                { scale: pulseAnim },
                { translateX: shakeAnim }
              ] 
            }
          ]}>
            <Text style={styles.offerBadgeText}>🔥 OFERTA ESPECIAL - Solo {timeLeft.days} días restantes</Text>
          </Animated.View>

          {/* Título Principal */}
          <Text style={styles.heroTitle}>
            Identifica cualquier plato{'\n'}
            <Text style={styles.heroTitleAccent}>con una foto</Text>
          </Text>

          {/* Subtítulo */}
          <Text style={styles.heroSubtitle}>
            Descubre recetas, ingredientes y tutoriales de YouTube{'\n'}
            usando inteligencia artificial avanzada
          </Text>

          {/* Contenedor de Precio con Marco Destacado */}
          <Animated.View style={[
            styles.priceHighlightContainer,
            {
              opacity: priceAnim,
              shadowOpacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.8],
              }),
              shadowRadius: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [15, 30],
              }),
              borderColor: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.8)'],
              }),
            }
          ]}>
            {/* Decoraciones de esquinas */}
            <View style={styles.cornerDecorations}>
              <View style={[styles.cornerDecoration, styles.topLeft]} />
              <View style={[styles.cornerDecoration, styles.topRight]} />
              <View style={[styles.cornerDecoration, styles.bottomLeft]} />
              <View style={[styles.cornerDecoration, styles.bottomRight]} />
            </View>

            {/* Precio Destacado */}
            <View style={styles.priceSection}>
              <View style={styles.priceContainer}>
                <View style={styles.originalPriceContainer}>
                  <Text style={styles.originalPriceLabel}>Precio normal:</Text>
                  <Text style={styles.originalPrice}>18€/mes</Text>
                </View>
                <Animated.View style={[
                  styles.specialPriceContainer,
                  { transform: [{ scale: pulseAnim }] }
                ]}>
                  <Text style={styles.specialPriceLabel}>Oferta de lanzamiento:</Text>
                  <Text style={styles.specialPrice}>1€</Text>
                  <Text style={styles.specialPeriod}>/mes</Text>
                </Animated.View>
                <Animated.View style={[
                  styles.savingsTextContainer,
                  { transform: [{ scale: pulseAnim }] }
                ]}>
                  <Text style={styles.savingsText}>⚡ Ahorra 94% durante el primer mes ⚡</Text>
                </Animated.View>
              </View>
            </View>

            {/* Countdown Compacto con efectos */}
            <View style={styles.countdownCompact}>
              <Animated.View style={[
                styles.countdownTitleContainer,
                { transform: [{ translateX: shakeAnim }] }
              ]}>
                <Text style={styles.countdownTitle}>⏰ Termina en:</Text>
              </Animated.View>
              <View style={styles.countdownBoxes}>
                <Animated.View style={[
                  styles.countdownBoxHighlight,
                  { transform: [{ scale: pulseAnim }] }
                ]}>
                  <Text style={styles.countdownNumber}>{timeLeft.days}</Text>
                  <Text style={styles.countdownLabel}>días</Text>
                </Animated.View>
                <Text style={styles.countdownSeparator}>:</Text>
                <Animated.View style={[
                  styles.countdownBoxHighlight,
                  { transform: [{ scale: pulseAnim }] }
                ]}>
                  <Text style={styles.countdownNumber}>{timeLeft.hours}</Text>
                  <Text style={styles.countdownLabel}>hrs</Text>
                </Animated.View>
                <Text style={styles.countdownSeparator}>:</Text>
                <Animated.View style={[
                  styles.countdownBoxHighlight,
                  { transform: [{ scale: pulseAnim }] }
                ]}>
                  <Text style={styles.countdownNumber}>{timeLeft.minutes}</Text>
                  <Text style={styles.countdownLabel}>min</Text>
                </Animated.View>
              </View>
            </View>
          </Animated.View>

          {/* CTA Buttons con efectos mejorados */}
          <View style={styles.heroButtons}>
            <Animated.View style={[
              { transform: [{ scale: pulseAnim }] }
            ]}>
              <TouchableOpacity 
                style={styles.primaryButton} 
                onPress={handleGetStarted}
                activeOpacity={0.9}
              >
                <Text style={styles.primaryButtonText}>🚀 Comenzar por 1€</Text>
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={handleLearnMore}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Conocer más</Text>
            </TouchableOpacity>
          </View>

          {/* Garantía */}
          <Text style={styles.guarantee}>✓ Garantía de devolución de 30 días</Text>
        </View>
      </Animated.View>

      {/* Social Proof Minimalista */}
      <View style={styles.socialProof}>
        <Text style={styles.socialProofText}>
          Únete a más de <Text style={styles.socialProofNumber}>10,000</Text> usuarios que ya cocinan mejor
        </Text>
        <View style={styles.starsContainer}>
          <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
          <Text style={styles.rating}>4.8/5 en las tiendas de apps</Text>
        </View>
      </View>

      {/* Features Section Minimalista */}
      <View ref={featuresRef} style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>¿Cómo funciona?</Text>
        
        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>📸</Text>
            </View>
            <Text style={styles.featureTitle}>Toma una foto</Text>
            <Text style={styles.featureDesc}>Captura cualquier plato que te guste</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>🤖</Text>
            </View>
            <Text style={styles.featureTitle}>IA lo analiza</Text>
            <Text style={styles.featureDesc}>Identifica ingredientes y técnicas</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>👨‍🍳</Text>
            </View>
            <Text style={styles.featureTitle}>Aprende a cocinar</Text>
            <Text style={styles.featureDesc}>Recetas y videos paso a paso</Text>
          </View>
        </View>
      </View>

      {/* Pricing Section Simplificado */}
      <View ref={pricingRef} style={styles.pricingSection}>
        <Text style={styles.sectionTitle}>Comienza tu prueba por solo 1€</Text>
        
        <View style={styles.pricingCard}>
          <View style={styles.pricingHeader}>
            <Text style={styles.pricingBadge}>OFERTA ESPECIAL</Text>
            <Text style={styles.pricingTitle}>Acceso Completo</Text>
            
            <View style={styles.pricingPriceContainer}>
              <Text style={styles.pricingOriginalPrice}>18€</Text>
              <Text style={styles.pricingSpecialPrice}>1€</Text>
              <Text style={styles.pricingPeriod}>/mes</Text>
            </View>
            
            <Text style={styles.pricingNote}>Primer mes, luego precio normal</Text>
          </View>

          <View style={styles.pricingFeatures}>
            <View style={styles.pricingFeature}>
              <Text style={styles.checkIcon}>✓</Text>
              <Text style={styles.featureText}>Reconocimiento IA ilimitado</Text>
            </View>
            <View style={styles.pricingFeature}>
              <Text style={styles.checkIcon}>✓</Text>
              <Text style={styles.featureText}>Tutoriales de YouTube premium</Text>
            </View>
            <View style={styles.pricingFeature}>
              <Text style={styles.checkIcon}>✓</Text>
              <Text style={styles.featureText}>Recetas personalizadas</Text>
            </View>
            <View style={styles.pricingFeature}>
              <Text style={styles.checkIcon}>✓</Text>
              <Text style={styles.featureText}>Análisis nutricional</Text>
            </View>
            <View style={styles.pricingFeature}>
              <Text style={styles.checkIcon}>✓</Text>
              <Text style={styles.featureText}>Cancela cuando quieras</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.pricingButton} 
            onPress={handleGetStarted}
            activeOpacity={0.9}
          >
            <Text style={styles.pricingButtonText}>Comenzar por 1€</Text>
          </TouchableOpacity>

          <Text style={styles.pricingDisclaimer}>
            Sin compromiso • Cancela en cualquier momento • Garantía de 30 días
          </Text>
        </View>
      </View>

      {/* Planes Adicionales */}
      <View style={styles.additionalPlansSection}>
        <Text style={styles.additionalPlansTitle}>¿Buscas más ahorro?</Text>
        <Text style={styles.additionalPlansSubtitle}>
          Estos planes te ofrecen mayor valor y características exclusivas
        </Text>
        
        <View style={styles.additionalPlansGrid}>
          
          {/* Plan 3 Meses */}
          <View style={[styles.additionalPlanCard, styles.quarterlyPlanCard]}>
            <View style={styles.planBadgeContainer}>
              <Text style={[styles.planBadge, styles.popularBadge]}>🔥 MÁS POPULAR</Text>
            </View>
            
            <Text style={styles.planName}>Plan 3 Meses</Text>
            
            <View style={styles.planPriceSection}>
              <View style={styles.planPriceContainer}>
                <Text style={styles.planOriginalPrice}>50€</Text>
                <Text style={styles.planPrice}>30€</Text>
              </View>
              <Text style={styles.planPeriod}>por 3 meses completos</Text>
              <Text style={styles.planSavings}>Ahorra 40% - Oferta limitada</Text>
            </View>

            <View style={styles.planFeaturesContainer}>
              <Text style={styles.planFeaturesTitle}>✨ Todo del plan mensual más:</Text>
              <View style={styles.planFeature}>
                <Text style={styles.planFeatureIcon}>🎯</Text>
                <Text style={styles.planFeatureText}>Recetas premium exclusivas</Text>
              </View>
              <View style={styles.planFeature}>
                <Text style={styles.planFeatureIcon}>📊</Text>
                <Text style={styles.planFeatureText}>Análisis nutricional avanzado</Text>
              </View>
              <View style={styles.planFeature}>
                <Text style={styles.planFeatureIcon}>🏆</Text>
                <Text style={styles.planFeatureText}>Soporte prioritario</Text>
              </View>
              <View style={styles.planFeature}>
                <Text style={styles.planFeatureIcon}>🚫</Text>
                <Text style={styles.planFeatureText}>Sin renovación automática</Text>
              </View>
              <View style={styles.planFeature}>
                <Text style={styles.planFeatureIcon}>📱</Text>
                <Text style={styles.planFeatureText}>Acceso offline limitado</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.planButton, styles.quarterlyButton]} 
              onPress={() => handleSelectPlan('quarterly')}
              activeOpacity={0.9}
            >
              <Text style={styles.planButtonText}>¡Aprovechar Oferta!</Text>
            </TouchableOpacity>
          </View>

          {/* Plan Vitalicio */}
          <View style={[styles.additionalPlanCard, styles.lifetimePlanCard]}>
            <View style={styles.planBadgeContainer}>
              <Text style={[styles.planBadge, styles.lifetimeBadge]}>👑 MEJOR VALOR</Text>
            </View>
            
            <Text style={styles.planName}>Plan Vitalicio</Text>
            
            <View style={styles.planPriceSection}>
              <View style={styles.planPriceContainer}>
                <Text style={styles.planPrice}>200€</Text>
              </View>
              <Text style={styles.planPeriod}>pago único para siempre</Text>
              <Text style={styles.planSavings}>Sin pagos recurrentes nunca más</Text>
            </View>

            <View style={styles.planFeaturesContainer}>
              <Text style={styles.planFeaturesTitle}>👑 Todo de los planes anteriores más:</Text>
              <View style={styles.planFeature}>
                <Text style={styles.planFeatureIcon}>🔮</Text>
                <Text style={styles.planFeatureText}>Acceso a futuras funciones</Text>
              </View>
              <View style={styles.planFeature}>
                <Text style={styles.planFeatureIcon}>🤖</Text>
                <Text style={styles.planFeatureText}>Chef personal IA avanzado</Text>
              </View>
              <View style={styles.planFeature}>
                <Text style={styles.planFeatureIcon}>👨‍💼</Text>
                <Text style={styles.planFeatureText}>Soporte VIP personalizado</Text>
              </View>
              <View style={styles.planFeature}>
                <Text style={styles.planFeatureIcon}>👥</Text>
                <Text style={styles.planFeatureText}>Comunidad exclusiva</Text>
              </View>
              <View style={styles.planFeature}>
                <Text style={styles.planFeatureIcon}>💾</Text>
                <Text style={styles.planFeatureText}>Descarga offline ilimitada</Text>
              </View>
              <View style={styles.planFeature}>
                <Text style={styles.planFeatureIcon}>🎁</Text>
                <Text style={styles.planFeatureText}>Contenido exclusivo mensual</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.planButton, styles.lifetimeButton]} 
              onPress={() => handleSelectPlan('lifetime')}
              activeOpacity={0.9}
            >
              <Text style={styles.planButtonText}>Comprar una vez</Text>
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.plansGuarantee}>
          <Text style={styles.plansGuaranteeText}>
            🔒 Todos los planes incluyen: Pago seguro SSL • Garantía 30 días • Activación instantánea
          </Text>
        </View>
      </View>

      {/* Email Signup Minimalista */}
      <View style={styles.emailSection}>
        <Text style={styles.emailTitle}>¿No estás listo aún?</Text>
        <Text style={styles.emailSubtitle}>
          Recibe un recordatorio cuando la oferta esté a punto de terminar
        </Text>
        
        {!submitted ? (
          <View style={styles.emailForm}>
            <TextInput
              style={styles.emailInput}
              placeholder="Tu email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.emailButton} 
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.emailButtonText}>Recordar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emailSuccess}>
            <Text style={styles.emailSuccessText}>✓ Te avisaremos antes de que termine la oferta</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View ref={contactRef} style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerBrand}>
            <Text style={styles.footerLogo}>ChefSnap</Text>
            <Text style={styles.footerDesc}>Aprende a cocinar cualquier plato desde una foto.</Text>
          </View>
          <View style={styles.footerContact}>
            <Text style={styles.footerContactTitle}>Contacto</Text>
            <Text style={styles.footerContactText}>Email: support@chefsnap.app</Text>
            <Text style={styles.footerContactText}>Teléfono: +34 123 456 789</Text>
            <Text style={styles.footerContactText}>Social: @ChefSnapOfficial</Text>
          </View>
        </View>
        <Text style={styles.footerCopyright}>
          © {new Date().getFullYear()} ChefSnap. Todos los derechos reservados.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroSection: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(244, 162, 89, 0.9)',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 600,
    zIndex: 1,
  },
  offerBadge: {
    backgroundColor: '#F4A259',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  offerBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 50,
  },
  heroTitleAccent: {
    color: '#F4A259',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
  },
  priceSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  priceContainer: {
    alignItems: 'center',
  },
  originalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPriceLabel: {
    fontSize: 14,
    color: '#fff',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 18,
    color: '#fff',
    textDecorationLine: 'line-through',
  },
  specialPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  specialPriceLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginRight: 12,
  },
  specialPrice: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
  },
  specialPeriod: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  savingsTextContainer: {
    marginTop: 8,
  },
  savingsText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    textAlign: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  countdownCompact: {
    alignItems: 'center',
    marginBottom: 32,
  },
  countdownTitleContainer: {
    marginBottom: 12,
  },
  countdownTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  countdownBoxes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownBox: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  countdownNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  countdownLabel: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  countdownSeparator: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(244, 162, 89, 0.3)',
  },
  primaryButtonText: {
    color: '#F4A259',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  guarantee: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  socialProof: {
    backgroundColor: '#FFF9F0',
    paddingVertical: 32,
    alignItems: 'center',
  },
  socialProofText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  socialProofNumber: {
    fontWeight: '700',
    color: '#F4A259',
  },
  starsContainer: {
    alignItems: 'center',
  },
  stars: {
    fontSize: 20,
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#999',
  },
  featuresSection: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 48,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    flexWrap: 'wrap',
  },
  featureCard: {
    alignItems: 'center',
    width: 200,
  },
  featureIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#FFF9F0',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F4A25933',
  },
  featureIcon: {
    fontSize: 32,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  pricingSection: {
    backgroundColor: '#FFF9F0',
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  pricingCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    maxWidth: 400,
    width: '100%',
    shadowColor: '#F4A259',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#F4A259',
  },
  pricingHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  pricingBadge: {
    backgroundColor: '#F4A259',
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  pricingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  pricingPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  pricingOriginalPrice: {
    fontSize: 20,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  pricingSpecialPrice: {
    fontSize: 40,
    fontWeight: '900',
    color: '#F4A259',
  },
  pricingPeriod: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  pricingNote: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  pricingFeatures: {
    marginBottom: 32,
  },
  pricingFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkIcon: {
    fontSize: 16,
    color: '#22c55e',
    fontWeight: '700',
    marginRight: 12,
    width: 20,
  },
  featureText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  pricingButton: {
    backgroundColor: '#F4A259',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#F4A259',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pricingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  pricingDisclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
  emailSection: {
    backgroundColor: '#fff',
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emailTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emailSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emailForm: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    maxWidth: 400,
  },
  emailInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emailButton: {
    backgroundColor: '#F4A259',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  emailSuccess: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#22c55e33',
  },
  emailSuccessText: {
    color: '#22c55e',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 32,
    alignItems: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 900,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  footerBrand: {
    marginBottom: 16,
  },
  footerLogo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F4A259',
    marginBottom: 4,
  },
  footerDesc: {
    color: '#ccc',
    fontSize: 15,
  },
  footerContact: {
    alignItems: 'flex-end',
  },
  footerContactTitle: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
  },
  footerContactText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 2,
  },
  footerCopyright: {
    color: '#999',
    fontSize: 13,
    textAlign: 'center',
  },
  additionalPlansSection: {
    backgroundColor: '#fff',
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  additionalPlansTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  additionalPlansSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
    maxWidth: 500,
  },
  additionalPlansGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    flexWrap: 'wrap',
    marginBottom: 32,
  },
  additionalPlanCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: 320,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  quarterlyPlanCard: {
    borderColor: '#D2691E',
    borderWidth: 3,
    backgroundColor: '#FFF4E6',
    transform: [{ scale: 1.02 }],
  },
  lifetimePlanCard: {
    borderColor: '#CD853F',
    borderWidth: 2,
    backgroundColor: '#FFFAF0',
  },
  planBadgeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  planBadge: {
    backgroundColor: '#F4A259',
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    textAlign: 'center',
  },
  popularBadge: {
    backgroundColor: '#D2691E',
  },
  lifetimeBadge: {
    backgroundColor: '#CD853F',
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 20,
  },
  planPriceSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  planPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  planOriginalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: '900',
    color: '#F4A259',
  },
  planPeriod: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  planSavings: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planFeaturesContainer: {
    marginBottom: 24,
  },
  planFeaturesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  planFeatureIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  planFeatureText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  planButton: {
    backgroundColor: '#F4A259',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#F4A259',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  quarterlyButton: {
    backgroundColor: '#D2691E',
    shadowColor: '#D2691E',
  },
  lifetimeButton: {
    backgroundColor: '#CD853F',
    shadowColor: '#CD853F',
  },
  planButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  plansGuarantee: {
    backgroundColor: '#FFF4E6',
    borderRadius: 12,
    padding: 16,
    maxWidth: 800,
    borderWidth: 1,
    borderColor: '#F4A25933',
  },
  plansGuaranteeText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  priceHighlightContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 24,
    marginVertical: 32,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    position: 'relative',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    ...Platform.select({
      web: {
        boxShadow: '0 0 30px rgba(255,255,255,0.5)',
      },
    }),
  },
  cornerDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cornerDecoration: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#fff',
    borderWidth: 3,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  countdownBoxHighlight: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
