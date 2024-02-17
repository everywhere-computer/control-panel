import { get as getStore } from 'svelte/store'

import { themeStore } from '$lib/stores'

export const hostStyles = `
  fieldset {
    border: none;
    padding: 0;
  }

  label {
    display: flex;    
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  label > div {
    text-transform: capitalize;
    font-weight: 400;
    font-size: 14.22px;
    line-height: 16px;    
    color: ${getStore(themeStore).selectedTheme === 'light' ? '#32334A' : '#E1E1F2'};
  }

  label > input {
    height: 2rem;
    box-sizing: border-box;
    background-color: transparent;
    --tw-border-opacity: 1;
    border-color: rgb(137 137 176 / var(--tw-border-opacity));
    border-width: 1px;
    border-style: solid;
    border-radius: 0.125rem;    
    transition-property: color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;
    transition-property: color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;
    transition-property: color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;
    transition-timing-function: cubic-bezier(.4,0,.2,1);
    transition-duration: .2s;
    --tw-text-opacity: 1;
    color: ${getStore(themeStore).selectedTheme === 'light' ? '#32334A' : '#E1E1F2'};
    font-size: 16px;
    line-height: 20px;
    font-weight: 400;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 0.125rem;
    padding-bottom: 0.125rem;
  }

  label > input:focus-visible {
    outline: none;
  }

  label > input:focus {
    outline-style: solid;
    outline-width: 2px;
    outline-offset: 2px;
    --bc: 240 40% 92%;
    outline-color: hsl(var(--bc) / .2);
  }

  .widget-submit {
    position: absolute;
    top: -3px;
    right: 0;
    background: none;
    padding: 0;
    margin: 0 !important;
    height: 2rem;
  }

  .widget-submit button {
    min-height: 0px;
    border-width: 0px;
    font-family: Overpass;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);    
    --tw-bg-opacity: 1;
    background-color: rgb(106 80 235 / var(--tw-bg-opacity));
    padding-left: 0.5rem;
    padding-right: 0.5rem;        
    border-radius: 0.125rem;
    border-width: 4px;
    --tw-border-opacity: 1;
    border-color: rgb(141 116 247 / var(--tw-border-opacity));
    font-size: 14.22px;
    line-height: 16px;
    font-weight: 550;
    --tw-text-opacity: 1;
    color: rgb(235 227 255 / var(--tw-text-opacity));
    border-style: ridge;        
    height: 2rem;
    width: 80px;    
  }

  .widget-submit button:disabled {
    --tw-bg-opacity: 1;
    background-color: rgb(106 80 235 / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: rgb(235 227 255 / var(--tw-text-opacity));
    opacity: .5;    
  }

  .widget-fieldset {
    padding: 0 !important;
  }
`
export const setFormStyles = () => {
  // Set styles for shadow elements in form(this is messy, but it's the only workaround for this library)
  const timeout = setTimeout(() => {
    const hostStylesheet = document.createElement('style')
    hostStylesheet.innerHTML = hostStyles
    const host = document.querySelector('jsf-system')
    host.shadowRoot.appendChild(hostStylesheet)
    host.shadowRoot.querySelector('.widget-submit button').innerHTML = 'Run'
    clearTimeout(timeout)
  }, 0)  
}