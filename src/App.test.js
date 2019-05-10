import React from 'react';
import {shallow} from 'enzyme';

import ButtonAppBar from './App';
import Footer from './components/Footer';

describe('<App />', () => {
  it('renders', () => {
    const wrapper = shallow(<ButtonAppBar />);

    expect(wrapper).toEqual(1);
  });
});
