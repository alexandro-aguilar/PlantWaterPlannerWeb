import { Fragment, type FC } from 'react'
import IdentifyUploadContainer from '../containers/IdentifyUploadContainer'

const IdentifyPage: FC = () => {
  return (
    <Fragment>
      <header className="app-shell__header">
        <span className="app-shell__eyebrow">Plant Care</span>
        <h1 className="app-shell__title">Plant Water Planner</h1>
        <p className="app-shell__subtitle">
          Upload one photo and get an instant identification with watering and
          sunlight guidance.
        </p>
      </header>
      <IdentifyUploadContainer />
    </Fragment>
  )
}

export default IdentifyPage
