export default function TableBackground() {
  return (
    <div className="table-background" aria-hidden="true">
      <svg
        className="table-grain"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {[
            ["daytime", ".45 .26 .12", "1.3", "-.45"],
            ["evening", ".16 .08 .04", "1.5", "-.5"],
          ].map(([theme, rgb, alpha, offset]) => {
            const [r, g, b] = rgb.split(" ")
            return (
              <filter key={theme} id={`grain-${theme}`}>
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.0035 0.085"
                  numOctaves="3"
                  seed="11"
                />
                <feColorMatrix
                  type="matrix"
                  values={`0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} ${alpha} 0 0 0 ${offset}`}
                />
                <feGaussianBlur stdDeviation="1.6" />
              </filter>
            )
          })}
        </defs>
        <rect
          className="grain-daytime"
          width="100%"
          height="100%"
          filter="url(#grain-daytime)"
        />
        <rect
          className="grain-evening"
          width="100%"
          height="100%"
          filter="url(#grain-evening)"
        />
      </svg>
    </div>
  )
}
