import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as THREE from 'three'
import './index.css'
import App from './App.jsx'

// 将 THREE 暴露到全局作用域，供 @react-three/drei 使用
window.THREE = THREE

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
