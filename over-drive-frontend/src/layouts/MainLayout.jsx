import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#EEF2F5]">
      <Outlet />
    </div>
  )
}

export default MainLayout
