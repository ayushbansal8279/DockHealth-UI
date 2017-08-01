import React from 'react'
import { Link } from 'react-router'

const ErrorPage = (props) => (
  <div>
    <section className='hero is-medium is-bold'>
      <div className='hero-body container'>
        <div id="errorPage">
          <h2 className='title'>Oops!</h2>
          <h4 className='subtitle'>
            Looks like you haven't been invited to join Dock.<br/>
            Contact an admin to join the fun!
          </h4>
        </div>
      </div>
    </section>
  </div>
)

//PageNotFound.route = { path: '*', component: PageNotFound }

export default ErrorPage
