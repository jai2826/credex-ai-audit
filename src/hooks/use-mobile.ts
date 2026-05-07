import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    // NOTE: Using the onChange() handler to set the initial state to ensure consistency with media query changes
    onChange();
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
