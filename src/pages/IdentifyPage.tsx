import { Fragment, type FC } from 'react'
import IdentifyUploadContainer from '../containers/IdentifyUploadContainer'

const IdentifyPage: FC = () => {
  return (
    <Fragment>
      <header className="app-shell__header">
        <h1 className="app-shell__title">Plant Water Planner</h1>
        <p className="app-shell__subtitle">
          Snap a photo of your plant, send it for identification, and get care
          tips in seconds.
        </p>
      </header>
      <IdentifyUploadContainer />
    </Fragment>
  )
}

export default IdentifyPage
