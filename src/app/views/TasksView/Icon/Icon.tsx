import React, { FC, FunctionComponent, HTMLAttributes, Suspense } from "react";
import cx from "./Icon.module.scss"
import assets from "./assets"

export type IconName =
  "subitem"

export interface Props {
  name: IconName
  lazy?: boolean
}

function Icon ({ name, lazy = false }: Props) {
  const renderIconComponent = () => {
    if (lazy) {
      const LazyComponent =
        React.lazy(() => import(`./assets/${name}.svg?react`.toString()))
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyComponent
            className={cx.Glyph}
          />
        </Suspense>
      )
    } else {
      const EagerComponent: React.FC<React.HTMLAttributes<SVGSVGElement>> = (props) =>
        React.createElement(assets[name], props, null)
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <EagerComponent
            className={cx.Glyph}
          />
        </Suspense>
      )
    }
  }

  return (
    <i
      className={cx.Icon}
    >
      {renderIconComponent()}
    </i>
  )
}


export default Icon