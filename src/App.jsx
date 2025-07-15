import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  Shield, 
  Clock, 
  DollarSign,
  CheckCircle,
  Star,
  ArrowRight,
  Wrench,
  Zap,
  Award,
  Target,
  TrendingDown,
  Users,
  Factory,
  ArrowDown,
  X,
  Loader2
} from 'lucide-react'
import { supabase } from './lib/supabase'
import { validateEmail, validatePhone, formatPhone } from './utils/validation'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    productType: '',
    quantity: '',
    message: ''
  })
  
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', or null
  const [showFloatingBar, setShowFloatingBar] = useState(false)
  const [showPriceChallenge, setShowPriceChallenge] = useState(false)
  
  const nameInputRef = useRef(null)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingBar(window.scrollY > 800)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-focus on first input when form section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && nameInputRef.current) {
            setTimeout(() => {
              nameInputRef.current.focus()
            }, 500)
          }
        })
      },
      { threshold: 0.5 }
    )

    const quoteSection = document.getElementById('quote')
    if (quoteSection) {
      observer.observe(quoteSection)
    }

    return () => observer.disconnect()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Format phone number as user types
    if (name === 'phone') {
      const formatted = formatPhone(value)
      setFormData({
        ...formData,
        [name]: formatted
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.company.trim()) {
      errors.company = 'Company is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number'
    }

    if (!formData.productType) {
      errors.productType = 'Please select a product type'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Check if Supabase is configured
      if (!supabase) {
        throw new Error('Database connection not configured. Please contact support.')
      }

      const { data, error } = await supabase
        .from('quote_requests')
        .insert([
          {
            name: formData.name.trim(),
            company: formData.company.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            product_type: formData.productType,
            quantity: formData.quantity || null,
            message: formData.message.trim() || null,
            created_at: new Date().toISOString()
          }
        ])

      if (error) {
        throw error
      }

      setSubmitStatus('success')
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        productType: '',
        quantity: '',
        message: ''
      })

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)

    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
      
      // Hide error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="App">
      {/* Floating Contact Bar */}
      <AnimatePresence>
        {showFloatingBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="floating-contact-bar"
          >
            <div className="container" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '16px 20px'
            }}>
              <span style={{ fontWeight: '600', color: '#ffffff' }}>
                Ready for direct manufacturer pricing?
              </span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href="#quote" className="btn btn-primary btn-sm">
                  Get Quote
                </a>
                <a href="tel:+1-267-212-1034" className="btn btn-call btn-sm">
                  <Phone size={16} />
                  Call Now
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Price Challenge Modal */}
      <AnimatePresence>
        {showPriceChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowPriceChallenge(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff' }}>
                  Challenge Our <span className="gradient-text">Pricing</span>
                </h3>
                <button 
                  onClick={() => setShowPriceChallenge(false)}
                  style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer' }}
                >
                  <X size={24} />
                </button>
              </div>
              <p style={{ color: '#cccccc', marginBottom: '24px', lineHeight: '1.6' }}>
                Send us your current supplier's quote and we'll beat it. Guaranteed. 
                As direct manufacturer representatives, we eliminate 5-7 layers of markup.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="#quote" className="btn btn-primary" onClick={() => setShowPriceChallenge(false)}>
                  Get My Quote
                </a>
                <a href="tel:+1-267-212-1034" className="btn btn-secondary">
                  <Phone size={18} />
                  Call Direct
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="header"
      >
        <div className="container" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '20px' 
        }}>
          <motion.div 
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="logo-icon"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Zap size={24} color="#ffffff" />
            </motion.div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff' }}>
              HOUSTON<span className="gradient-text">BULK</span>OIL
            </h1>
          </motion.div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <motion.a 
              href="tel:+1-267-212-1034" 
              className="btn btn-call"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={18} />
              (267) 212-1034
            </motion.a>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div style={{ y: y1 }} className="hero-bg"></motion.div>
        <div className="container section" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div 
            className="grid grid-2" 
            style={{ alignItems: 'center', gap: '60px' }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div>
              <motion.h2 
                variants={itemVariants}
                style={{ 
                  fontSize: '3.5rem', 
                  fontWeight: '800', 
                  lineHeight: '1.1', 
                  marginBottom: '24px',
                  color: '#ffffff'
                }}
              >
                Direct from <span className="gradient-text">Manufacturer</span> to Your Operation
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                style={{ 
                  fontSize: '1.25rem', 
                  color: '#cccccc', 
                  marginBottom: '40px',
                  lineHeight: '1.6'
                }}
              >
                Skip the middlemen. Premium hydraulic oils, engine lubricants, and industrial greases 
                delivered across Greater Houston in 48 hours. Zero broker markup.
              </motion.p>
              <motion.div 
                variants={itemVariants}
                style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}
              >
                <motion.a 
                  href="#quote" 
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(255, 107, 53, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Challenge Our Price
                  <ArrowRight size={18} />
                </motion.a>
                <motion.button
                  onClick={() => setShowPriceChallenge(true)}
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Target size={18} />
                  Beat My Quote
                </motion.button>
              </motion.div>
              
              {/* Houston Delivery Zone */}
              <motion.div 
                variants={itemVariants}
                className="delivery-zone"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ color: '#22c55e' }}
                  >
                    <MapPin size={24} />
                  </motion.div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#ffffff' }}>
                    48-Hour Delivery Across Greater Houston
                  </h3>
                </div>
                <div className="houston-coverage">
                  <div className="coverage-item">Houston Metro</div>
                  <div className="coverage-item">Katy</div>
                  <div className="coverage-item">Sugar Land</div>
                  <div className="coverage-item">The Woodlands</div>
                  <div className="coverage-item">Pasadena</div>
                  <div className="coverage-item">Baytown</div>
                </div>
              </motion.div>
            </div>
            <motion.div 
              variants={itemVariants}
              style={{ position: 'relative' }}
            >
              <motion.img 
                src="https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                alt="Industrial machinery and equipment"
                style={{ 
                  width: '100%', 
                  borderRadius: '16px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="floating-badge"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Factory size={20} />
                Direct Manufacturer
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Supply Chain Animation */}
      <section className="section section-dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <h3 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '16px',
              color: '#ffffff'
            }}>
              Why Pay <span className="gradient-text">Broker Markup</span>?
            </h3>
            <p style={{ fontSize: '1.125rem', color: '#888888', maxWidth: '600px', margin: '0 auto' }}>
              Most suppliers add 5-7 layers of markup. We connect you directly to the source.
            </p>
          </motion.div>
          
          <div className="supply-chain-comparison">
            <div className="supply-chain-column">
              <h4 style={{ color: '#ef4444', marginBottom: '24px', textAlign: 'center' }}>
                Traditional Supply Chain
              </h4>
              <div className="supply-chain-flow">
                {[
                  { icon: <Factory size={20} />, label: 'Manufacturer', markup: '+0%' },
                  { icon: <Users size={20} />, label: 'National Distributor', markup: '+15%' },
                  { icon: <Truck size={20} />, label: 'Regional Distributor', markup: '+12%' },
                  { icon: <Users size={20} />, label: 'Local Rep', markup: '+18%' },
                  { icon: <Users size={20} />, label: 'Sales Agent', markup: '+10%' },
                  { icon: <Target size={20} />, label: 'Your Price', markup: '+55% Total' }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="supply-step traditional"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="step-icon">{step.icon}</div>
                    <div className="step-content">
                      <div className="step-label">{step.label}</div>
                      <div className="step-markup">{step.markup}</div>
                    </div>
                    {index < 5 && <ArrowDown size={16} className="step-arrow" />}
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="supply-chain-column">
              <h4 style={{ color: '#22c55e', marginBottom: '24px', textAlign: 'center' }}>
                Houston Bulk Oil Direct
              </h4>
              <div className="supply-chain-flow">
                <motion.div
                  className="supply-step direct"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="step-icon"><Factory size={20} /></div>
                  <div className="step-content">
                    <div className="step-label">Manufacturer</div>
                    <div className="step-markup">+0%</div>
                  </div>
                  <ArrowDown size={16} className="step-arrow" />
                </motion.div>
                <motion.div
                  className="supply-step direct"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="step-icon"><Target size={20} /></div>
                  <div className="step-content">
                    <div className="step-label">Your Price</div>
                    <div className="step-markup savings">Save 40-55%</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price Challenge CTA */}
      <section className="section section-darker">
        <div className="container">
          <motion.div
            className="price-challenge-cta"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="challenge-content">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ marginBottom: '20px' }}
              >
                <TrendingDown size={48} className="gradient-text" />
              </motion.div>
              <h3 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '800', 
                marginBottom: '16px',
                color: '#ffffff'
              }}>
                We <span className="gradient-text">Guarantee</span> to Beat Your Current Pricing
              </h3>
              <p style={{ 
                fontSize: '1.25rem', 
                color: '#cccccc', 
                marginBottom: '32px',
                maxWidth: '600px',
                margin: '0 auto 32px'
              }}>
                Send us your current supplier's quote. If we can't beat it by at least 10%, 
                we'll pay you $500 for your time.
              </p>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.button
                  onClick={() => setShowPriceChallenge(true)}
                  className="btn btn-primary btn-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Target size={20} />
                  Challenge Our Price
                </motion.button>
                <motion.a 
                  href="tel:+1-267-212-1034" 
                  className="btn btn-call btn-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone size={20} />
                  Call for Instant Quote
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="section section-dark">
        <div className="container">
          <motion.div 
            style={{ textAlign: 'center', marginBottom: '60px' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '16px',
              color: '#ffffff'
            }}>
              Industrial-Grade <span className="gradient-text">Product Lines</span>
            </h3>
            <p style={{ fontSize: '1.125rem', color: '#888888', maxWidth: '600px', margin: '0 auto' }}>
              Premium lubricants engineered for maximum performance and equipment protection
            </p>
          </motion.div>
          <motion.div 
            className="grid grid-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: 'Hydraulic Oils',
                description: 'High-performance hydraulic fluids for construction and industrial equipment',
                image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
                icon: <Wrench size={32} />
              },
              {
                title: 'Engine Oils',
                description: 'Premium motor oils for commercial fleets and heavy-duty vehicles',
                image: 'https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
                icon: <Zap size={32} />
              },
              {
                title: 'Industrial Greases',
                description: 'High-temperature greases for bearings and heavy machinery',
                image: 'https://images.pexels.com/photos/162568/oil-rig-sea-oil-production-162568.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
                icon: <Shield size={32} />
              },
              {
                title: 'DEF & AdBlue',
                description: 'Diesel exhaust fluid for emissions compliance and performance',
                image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
                icon: <Award size={32} />
              }
            ].map((product, index) => (
              <motion.div 
                key={index} 
                className="card product-card"
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 20px 60px rgba(255, 107, 53, 0.2)'
                }}
              >
                <motion.img 
                  src={product.image}
                  alt={product.title}
                  style={{ 
                    width: '100%', 
                    height: '160px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div 
                  style={{ color: '#ff6b35', marginBottom: '16px' }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {product.icon}
                </motion.div>
                <h4 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '12px',
                  color: '#ffffff'
                }}>
                  {product.title}
                </h4>
                <p style={{ color: '#888888', fontSize: '0.95rem' }}>
                  {product.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quote Form */}
      <section id="quote" className="section section-dark">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'start', gap: '60px' }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                marginBottom: '24px',
                color: '#ffffff'
              }}>
                Get Your <span className="gradient-text">Direct Quote</span>
              </h3>
              <p style={{ 
                fontSize: '1.125rem', 
                color: '#888888', 
                marginBottom: '32px' 
              }}>
                Skip the middlemen. Get manufacturer-direct pricing within 2 hours. 
                Our procurement specialists will optimize your fluid program.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  'Direct manufacturer pricing - no broker markup',
                  '48-hour delivery across Greater Houston',
                  'Free technical consultation and fluid analysis',
                  'Volume pricing automatically applied'
                ].map((benefit, index) => (
                  <motion.div 
                    key={index}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      <CheckCircle size={20} style={{ color: '#22c55e' }} />
                    </motion.div>
                    <span>{benefit}</span>
                  </motion.div>
                ))}
              </div>
              <motion.div 
                className="urgent-contact"
                whileHover={{ scale: 1.02 }}
              >
                <h4 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '16px',
                  color: '#ffffff'
                }}>
                  Need immediate assistance?
                </h4>
                <motion.a 
                  href="tel:+1-267-212-1034" 
                  className="btn btn-call" 
                  style={{ width: '100%' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone size={18} />
                  Call (267) 212-1034
                </motion.a>
              </motion.div>
            </motion.div>
            <motion.div 
              className="card"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Success/Error Messages */}
              <AnimatePresence>
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="form-message success"
                    style={{ marginBottom: '24px' }}
                  >
                    <CheckCircle size={20} />
                    <span>Thanks! We'll contact you within 24 hours with your direct manufacturer quote.</span>
                  </motion.div>
                )}
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="form-message error"
                    style={{ marginBottom: '24px' }}
                  >
                    <X size={20} />
                    <span>Something went wrong. Please try again or call us directly at (267) 212-1034.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      name="name"
                      className={`form-input ${formErrors.name ? 'error' : ''}`}
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="John Smith"
                      disabled={isSubmitting}
                    />
                    {formErrors.name && <span className="form-error">{formErrors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company *</label>
                    <input
                      type="text"
                      name="company"
                      className={`form-input ${formErrors.company ? 'error' : ''}`}
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      placeholder="ABC Construction"
                      disabled={isSubmitting}
                    />
                    {formErrors.company && <span className="form-error">{formErrors.company}</span>}
                  </div>
                </div>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      className={`form-input ${formErrors.email ? 'error' : ''}`}
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@company.com"
                      disabled={isSubmitting}
                    />
                    {formErrors.email && <span className="form-error">{formErrors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      className={`form-input ${formErrors.phone ? 'error' : ''}`}
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="(267) 212-1034"
                      disabled={isSubmitting}
                    />
                    {formErrors.phone && <span className="form-error">{formErrors.phone}</span>}
                  </div>
                </div>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Product Type *</label>
                    <select
                      name="productType"
                      className={`form-select ${formErrors.productType ? 'error' : ''}`}
                      value={formData.productType}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select Product</option>
                      <option value="hydraulic-oil">Hydraulic Oil</option>
                      <option value="engine-oil">Engine Oil</option>
                      <option value="industrial-grease">Industrial Grease</option>
                      <option value="def-adblue">DEF / AdBlue</option>
                      <option value="other">Other</option>
                    </select>
                    {formErrors.productType && <span className="form-error">{formErrors.productType}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Estimated Quantity</label>
                    <select
                      name="quantity"
                      className="form-select"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Select Quantity</option>
                      <option value="55-gal-drums">55-Gallon Drums</option>
                      <option value="275-gal-totes">275-Gallon Totes</option>
                      <option value="bulk-delivery">Bulk Delivery</option>
                      <option value="custom">Custom Amount</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Current Supplier Quote (Optional)</label>
                  <textarea
                    name="message"
                    className="form-textarea"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Share your current pricing or supplier quote for us to beat..."
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                <motion.button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="spinner" />
                      Submitting Quote Request...
                    </>
                  ) : (
                    <>
                      Get Direct Manufacturer Quote
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-darker">
        <div className="container">
          <motion.div 
            style={{ textAlign: 'center', marginBottom: '60px' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '16px',
              color: '#ffffff'
            }}>
              Trusted by <span className="gradient-text">Houston Industry Leaders</span>
            </h3>
          </motion.div>
          <motion.div 
            className="grid grid-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                name: 'Mike Rodriguez',
                title: 'Fleet Manager, Southwest Logistics',
                content: 'Switched to Houston Bulk Oil and immediately saved 35% on hydraulic oils. Their Houston delivery is lightning fast and the quality is exceptional.',
                rating: 5,
                savings: '35% Cost Savings'
              },
              {
                name: 'Sarah Chen',
                title: 'Operations Director, MegaBuild Construction',
                content: 'Direct manufacturer pricing changed our bottom line. No more broker markup means we can bid more competitively on projects.',
                rating: 5,
                savings: '42% Cost Savings'
              },
              {
                name: 'David Thompson',
                title: 'Maintenance Supervisor, Industrial Solutions Inc.',
                content: 'The technical support is outstanding. They analyzed our equipment and recommended the perfect fluid program. Delivery is always on time.',
                rating: 5,
                savings: '28% Cost Savings'
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index} 
                className="card testimonial-card"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div style={{ 
                  display: 'flex', 
                  gap: '4px', 
                  marginBottom: '16px' 
                }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star size={16} style={{ color: '#ff6b35', fill: '#ff6b35' }} />
                    </motion.div>
                  ))}
                </div>
                <div className="savings-badge">
                  {testimonial.savings}
                </div>
                <p style={{ 
                  color: '#cccccc', 
                  marginBottom: '20px',
                  fontStyle: 'italic',
                  lineHeight: '1.6'
                }}>
                  "{testimonial.content}"
                </p>
                <div>
                  <div style={{ 
                    fontWeight: '600', 
                    color: '#ffffff',
                    marginBottom: '4px'
                  }}>
                    {testimonial.name}
                  </div>
                  <div style={{ color: '#888888', fontSize: '0.9rem' }}>
                    {testimonial.title}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="grid grid-4" style={{ marginBottom: '40px' }}>
            <div>
              <motion.div 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="logo-icon">
                  <Zap size={24} color="#ffffff" />
                </div>
                <h4 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>
                  HOUSTON<span className="gradient-text">BULK</span>OIL
                </h4>
              </motion.div>
              <p style={{ color: '#888888', marginBottom: '20px' }}>
                Direct manufacturer pricing for premium bulk oils and lubricants. 
                Serving Greater Houston with 48-hour delivery.
              </p>
            </div>
            <div>
              <h5 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: '#ffffff'
              }}>
                Products
              </h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><a href="#" className="footer-link">Hydraulic Oils</a></li>
                <li><a href="#" className="footer-link">Engine Oils</a></li>
                <li><a href="#" className="footer-link">Industrial Greases</a></li>
                <li><a href="#" className="footer-link">DEF & AdBlue</a></li>
              </ul>
            </div>
            <div>
              <h5 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: '#ffffff'
              }}>
                Company
              </h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><a href="#" className="footer-link">About Us</a></li>
                <li><a href="#" className="footer-link">Quality Certifications</a></li>
                <li><a href="#" className="footer-link">Technical Support</a></li>
                <li><a href="#" className="footer-link">Price Challenge</a></li>
              </ul>
            </div>
            <div>
              <h5 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: '#ffffff'
              }}>
                Contact Houston Direct
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <motion.div 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  whileHover={{ x: 5 }}
                >
                  <Phone size={16} style={{ color: '#ff6b35' }} />
                  <a href="tel:+1-267-212-1034" className="footer-link">
                    (267) 212-1034
                  </a>
                </motion.div>
                <motion.div 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  whileHover={{ x: 5 }}
                >
                  <Mail size={16} style={{ color: '#ff6b35' }} />
                  <a href="mailto:quotes@houstonbulkoil.com" className="footer-link">
                    quotes@houstonbulkoil.com
                  </a>
                </motion.div>
                <motion.div 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  whileHover={{ x: 5 }}
                >
                  <MapPin size={16} style={{ color: '#ff6b35' }} />
                  <span style={{ color: '#888888' }}>Houston Distribution Center</span>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p style={{ color: '#888888' }}>
              © 2024 Houston Bulk Oil. All rights reserved. | Direct Manufacturer Representative
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
