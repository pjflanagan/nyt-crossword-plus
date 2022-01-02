import React, { FC } from "react";

import { MainComponent, HeadComponent } from 'components';

import './style.css';

const PageIndex: FC = () => {
  return (
    <>
      <HeadComponent />
      <MainComponent />
    </>
  );
}

export default PageIndex;
