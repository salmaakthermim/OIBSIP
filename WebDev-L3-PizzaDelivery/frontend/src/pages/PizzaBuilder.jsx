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
  }

  const handleVegetableToggle = (item) => {
    if (item.stock < 1) { toast.error(`${item.name} is out of stock!`); return }
    setSelection(prev => {
      const exists = prev.vegetables.find(v => v._id === item._id)
      return {
        ...prev,
        vegetables: exists
          ? prev.vegetables.filter(v => v._id !== item._id)
          : [...prev.vegetables, item],
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
    if (step < 3) setStep(s => s + 1)
    else {
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
                  width: 48, height: 48, borderRadius: '50%',
                  background: i <= step ? 'linear-gradient(135deg,#FF4D00,#FF8C42)' : '#fff',
                  border: `3px solid ${i <= step ? '#FF4D00' : '#EDE0D8'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
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
        </div>

        {/* Ingredient Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: '2rem' }}>
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
                  background: '#fff',
                  borderRadius: 16, padding: '20px 16px',
                  border: `2.5px solid ${isSelected ? '#FF4D00' : outOfStock ? '#EDE0D8' : '#EDE0D8'}`,
                  boxShadow: isSelected ? '0 6px 24px rgba(255,77,0,0.2)' : '0 2px 12px rgba(0,0,0,0.05)',
                  cursor: outOfStock ? 'not-allowed' : 'pointer',
                  opacity: outOfStock ? 0.5 : 1,
                  transition: 'all 0.25s',
                  textAlign: 'center',
                  position: 'relative',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                }}
                onMouseEnter={e => { if (!outOfStock && !isSelected) { e.currentTarget.style.borderColor = '#FF8C42'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,77,0,0.15)' } }}
                onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = '#EDE0D8'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)' } }}
              >
                {isSelected && (
                  <div style={{ position: 'absolute', top: 10, right: 10, width: 24, height: 24, background: '#FF4D00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 800 }}>✓</div>
                )}
                {outOfStock && (
                  <div style={{ position: 'absolute', top: 8, left: 8, background: '#EF4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>OUT OF STOCK</div>
                )}
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>
                  {step === 0 ? '🍞' : step === 1 ? '🍅' : step === 2 ? '🧀' : '🥦'}
                </div>
                <h3 style={{ fontWeight: 800, color: '#1A0500', fontSize: '0.95rem', marginBottom: 4 }}>{item.name}</h3>
                <p style={{ color: '#aaa', fontSize: '0.75rem', marginBottom: 10, textTransform: 'capitalize' }}>{item.category}</p>
                <div style={{ background: isSelected ? '#FF4D00' : '#FFF0E6', color: isSelected ? '#fff' : '#FF4D00', padding: '5px 12px', borderRadius: 20, fontWeight: 800, fontSize: '0.85rem', display: 'inline-block' }}>
                  +৳{item.price}
                </div>
                <p style={{ color: item.stock > 20 ? '#10B981' : item.stock > 0 ? '#F59E0B' : '#EF4444', fontSize: '0.72rem', fontWeight: 600, marginTop: 6 }}>
                  {item.stock > 20 ? `${item.stock} in stock` : item.stock > 0 ? `Only ${item.stock} left!` : 'Out of stock'}
                </p>
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
          <button onClick={handleNext} disabled={!canNext()} style={{ flex: 1, maxWidth: 300, padding: '13px 28px', borderRadius: 12, border: 'none', background: canNext() ? 'linear-gradient(135deg,#FF4D00,#FF8C42)' : '#ccc', color: '#fff', fontWeight: 800, fontSize: '0.95rem', cursor: canNext() ? 'pointer' : 'not-allowed', boxShadow: canNext() ? '0 6px 24px rgba(255,77,0,0.35)' : 'none' }}>
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
