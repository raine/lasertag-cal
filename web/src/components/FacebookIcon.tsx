import iconStyle from './icon.module.scss'

export default function FacebookIcon() {
  return (
    <svg
      className={iconStyle.icon}
      width="17"
      height="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fillRule="nonzero" fill="none">
        <path
          d="M16.062 16c.518 0 .938-.395.938-.883V.883C17 .395 16.58 0 16.062 0H.938C.42 0 0 .395 0 .883v14.234c0 .488.42.883.938.883h15.124z"
          fill="#A1A1A1"
        />
        <path
          d="M12.193 16v-5.93h2.358l.354-2.31h-2.712V6.283c0-.67.22-1.125 1.357-1.125H15V3.09A22.936 22.936 0 0 0 12.887 3c-2.09 0-3.522 1.077-3.522 3.055v1.704H7v2.311h2.365V16h2.828z"
          fill="#FFF"
        />
      </g>
    </svg>
  )
}
