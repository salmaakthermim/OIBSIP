import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const STEPS = ['Base', 'Sauce', 'Cheese', 'Vegetables']
const STEP_ICONS = ['🍞', '🍅', '🧀', '🥦']
const STEP_DESCS = [
  'Choose your pizza crust',
  'Pick your sauce',
  'Select your cheese',
  'Add your toppings (multiple)',
]

export default function PizzaBuilder() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [ingredients, setIngredients] = useState({ base: [], sauce: [], cheese: [], vegetable: [] })
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(0)
  const [selection, setSelection] = useState({ base: null, sauce: null, cheese: null, vegetables: [] })

  useEffect(() => {
    api.get('/ingredients').then(res => {
      const all = res.data
      setIngredients({
        base: all.filter(i => i.category === 'base'),
        sauce: all.filter(i => i.category === 'sauce'),
        cheese: all.filter(i => i.category === 'cheese'),
        vegetable: all.filter(i => i.category === 'vegetable'),
      })
      setLoading(false)
    }).catch(() => { toast.error('Failed to load ingredients'); setLoading(false) })
  }, [])

  const totalPrice = () => {
    let price = 0
    if (selection.base) price += selection.base.price
    if (selection.sauce) price += selection.sauce.price
    if (selection.cheese) price += selection.cheese.price
    selection.vegetables.forEach(v => price += v.price)
    return price
  }

  const handleSingleSelect = (category, item) => {
    if (item.stock < 1) { toast.error(`${item.name} is out of stock!`); return }
    setSelection(prev => ({ ...prev, [category]: item }))
    toast.success(`${item.name} সিলেক্ট করা হয়েছে! ✓`, { id: 'ing-select', duration: 1800 })
  }

  const handleVegetableToggle = (item) => {
    if (item.stock < 1) { toast.error(`${item.name} is out of stock!`); return }
    setSelection(prev => {
      const exists = prev.vegetables.find(v => v._id === item._id)
      const updated = exists
        ? prev.vegetables.filter(v => v._id !== item._id)
        : [...prev.vegetables, item]
      if (exists) {
        toast(`Removed ${item.name}`, { id: 'ing-select', duration: 1200 })
      } else {
        toast.success(`Added ${item.name}! ✓`, { id: 'ing-select', duration: 1500 })
      }
      return {
        ...prev,
        vegetables: updated,
      }
    })
  }

  const canNext = () => {
    if (step === 0) return !!selection.base
    if (step === 1) return !!selection.sauce
    if (step === 2) return !!selection.cheese
    return true
  }

  const handleNext = () => {
    if (step === 0 && !selection.base) {
      toast.error('অনুগ্রহ করে প্রথমে যেকোনো ১টি Pizza Base (Crust) কার্ডে ক্লিক করে সিলেক্ট করুন! 🍞', { id: 'step-req' })
      return
    }
    if (step === 1 && !selection.sauce) {
      toast.error('অনুগ্রহ করে প্রথমে যেকোনো ১টি Sauce কার্ডে ক্লিক করে সিলেক্ট করুন! 🍅', { id: 'step-req' })
      return
    }
    if (step === 2 && !selection.cheese) {
      toast.error('অনুগ্রহ করে প্রথমে যেকোনো ১টি Cheese কার্ডে ক্লিক করে সিলেক্ট করুন! 🧀', { id: 'step-req' })
      return
    }

    if (step < 3) {
      setStep(s => s + 1)
    } else {
      if (!user) {
        toast('Please login to finalize and place your pizza order! 🍕', { icon: '🔐' })
        navigate('/login', { state: { from: '/order-summary', selection, totalPrice: totalPrice() } })
        return
      }
      // Go to order summary
      navigate('/order-summary', { state: { selection, totalPrice: totalPrice() } })
    }
  }

  const stepItems = [
    ingredients.base,
    ingredients.sauce,
    ingredients.cheese,
    ingredients.vegetable,
  ]

  const isVegStep = step === 3

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 48, height: 48, border: '4px solid #EDE0D8', borderTopColor: '#FF4D00', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#888', fontWeight: 600 }}>Loading ingredients...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ background: '#FFF8F3', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1A0500,#3D0A00)', padding: 'clamp(1.5rem,4vw,3rem) 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: 8 }}>Build Your Pizza 🍕</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Customize every layer of your perfect pizza</p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Step Progress */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', gap: 0 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div
                onClick={() => i < step && setStep(i)}
                style={{
                  width: 'clamp(38px, 9vw, 48px)', height: 'clamp(38px, 9vw, 48px)', borderRadius: '50%',
                  background: i <= step ? 'linear-gradient(135deg,#FF4D00,#FF8C42)' : '#fff',
                  border: `3px solid ${i <= step ? '#FF4D00' : '#EDE0D8'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 'clamp(16px, 4vw, 20px)', flexShrink: 0,
                  cursor: i < step ? 'pointer' : 'default',
                  boxShadow: i === step ? '0 4px 20px rgba(255,77,0,0.35)' : 'none',
                  transition: 'all 0.3s',
                  position: 'relative',
                }}>
                {i < step ? '✓' : STEP_ICONS[i]}
                {i === step && (
                  <div style={{ position: 'absolute', top: -8, right: -8, background: '#FF4D00', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 6, height: 6, background: '#fff', borderRadius: '50%' }} />
                  </div>
                )}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 3, background: i < step ? '#FF4D00' : '#EDE0D8', margin: '0 4px', transition: 'background 0.3s' }} />
              )}
            </div>
          ))}
        </div>

        {/* Step label */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ background: 'rgba(255,77,0,0.1)', color: '#FF4D00', fontSize: 11, fontWeight: 700, letterSpacing: 2, padding: '4px 12px', borderRadius: 20 }}>STEP {step + 1} OF 4</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1A0500', margin: '10px 0 4px' }}>{STEP_ICONS[step]} {STEPS[step]}</h2>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>{STEP_DESCS[step]}</p>

          {!canNext() && (
            <div style={{
              background: '#FFF3E0',
              border: '1.5px solid #FFB74D',
              color: '#D84315',
              padding: '10px 20px',
              borderRadius: 14,
              textAlign: 'center',
              fontSize: '0.9rem',
              fontWeight: 800,
              marginTop: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 15px rgba(255,140,66,0.15)',
            }}>
              <span>👇</span>
              <span>নিচের যেকোনো ১টি {STEPS[step]} কার্ডে ক্লিক করে পছন্দ করুন</span>
            </div>
          )}
        </div>

        {/* Ingredient Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 14, marginBottom: '2rem' }}>
          {stepItems[step].map(item => {
            const outOfStock = item.stock < 1
            const isSelected = isVegStep
              ? selection.vegetables.some(v => v._id === item._id)
              : selection[STEPS[step].toLowerCase()]?._id === item._id

            return (
              <div
                key={item._id}
                onClick={() => !outOfStock && (isVegStep ? handleVegetableToggle(item) : handleSingleSelect(STEPS[step].toLowerCase(), item))}
                style={{
                  background: isSelected ? '#FFF8F4' : '#fff',
                  borderRadius: 18, padding: '22px 16px',
                  border: `2.5px solid ${isSelected ? '#FF4D00' : outOfStock ? '#EDE0D8' : '#EDE0D8'}`,
                  boxShadow: isSelected ? '0 8px 28px rgba(255,77,0,0.22)' : '0 2px 12px rgba(0,0,0,0.05)',
                  cursor: outOfStock ? 'not-allowed' : 'pointer',
                  opacity: outOfStock ? 0.5 : 1,
                  transition: 'all 0.25s',
                  textAlign: 'center',
                  position: 'relative',
                  transform: isSelected ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                }}
                onMouseEnter={e => { if (!outOfStock && !isSelected) { e.currentTarget.style.borderColor = '#FF8C42'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(255,77,0,0.15)' } }}
                onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = '#EDE0D8'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)' } }}
              >
                {isSelected && (
                  <div style={{ position: 'absolute', top: 10, right: 10, width: 26, height: 26, background: '#FF4D00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 900, boxShadow: '0 2px 8px rgba(255,77,0,0.4)' }}>✓</div>
                )}
                {outOfStock && (
                  <div style={{ position: 'absolute', top: 8, left: 8, background: '#EF4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>OUT OF STOCK</div>
                )}
                <div style={{ fontSize: '2.8rem', marginBottom: 10 }}>
                  {step === 0 ? '🍞' : step === 1 ? '🍅' : step === 2 ? '🧀' : '🥦'}
                </div>
                <h3 style={{ fontWeight: 800, color: '#1A0500', fontSize: '1rem', marginBottom: 4 }}>{item.name}</h3>
                <p style={{ color: '#aaa', fontSize: '0.75rem', marginBottom: 10, textTransform: 'capitalize' }}>{item.category}</p>
                <div style={{ background: isSelected ? '#FF4D00' : '#FFF0E6', color: isSelected ? '#fff' : '#FF4D00', padding: '5px 14px', borderRadius: 20, fontWeight: 800, fontSize: '0.88rem', display: 'inline-block' }}>
                  +৳{item.price}
                </div>
                <p style={{ color: item.stock > 20 ? '#10B981' : item.stock > 0 ? '#F59E0B' : '#EF4444', fontSize: '0.72rem', fontWeight: 600, marginTop: 8 }}>
                  {item.stock > 20 ? `${item.stock} in stock` : item.stock > 0 ? `Only ${item.stock} left!` : 'Out of stock'}
                </p>

                {/* Explicit Click Button on Card */}
                <div style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    disabled={outOfStock}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: isSelected ? 'none' : '1.5px solid #FF4D00',
                      background: isSelected ? '#FF4D00' : 'transparent',
                      color: isSelected ? '#fff' : '#FF4D00',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: outOfStock ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {isSelected ? '✓ Selected' : `Select (+৳${item.price})`}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary + Navigation */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <p style={{ color: '#aaa', fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>YOUR SELECTION</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selection.base && <Chip label={selection.base.name} color="#FF4D00" icon="🍞" />}
              {selection.sauce && <Chip label={selection.sauce.name} color="#EF4444" icon="🍅" />}
              {selection.cheese && <Chip label={selection.cheese.name} color="#F59E0B" icon="🧀" />}
              {selection.vegetables.map(v => <Chip key={v._id} label={v.name} color="#10B981" icon="🥦" />)}
              {!selection.base && !selection.sauce && !selection.cheese && <span style={{ color: '#ccc', fontSize: '0.85rem' }}>Nothing selected yet</span>}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#aaa', fontSize: '0.78rem', fontWeight: 600 }}>TOTAL</p>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FF4D00' }}>৳{totalPrice()}</p>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', gap: 12 }}>
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0} style={{ padding: '13px 28px', borderRadius: 12, border: '2px solid #EDE0D8', background: '#fff', color: '#888', fontWeight: 700, fontSize: '0.95rem', cursor: step === 0 ? 'not-allowed' : 'pointer', opacity: step === 0 ? 0.5 : 1 }}>
            ← Back
          </button>
          <button
            onClick={handleNext}
            style={{
              flex: 1,
              maxWidth: 320,
              padding: '14px 28px',
              borderRadius: 12,
              border: 'none',
              background: canNext()
                ? 'linear-gradient(135deg,#FF4D00,#FF8C42)'
                : 'linear-gradient(135deg,#FFA726,#FFB74D)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: canNext() ? '0 6px 24px rgba(255,77,0,0.35)' : 'none',
              transition: 'all 0.25s',
            }}
          >
            {step < 3 ? `Next: ${STEPS[step + 1]} →` : 'Review Order →'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Chip({ label, color, icon }) {
  return (
    <span style={{ background: color + '15', color, border: `1.5px solid ${color}30`, padding: '4px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
      {icon} {label}
    </span>
  )
}
