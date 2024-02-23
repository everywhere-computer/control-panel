import { get as getStore } from 'svelte/store'

import { themeStore } from '$lib/stores'

export const hostStyles = `
  fieldset {
    border: none;
    padding: 0;
  }

  legend {
    display: block;
    width: 100%;
    padding: 0;
    text-transform: capitalize;
    font-size: 16px;
    line-height: 16px;
    font-weight: 550;
    padding-bottom: 0.5rem;
    --tw-border-opacity: 1;
    border-color: rgb(137 137 176 / var(--tw-border-opacity));
    border-bottom-width: 1px;
    border-bottom-style: solid;
    margin-bottom: 1rem;    
  }

  label {
    display: flex;    
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  label > div {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-transform: capitalize;
    font-weight: 400;
    font-size: 14.22px;
    line-height: 16px;    
    color: ${
      getStore(themeStore).selectedTheme === 'light' ? '#32334A' : '#E1E1F2'
    };
  }

  input:disabled {
    -webkit-opacity: 0.3;
    -moz-opacity: 0.3;
    -o-opacity: 0.3;
    opacity: 0.3;
    background: ${
      getStore(themeStore).selectedTheme === 'light' ? '#E8E8F4' : '#181929'
    };
    cursor: not-allowed;
  }

  .checkbox-wrapper {
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 4px;
  }

  .checkbox-wrapper span {
    text-transform: lowercase;
  }

  .checkbox {    
    --p: ${
      getStore(themeStore).selectedTheme === 'light' ? '#6A50EB' : '#8D74F7'
    };
    --pc: #FBFAFF;
    --bc: ${
      getStore(themeStore).selectedTheme === 'light' ? '#32334A' : '#E1E1F2'
    };
    --b1: ${
      getStore(themeStore).selectedTheme === 'light' ? '#F5F5FC' : '#232538'
    };    
    flex-shrink: 0;
    --chkbg: var(--fallback-bc, oklch(var(--bc)))/1));
    --chkfg: var(--fallback-b1, oklch(var(--b1)))/1));
    height: 1.5rem;
    width: 1.5rem;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: var(--rounded-btn, 0.5rem);
    border-width: 1px;
    border-color: var(--fallback-bc, oklch(var(--bc)))/var(--tw-border-opacity)));
    --tw-border-opacity: 0.2;
    --chkbg: var(--fallback-p, oklch(var(--p)))/1));
    --chkfg: var(--fallback-pc, oklch(var(--pc)))/1));
    --tw-border-opacity: 1;
    border-color: ${
      getStore(themeStore).selectedTheme === 'light' ? '#6A50EB' : '#8D74F7'
    };    
    border-style: solid;
  }

  .checkbox:checked {
    --p: ${
      getStore(themeStore).selectedTheme === 'light' ? '#6A50EB' : '#8D74F7'
    };
    --pc: #FBFAFF;
    --bc: ${
      getStore(themeStore).selectedTheme === 'light' ? '#32334A' : '#E1E1F2'
    };
    --b1: ${
      getStore(themeStore).selectedTheme === 'light' ? '#F5F5FC' : '#232538'
    };    
    --chkbg: ${
      getStore(themeStore).selectedTheme === 'light' ? '#6A50EB' : '#8D74F7'
    };
    --chkfg: var(--fallback-pc, oklch(var(--pc)))/1));            
    --chkfg: #FBFAFF;            
    background-repeat: no-repeat;
    animation: checkmark var(--animation-input, 0.2s) ease-out;
    background-color: var(--chkbg);
    --tw-border-opacity: 1;
    border-color: var(--fallback-p, oklch(var(--p)))/var(--tw-border-opacity)));
    border-color: ${
      getStore(themeStore).selectedTheme === 'light' ? '#6A50EB' : '#8D74F7'
    };        
    --tw-bg-opacity: 1;
    background-color: var(--fallback-p, oklch(var(--p)))/var(--tw-bg-opacity)));
    background-color: ${
      getStore(themeStore).selectedTheme === 'light' ? '#6A50EB' : '#8D74F7'
    };        
    --tw-text-opacity: 1;
    color: var(--fallback-pc, oklch(var(--pc)))/var(--tw-text-opacity)));    
    color: #FBFAFF;    
    background-image: linear-gradient(-45deg, transparent 65%, var(--chkbg) 65.99%), linear-gradient(45deg, transparent 75%, var(--chkbg) 75.99%), linear-gradient(-45deg, var(--chkbg) 40%, transparent 40.99%), linear-gradient( 45deg, var(--chkbg) 30%, var(--chkfg) 30.99%, var(--chkfg) 40%, transparent 40.99% ), linear-gradient(-45deg, var(--chkfg) 50%, var(--chkbg) 50.99%);    
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
    color: ${
      getStore(themeStore).selectedTheme === 'light' ? '#32334A' : '#E1E1F2'
    };
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
    display: none !important;
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
