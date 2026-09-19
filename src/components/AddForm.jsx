import { useState } from 'react'
import { FiArrowUpRight, FiClock, FiPlus } from 'react-icons/fi'
import s from './TodoList.module.scss'

const bucketOptions = [
  { value: 'today', label: 'Today' },
  { value: 'next', label: 'Next' },
  { value: 'later', label: 'Later' },
]

const estimateOptions = [5, 15, 30, 60]

export const AddForm = ({ onAdd, inputRef }) => {
  const [title, setTitle] = useState('')
  const [bucket, setBucket] = useState('today')
  const [estimate, setEstimate] = useState(15)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!title.trim()) return

    onAdd({ title, bucket, estimate })
    setTitle('')
    inputRef.current?.focus()
  }

  return (
    <section className={s.captureCard} aria-labelledby="capture-title">
      <div className={s.captureHeading}>
        <div>
          <span className={s.eyebrow}>Quick capture</span>
          <h2 id="capture-title">Clear your head in one line.</h2>
        </div>
        <span className={s.shortcut} aria-hidden="true">N</span>
      </div>

      <form className={s.captureForm} onSubmit={handleSubmit}>
        <div className={s.captureInputWrap}>
          <FiPlus aria-hidden="true" />
          <input
            ref={inputRef}
            className={s.captureInput}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={160}
            placeholder="What deserves your attention?"
            aria-label="New task"
            autoComplete="off"
          />
        </div>

        <div className={s.captureMeta}>
          <label className={s.compactField}>
            <span>When</span>
            <select value={bucket} onChange={(event) => setBucket(event.target.value)}>
              {bucketOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className={s.compactField}>
            <span className={s.inlineLabel}><FiClock aria-hidden="true" /> Effort</span>
            <select value={estimate} onChange={(event) => setEstimate(Number(event.target.value))}>
              {estimateOptions.map((minutes) => (
                <option key={minutes} value={minutes}>{minutes} min</option>
              ))}
            </select>
          </label>

          <button className={s.primaryButton} type="submit" disabled={!title.trim()}>
            Add to orbit
            <FiArrowUpRight aria-hidden="true" />
          </button>
        </div>
      </form>
    </section>
  )
}
