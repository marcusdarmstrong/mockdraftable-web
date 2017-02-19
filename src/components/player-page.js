// @flow
import React from 'react';

import AboutSection from './about-section';
import MeasurablesSection from './measurables-section';
import ComparisonSection from './comparison-section';

export default () => <div className="container-fluid window">
  <div className="container-fluid col-12 col-xl-10 offset-xl-1">
    <div className="row flex-md-row-reverse">
      <div className="col-12 col-md-7">
        <MeasurablesSection />
      </div>
      <div className="col-12 col-md-5">
        <AboutSection />
        <ComparisonSection />
      </div>
    </div>
  </div>
</div>;
