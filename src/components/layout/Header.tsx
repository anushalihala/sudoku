import React from 'react';
import { Mode } from '../Mode'

type HeaderProps = {
  onClick: () => void;
  onClickLockMode: () => void;
};

/**
 * React component for the Header Section.
 */
export const Header = (props: HeaderProps) => {
  return (
    <header className="header">
      <h1>
        Su<span className="header__group-one">do</span><span className="header__group-two">ku</span>
      </h1>
      <h2 onClick={props.onClick}>
        New Game
      </h2>
      <Mode mode='lock' onClickMode={props.onClickLockMode}></Mode>
    </header>
  )
}
