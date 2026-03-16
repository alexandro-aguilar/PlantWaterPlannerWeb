import { type FC, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { IdentifyResultLocationState } from '../types/identifyResultState'

const IdentifyResultPage: FC = () => {
  const location = useLocation()
  const state = location.state as IdentifyResultLocationState | undefined
  const imageFile = state?.imageFile

  const imageUrl = useMemo(() => {
    if (!imageFile) {
      return undefined
    }

    return URL.createObjectURL(imageFile)
  }, [imageFile])

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [imageUrl])

  if (!state) {
    return (
      <section className="identify-result identify-result--empty">
        <h1 className="identify-result__title">No result to show yet</h1>
        <p className="identify-result__description">
          Upload a plant photo first, then we will show the identified details
          here.
        </p>
        <Link to="/" className="identify-result__back">
          Back to upload
        </Link>
      </section>
    )
  }

  return (
    <section className="identify-result">
      <header className="identify-result__header">
        <h1 className="identify-result__title">Plant identification</h1>
        <p className="identify-result__description">{state.fileName}</p>
      </header>

      {imageUrl && (
        <div className="identify-result__media">
          <img
            src={imageUrl}
            alt="Uploaded plant"
            className="identify-result__image"
          />
        </div>
      )}

      <section className="identify-result__card">
        <h2 className="identify-result__plant-name">{state.plant.name}</h2>
        <p className="identify-result__scientific">
          <em>{state.plant.scientific_name}</em>
        </p>
        <dl className="identify-result__grid">
          <div className="identify-result__item">
            <dt>Sunlight</dt>
            <dd>{state.plant.sunlight_preference}</dd>
          </div>
          <div className="identify-result__item">
            <dt>Watering</dt>
            <dd>Every {state.plant.watering_frequency_days} days</dd>
          </div>
          <div className="identify-result__item identify-result__item--full">
            <dt>Condition</dt>
            <dd>{state.plant.current_condition}</dd>
          </div>
          <div className="identify-result__item identify-result__item--full">
            <dt>Care notes</dt>
            <dd>{state.plant.care_notes}</dd>
          </div>
        </dl>
      </section>

      <Link to="/" className="identify-result__back">
        Identify another plant
      </Link>
    </section>
  )
}

export default IdentifyResultPage
