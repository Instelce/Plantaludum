
type IconProps = {
  fill: string;
  color: string;
}

function Flower({ fill = "#fff", color = "#fff", ...props }: IconProps) {
  return (
    <svg
      {...props}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={color}
        d="M17.6559 4.47317C16.6387 3.93856 15.4525 3.82388 14.3517 4.15373C14.2981 3.03416 13.8156 1.97818 13.0043 1.20481C12.193 0.431429 11.1152 0 9.99433 0C8.87348 0 7.79564 0.431429 6.98434 1.20481C6.17305 1.97818 5.69057 3.03416 5.63697 4.15373C4.53918 3.82313 3.35634 3.92676 2.33276 4.44323C1.57898 4.83942 0.957633 5.44756 0.545352 6.19267C0.133072 6.93777 -0.0521149 7.78725 0.0126288 8.63635C0.0773724 9.48545 0.389215 10.297 0.909701 10.971C1.43019 11.645 2.13655 12.1519 2.94169 12.4292C2.42778 13.1605 2.14918 14.0311 2.14309 14.9249C2.14753 15.1758 2.17089 15.4261 2.21297 15.6735C2.38108 16.6873 2.90406 17.6083 3.68853 18.2721C4.47299 18.9359 5.46786 19.2992 6.49546 19.2972C6.70817 19.3118 6.92163 19.3118 7.13434 19.2972C8.27538 19.1174 9.30042 18.4974 9.98934 17.5702C10.6854 18.4824 11.7095 19.0875 12.8443 19.2573C13.057 19.2718 13.2705 19.2718 13.4832 19.2573C14.28 19.2563 15.0612 19.0367 15.7417 18.6224C16.4222 18.208 16.976 17.6148 17.3425 16.9074C17.7091 16.2 17.8745 15.4055 17.8206 14.6106C17.7667 13.8156 17.4957 13.0508 17.037 12.3993C17.8461 12.1267 18.5571 11.6223 19.0816 10.9487C19.6062 10.2751 19.921 9.46211 19.987 8.61092C20.053 7.75973 19.8671 6.90794 19.4526 6.16157C19.0382 5.4152 18.4133 4.80721 17.6559 4.41328V4.47317ZM8.33224 2.53657C8.77821 2.10947 9.37185 1.87106 9.98934 1.87106C10.6068 1.87106 11.2005 2.10947 11.6464 2.53657C11.9869 2.87756 12.2181 3.31223 12.3106 3.78515C12.403 4.25807 12.3525 4.74781 12.1655 5.19191L11.906 5.78088L11.2471 6.35987C10.8421 6.22083 10.4176 6.14671 9.98934 6.14025C9.43588 6.14078 8.88857 6.25636 8.38216 6.47966L7.82314 5.19191C7.6294 4.74977 7.57435 4.25925 7.66525 3.78516C7.75615 3.31107 7.98872 2.8757 8.33224 2.53657ZM2.24292 9.3646C2.02007 8.87422 1.97122 8.32248 2.10445 7.80058C2.23768 7.27868 2.54501 6.81787 2.97564 6.49432C3.40627 6.17076 3.93442 6.00384 4.47278 6.02114C5.01114 6.03844 5.52748 6.23893 5.93644 6.58946L6.42559 7.01871L6.77497 7.81731C6.2749 8.4864 6.00205 9.29795 5.99634 10.1333C5.9845 10.2828 5.9845 10.433 5.99634 10.5825H5.4473L4.60877 10.6623C4.12916 10.7129 3.64553 10.6158 3.22269 10.3838C2.79985 10.1519 2.45799 9.79626 2.24292 9.3646ZM8.83137 15.434C8.7112 15.9669 8.41105 16.4421 7.98148 16.7796C7.55191 17.117 7.01916 17.2962 6.47295 17.2868C5.92675 17.2774 5.40046 17.0801 4.98273 16.7281C4.56499 16.376 4.28133 15.8908 4.17952 15.3541C4.16995 15.2145 4.16995 15.0744 4.17952 14.9348C4.18314 14.5291 4.29284 14.1313 4.49773 13.7811C4.70262 13.4309 4.99556 13.1403 5.34748 12.9383L5.85658 12.579L6.76499 12.4791C7.33754 13.2757 8.18326 13.8335 9.14083 14.0464L8.83137 15.434ZM9.98934 12.1298C9.59447 12.1298 9.20847 12.0127 8.88014 11.7933C8.55182 11.5739 8.29592 11.2621 8.14481 10.8973C7.9937 10.5325 7.95417 10.131 8.0312 9.74375C8.10824 9.35647 8.29839 9.00073 8.5776 8.72151C8.85682 8.4423 9.21256 8.25215 9.59984 8.17511C9.98713 8.09808 10.3886 8.13762 10.7534 8.28873C11.1182 8.43984 11.43 8.69573 11.6494 9.02406C11.8687 9.35238 11.9858 9.73838 11.9858 10.1333C11.9858 10.6628 11.7755 11.1706 11.4011 11.545C11.0267 11.9194 10.5188 12.1298 9.98934 12.1298ZM15.7992 15.3441C15.6962 15.9532 15.3581 16.4975 14.8577 16.8597C14.3573 17.2219 13.7346 17.3731 13.1238 17.2807C12.6426 17.2129 12.1935 16.9997 11.8367 16.6697C11.4799 16.3396 11.2324 15.9085 11.1273 15.434L10.9876 14.835L11.1972 13.9166C12.1181 13.6167 12.8986 12.9923 13.3934 12.1597L13.8925 12.4592H13.9823L14.6412 12.8485C15.0692 13.0929 15.4107 13.4645 15.6182 13.9116C15.8256 14.3588 15.8889 14.8594 15.7992 15.3441ZM17.7358 9.35462C17.5394 9.7514 17.2366 10.0857 16.861 10.3202C16.4855 10.5547 16.0522 10.68 15.6095 10.6823H15.3699L14.731 10.5825L13.9823 10.1732C13.9809 9.20259 13.6261 8.26574 12.9841 7.5378L13.4133 7.16845L14.0422 6.58946C14.4524 6.22484 14.9765 6.01414 15.5249 5.99344C16.0733 5.97273 16.6118 6.14331 17.0483 6.47597C17.4847 6.80862 17.792 7.28266 17.9174 7.81691C18.0428 8.35117 17.9786 8.91241 17.7358 9.40453V9.35462Z"
      />
    </svg>
  );
}

export default Flower;
