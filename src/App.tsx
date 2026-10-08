import {
  EmbedProvider,
  LocationBox,
  RegionSeams,
  Scalebar,
  TrackStack,
  TrackToggle,
} from '@jbrowse/display-ui/embed'
import { useCreateViewState } from '@jbrowse/react-linear-genome-view2'
import type { ViewModel } from '@jbrowse/react-linear-genome-view2'
import RpcWorker from '@jbrowse/react-linear-genome-view2/esm/rpcWorker?worker'
import { observer } from 'mobx-react'

import { assembly, tracks, view } from './config'

const genes = [
  { name: 'CYP2C19', loc: '10:94,762,681..94,855,547' },
  { name: 'BRCA2', loc: '13:32,315,086..32,400,266' },
]

const Gridlines = observer(function Gridlines({
  view,
}: {
  view: ViewModel['session']['view']
}) {
  const path = (major: boolean) =>
    view.gridlineTicks
      .filter(tick => tick.major === major)
      .map(tick => `M${tick.x + 0.5} 0V100000`)
      .join('')
  return (
    <svg
      aria-hidden
      className="gridlines"
      style={{
        width: view.staticBlocks.totalWidthPx,
        transform: `translateX(${view.staticBlocksTranslateX}px)`,
      }}
    >
      <path d={path(false)} className="minor" />
      <path d={path(true)} className="major" />
    </svg>
  )
})

const App = observer(function App() {
  const state = useCreateViewState({
    assembly,
    tracks,
    view,
    configuration: { preferences: { scrollZoom: true } },
    makeWorkerInstance: () => new RpcWorker(),
  })
  if (!state) {
    return null
  }
  const { session } = state
  return (
    <>
      <h1>JBrowse 2 engine, your own UI, with vite</h1>
      <EmbedProvider session={session}>
        <div className="controls">
          <LocationBox view={session.view} />
          <button
            aria-label="Zoom out"
            onClick={() => {
              session.view.zoom(session.view.bpPerPx * 2)
            }}
          >
            −
          </button>
          <button
            aria-label="Zoom in"
            onClick={() => {
              session.view.zoom(session.view.bpPerPx / 2)
            }}
          >
            +
          </button>
          {genes.map(({ name, loc }) => (
            <button
              key={name}
              onClick={() => {
                session.view.navToLocString(loc).catch((e: unknown) => {
                  console.error(e)
                })
              }}
            >
              {name}
            </button>
          ))}
          <label>
            <input
              type="checkbox"
              checked={session.view.scrollZoom}
              onChange={event => {
                session.view.setScrollZoom(event.target.checked)
              }}
            />
            Zoom on scroll
          </label>
          {tracks.map(({ trackId, name }) => (
            <TrackToggle key={trackId} view={session.view} trackId={trackId}>
              {name}
            </TrackToggle>
          ))}
        </div>
        <TrackStack view={session.view}>
          <Gridlines view={session.view} />
          <Scalebar view={session.view} />
          <RegionSeams view={session.view} />
        </TrackStack>
      </EmbedProvider>
      <h3>Code</h3>
      <p>
        The code for this app is at{' '}
        <a href="https://github.com/GMOD/jbrowse-build-your-own-vite-demo">
          https://github.com/GMOD/jbrowse-build-your-own-vite-demo
        </a>
        . Every control above is this app's own: the location box, the zoom
        buttons and the checkboxes call the view model, the gridlines are an SVG
        this file draws from <code>view.gridlineTicks</code>, and{' '}
        <code>TrackStack</code> draws the tracks. More at{' '}
        <a href="https://jbrowse.org/storybook/byo/">
          jbrowse.org/storybook/byo
        </a>
        .
      </p>
    </>
  )
})

export default App
