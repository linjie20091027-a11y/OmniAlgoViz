/// <reference types="vite/client" />

declare module '*.py?raw' {
  const content: string
  export default content
}

declare module '*.cpp?raw' {
  const content: string
  export default content
}
