import React from 'react'
import FacebookIcon from './FacebookIcon'

export default function LtuhFacebookLink() {
  return (
    <div className="relative p-4 pb-0 text-center">
      <a href="https://www.facebook.com/LTUHKI/">
        <FacebookIcon />
        <span className="ml-1 text-sm text-black-555">
          Laser Tag Urheilijat Helsinki
        </span>
      </a>
    </div>
  )
}
