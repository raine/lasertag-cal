import React from 'react'
import FacebookIcon from './FacebookIcon'

export default function LtuhFacebookLink() {
  return (
    <div className="relative pt-4 pb-1 text-center">
      <a href="https://www.facebook.com/LTUHKI/">
        <FacebookIcon />
        <span className="ml-1 text-sm text-black-555">
          Laser Tag Urheilijat Helsinki
        </span>
      </a>
    </div>
  )
}
