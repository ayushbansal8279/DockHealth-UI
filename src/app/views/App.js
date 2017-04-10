import React from 'react'
import Notification from '../components/common/Notification'

const App = ({children}) => (
  <div id='appHome'>
    <main>
      {children}
    </main>
    <Notification />
  </div>
)

export default App