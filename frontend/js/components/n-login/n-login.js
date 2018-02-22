
import html from 'choo/html'

import style from './style'
import lonelybox from '../n-lonely-centered-box/n-lonely-centered-box'
import form from '../n-form/n-form'
import input from '../n-input/n-input'
import button from '../n-button/n-button'
import link from '../n-link/n-link'

const formConfig = (state) => ({event: state.events.user.SUBMIT_LOGIN})

export default (state, emit) => {
  return html`
    ${lonelybox(html`
      <div>
        ${form(formConfig(state), emit, html`
          <div class=${style}>
            <h2>Login</h2>
            ${input({type: 'text', placeholder: 'Username'})}
            ${input({type: 'password', placeholder: 'Password'})}
            <input class=${button} type="submit" value="Send"/>
          </div>
        `)}
        <a class=${link} href="/signup">Don't have an account yet?</a>
      </div>
    `)}
  `
}
