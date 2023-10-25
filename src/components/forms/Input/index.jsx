import React, { useId } from "react";

import "./style.scss";
import PropTypes from "prop-types";

function Input({ label, type, size="lg", disabled= false, showInfo= false, value, handleValueChange=null }) {
  const id = useId();
  return (
    <div className="input-wrapper">
      <input
          className={size}
        type={type}
        id={id}
        name={id}
        placeholder=" "
          disabled={disabled}
        value={value}
        onChange={(e) => handleValueChange ? handleValueChange(e.target.value) : null}
      />
      <label htmlFor={id}>{label}</label>
        { showInfo &&
            <svg
                className="info"
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M18.6518 4.48101C17.6328 3.94546 16.4445 3.83058 15.3418 4.16101C15.2881 3.03948 14.8048 1.98165 13.992 1.20692C13.1793 0.432185 12.0996 0 10.9768 0C9.85397 0 8.77424 0.432185 7.96152 1.20692C7.14881 1.98165 6.66548 3.03948 6.61178 4.16101C5.51207 3.82983 4.32716 3.93364 3.30178 4.45101C2.54668 4.8479 1.92425 5.45711 1.51124 6.20352C1.09824 6.94994 0.912729 7.8009 0.977586 8.65149C1.04244 9.50208 1.35483 10.3151 1.87623 10.9902C2.39763 11.6654 3.10523 12.1732 3.91179 12.451C3.39697 13.1835 3.11788 14.0557 3.11178 14.951C3.11623 15.2024 3.13963 15.4531 3.18179 15.701C3.35019 16.7166 3.87409 17.6392 4.65993 18.3041C5.44577 18.9691 6.44238 19.333 7.47179 19.331C7.68487 19.3456 7.8987 19.3456 8.11179 19.331C9.25482 19.1509 10.2817 18.5298 10.9718 17.601C11.6691 18.5148 12.695 19.121 13.8318 19.291C14.0449 19.3056 14.2587 19.3056 14.4718 19.291C15.2699 19.2901 16.0525 19.0701 16.7342 18.655C17.416 18.2399 17.9706 17.6457 18.3379 16.937C18.7051 16.2284 18.8707 15.4325 18.8168 14.6362C18.7628 13.8399 18.4913 13.0736 18.0318 12.421C18.8423 12.148 19.5546 11.6427 20.08 10.9679C20.6055 10.2931 20.9209 9.47869 20.987 8.62601C21.053 7.77334 20.8669 6.92005 20.4517 6.17237C20.0365 5.42469 19.4105 4.81564 18.6518 4.42101V4.48101ZM9.31178 2.54101C9.75853 2.11317 10.3532 1.87434 10.9718 1.87434C11.5904 1.87434 12.185 2.11317 12.6318 2.54101C12.9729 2.8826 13.2045 3.31803 13.2971 3.79178C13.3897 4.26553 13.3391 4.75613 13.1518 5.20101L12.8918 5.79101L12.2318 6.37101C11.826 6.23173 11.4008 6.15748 10.9718 6.15101C10.4174 6.15154 9.86909 6.26733 9.36178 6.49101L8.80178 5.20101C8.60771 4.75809 8.55256 4.26672 8.64362 3.7918C8.73468 3.31688 8.96765 2.88075 9.31178 2.54101ZM3.21178 9.38101C2.98854 8.88978 2.93961 8.33707 3.07307 7.81426C3.20654 7.29144 3.51441 6.82982 3.94579 6.5057C4.37718 6.18158 4.90625 6.01436 5.44555 6.03169C5.98486 6.04902 6.5021 6.24986 6.91179 6.60101L7.40179 7.03101L7.75178 7.83101C7.25083 8.50127 6.9775 9.31425 6.97179 10.151C6.95992 10.3008 6.95992 10.4512 6.97179 10.601H6.42178L5.58179 10.681C5.10133 10.7317 4.61686 10.6344 4.19328 10.402C3.76969 10.1697 3.42724 9.81343 3.21178 9.38101ZM9.81178 15.461C9.6914 15.9949 9.39073 16.4709 8.9604 16.809C8.53008 17.147 7.9964 17.3265 7.44923 17.3171C6.90207 17.3077 6.37486 17.11 5.9564 16.7574C5.53793 16.4048 5.25377 15.9187 5.15178 15.381C5.1422 15.2412 5.1422 15.1009 5.15178 14.961C5.15541 14.5546 5.2653 14.1561 5.47055 13.8053C5.6758 13.4544 5.96926 13.1634 6.32178 12.961L6.83179 12.601L7.74179 12.501C8.31534 13.2989 9.16254 13.8578 10.1218 14.071L9.81178 15.461ZM10.9718 12.151C10.5762 12.151 10.1895 12.0337 9.86064 11.814C9.53175 11.5942 9.2754 11.2818 9.12403 10.9164C8.97265 10.5509 8.93304 10.1488 9.01021 9.76083C9.08738 9.37287 9.27787 9.01651 9.55757 8.7368C9.83728 8.4571 10.1936 8.26661 10.5816 8.18944C10.9696 8.11227 11.3717 8.15188 11.7372 8.30326C12.1026 8.45463 12.415 8.71098 12.6347 9.03987C12.8545 9.36877 12.9718 9.75545 12.9718 10.151C12.9718 10.6814 12.7611 11.1902 12.386 11.5652C12.0109 11.9403 11.5022 12.151 10.9718 12.151ZM16.7918 15.371C16.6886 15.9812 16.3499 16.5264 15.8487 16.8893C15.3474 17.2521 14.7236 17.4036 14.1118 17.311C13.6297 17.2431 13.1798 17.0295 12.8224 16.6989C12.4649 16.3683 12.217 15.9364 12.1118 15.461L11.9718 14.861L12.1818 13.941C13.1043 13.6406 13.8862 13.0151 14.3818 12.181L14.8818 12.481H14.9718L15.6318 12.871C16.0606 13.1159 16.4026 13.4881 16.6105 13.936C16.8183 14.384 16.8817 14.8855 16.7918 15.371ZM18.7318 9.37101C18.5351 9.76849 18.2317 10.1034 17.8555 10.3383C17.4794 10.5732 17.0453 10.6988 16.6018 10.701H16.3618L15.7218 10.601L14.9718 10.191C14.9704 9.21872 14.6149 8.28023 13.9718 7.55101L14.4018 7.18101L15.0318 6.60101C15.4426 6.23576 15.9677 6.02469 16.517 6.00394C17.0664 5.9832 17.6059 6.15408 18.0431 6.48732C18.4803 6.82055 18.7881 7.29542 18.9137 7.83062C19.0394 8.36581 18.9751 8.92803 18.7318 9.42101V9.37101Z"
                    fill="inherit"
                    fillOpacity="0.4"
                />
            </svg>
        }
    </div>
  );
}

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.oneOf(['text', 'email', 'password']),
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'big']),
    showInfo: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    handleValueChange: PropTypes.func,
}

export default Input;
